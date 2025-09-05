import dotenv from 'dotenv';
import { createApp } from './config/app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getCorsOrigins } from './config/cors';
import { log } from './lib/logger';
import { ServiceRegistry } from './container/ServiceRegistry';
import { setupGlobalErrorHandlers } from './lib/errors';

// 🚀 Server Module
// Extraído do index.ts para seguir Single Responsibility Principle
// Responsável apenas pela inicialização e lifecycle do servidor

// Configuração do ambiente
dotenv.config();

const PORT = process.env.PORT || 3000;

export async function startServer(): Promise<void> {
  try {
    // 🔧 Setup global error handlers
    setupGlobalErrorHandlers();
    
    // 🏭 Register all services in DI container
    ServiceRegistry.registerServices();
    
    log.info('Phase 2 Architecture initialized', {
      features: [
        'Repository Pattern',
        'Dependency Injection Container', 
        'Standardized Error Handling',
        'Unit Test Framework'
      ]
    });
    
    // 🗄️ Connect to database
    await connectDatabase();
    
    // 🏗️ Create Express application
    const app = createApp();
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      const corsOrigins = getCorsOrigins();
      
      log.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        corsOrigins,
        endpoints: {
          health: `http://localhost:${PORT}/health`,
          contact: `http://localhost:${PORT}/api/contact`,
          quotes: `http://localhost:${PORT}/api/quotes`,
          adminAuth: `http://localhost:${PORT}/api/admin/auth`
        },
        security: {
          helmet: true,
          rateLimit: {
            general: '100 req/15min',
            strict: '20 req/15min'
          },
          cors: corsOrigins.join(', ')
        }
      });
    });

    // 🔄 Graceful shutdown handlers
    setupGracefulShutdown(server);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error('Failed to start server', { error: errorMessage });
    process.exit(1);
  }
}

function setupGracefulShutdown(server: any): void {
  const shutdown = async (signal: string) => {
    log.info('Shutdown initiated', { signal });
    
    server.close(async () => {
      log.info('HTTP server closed');
      
      try {
        await disconnectDatabase();
        log.info('Application shutdown completed successfully');
        process.exit(0);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error('Error during shutdown', { error: errorMessage });
        process.exit(1);
      }
    });
  };

  // Handle different shutdown signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught exceptions and rejections
  process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception', { 
      error: error.message,
      stack: error.stack 
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled Rejection', { 
      reason,
      promise: promise.toString()
    });
    process.exit(1);
  });
}

// 🏁 Start server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    log.error('Failed to start application', { error: error.message });
    process.exit(1);
  });
}