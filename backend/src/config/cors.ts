import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const corsOptions: cors.CorsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}; 