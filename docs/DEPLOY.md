# Deploy Guide - TechFlow Solutions

Este guia apresenta as melhores práticas de deploy para a aplicação TechFlow Solutions.

## Principios

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
VITE_ENV=development

# ❌ Evitar
# Hardcoding de URLs e credenciais
# VITE_MONGODB_URI - MongoDB não deve ser acessado diretamente do frontend
```

### Production

```bash
# ✅ Correto
# .env.production
VITE_API_URL=https://api.techflow.com
VITE_ENV=production

# ❌ Evitar
# Hardcoding de URLs e credenciais
# VITE_MONGODB_URI - MongoDB não deve ser acessado diretamente do frontend
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
        "distDir": "frontend/dist"
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

## Segurança e Arquitetura

### Acesso ao MongoDB

```typescript
// ✅ Correto - No backend (API)
// backend/src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Não VITE_MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

// O MongoDB deve ser acessado apenas no backend
export default clientPromise;

// ❌ Evitar
// Nunca acesse MongoDB diretamente do frontend
// Nunca use VITE_MONGODB_URI (expõe credenciais)
```

### Frontend para API

```typescript
// ✅ Correto - No frontend
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchData() {
  const response = await fetch(`${API_URL}/api/data`);
  return response.json();
}

// O frontend sempre acessa dados através da API do backend
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

- [ ] Variáveis de ambiente configuradas (apenas as necessárias para o frontend)
- [ ] MongoDB Cloud configurado no backend
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

- [ ] Variáveis de ambiente seguras (sem credenciais de DB no frontend)
- [ ] CORS configurado
- [ ] Headers de segurança
- [ ] Rate limiting (se necessário)
- [ ] MongoDB acessado apenas via API backend
