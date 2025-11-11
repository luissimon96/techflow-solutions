// Setup global para testes
import dotenv from 'dotenv';

// Carregar variáveis de ambiente para testes
dotenv.config({ path: '.env.test' });

// Configurar timeout global para testes
jest.setTimeout(10000);

// Mock do console para testes mais limpos
const originalConsole = console;

beforeAll(() => {
  // Silenciar logs durante os testes
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restaurar console original
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Configurações globais para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.CORS_ORIGIN = 'http://localhost:5173,http://localhost:3000';

// No database mocks needed - WhatsApp integration only 