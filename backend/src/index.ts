import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { healthRouter } from './routes/health';
import { contactRouter } from './routes/contact';
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

// Error handling
app.use(errorHandler);

// Conexão com o MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techflowdb';

console.log('🔗 Tentando conectar ao MongoDB...');
console.log('📍 Database: techflowdb');
console.log('📦 Collection: user');

if (mongoUri !== 'mongodb://localhost:27017/techflowdb') {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ Conectado ao MongoDB Atlas');
      console.log('🗄️  Database: techflowdb');
      console.log('📋 Collection: user');
      startServer();
    })
    .catch((error) => {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      process.exit(1);
    });
} else {
  console.log('⚠️  Iniciando sem MongoDB (desenvolvimento local)');
  startServer();
}

function startServer() {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`📧 API Contact: http://localhost:${port}/api/contact`);
    console.log(`🌐 CORS configurado para: ${process.env.CORS_ORIGIN || 'localhost'}`);
  });
} 