import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin, IAdmin } from '../models/Admin';

// Estender interface Request para incluir admin
declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
    }
  }
}

// Interface para o payload do JWT
interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

// Blacklist de tokens (em produção usar Redis)
const tokenBlacklist = new Set<string>();

// Middleware de autenticação
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extrair token do header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    const token = authHeader.substring(7);

    // Verificar se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Verificar e decodificar o token
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret) as JWTPayload;

    // Verificar se o token é do tipo correto
    if (decoded.aud !== 'admin-panel' || decoded.iss !== 'techflow-solutions') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Buscar o admin no banco
    const admin = await Admin.findById(decoded.id).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin não encontrado'
      });
    }

    // Verificar se o admin está ativo
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Verificar se a senha foi alterada após a emissão do token
    if (admin.passwordChangedAt && decoded.iat < Math.floor(admin.passwordChangedAt.getTime() / 1000)) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Faça login novamente.'
      });
    }

    // Adicionar admin ao request
    req.admin = admin;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware de autorização por role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissão insuficiente'
      });
    }

    next();
  };
};

// Middleware para verificar se é super-admin
export const requireSuperAdmin = authorize('super-admin');

// Middleware para verificar se é admin ou super-admin
export const requireAdmin = authorize('admin', 'super-admin');

// Função para adicionar token à blacklist
export const blacklistToken = (token: string): void => {
  tokenBlacklist.add(token);
};

// Função para verificar refresh token
export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
    const decoded = jwt.verify(token, refreshSecret) as JWTPayload;

    if (decoded.aud !== 'admin-panel' || decoded.iss !== 'techflow-solutions') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

// Rate limiting específico para login
export const loginRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Implementação básica - em produção usar express-rate-limit com Redis
  const ip = req.ip;
  const key = `login_attempts_${ip}`;

  // Por enquanto, apenas log - implementar Redis em produção
  console.log(`Login attempt from IP: ${ip}`);
  next();
}; 