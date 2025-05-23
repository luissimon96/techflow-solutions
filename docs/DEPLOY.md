# Guia de Deploy - TechFlow Solutions

## Princípios de Deploy

1. **Simplicidade**: Processos diretos e fáceis de manter
2. **Confiabilidade**: Deploy consistente e estável
3. **Monitoramento**: Métricas básicas de performance
4. **Segurança**: Proteção de dados e acessos
5. **Escalabilidade**: Preparado para crescimento futuro

## Ambientes

### Development

```bash
# ✅ Correto
# .env.development
VITE_API_URL=http://localhost:3000
VITE_MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dev
VITE_ENV=development

# ❌ Evitar
# Hardcoding de URLs e credenciais
```

### Production

```bash
# ✅ Correto
# .env.production
VITE_API_URL=https://api.techflow.com
VITE_MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prod
VITE_ENV=production

# ❌ Evitar
# Hardcoding de URLs e credenciais
```

## CI/CD com Vercel

### Configuração do Projeto

```json
// ✅ Correto
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}

// ❌ Evitar
// Sem configuração do Vercel
```

### GitHub Actions para CI

```yaml
# ✅ Correto
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run linting
      run: npm run lint

# ❌ Evitar
# Sem pipeline de CI
```

## MongoDB Cloud

### Configuração da Conexão

```typescript
// ✅ Correto
// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = import.meta.env.VITE_MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Por favor, defina a variável de ambiente VITE_MONGODB_URI');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// ❌ Evitar
// Conexão direta sem variáveis de ambiente
```

## Monitoramento

### Performance

```typescript
// ✅ Correto
// src/lib/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsWrapper({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}

// ❌ Evitar
// Sem monitoramento
```

## Checklist de Deploy

### Preparação

- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB Cloud configurado
- [ ] Domínio configurado (opcional)
- [ ] SSL configurado (automático na Vercel)

### Build

- [ ] Otimizações de assets
- [ ] Minificação
- [ ] Compression
- [ ] Cache configurado

### Deploy

- [ ] CI configurado
- [ ] Vercel configurado
- [ ] Domínio configurado
- [ ] SSL ativo

### Monitoramento

- [ ] Analytics configurado
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Logs básicos

### Segurança

- [ ] Variáveis de ambiente seguras
- [ ] CORS configurado
- [ ] Headers de segurança
- [ ] Rate limiting (se necessário)
