import { Request, Response, NextFunction } from 'express';
import { securityLogger } from './security';

// Cache em memória simples
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize = 1000; // Máximo de 1000 entradas

  set(key: string, data: any, ttlSeconds = 300): void {
    // Limpar cache se estiver muito grande
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    };

    this.cache.set(key, entry);

    securityLogger.info('Cache entry created', {
      key,
      ttlSeconds,
      cacheSize: this.cache.size
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      securityLogger.info('Cache entry expired and removed', { key });
      return null;
    }

    securityLogger.info('Cache hit', { key });
    return entry.data;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      securityLogger.info('Cache entry deleted', { key });
    }
    return deleted;
  }

  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    securityLogger.info('Cache cleared', { previousSize: size });
  }

  // Limpar entradas expiradas
  cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    // Se ainda estiver muito grande, remover as mais antigas
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.2)); // Remove 20%
      toRemove.forEach(([key]) => {
        this.cache.delete(key);
        removedCount++;
      });
    }

    securityLogger.info('Cache cleanup completed', {
      removedCount,
      currentSize: this.cache.size
    });
  }

  getStats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}

// Instância global do cache
const cache = new MemoryCache();

// Middleware de cache para responses
export const cacheResponse = (ttlSeconds = 300, keyGenerator?: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Apenas cachear GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Gerar chave do cache
    const cacheKey = keyGenerator
      ? keyGenerator(req)
      : `${req.originalUrl}:${JSON.stringify(req.query)}`;

    // Tentar buscar no cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Key', cacheKey);
      return res.json(cachedData);
    }

    // Interceptar o response para cachear
    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function (data) {
      // Cachear apenas responses de sucesso
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          cache.set(cacheKey, parsedData, ttlSeconds);
          res.set('X-Cache', 'MISS');
          res.set('X-Cache-Key', cacheKey);
        } catch (error) {
          securityLogger.warn('Failed to cache response', {
            error: error instanceof Error ? error.message : 'Unknown error',
            cacheKey
          });
        }
      }

      return originalSend.call(this, data);
    };

    res.json = function (data) {
      // Cachear apenas responses de sucesso
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, data, ttlSeconds);
        res.set('X-Cache', 'MISS');
        res.set('X-Cache-Key', cacheKey);
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

// Middleware para invalidar cache por padrão
export const invalidateCache = (pattern: string | RegExp) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const originalJson = res.json;

    const invalidate = () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const keys = Array.from(cache['cache'].keys());
        let invalidatedCount = 0;

        keys.forEach(key => {
          if (typeof pattern === 'string') {
            if (key.includes(pattern)) {
              cache.delete(key);
              invalidatedCount++;
            }
          } else {
            if (pattern.test(key)) {
              cache.delete(key);
              invalidatedCount++;
            }
          }
        });

        if (invalidatedCount > 0) {
          securityLogger.info('Cache invalidated', {
            pattern: pattern.toString(),
            invalidatedCount
          });
        }
      }
    };

    res.send = function (data) {
      invalidate();
      return originalSend.call(this, data);
    };

    res.json = function (data) {
      invalidate();
      return originalJson.call(this, data);
    };

    next();
  };
};

// Cache específico para projetos
export const projectCache = {
  // Cache para lista de projetos (5 minutos)
  list: cacheResponse(300, (req) => `projects:list:${JSON.stringify(req.query)}`),

  // Cache para projeto específico (10 minutos)
  single: cacheResponse(600, (req) => `projects:single:${req.params.id || req.params.slug}`),

  // Cache para estatísticas (15 minutos)
  stats: cacheResponse(900, () => 'projects:stats'),

  // Invalidar cache de projetos
  invalidate: invalidateCache(/^projects:/)
};

// Cache específico para quotes
export const quoteCache = {
  // Cache para estatísticas de quotes (10 minutos)
  stats: cacheResponse(600, () => 'quotes:stats'),

  // Invalidar cache de quotes
  invalidate: invalidateCache(/^quotes:/)
};

// Middleware para headers de cache HTTP
export const setCacheHeaders = (maxAge = 300, isPublic = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      const cacheControl = isPublic
        ? `public, max-age=${maxAge}`
        : `private, max-age=${maxAge}`;

      res.set('Cache-Control', cacheControl);
      res.set('ETag', `"${Date.now()}"`);
    }

    next();
  };
};

// Cleanup automático do cache a cada 30 minutos
setInterval(() => {
  cache.cleanup();
}, 30 * 60 * 1000);

// Exportar instância do cache para uso direto
export { cache };

// Middleware para estatísticas do cache
export const cacheStats = (req: Request, res: Response) => {
  const stats = cache.getStats();

  res.json({
    success: true,
    data: {
      ...stats,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    }
  });
};

export default cache; 