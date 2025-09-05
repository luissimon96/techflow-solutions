// 🎯 Standardized Error Handling System
// Implementa tratamento consistente de erros em toda aplicação
// Suporta diferentes tipos de erro e logging estruturado

import { log } from './logger';

export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  BUSINESS_RULE = 'BUSINESS_RULE_ERROR'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 🎯 Base Application Error
export abstract class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly severity: ErrorSeverity;
  public readonly context: Record<string, any>;
  public readonly timestamp: Date;
  public readonly correlationId?: string;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Record<string, any> = {},
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
    this.correlationId = this.generateCorrelationId();

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);

    // Log error immediately
    this.logError();
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private logError(): void {
    const errorData = {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      severity: this.severity,
      context: this.context,
      correlationId: this.correlationId,
      stack: this.stack,
      timestamp: this.timestamp.toISOString()
    };

    switch (this.severity) {
      case ErrorSeverity.CRITICAL:
        log.error('Critical error occurred', errorData);
        break;
      case ErrorSeverity.HIGH:
        log.error('High severity error occurred', errorData);
        break;
      case ErrorSeverity.MEDIUM:
        log.warn('Medium severity error occurred', errorData);
        break;
      case ErrorSeverity.LOW:
        log.info('Low severity error occurred', errorData);
        break;
    }
  }

  public toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      severity: this.severity,
      correlationId: this.correlationId,
      timestamp: this.timestamp,
      context: this.context
    };
  }
}

// 🔍 Specific Error Classes

export class ValidationError extends AppError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(
      message,
      ErrorType.VALIDATION,
      400,
      ErrorSeverity.LOW,
      context
    );
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context: Record<string, any> = {}) {
    super(
      message,
      ErrorType.AUTHENTICATION,
      401,
      ErrorSeverity.MEDIUM,
      context
    );
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context: Record<string, any> = {}) {
    super(
      message,
      ErrorType.AUTHORIZATION,
      403,
      ErrorSeverity.MEDIUM,
      context
    );
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, context: Record<string, any> = {}) {
    super(
      `${resource} not found`,
      ErrorType.NOT_FOUND,
      404,
      ErrorSeverity.LOW,
      { resource, ...context }
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(
      message,
      ErrorType.CONFLICT,
      409,
      ErrorSeverity.MEDIUM,
      context
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(
      message,
      ErrorType.DATABASE,
      500,
      ErrorSeverity.HIGH,
      context,
      true
    );
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, context: Record<string, any> = {}) {
    super(
      `External service error: ${service} - ${message}`,
      ErrorType.EXTERNAL_SERVICE,
      502,
      ErrorSeverity.HIGH,
      { service, ...context }
    );
  }
}

export class InternalError extends AppError {
  constructor(message: string = 'Internal server error', context: Record<string, any> = {}) {
    super(
      message,
      ErrorType.INTERNAL,
      500,
      ErrorSeverity.CRITICAL,
      context,
      false // Programming errors are not operational
    );
  }
}

export class RateLimitError extends AppError {
  constructor(limit: number, window: string, context: Record<string, any> = {}) {
    super(
      `Rate limit exceeded: ${limit} requests per ${window}`,
      ErrorType.RATE_LIMIT,
      429,
      ErrorSeverity.MEDIUM,
      { limit, window, ...context }
    );
  }
}

export class BusinessRuleError extends AppError {
  constructor(rule: string, message: string, context: Record<string, any> = {}) {
    super(
      `Business rule violation: ${rule} - ${message}`,
      ErrorType.BUSINESS_RULE,
      422,
      ErrorSeverity.MEDIUM,
      { rule, ...context }
    );
  }
}

// 🛠️ Error Utilities

export class ErrorHandler {
  /**
   * Check if error is an operational error
   */
  static isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  /**
   * Extract safe error details for client response
   */
  static getSafeErrorResponse(error: Error): {
    message: string;
    type?: ErrorType;
    statusCode: number;
    correlationId?: string;
    context?: Record<string, any>;
  } {
    if (error instanceof AppError) {
      return {
        message: error.message,
        type: error.type,
        statusCode: error.statusCode,
        correlationId: error.correlationId,
        // Only include safe context data (no sensitive information)
        context: this.sanitizeContext(error.context)
      };
    }

    // For unknown errors, provide generic response
    return {
      message: 'Internal server error',
      statusCode: 500
    };
  }

  private static sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 
      'credential', 'private', 'confidential'
    ];

    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(context)) {
      const keyLower = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(sensitive => keyLower.includes(sensitive));
      
      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Handle uncaught exceptions
   */
  static handleUncaughtException(error: Error): void {
    log.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack,
      type: 'UNCAUGHT_EXCEPTION'
    });

    // In production, you might want to restart the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  /**
   * Handle unhandled promise rejections
   */
  static handleUnhandledRejection(reason: any, promise: Promise<any>): void {
    log.error('Unhandled Promise Rejection', {
      reason: reason?.toString() || 'Unknown reason',
      promise: promise.toString(),
      type: 'UNHANDLED_REJECTION'
    });

    // In production, you might want to restart the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

// 🎯 Error Factory - Helper functions for common errors

export const ErrorFactory = {
  validationError: (field: string, value: any, rule: string) => 
    new ValidationError(`Validation failed for field '${field}'`, { field, value, rule }),

  emailAlreadyExists: (email: string) =>
    new ConflictError('Email already exists', { email }),

  adminNotFound: (identifier: string) =>
    new NotFoundError('Admin', { identifier }),

  invalidCredentials: () =>
    new AuthenticationError('Invalid credentials'),

  accountLocked: (unlockTime?: Date) =>
    new AuthenticationError('Account is locked', { unlockTime }),

  insufficientPermissions: (required: string, current: string) =>
    new AuthorizationError('Insufficient permissions', { required, current }),

  databaseConnectionError: (error: string) =>
    new DatabaseError(`Database connection failed: ${error}`),

  mongoError: (operation: string, error: string) =>
    new DatabaseError(`MongoDB ${operation} failed: ${error}`, { operation })
};

// 🌍 Global error handlers setup
export function setupGlobalErrorHandlers(): void {
  process.on('uncaughtException', ErrorHandler.handleUncaughtException);
  process.on('unhandledRejection', ErrorHandler.handleUnhandledRejection);
  
  log.info('Global error handlers configured');
}