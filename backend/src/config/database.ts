import mongoose from 'mongoose';
import { log } from '../lib/logger';

// 🗄️ Database Configuration Module
// Extraído do index.ts para seguir Single Responsibility Principle
// Responsável pela conexão e configuração do MongoDB

interface MongoConnectionOptions extends mongoose.ConnectOptions {
  maxPoolSize: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
  retryWrites: boolean;
}

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  log.info('Database connection attempt started', {
    database: 'techflowdb',
    securityEnabled: true
  });

  if (!mongoUri) {
    const message = 'MONGODB_URI não encontrada nas variáveis de ambiente';
    
    if (process.env.NODE_ENV !== 'production') {
      log.warn('MongoDB URI missing in development mode', {
        environment: process.env.NODE_ENV || 'development',
        continuingWithoutDB: true
      });
      return;
    }
    
    log.error(message, {
      environment: process.env.NODE_ENV || 'development'
    });
    throw new Error(message);
  }

  const mongoOptions: MongoConnectionOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true
  };

  try {
    await mongoose.connect(mongoUri, mongoOptions);
    
    log.info('MongoDB connection established successfully', {
      database: 'techflowdb',
      secure: true,
      poolSize: mongoOptions.maxPoolSize,
      timeout: mongoOptions.serverSelectionTimeoutMS
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (process.env.NODE_ENV !== 'production') {
      log.warn('MongoDB connection failed in development', {
        error: errorMessage,
        mongoUri: mongoUri.substring(0, 20) + '...',
        continuingWithoutDB: true
      });
      return;
    }

    log.error('MongoDB connection failed in production', {
      error: errorMessage,
      mongoUri: mongoUri.substring(0, 20) + '...'
    });
    
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    log.info('MongoDB connection closed successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error('Error closing MongoDB connection', { error: errorMessage });
    throw error;
  }
} 