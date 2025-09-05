import express, { Request, Response } from 'express';
import { createCorsConfig } from './cors';
import { log } from '../lib/logger';
import {
  helmetConfig,
  compressionConfig,
  securityMorgan,
  generalRateLimit,
  strictRateLimit,
  speedLimiter,
  attackDetection,
  originValidation,
  sanitizeHeaders,
  auditLog,
} from '../middleware/security';

// Routes
import { healthRouter } from '../routes/health';
import { contactRouter } from '../routes/contact';
import { quoteRouter } from '../routes/quotes';
import authRouter from '../routes/auth';
import { errorHandler } from '../middleware/errorHandler';

// 🏗️ Express Application Configuration
// Extraído do index.ts para seguir Single Responsibility Principle
// Responsável apenas pela configuração do app Express

export function createApp(): express.Application {
  const app = express();

  // Trust proxy para obter IP real em produção
  app.set('trust proxy', 1);

  // 🛡️ Security middlewares (ordem importa!)
  app.use(helmetConfig);
  app.use(compressionConfig);
  app.use(securityMorgan);
  app.use(sanitizeHeaders);
  app.use(attackDetection);
  app.use(speedLimiter);

  // 🌐 CORS configurado com segurança
  app.use(createCorsConfig());

  // 📝 Body parsing com limites de segurança
  app.use(express.json({
    limit: '5mb'
  }));

  app.use(express.urlencoded({
    extended: true,
    limit: '5mb',
    parameterLimit: 100
  }));

  // 🚦 Rate limiting geral
  app.use(generalRateLimit);
  app.use(originValidation);

  // 🎯 Routes configuration
  setupRoutes(app);

  // 🚫 404 handler
  app.use('*', handle404);

  // ❌ Error handling
  app.use(errorHandler);

  return app;
}

function setupRoutes(app: express.Application): void {
  // Health checks
  app.use('/health', healthRouter);
  app.use('/api/health', healthRouter);

  // Contact routes com rate limiting restritivo
  app.use('/api/contact',
    strictRateLimit,
    auditLog('contact_submission'),
    contactRouter
  );

  // Quote routes com rate limiting restritivo
  app.use('/api/quotes',
    strictRateLimit,
    auditLog('quote_submission'),
    quoteRouter
  );

  // Auth routes com auditoria
  app.use('/api/admin/auth',
    auditLog('admin_auth'),
    authRouter
  );

  log.info('Routes configured successfully');
}

function handle404(req: Request, res: Response): void {
  log.warn('404 - Route not found', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    error: 'NOT_FOUND'
  });
}