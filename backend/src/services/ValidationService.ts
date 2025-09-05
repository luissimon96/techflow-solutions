import { body, validationResult, ValidationChain, Result } from 'express-validator';
import { Request } from 'express';

// 🔍 Validation Service
// Extraído do authController para seguir Single Responsibility Principle
// Responsável apenas pelas validações de entrada

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ValidationService {
  // 🔐 Validações de Login
  static getLoginValidation(): ValidationChain[] {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email deve ter um formato válido'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Senha deve ter no mínimo 8 caracteres')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    ];
  }

  // 🔒 Validações de Alteração de Senha
  static getChangePasswordValidation(): ValidationChain[] {
    return [
      body('currentPassword')
        .notEmpty()
        .withMessage('Senha atual é obrigatória'),
      body('newPassword')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Nova senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo'),
      body('confirmPassword')
        .custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new Error('Confirmação de senha não confere');
          }
          return true;
        }),
    ];
  }

  // 📝 Validações de Contato
  static getContactValidation(): ValidationChain[] {
    return [
      body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage('Nome deve conter apenas letras e espaços'),
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email deve ter um formato válido'),
      body('phone')
        .optional()
        .matches(/^[\d\s\(\)\-\+]+$/)
        .withMessage('Telefone deve conter apenas números e símbolos válidos'),
      body('subject')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Assunto deve ter entre 5 e 200 caracteres'),
      body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Mensagem deve ter entre 10 e 1000 caracteres'),
    ];
  }

  // 💼 Validações de Orçamento
  static getQuoteValidation(): ValidationChain[] {
    return [
      body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email deve ter um formato válido'),
      body('company')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Nome da empresa deve ter no máximo 100 caracteres'),
      body('projectType')
        .isIn(['website', 'webapp', 'mobile', 'ecommerce', 'other'])
        .withMessage('Tipo de projeto inválido'),
      body('budget')
        .isIn(['5k-10k', '10k-25k', '25k-50k', '50k+', 'custom'])
        .withMessage('Faixa de orçamento inválida'),
      body('timeline')
        .isIn(['asap', '1-month', '2-3-months', '3-6-months', 'flexible'])
        .withMessage('Prazo inválido'),
      body('description')
        .trim()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Descrição deve ter entre 20 e 2000 caracteres'),
      body('features')
        .optional()
        .isArray()
        .withMessage('Features deve ser um array'),
    ];
  }

  // 🔧 Método utilitário para processar resultado da validação
  static processValidationResult(req: Request): ValidationResult {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return {
        isValid: true,
        errors: []
      };
    }

    const formattedErrors: ValidationError[] = errors.array().map(error => ({
      field: 'path' in error ? String(error.path) : 'unknown',
      message: error.msg,
      value: 'value' in error ? error.value : undefined
    }));

    return {
      isValid: false,
      errors: formattedErrors
    };
  }

  // 🚫 Sanitização de dados sensíveis para logs
  static sanitizeForLogging(data: any): any {
    const sensitiveFields = ['password', 'currentPassword', 'newPassword', 'confirmPassword', 'token', 'refreshToken'];
    const sanitized = { ...data };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  // 🔒 Validação de força de senha
  static validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Pelo menos 8 caracteres');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Pelo menos uma letra minúscula');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Pelo menos uma letra maiúscula');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Pelo menos um número');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Pelo menos um símbolo especial (@$!%*?&)');

    return {
      isStrong: score >= 4,
      score,
      feedback: feedback.length > 0 ? feedback : ['Senha forte!']
    };
  }
}