import { Admin, IAdmin } from '../models/Admin';
import { log } from '../lib/logger';
import jwt from 'jsonwebtoken';

// 🎫 Token Service
// Extraído do authController para seguir Single Responsibility Principle
// Responsável apenas pela gestão de tokens JWT

export interface TokenResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
  message?: string;
}

export interface DecodedToken {
  id: string;
  email?: string;
  role?: string;
  type?: string;
  iat?: number;
  exp?: number;
}

export class TokenService {
  private readonly JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    
    if (!process.env.JWT_SECRET) {
      log.warn('JWT_SECRET not found in environment variables, using fallback');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResult> {
    try {
      // Verificar refresh token
      const decoded = this.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return {
          success: false,
          message: 'Refresh token inválido'
        };
      }

      // Buscar admin
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        log.warn('Refresh token failed - admin not found', {
          tokenId: decoded.id
        });
        return {
          success: false,
          message: 'Admin não encontrado'
        };
      }

      // Verificar se o refresh token existe na lista
      if (!admin.refreshTokens.includes(refreshToken)) {
        log.warn('Refresh token failed - token not in whitelist', {
          adminId: admin._id.toString(),
          email: admin.email
        });
        return {
          success: false,
          message: 'Refresh token inválido'
        };
      }

      // Verificar se está ativo
      if (!admin.isActive) {
        log.warn('Refresh token failed - account inactive', {
          adminId: admin._id.toString(),
          email: admin.email
        });
        return {
          success: false,
          message: 'Conta desativada'
        };
      }

      // Gerar novo access token
      const newAccessToken = admin.generateAccessToken();

      log.auth('access_token_refreshed', {
        adminId: admin._id.toString(),
        email: admin.email,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        accessToken: newAccessToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        message: 'Token renovado com sucesso'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Token refresh service error', { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  verifyAccessToken(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as DecodedToken;
      return decoded;
    } catch (error) {
      log.debug('Access token verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  verifyRefreshToken(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as DecodedToken;
      
      // Verificar se é um refresh token
      if (decoded.type !== 'refresh') {
        log.debug('Token verification failed - not a refresh token', {
          tokenType: decoded.type || 'access'
        });
        return null;
      }
      
      return decoded;
    } catch (error) {
      log.debug('Refresh token verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  // 🚫 Token Blacklist Management
  private blacklistedTokens = new Set<string>();

  blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
    
    log.auth('token_blacklisted', {
      tokenHash: this.hashToken(token),
      timestamp: new Date().toISOString()
    });
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  // Helper para logging seguro de tokens
  private hashToken(token: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(token).digest('hex').substring(0, 8);
  }

  // 🧹 Limpeza periódica de tokens expirados (executar via cron job)
  cleanupExpiredTokens(): void {
    const now = Math.floor(Date.now() / 1000);
    const tokensToRemove: string[] = [];

    this.blacklistedTokens.forEach(token => {
      try {
        const decoded = jwt.decode(token) as DecodedToken;
        if (decoded && decoded.exp && decoded.exp < now) {
          tokensToRemove.push(token);
        }
      } catch {
        // Token inválido, remover
        tokensToRemove.push(token);
      }
    });

    tokensToRemove.forEach(token => this.blacklistedTokens.delete(token));

    if (tokensToRemove.length > 0) {
      log.info('Expired tokens cleaned up', {
        removedCount: tokensToRemove.length,
        remainingCount: this.blacklistedTokens.size
      });
    }
  }
}