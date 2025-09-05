import { container, SERVICE_IDENTIFIERS } from './DIContainer';
import { log } from '../lib/logger';

// Repositories
import { IAdminRepository } from '../repositories/IAdminRepository';
import { MongoAdminRepository } from '../repositories/MongoAdminRepository';

// Services
import { AuthService } from '../services/AuthService';
import { TokenService } from '../services/TokenService';
import { ValidationService } from '../services/ValidationService';

// 🏭 Service Registry
// Configura e registra todos os serviços no DI Container
// Ponto central para configuração de dependências

export class ServiceRegistry {
  
  /**
   * Registra todos os serviços necessários para a aplicação
   */
  static registerServices(): void {
    log.info('Starting service registration');

    try {
      // 🗄️ Repositories (Data Layer)
      this.registerRepositories();
      
      // 🏢 Services (Business Logic Layer)  
      this.registerBusinessServices();
      
      // 🔧 Infrastructure Services
      this.registerInfrastructure();

      // ✅ Validate container configuration
      const validation = container.validate();
      if (!validation.valid) {
        log.error('DI Container validation failed', { errors: validation.errors });
        throw new Error(`Container validation failed: ${validation.errors.join(', ')}`);
      }

      const diagnostics = container.getDiagnostics();
      log.info('Service registration completed successfully', {
        totalServices: diagnostics.totalServices,
        singletonServices: diagnostics.singletonServices,
        transientServices: diagnostics.transientServices
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Service registration failed', { error: errorMessage });
      throw new Error(`Failed to register services: ${errorMessage}`);
    }
  }

  /**
   * Registra repositories (camada de dados)
   */
  private static registerRepositories(): void {
    log.debug('Registering repositories');

    // Admin Repository - Singleton para cache de consultas
    container.registerSingleton<IAdminRepository>(
      SERVICE_IDENTIFIERS.ADMIN_REPOSITORY,
      MongoAdminRepository
    );

    // Futuramente: User Repository, Quote Repository, etc.
  }

  /**
   * Registra business services (camada de negócio)
   */
  private static registerBusinessServices(): void {
    log.debug('Registering business services');

    // Auth Service - Singleton para performance
    container.registerSingleton(
      SERVICE_IDENTIFIERS.AUTH_SERVICE,
      AuthService,
      [SERVICE_IDENTIFIERS.ADMIN_REPOSITORY, SERVICE_IDENTIFIERS.TOKEN_SERVICE]
    );

    // Token Service - Singleton para shared state (blacklist)
    container.registerSingleton(
      SERVICE_IDENTIFIERS.TOKEN_SERVICE,
      TokenService
    );

    // Validation Service - Stateless, pode ser singleton
    container.registerSingleton(
      SERVICE_IDENTIFIERS.VALIDATION_SERVICE,
      ValidationService
    );
  }

  /**
   * Registra serviços de infraestrutura
   */
  private static registerInfrastructure(): void {
    log.debug('Registering infrastructure services');

    // Logger instance - já existente, registrar como instância
    container.registerInstance(SERVICE_IDENTIFIERS.LOGGER, log);

    // Futuramente: Cache, Database Connection, etc.
  }

  /**
   * Configura serviços para ambiente de teste
   */
  static registerTestServices(): void {
    log.info('Registering test services');

    // Clear existing services
    container.clear();

    // Register test implementations
    // Por exemplo, mock repositories para testes unitários
    
    // Esta função seria expandida quando implementarmos testes
  }

  /**
   * Configura serviços para ambiente de desenvolvimento
   */
  static registerDevelopmentServices(): void {
    log.info('Registering development services');

    // Register standard services
    this.registerBusinessServices();

    // Add development-specific services
    // Por exemplo: debug utilities, dev middleware, etc.
  }

  /**
   * Configura serviços para ambiente de produção
   */
  static registerProductionServices(): void {
    log.info('Registering production services');

    // Register standard services
    this.registerBusinessServices();

    // Add production-specific optimizations
    // Por exemplo: caching layers, monitoring, etc.
  }

  /**
   * Obtém diagnósticos do container
   */
  static getDiagnostics() {
    return container.getDiagnostics();
  }

  /**
   * Valida a configuração atual do container
   */
  static validateConfiguration() {
    return container.validate();
  }
}

// 🎯 Service Locator Pattern (para casos onde DI não é possível)
export class ServiceLocator {
  
  /**
   * Resolve um serviço por identifier
   */
  static get<T>(identifier: symbol): T {
    try {
      return container.resolve<T>(identifier);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log.error('Service resolution failed', { 
        identifier: identifier.toString(),
        error: errorMessage 
      });
      throw error;
    }
  }

  /**
   * Métodos de conveniência para serviços mais usados
   */
  static getAuthService(): AuthService {
    return this.get<AuthService>(SERVICE_IDENTIFIERS.AUTH_SERVICE);
  }

  static getTokenService(): TokenService {
    return this.get<TokenService>(SERVICE_IDENTIFIERS.TOKEN_SERVICE);
  }

  static getValidationService(): ValidationService {
    return this.get<ValidationService>(SERVICE_IDENTIFIERS.VALIDATION_SERVICE);
  }

  static getAdminRepository(): IAdminRepository {
    return this.get<IAdminRepository>(SERVICE_IDENTIFIERS.ADMIN_REPOSITORY);
  }
}

// 🔧 Decorator para injeção de dependência (experimental)
export function Injectable(identifier?: symbol) {
  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    const serviceId = identifier || Symbol(constructor.name);
    container.registerTransient(serviceId, constructor);
    return constructor;
  };
}

// 🎭 Type helpers para melhor IntelliSense
export type ServiceType<T extends symbol> = 
  T extends typeof SERVICE_IDENTIFIERS.AUTH_SERVICE ? AuthService :
  T extends typeof SERVICE_IDENTIFIERS.TOKEN_SERVICE ? TokenService :
  T extends typeof SERVICE_IDENTIFIERS.VALIDATION_SERVICE ? ValidationService :
  T extends typeof SERVICE_IDENTIFIERS.ADMIN_REPOSITORY ? IAdminRepository :
  unknown;