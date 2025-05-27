import request from 'supertest';
import express from 'express';
import {
  helmetConfig,
  generalRateLimit,
  attackDetection,
  originValidation,
  sanitizeHeaders
} from '../middleware/security';

// App de teste
const createTestApp = () => {
  const app = express();

  // Middlewares de segurança
  app.use(helmetConfig);
  app.use(express.json());
  app.use(sanitizeHeaders);
  app.use(attackDetection);
  app.use(originValidation);

  // Rota de teste
  app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Test endpoint' });
  });

  app.post('/test', (req, res) => {
    res.json({ success: true, data: req.body });
  });

  return app;
};

describe('Security Middleware Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Helmet Security Headers', () => {
    it('should set security headers correctly', async () => {
      const response = await request(app)
        .get('/test')
        .expect(200);

      // Verificar headers de segurança
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    });
  });

  describe('Attack Detection', () => {
    it('should block XSS attempts in URL', async () => {
      await request(app)
        .get('/test?search=<script>alert("xss")</script>')
        .expect(400);
    });

    it('should block SQL injection attempts', async () => {
      await request(app)
        .post('/test')
        .send({ query: "'; DROP TABLE users; --" })
        .expect(400);
    });

    it('should block path traversal attempts', async () => {
      await request(app)
        .get('/test/../../../etc/passwd')
        .expect(400);
    });

    it('should allow legitimate requests', async () => {
      await request(app)
        .post('/test')
        .send({ name: 'João Silva', email: 'joao@example.com' })
        .expect(200);
    });
  });

  describe('Header Sanitization', () => {
    it('should remove dangerous headers', async () => {
      const response = await request(app)
        .get('/test')
        .set('X-Forwarded-Host', 'malicious.com')
        .set('X-Original-Host', 'evil.com')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should validate Content-Type for POST requests', async () => {
      // Este teste verifica se o middleware está funcionando
      // O comportamento específico pode variar
      await request(app)
        .post('/test')
        .set('Content-Type', 'text/plain')
        .send('invalid data')
        .expect(400);
    });
  });

  describe('Origin Validation', () => {
    it('should allow requests from allowed origins', async () => {
      await request(app)
        .get('/test')
        .set('Origin', 'http://localhost:5173')
        .expect(200);
    });

    it('should block requests from unauthorized origins in production', async () => {
      // Simular ambiente de produção
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        await request(app)
          .get('/test')
          .set('Origin', 'https://malicious.com')
          .expect(403);
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});

describe('Rate Limiting Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(generalRateLimit);

    app.get('/test', (req, res) => {
      res.json({ success: true });
    });
  });

  it('should allow requests within rate limit', async () => {
    // Fazer algumas requisições dentro do limite
    for (let i = 0; i < 5; i++) {
      await request(app)
        .get('/test')
        .expect(200);
    }
  });

  it('should include rate limit headers', async () => {
    const response = await request(app)
      .get('/test')
      .expect(200);

    expect(response.headers['x-ratelimit-limit']).toBeDefined();
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
  });
});

describe('Input Validation Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  it('should handle large payloads correctly', async () => {
    const largePayload = {
      data: 'x'.repeat(1000000) // 1MB de dados
    };

    await request(app)
      .post('/test')
      .send(largePayload)
      .expect(413); // Payload too large
  });

  it('should handle malformed JSON', async () => {
    await request(app)
      .post('/test')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }')
      .expect(400);
  });

  it('should handle empty requests', async () => {
    await request(app)
      .post('/test')
      .send({})
      .expect(200);
  });
});

describe('Performance Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  it('should respond within acceptable time limits', async () => {
    const startTime = Date.now();

    await request(app)
      .get('/test')
      .expect(200);

    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(100); // Menos de 100ms
  });

  it('should handle concurrent requests', async () => {
    const promises = Array.from({ length: 10 }, () =>
      request(app).get('/test').expect(200)
    );

    const responses = await Promise.all(promises);
    expect(responses).toHaveLength(10);
    responses.forEach(response => {
      expect(response.body.success).toBe(true);
    });
  });
});

describe('Error Handling Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();

    // Rota que gera erro
    app.get('/error', (req, res) => {
      throw new Error('Test error');
    });
  });

  it('should handle errors gracefully', async () => {
    await request(app)
      .get('/error')
      .expect(500);
  });

  it('should not expose sensitive error information', async () => {
    const response = await request(app)
      .get('/error')
      .expect(500);

    // Verificar se não expõe stack trace em produção
    expect(response.body.stack).toBeUndefined();
  });
}); 