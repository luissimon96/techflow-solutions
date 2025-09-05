import { Request, Response } from 'express';
import { log } from '../lib/logger';
import { ServiceLocator } from '../container/ServiceRegistry';
import { ValidationService } from '../services/ValidationService';
import { ErrorHandler, AuthenticationError, ValidationError } from '../lib/errors';

// 🎮 Auth Controller - Phase 2 Refactored
// ✅ Repository Pattern via DI Container
// ✅ Standardized Error Handling
// ✅ Clean Architecture Implementation

// 🏭 Service instances via DI Container
const getAuthService = () => ServiceLocator.getAuthService();
const getTokenService = () => ServiceLocator.getTokenService();
const getValidationService = () => ServiceLocator.getValidationService();

// ✅ Validações via ValidationService
export const loginValidation = ValidationService.getLoginValidation();
export const changePasswordValidation = ValidationService.getChangePasswordValidation();

// 🔐 Login - Complete Phase 2 Implementation
export const login = async (req: Request, res: Response) => {
  try {
    const authService = getAuthService();
    const validationService = getValidationService();

    // ✅ Standardized validation
    const validation = ValidationService.processValidationResult(req);
    
    if (!validation.isValid) {
      const error = new ValidationError('Login validation failed', {
        errors: validation.errors,
        ip: req.ip
      });
      
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message,
        errors: validation.errors,
        correlationId: safeError.correlationId
      });
    }

    const { email, password } = req.body;

    // ✅ Repository Pattern: AuthService uses abstracted data access
    const result = await authService.authenticateAdmin({ email, password });
    
    if (!result.success) {
      const statusCode = result.message?.includes('bloqueada') ? 423 : 401;
      return res.status(statusCode).json({
        success: false,
        message: result.message
      });
    }

    // ✅ Successful authentication
    log.auth('login_success', {
      adminId: result.admin?.id,
      email: result.admin?.email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.json({
      success: true,
      message: result.message,
      data: {
        admin: result.admin,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn
      }
    });

  } catch (error) {
    const authError = new AuthenticationError('Authentication process failed', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      originalError: error instanceof Error ? error.message : 'Unknown error'
    });

    const safeError = ErrorHandler.getSafeErrorResponse(authError);
    return res.status(safeError.statusCode).json({
      success: false,
      message: safeError.message,
      correlationId: safeError.correlationId
    });
  }
};

// 🎫 Refresh Token - Phase 2 Implementation
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const tokenService = getTokenService();
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new ValidationError('Refresh token is required');
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message,
        correlationId: safeError.correlationId
      });
    }

    // ✅ TokenService handles all token operations via repository
    const result = await tokenService.refreshAccessToken(refreshToken);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message
      });
    }

    log.auth('token_refreshed', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.json({
      success: true,
      message: result.message,
      data: {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      }
    });

  } catch (error) {
    const tokenError = new AuthenticationError('Token refresh failed', {
      ip: req.ip,
      originalError: error instanceof Error ? error.message : 'Unknown error'
    });

    const safeError = ErrorHandler.getSafeErrorResponse(tokenError);
    return res.status(safeError.statusCode).json({
      success: false,
      message: safeError.message,
      correlationId: safeError.correlationId
    });
  }
};

// 🚪 Logout - Phase 2 Implementation
export const logout = async (req: Request, res: Response) => {
  try {
    const authService = getAuthService();
    const tokenService = getTokenService();
    const { refreshToken } = req.body;
    const authHeader = req.headers.authorization;

    // ✅ TokenService manages token blacklisting
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      tokenService.blacklistToken(accessToken);
    }

    // ✅ AuthService handles logout via repository
    if (refreshToken && req.admin) {
      const result = await authService.logoutAdmin(
        req.admin._id.toString(), 
        refreshToken
      );
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.message
        });
      }
    }

    log.auth('logout_success', {
      adminId: req.admin?._id.toString(),
      ip: req.ip
    });

    return res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    const logoutError = new AuthenticationError('Logout process failed', {
      adminId: req.admin?._id.toString(),
      ip: req.ip,
      originalError: error instanceof Error ? error.message : 'Unknown error'
    });

    const safeError = ErrorHandler.getSafeErrorResponse(logoutError);
    return res.status(safeError.statusCode).json({
      success: false,
      message: safeError.message,
      correlationId: safeError.correlationId
    });
  }
};

// 🚪🚪 Logout All Sessions - Phase 2 Implementation
export const logoutAll = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      const error = new AuthenticationError('Not authenticated');
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message
      });
    }

    const authService = getAuthService();

    // ✅ Repository Pattern: Clear all sessions via service
    const result = await authService.logoutAllSessions(req.admin._id.toString());

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }

    log.auth('logout_all_sessions', {
      adminId: req.admin._id.toString(),
      email: req.admin.email,
      ip: req.ip
    });

    return res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    const logoutError = new AuthenticationError('Logout all sessions failed', {
      adminId: req.admin?._id.toString(),
      originalError: error instanceof Error ? error.message : 'Unknown error'
    });

    const safeError = ErrorHandler.getSafeErrorResponse(logoutError);
    return res.status(safeError.statusCode).json({
      success: false,
      message: safeError.message,
      correlationId: safeError.correlationId
    });
  }
};

// 👤 Get Profile - Phase 2 Implementation
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      const error = new AuthenticationError('Not authenticated');
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message
      });
    }

    const adminRepository = ServiceLocator.getAdminRepository();
    
    // ✅ Repository Pattern: Fetch fresh admin data
    const admin = await adminRepository.findById(req.admin._id.toString());
    
    if (!admin) {
      const error = new AuthenticationError('Admin not found');
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message
      });
    }

    return res.json({
      success: true,
      data: {
        admin: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin,
          twoFactorEnabled: admin.twoFactorEnabled,
          createdAt: admin.createdAt
        }
      }
    });

  } catch (error) {
    const profileError = new AuthenticationError('Failed to get profile', {
      adminId: req.admin?._id.toString(),
      originalError: error instanceof Error ? error.message : 'Unknown error'
    });

    const safeError = ErrorHandler.getSafeErrorResponse(profileError);
    return res.status(safeError.statusCode).json({
      success: false,
      message: safeError.message,
      correlationId: safeError.correlationId
    });
  }
};

// 🔑 Change Password - Phase 2 Implementation
export const changePassword = async (req: Request, res: Response) => {
  try {
    const validationService = getValidationService();

    // ✅ Standardized validation
    const validation = ValidationService.processValidationResult(req);
    
    if (!validation.isValid) {
      const error = new ValidationError('Password change validation failed', {
        errors: validation.errors
      });
      
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message,
        errors: validation.errors
      });
    }

    if (!req.admin) {
      const error = new AuthenticationError('Not authenticated');
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message
      });
    }

    const adminRepository = ServiceLocator.getAdminRepository();
    const { currentPassword, newPassword } = req.body;

    // ✅ Repository Pattern: Get admin with password
    const admin = await adminRepository.findById(req.admin._id.toString(), true);
    if (!admin) {
      const error = new AuthenticationError('Admin not found');
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      const error = new ValidationError('Current password is incorrect');
      const safeError = ErrorHandler.getSafeErrorResponse(error);
      
      return res.status(safeError.statusCode).json({
        success: false,
        message: safeError.message
      });
    }

    // ✅ Repository Pattern: Update password
    await adminRepository.update(admin._id.toString(), {
      password: newPassword,
      passwordChangedAt: new Date()
    });

    // Clear all refresh tokens (force re-login)
    await adminRepository.clearAllRefreshTokens(admin._id.toString());

    log.auth('password_changed', {
      adminId: admin._id.toString(),
      email: admin.email,
      ip: req.ip
    });

    return res.json({
      success: true,
      message: 'Senha alterada com sucesso. Faça login novamente.'
    });

  } catch (error) {
    const passwordError = new AuthenticationError('Password change failed', {
      adminId: req.admin?._id.toString(),
      originalError: error instanceof Error ? error.message : 'Unknown error'
    });

    const safeError = ErrorHandler.getSafeErrorResponse(passwordError);
    return res.status(safeError.statusCode).json({
      success: false,
      message: safeError.message,
      correlationId: safeError.correlationId
    });
  }
};