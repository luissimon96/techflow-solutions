import { log } from '../lib/logger';

// 🏗️ Dependency Injection Container
// Implementa IoC (Inversion of Control) para gerenciar dependências
// Suporta Singleton e Transient lifetimes

export type ServiceLifetime = 'singleton' | 'transient';
export type ServiceIdentifier = string | symbol;
export type ServiceFactory<T = any> = (...args: any[]) => T;
export type ServiceConstructor<T = any> = new (...args: any[]) => T;

interface ServiceDescriptor {
  identifier: ServiceIdentifier;
  factory?: ServiceFactory;
  constructor?: ServiceConstructor;
  instance?: any;
  lifetime: ServiceLifetime;
  dependencies?: ServiceIdentifier[];
}

export class DIContainer {
  private services = new Map<ServiceIdentifier, ServiceDescriptor>();
  private resolving = new Set<ServiceIdentifier>(); // Circular dependency detection

  // 🎯 Service Registration Methods

  /**
   * Register a singleton service (single instance for app lifetime)
   */
  registerSingleton<T>(
    identifier: ServiceIdentifier,
    constructor: ServiceConstructor<T> | ServiceFactory<T>,
    dependencies: ServiceIdentifier[] = []
  ): void {
    this.registerService(identifier, constructor, 'singleton', dependencies);
  }

  /**
   * Register a transient service (new instance each time)
   */
  registerTransient<T>(
    identifier: ServiceIdentifier,
    constructor: ServiceConstructor<T> | ServiceFactory<T>,
    dependencies: ServiceIdentifier[] = []
  ): void {
    this.registerService(identifier, constructor, 'transient', dependencies);
  }

  /**
   * Register a service instance directly
   */
  registerInstance<T>(identifier: ServiceIdentifier, instance: T): void {
    this.services.set(identifier, {
      identifier,
      instance,
      lifetime: 'singleton',
      dependencies: []
    });

    log.debug('Service instance registered', { 
      identifier: String(identifier),
      type: 'instance'
    });
  }

  private registerService(
    identifier: ServiceIdentifier,
    implementation: ServiceConstructor | ServiceFactory,
    lifetime: ServiceLifetime,
    dependencies: ServiceIdentifier[]
  ): void {
    // Determinar se é construtor ou factory
    const isConstructor = implementation.prototype && implementation.prototype.constructor;
    
    const descriptor: ServiceDescriptor = {
      identifier,
      lifetime,
      dependencies,
      ...(isConstructor 
        ? { constructor: implementation as ServiceConstructor }
        : { factory: implementation as ServiceFactory }
      )
    };

    this.services.set(identifier, descriptor);

    log.debug('Service registered', {
      identifier: String(identifier),
      lifetime,
      type: isConstructor ? 'constructor' : 'factory',
      dependencies: dependencies.map(String)
    });
  }

  // 🎯 Service Resolution Methods

  /**
   * Resolve a service by identifier
   */
  resolve<T>(identifier: ServiceIdentifier): T {
    // Circular dependency check
    if (this.resolving.has(identifier)) {
      const chain = Array.from(this.resolving).map(String).join(' -> ');
      throw new Error(`Circular dependency detected: ${chain} -> ${String(identifier)}`);
    }

    const descriptor = this.services.get(identifier);
    if (!descriptor) {
      throw new Error(`Service not found: ${String(identifier)}`);
    }

    // Return existing singleton instance
    if (descriptor.lifetime === 'singleton' && descriptor.instance) {
      return descriptor.instance as T;
    }

    // Mark as resolving for circular dependency detection
    this.resolving.add(identifier);

    try {
      const instance = this.createInstance<T>(descriptor);

      // Store singleton instance
      if (descriptor.lifetime === 'singleton') {
        descriptor.instance = instance;
      }

      log.debug('Service resolved', {
        identifier: String(identifier),
        lifetime: descriptor.lifetime
      });

      return instance;
    } finally {
      // Clean up resolving marker
      this.resolving.delete(identifier);
    }
  }

  /**
   * Resolve multiple services
   */
  resolveMany<T>(...identifiers: ServiceIdentifier[]): T[] {
    return identifiers.map(id => this.resolve<T>(id));
  }

  private createInstance<T>(descriptor: ServiceDescriptor): T {
    // Resolve dependencies first
    const dependencies = descriptor.dependencies?.map(dep => this.resolve(dep)) || [];

    if (descriptor.constructor) {
      // Invoke constructor with dependencies
      return new descriptor.constructor(...dependencies) as T;
    }

    if (descriptor.factory) {
      // Invoke factory with dependencies
      return descriptor.factory(...dependencies) as T;
    }

    throw new Error(`Invalid service descriptor for ${String(descriptor.identifier)}`);
  }

  // 🎯 Container Management

  /**
   * Check if service is registered
   */
  isRegistered(identifier: ServiceIdentifier): boolean {
    return this.services.has(identifier);
  }

  /**
   * Get all registered service identifiers
   */
  getRegisteredServices(): ServiceIdentifier[] {
    return Array.from(this.services.keys());
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.resolving.clear();
    log.debug('DI Container cleared');
  }

  /**
   * Create a scoped container (child container)
   */
  createScope(): DIContainer {
    const scope = new DIContainer();
    
    // Copy parent registrations (but not instances)
    for (const [key, descriptor] of this.services.entries()) {
      scope.services.set(key, {
        ...descriptor,
        instance: undefined // Don't copy instances to scope
      });
    }

    return scope;
  }

  // 🎯 Diagnostic Methods

  /**
   * Get container diagnostic information
   */
  getDiagnostics(): {
    totalServices: number;
    singletonServices: number;
    transientServices: number;
    instantiatedSingletons: number;
    services: Array<{
      identifier: string;
      lifetime: ServiceLifetime;
      dependencies: string[];
      instantiated: boolean;
    }>;
  } {
    const services = Array.from(this.services.values());
    
    return {
      totalServices: services.length,
      singletonServices: services.filter(s => s.lifetime === 'singleton').length,
      transientServices: services.filter(s => s.lifetime === 'transient').length,
      instantiatedSingletons: services.filter(s => s.lifetime === 'singleton' && s.instance).length,
      services: services.map(s => ({
        identifier: String(s.identifier),
        lifetime: s.lifetime,
        dependencies: s.dependencies?.map(String) || [],
        instantiated: !!s.instance
      }))
    };
  }

  /**
   * Validate container configuration (detect circular dependencies, missing services)
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [identifier, descriptor] of this.services.entries()) {
      // Check if all dependencies are registered
      if (descriptor.dependencies) {
        for (const dep of descriptor.dependencies) {
          if (!this.services.has(dep)) {
            errors.push(`Service ${String(identifier)} depends on unregistered service ${String(dep)}`);
          }
        }
      }
    }

    // Test for circular dependencies by attempting to resolve all services
    for (const identifier of this.services.keys()) {
      try {
        this.resolving.clear(); // Reset for each test
        this.testResolve(identifier, new Set());
      } catch (error) {
        if (error instanceof Error && error.message.includes('Circular dependency')) {
          errors.push(error.message);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private testResolve(identifier: ServiceIdentifier, visited: Set<ServiceIdentifier>): void {
    if (visited.has(identifier)) {
      throw new Error(`Circular dependency detected in validation`);
    }

    const descriptor = this.services.get(identifier);
    if (!descriptor) return;

    visited.add(identifier);

    if (descriptor.dependencies) {
      for (const dep of descriptor.dependencies) {
        this.testResolve(dep, new Set(visited));
      }
    }
  }
}

// 🌍 Global container instance (can be replaced for testing)
export const container = new DIContainer();

// 🎭 Service Identifiers (symbols for type safety)
export const SERVICE_IDENTIFIERS = {
  // Repositories
  ADMIN_REPOSITORY: Symbol('IAdminRepository'),
  USER_REPOSITORY: Symbol('IUserRepository'),
  QUOTE_REPOSITORY: Symbol('IQuoteRepository'),
  
  // Services
  AUTH_SERVICE: Symbol('AuthService'),
  TOKEN_SERVICE: Symbol('TokenService'),
  VALIDATION_SERVICE: Symbol('ValidationService'),
  EMAIL_SERVICE: Symbol('EmailService'),
  
  // Infrastructure
  LOGGER: Symbol('Logger'),
  CACHE_SERVICE: Symbol('CacheService'),
  
  // External services
  DATABASE_CONNECTION: Symbol('DatabaseConnection'),
} as const;