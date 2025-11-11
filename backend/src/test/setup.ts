import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
// No MongoDB needed - WhatsApp integration only
process.env.JWT_SECRET = 'test-secret';
process.env.CORS_ORIGIN = 'http://localhost:3000'; 