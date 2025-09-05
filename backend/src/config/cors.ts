import cors from 'cors';
import { log } from '../lib/logger';

// 🌐 CORS Configuration Module
// Extraído do index.ts para seguir Single Responsibility Principle
// Gerencia configuração de Cross-Origin Resource Sharing

export function createCorsConfig() {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'https://techflow-solutions.vercel.app'];

  return cors({
    origin: (origin, callback) => {
      // Permitir requests sem origin em desenvolvimento (ex: Postman)
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        log.security('CORS blocked request from unauthorized origin', {
          origin,
          allowedOrigins,
          timestamp: new Date().toISOString()
        });
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // Cache preflight por 24h
  });
}

export function getCorsOrigins(): string[] {
  return process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'https://techflow-solutions.vercel.app'];
} 