import { IAdmin } from '../models/Admin';
import { IAdminRepository } from '../repositories/IAdminRepository';
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

// ✅ SOLID: Dependency Inversion - depende de abstração (IAdminRepository)
// ✅ Clean Architecture: Service não conhece detalhes de persistência

export class AuthService {
  constructor(private adminRepository: IAdminRepository) {}

  async authenticateAdmin(credentials: AuthCredentials): Promise<LoginResult> {
    const { email, password } = credentials;

    try {
      log.info('Admin authentication attempt', { 
        email,
        timestamp: new Date().toISOString()
      });

      // ✅ Repository Pattern: abstração de dados
      const admin = await this.adminRepository.findByEmail(email, true);
      
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
        
        // ✅ Repository Pattern: operação através da abstração
        await this.adminRepository.incrementLoginAttempts(admin._id.toString());
        
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }

      // ✅ Repository Pattern: operação através da abstração
      await this.adminRepository.resetLoginAttempts(admin._id.toString());

      // Gerar tokens
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();

      // ✅ Repository Pattern: operação através da abstração
      await this.adminRepository.addRefreshToken(admin._id.toString(), refreshToken);

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
        // ✅ Repository Pattern: operação através da abstração
        await this.adminRepository.removeRefreshToken(adminId, refreshToken);
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
      const admin = await this.adminRepository.findById(adminId);
      if (!admin) {
        return {
          success: false,
          message: 'Admin não encontrado'
        };
      }

      // ✅ Repository Pattern: operação através da abstração
      await this.adminRepository.clearAllRefreshTokens(adminId);

      const adminData = admin;

      log.auth('admin_logout_all_sessions', {
        adminId,
        email: adminData.email,
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