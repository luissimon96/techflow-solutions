import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { healthRouter } from './routes/health';
import { contactRouter } from './routes/contact';
import { quoteRouter } from './routes/quotes';
import authRouter from './routes/auth';
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

// Rotas de autenticação admin com rate limiting específico
app.use('/api/admin/auth',
  auditLog('admin_auth'),
  authRouter
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

// Conexão com o MongoDB com configurações de segurança
const mongoUri = process.env.MONGODB_URI;

console.log('🔗 Tentando conectar ao MongoDB...');
console.log('📍 Database: techflowdb');
console.log('🔒 Configurações de segurança ativadas');

if (mongoUri) {
  console.log('🔑 MongoDB URI encontrada, conectando...');

  // Configurações de conexão seguras
  const mongoOptions: mongoose.ConnectOptions = {
    maxPoolSize: 10, // Limitar pool de conexões
    serverSelectionTimeoutMS: 5000, // Timeout de 5s
    socketTimeoutMS: 45000, // Timeout de socket
    retryWrites: true
  };

  mongoose.connect(mongoUri, mongoOptions)
    .then(() => {
      console.log('✅ Conectado ao MongoDB Atlas');
      console.log('🗄️  Database: techflowdb');
      console.log('🔒 Conexão segura estabelecida');

      // Log de inicialização
      securityLogger.info('Application started successfully', {
        port,
        environment: process.env.NODE_ENV || 'development',
        corsOrigins: allowedOrigins,
        mongoConnected: true
      });

      startServer();
    })
    .catch((error) => {
      console.error('❌ Erro ao conectar ao MongoDB:', error.message);

      // Em desenvolvimento, permitir rodar sem MongoDB para testar segurança
      if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️  Modo desenvolvimento: continuando sem MongoDB...');
        console.log('🔒 Testando apenas melhorias de segurança');

        securityLogger.warn('MongoDB connection failed in development - continuing without DB', {
          error: error.message,
          mongoUri: mongoUri?.substring(0, 20) + '...'
        });

        startServer();
      } else {
        securityLogger.error('MongoDB connection failed', {
          error: error.message,
          mongoUri: mongoUri?.substring(0, 20) + '...'
        });
        process.exit(1);
      }
    });
} else {
  console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente');

  // Em desenvolvimento, permitir rodar sem MongoDB
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  Modo desenvolvimento: continuando sem MongoDB...');
    console.log('🔒 Testando apenas melhorias de segurança');

    securityLogger.warn('Missing MongoDB URI in development - continuing without DB');
    startServer();
  } else {
    securityLogger.error('Missing MongoDB URI', {
      environment: process.env.NODE_ENV || 'development'
    });
    process.exit(1);
  }
}

function startServer() {
  const server = app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`📧 API Contact: http://localhost:${port}/api/contact`);
    console.log(`💼 API Quotes: http://localhost:${port}/api/quotes`);
    console.log(`🔐 Admin Auth: http://localhost:${port}/api/admin/auth`);
    console.log(`🌐 CORS configurado para: ${allowedOrigins.join(', ')}`);
    console.log(`🔒 Middlewares de segurança ativados`);
    console.log(`📊 Rate limiting: 100 req/15min (geral), 20 req/15min (APIs)`);
    console.log(`🛡️  Headers de segurança configurados`);
    console.log(`📝 Logs de segurança ativados`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM recebido, encerrando servidor...');
    securityLogger.info('Server shutdown initiated', { signal: 'SIGTERM' });

    server.close(() => {
      console.log('✅ Servidor encerrado graciosamente');
      mongoose.connection.close();
      console.log('✅ Conexão MongoDB encerrada');
      securityLogger.info('Application shutdown completed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🔄 SIGINT recebido, encerrando servidor...');
    securityLogger.info('Server shutdown initiated', { signal: 'SIGINT' });

    server.close(() => {
      console.log('✅ Servidor encerrado graciosamente');
      mongoose.connection.close();
      console.log('✅ Conexão MongoDB encerrada');
      securityLogger.info('Application shutdown completed');
      process.exit(0);
    });
  });
} 