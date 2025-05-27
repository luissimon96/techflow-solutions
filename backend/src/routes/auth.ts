import { Router } from 'express';
import {
  login,
  refreshToken,
  logout,
  logoutAll,
  getProfile,
  changePassword,
  loginValidation,
  changePasswordValidation
} from '../controllers/authController';
import { authenticate, loginRateLimit } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting específico para autenticação
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 tentativas por IP
  message: {
    success: false,
    message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting mais restritivo para login
const loginStrictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rotas públicas (não autenticadas)
router.post('/login', loginStrictRateLimit, loginRateLimit, loginValidation, login);
router.post('/refresh', authRateLimit, refreshToken);

// Rotas protegidas (requerem autenticação)
router.use(authenticate); // Middleware aplicado a todas as rotas abaixo

router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.get('/profile', getProfile);
router.put('/password', changePasswordValidation, changePassword);

export default router; 