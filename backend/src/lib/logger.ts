import winston from 'winston';

// 🎯 Structured Logging System
// Substitui os 82 console.log espalhados pelo código
// Implementa logging profissional com níveis e estrutura

const { combine, timestamp, colorize, printf, json } = winston.format;

// Formato personalizado para desenvolvimento
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
  return `${timestamp} [${level}] ${message} ${metaStr}`;
});

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production' ? json() : devFormat
  ),
  defaultMeta: { service: 'techflow-backend' },
  transports: [
    // Logs de erro em arquivo
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Todos os logs em arquivo
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Console transport para desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      devFormat
    )
  }));
}

// Logger específico para segurança (substitui securityLogger)
export const securityLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json()
  ),
  defaultMeta: { 
    service: 'techflow-security',
    category: 'security'
  },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      maxsize: 5242880,
      maxFiles: 10
    })
  ]
});

// Logger para auditoria (login, logout, etc)
export const auditLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json()
  ),
  defaultMeta: { 
    service: 'techflow-audit',
    category: 'audit'
  },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/audit.log',
      maxsize: 5242880,
      maxFiles: 20
    })
  ]
});

export default logger;

// 🔧 Helper functions para migração gradual dos console.log
export const log = {
  info: (message: string, meta?: object) => logger.info(message, meta),
  error: (message: string, meta?: object) => logger.error(message, meta),
  warn: (message: string, meta?: object) => logger.warn(message, meta),
  debug: (message: string, meta?: object) => logger.debug(message, meta),
  
  // Logs específicos de negócio
  auth: (action: string, meta?: object) => auditLogger.info(action, meta),
  security: (event: string, meta?: object) => securityLogger.warn(event, meta)
};