import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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

// Conexão com o MongoDB
const mongoUri = process.env.MONGODB_URI;

console.log('🔗 Tentando conectar ao MongoDB...');
console.log('📍 Database: techflowdb');
console.log('📦 Collection: user');

if (mongoUri) {
  console.log('🔑 MongoDB URI encontrada, conectando...');
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ Conectado ao MongoDB Atlas');
      console.log('🗄️  Database: techflowdb');
      console.log('📋 Collection: user');
      startServer();
    })
    .catch((error) => {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      console.error('🔍 URI de conexão:', mongoUri?.substring(0, 20) + '...');
      process.exit(1);
    });
} else {
  console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente');
  console.error('⚠️  O servidor não funcionará corretamente sem banco de dados');
  process.exit(1);
}

function startServer() {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`📧 API Contact: http://localhost:${port}/api/contact`);
    console.log(`💼 API Quotes: http://localhost:${port}/api/quotes`);
    console.log(`🌐 CORS configurado para: ${process.env.CORS_ORIGIN || 'localhost'}`);
  });
} 