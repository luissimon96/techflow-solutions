import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { contactRouter } from './routes/contact';
import { quoteRouter } from './routes/quotes';
import { errorHandler } from './middleware/errorHandler';
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
  securityLogger
} from './middleware/security';

// Configuração do ambiente
dotenv.config();

// Criação da aplicação Express
const app = express();
const port = process.env.PORT || 3000;

// Trust proxy para obter IP real em produção
app.set('trust proxy', 1);

// Middlewares de segurança (ordem importa!)
app.use(helmetConfig); // Headers de segurança
app.use(compressionConfig); // Compressão de resposta
app.use(securityMorgan); // Logs de requisições
app.use(sanitizeHeaders); // Sanitização de headers
app.use(attackDetection); // Detecção de ataques
app.use(speedLimiter); // Slow down para requests frequentes

// CORS configurado com segurança
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sem origin em desenvolvimento (ex: Postman)
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      securityLogger.error('CORS blocked request from unauthorized origin', {
        origin,
        allowedOrigins
      });
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // Cache preflight por 24h
}));

// Middlewares de parsing com limites de segurança
app.use(express.json({
  limit: '5mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '5mb',
  parameterLimit: 100 // Limitar número de parâmetros
}));

// Rate limiting geral para todas as rotas
app.use(generalRateLimit);

// Validação de origem adicional
app.use(originValidation);

// Routes com rate limiting específico
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);

// Rotas de contato com rate limiting mais restritivo
app.use('/api/contact',
  strictRateLimit,
  auditLog('contact_submission'),
  contactRouter
);

// Rotas de orçamento com rate limiting mais restritivo
app.use('/api/quotes',
  strictRateLimit,
  auditLog('quote_submission'),
  quoteRouter
);

// Middleware para capturar rotas não encontradas
app.use('*', (req, res) => {
  securityLogger.warn('404 - Route not found', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method
  });

  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    error: 'NOT_FOUND'
  });
});

// Error handling
app.use(errorHandler);

// Inicialização simplificada - sem banco de dados
console.log('🚀 Inicializando TechFlow Solutions API...');
console.log('📱 Sistema simplificado com integração WhatsApp');
console.log('🔒 Configurações de segurança ativadas');

// Log de inicialização
securityLogger.info('Application started successfully', {
  port,
  environment: process.env.NODE_ENV || 'development',
  corsOrigins: allowedOrigins,
  databaseType: 'None - WhatsApp Integration'
});

// Inicializar servidor
startServer();

function startServer() {
  const server = app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`📧 API Contact: http://localhost:${port}/api/contact`);
    console.log(`💼 API Quotes: http://localhost:${port}/api/quotes`);
    console.log(`🌐 CORS configurado para: ${allowedOrigins.join(', ')}`);
    console.log(`🔒 Middlewares de segurança ativados`);
    console.log(`📊 Rate limiting: 100 req/15min (geral), 20 req/15min (APIs)`);
    console.log(`🛡️  Headers de segurança configurados`);
    console.log(`📝 Logs de segurança ativados`);
    console.log(`📱 Integração WhatsApp ativada`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM recebido, encerrando servidor...');
    securityLogger.info('Server shutdown initiated', { signal: 'SIGTERM' });

    server.close(() => {
      console.log('✅ Servidor encerrado graciosamente');
      console.log('✅ Servidor encerrado');
      securityLogger.info('Application shutdown completed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🔄 SIGINT recebido, encerrando servidor...');
    securityLogger.info('Server shutdown initiated', { signal: 'SIGINT' });

    server.close(() => {
      console.log('✅ Servidor encerrado graciosamente');
      console.log('✅ Servidor encerrado');
      securityLogger.info('Application shutdown completed');
      process.exit(0);
    });
  });
} 