import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import compression from 'compression';
import morgan from 'morgan';
import winston from 'winston';

// Configuração do logger de segurança
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'security' },
  transports: [
    new winston.transports.File({ filename: 'logs/security-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/security-combined.log' }),
    ...(process.env.NODE_ENV !== 'production' ? [new winston.transports.Console()] : [])
  ],
});

// Rate limiting geral
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    securityLogger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });
    res.status(429).json({
      success: false,
      message: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
      retryAfter: '15 minutos'
    });
  }
});

// Rate limiting específico para APIs sensíveis
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // 20 requests por IP
  message: {
    error: 'Muitas tentativas, tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    securityLogger.warn('Strict rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas, tente novamente em 15 minutos.',
      retryAfter: '15 minutos'
    });
  }
});

// Rate limiting para login/auth
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de login por IP
  message: {
    error: 'Muitas tentativas de login, tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    securityLogger.error('Auth rate limit exceeded - possible brute force attack', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      body: req.body ? Object.keys(req.body) : []
    });
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas de login, tente novamente em 15 minutos.',
      retryAfter: '15 minutos'
    });
  }
});

// Slow down para requests frequentes
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // Permitir 50 requests por 15 min sem delay
  delayMs: () => 500, // Função que retorna 500ms de delay
  maxDelayMs: 20000, // Máximo de 20 segundos de delay
  validate: { delayMs: false } // Desabilitar warning
});

// Configuração avançada do Helmet
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      scriptSrc: [
        "'self'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "https://res.cloudinary.com"
      ],
      connectSrc: [
        "'self'",
        "https://api.cloudinary.com",
        "https://www.google-analytics.com"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Necessário para algumas integrações
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Middleware de compressão
export const compressionConfig = compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Nível de compressão balanceado
  threshold: 1024, // Comprimir apenas arquivos > 1KB
});

// Logger de requisições com informações de segurança
export const securityMorgan = morgan('combined', {
  stream: {
    write: (message: string) => {
      securityLogger.info(message.trim());
    }
  }
});

// Middleware para detectar tentativas de ataques
export const attackDetection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(<script>|<\/script>)/i, // XSS básico
    /(union|select|insert|delete|update|drop|create|alter)/i, // SQL Injection
    /(\.\.\/|\.\.\\)/i, // Path traversal
    /(%3C|%3E|%22|%27)/i, // Encoded XSS
    /(javascript:|vbscript:|onload=|onerror=)/i, // Event handlers
  ];

  const userAgent = req.get('User-Agent') || '';
  const url = req.originalUrl;
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);

  // Verificar padrões suspeitos
  const isSuspicious = suspiciousPatterns.some(pattern =>
    pattern.test(url) ||
    pattern.test(body) ||
    pattern.test(query) ||
    pattern.test(userAgent)
  );

  if (isSuspicious) {
    securityLogger.error('Suspicious request detected - possible attack attempt', {
      ip: req.ip,
      userAgent,
      url,
      method: req.method,
      body: req.body,
      query: req.query,
      headers: req.headers
    });

    return res.status(400).json({
      success: false,
      message: 'Requisição inválida detectada.'
    });
  }

  next();
};

// Middleware para validar origem das requisições
export const originValidation = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://www.srluissimon.com',
    'https://srluissimon.com',
    'https://techflow-solutions-frontend.vercel.app'
  ];

  const origin = req.get('Origin');
  const referer = req.get('Referer');

  // Para requisições sem origin (ex: Postman, curl), permitir apenas em desenvolvimento
  if (!origin && !referer) {
    if (process.env.NODE_ENV === 'production') {
      securityLogger.warn('Request without origin/referer in production', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
        method: req.method
      });
      return res.status(403).json({
        success: false,
        message: 'Origem da requisição não autorizada.'
      });
    }
    return next();
  }

  // Validar origem
  if (origin && !allowedOrigins.includes(origin)) {
    securityLogger.error('Unauthorized origin detected', {
      ip: req.ip,
      origin,
      referer,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });

    return res.status(403).json({
      success: false,
      message: 'Origem não autorizada.'
    });
  }

  next();
};

// Middleware para log de ações sensíveis
export const auditLog = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = function (data) {
      // Log apenas se a operação foi bem-sucedida
      if (res.statusCode >= 200 && res.statusCode < 300) {
        securityLogger.info('Sensitive action performed', {
          action,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode,
          userId: (req as any).user?.id || 'anonymous'
        });
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

// Middleware para sanitização adicional de headers
export const sanitizeHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remover headers potencialmente perigosos
  delete req.headers['x-forwarded-host'];
  delete req.headers['x-original-host'];
  delete req.headers['x-rewrite-url'];

  // Validar Content-Type para requests POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    if (contentType && !contentType.includes('application/json')) {
      securityLogger.warn('Invalid content-type detected', {
        ip: req.ip,
        contentType,
        url: req.originalUrl,
        method: req.method
      });
    }
  }

  next();
};

export { securityLogger }; 