import { Router } from 'express';
import { body } from 'express-validator';
import {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
} from '../controllers/contactController';

const router = Router();

// Validações para criação de contato
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),

  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nome da empresa deve ter no máximo 100 caracteres'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Telefone deve ter um formato válido'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Assunto deve ter entre 5 e 200 caracteres'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Mensagem deve ter entre 10 e 2000 caracteres'),

  body('consent')
    .isBoolean()
    .withMessage('Consentimento deve ser um valor booleano')
    .custom((value) => {
      if (value !== true) {
        throw new Error('Consentimento deve ser aceito');
      }
      return true;
    }),
];

// Rotas públicas
router.post('/', contactValidation, createContact);

// Rotas administrativas (futuro - requer autenticação)
router.get('/', getContacts);
router.get('/:id', getContactById);
router.delete('/:id', deleteContact);

export const contactRouter = router; 