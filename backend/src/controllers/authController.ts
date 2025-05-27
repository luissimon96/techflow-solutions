import { Request, Response } from 'express';
import { Admin, IAdmin } from '../models/Admin';
import { blacklistToken, verifyRefreshToken } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';

// Validações
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ter um formato válido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter no mínimo 8 caracteres'),
];

export const changePasswordValidation = [
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

// Login
export const login = async (req: Request, res: Response) => {
  try {
    // Verificar validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar admin com senha
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se a conta está bloqueada
    if (admin.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Conta temporariamente bloqueada devido a muitas tentativas de login'
      });
    }

    // Verificar se está ativo
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Verificar senha
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      // Incrementar tentativas de login
      await admin.incLoginAttempts();

      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Login bem-sucedido - resetar tentativas
    await admin.resetLoginAttempts();

    // Gerar tokens
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Salvar refresh token no banco
    admin.refreshTokens.push(refreshToken);
    await admin.save();

    // Log de auditoria
    console.log(`Admin login successful: ${admin.email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        },
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token não fornecido'
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Buscar admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin não encontrado'
      });
    }

    // Verificar se o refresh token existe na lista
    if (!admin.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Verificar se está ativo
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Gerar novo access token
    const newAccessToken = admin.generateAccessToken();

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        accessToken: newAccessToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
      }
    });

  } catch (error) {
    console.error('Erro no refresh token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      // Adicionar access token à blacklist
      blacklistToken(accessToken);
    }

    if (refreshToken && req.admin) {
      // Remover refresh token do banco
      req.admin.refreshTokens = req.admin.refreshTokens.filter(
        token => token !== refreshToken
      );
      await req.admin.save();
    }

    // Log de auditoria
    console.log(`Admin logout: ${req.admin?.email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Logout de todas as sessões
export const logoutAll = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    // Limpar todos os refresh tokens
    req.admin.refreshTokens = [];
    await req.admin.save();

    // Log de auditoria
    console.log(`Admin logout all sessions: ${req.admin.email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Logout de todas as sessões realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no logout all:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Perfil do admin
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    res.json({
      success: true,
      data: {
        admin: {
          id: req.admin._id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          lastLogin: req.admin.lastLogin,
          twoFactorEnabled: req.admin.twoFactorEnabled,
          createdAt: req.admin.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Alterar senha
export const changePassword = async (req: Request, res: Response) => {
  try {
    // Verificar validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Buscar admin com senha
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin não encontrado'
      });
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    admin.password = newPassword;
    await admin.save();

    // Limpar todos os refresh tokens (forçar novo login)
    admin.refreshTokens = [];
    await admin.save();

    // Log de auditoria
    console.log(`Admin password changed: ${admin.email} at ${new Date().toISOString()}`);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso. Faça login novamente.'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}; 