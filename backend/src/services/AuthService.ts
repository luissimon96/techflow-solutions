import { Admin, IAdmin } from '../models/Admin';
import { log } from '../lib/logger';

// 🔐 Authentication Service
// Extraído do authController para seguir Single Responsibility Principle
// Responsável apenas pela lógica de autenticação

export interface LoginResult {
  success: boolean;
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin?: Date;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
  message?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export class AuthService {
  async authenticateAdmin(credentials: AuthCredentials): Promise<LoginResult> {
    const { email, password } = credentials;

    try {
      log.info('Admin authentication attempt', { 
        email,
        timestamp: new Date().toISOString()
      });

      // Buscar admin com senha
      const admin = await Admin.findOne({ email }).select('+password');
      
      if (!admin) {
        log.warn('Authentication failed - admin not found', { email });
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }

      // Verificar se a conta está bloqueada
      if (admin.isLocked()) {
        log.warn('Authentication failed - account locked', { 
          email,
          adminId: admin._id.toString()
        });
        return {
          success: false,
          message: 'Conta temporariamente bloqueada devido a muitas tentativas de login'
        };
      }

      // Verificar se está ativo
      if (!admin.isActive) {
        log.warn('Authentication failed - account inactive', { 
          email,
          adminId: admin._id.toString()
        });
        return {
          success: false,
          message: 'Conta desativada'
        };
      }

      // Verificar senha
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        log.warn('Authentication failed - invalid password', { 
          email,
          adminId: admin._id.toString()
        });
        
        // Incrementar tentativas de login
        await admin.incLoginAttempts();
        
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
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
      log.auth('admin_login_success', {
        adminId: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        timestamp: new Date().toISOString(),
        ip: 'recorded_in_middleware' // IP será logado pelo middleware
      });

      return {
        success: true,
        admin: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        },
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        message: 'Login realizado com sucesso'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Authentication service error', {
        email,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<LoginResult> {
    try {
      // Esta lógica será movida para TokenService
      // Por ora, mantém funcionalidade básica
      return {
        success: false,
        message: 'Refresh token functionality moved to TokenService'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Refresh token service error', { error: errorMessage });
      
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  async logoutAdmin(adminId: string, refreshToken?: string): Promise<{ success: boolean; message: string }> {
    try {
      if (refreshToken) {
        const admin = await Admin.findById(adminId);
        if (admin) {
          // Remover refresh token específico
          admin.refreshTokens = admin.refreshTokens.filter(
            token => token !== refreshToken
          );
          await admin.save();
        }
      }

      log.auth('admin_logout', {
        adminId,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Logout realizado com sucesso'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Logout service error', {
        adminId,
        error: errorMessage
      });

      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  async logoutAllSessions(adminId: string): Promise<{ success: boolean; message: string }> {
    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return {
          success: false,
          message: 'Admin não encontrado'
        };
      }

      // Limpar todos os refresh tokens
      admin.refreshTokens = [];
      await admin.save();

      log.auth('admin_logout_all_sessions', {
        adminId,
        email: admin.email,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Logout de todas as sessões realizado com sucesso'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Logout all sessions service error', {
        adminId,
        error: errorMessage
      });

      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }
}