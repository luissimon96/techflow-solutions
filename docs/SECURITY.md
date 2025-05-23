# Guia de Segurança - TechFlow Solutions

## Princípios de Segurança

1. **Defesa em Profundidade**: Múltiplas camadas de segurança
2. **Princípio do Menor Privilégio**: Acesso mínimo necessário
3. **Validação de Dados**: Verificação rigorosa de inputs
4. **Criptografia**: Dados sensíveis sempre criptografados
5. **Auditoria**: Logs e monitoramento contínuo

## Autenticação

### Senhas

```typescript
// ✅ Correto
import { hash, compare } from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

// ❌ Evitar
function hashPassword(password: string): string {
  return md5(password); // Inseguro
}
```

### JWT

```typescript
// ✅ Correto
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

function generateToken(payload: TokenPayload): string {
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token: string): TokenPayload {
  return verify(token, JWT_SECRET) as TokenPayload;
}

// ❌ Evitar
function generateToken(payload) {
  return btoa(JSON.stringify(payload)); // Inseguro
}
```

## Autorização

### Middleware

```typescript
// ✅ Correto
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// ❌ Evitar
function authMiddleware(req, res, next) {
  if (req.headers.token) {
    next();
  }
}
```

### RBAC

```typescript
// ✅ Correto
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

function checkPermission(requiredRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
}

// ❌ Evitar
function checkAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  }
}
```

## Validação de Dados

### Input

```typescript
// ✅ Correto
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3)
});

function validateUser(data: unknown) {
  return UserSchema.parse(data);
}

// ❌ Evitar
function validateUser(data) {
  if (data.email && data.password) {
    return true;
  }
}
```

### Sanitização

```typescript
// ✅ Correto
import { sanitize } from 'sanitize-html';

function sanitizeInput(input: string): string {
  return sanitize(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

// ❌ Evitar
function sanitizeInput(input) {
  return input.replace(/<script>/g, '');
}
```

## Criptografia

### Dados Sensíveis

```typescript
// ✅ Correto
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// ❌ Evitar
function encrypt(text) {
  return btoa(text);
}
```

## Headers de Segurança

```typescript
// ✅ Correto
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  xssFilter: true,
  noSniff: true,
  frameguard: {
    action: 'deny',
  },
}));

// ❌ Evitar
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
```

## CORS

```typescript
// ✅ Correto
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

// ❌ Evitar
app.use(cors());
```

## Rate Limiting

```typescript
// ✅ Correto
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde'
});

app.use('/api/', limiter);

// ❌ Evitar
let requests = {};

app.use((req, res, next) => {
  const ip = req.ip;
  if (requests[ip] > 100) {
    res.status(429).send('Too many requests');
  }
  requests[ip] = (requests[ip] || 0) + 1;
  next();
});
```

## Logs de Segurança

```typescript
// ✅ Correto
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

function logSecurityEvent(event: SecurityEvent) {
  logger.info('Security Event', {
    timestamp: new Date().toISOString(),
    event: event.type,
    user: event.user,
    ip: event.ip,
    details: event.details
  });
}

// ❌ Evitar
console.log('Security event:', event);
```

## Backup e Recuperação

```typescript
// ✅ Correto
import { backup } from 'pg-backup';

async function createBackup() {
  const timestamp = new Date().toISOString();
  const filename = `backup-${timestamp}.sql`;
  
  await backup({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    output: filename
  });
  
  // Upload para storage seguro
  await uploadToSecureStorage(filename);
}

// ❌ Evitar
function backup() {
  // Backup local sem criptografia
}
```

## Monitoramento

```typescript
// ✅ Correto
import { monitor } from 'security-monitor';

monitor({
  endpoints: ['/api/*'],
  rules: [
    {
      type: 'brute-force',
      threshold: 5,
      window: '5m'
    },
    {
      type: 'sql-injection',
      pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b)/i
    }
  ],
  actions: [
    {
      type: 'block-ip',
      duration: '1h'
    },
    {
      type: 'notify-admin',
      channels: ['email', 'slack']
    }
  ]
});

// ❌ Evitar
// Sem monitoramento
```

## Checklist de Segurança

### Desenvolvimento

- [ ] Validação de inputs
- [ ] Sanitização de dados
- [ ] Criptografia de dados sensíveis
- [ ] Headers de segurança
- [ ] CORS configurado
- [ ] Rate limiting
- [ ] Logs de segurança
- [ ] Testes de segurança

### Deploy

- [ ] HTTPS configurado
- [ ] Certificados SSL válidos
- [ ] Firewall configurado
- [ ] Backup automatizado
- [ ] Monitoramento ativo
- [ ] Plano de recuperação

### Manutenção

- [ ] Atualizações de segurança
- [ ] Auditoria regular
- [ ] Análise de vulnerabilidades
- [ ] Treinamento da equipe
- [ ] Documentação atualizada
- [ ] Incident response plan
