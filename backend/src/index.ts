import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { healthRouter } from './routes/health';
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
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);

// Error handling
app.use(errorHandler);

// Conexão com o MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techflow';

if (mongoUri !== 'mongodb://localhost:27017/techflow') {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('Conectado ao MongoDB');
      startServer();
    })
    .catch((error) => {
      console.error('Erro ao conectar ao MongoDB:', error);
      process.exit(1);
    });
} else {
  console.log('Iniciando sem MongoDB (desenvolvimento)');
  startServer();
}

function startServer() {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Health check disponível em: http://localhost:${port}/health`);
  });
} 