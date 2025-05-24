import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { contactRouter } from './routes/contact';
import { quoteRouter } from './routes/quotes';
import { errorHandler } from './middleware/errorHandler';

// Configuração do ambiente
dotenv.config();

// Criação da aplicação Express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);
app.use('/api/contact', contactRouter);
app.use('/api/quotes', quoteRouter);

// Error handling
app.use(errorHandler);

// Rota de teste
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Backend TechFlow Solutions funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Iniciar servidor sem MongoDB para teste
function startTestServer() {
  app.listen(port, () => {
    console.log('🚀 Servidor de TESTE rodando na porta', port);
    console.log('🏥 Health check: http://localhost:' + port + '/health');
    console.log('🧪 Test endpoint: http://localhost:' + port + '/test');
    console.log('📧 API Contact: http://localhost:' + port + '/api/contact');
    console.log('💼 API Quotes: http://localhost:' + port + '/api/quotes');
    console.log('🌐 CORS configurado para:', process.env.CORS_ORIGIN || 'localhost');
    console.log('⚠️  MODO TESTE - MongoDB desabilitado');
  });
}

startTestServer(); 