# 🚀 DEPLOYMENT

Guia completo para deploy do TechFlow Solutions em Render (Backend) e Vercel (Frontend).

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Variáveis de Ambiente](#variáveis-de-ambiente)
3. [Deploy Backend (Render)](#deploy-backend-render)
4. [Deploy Frontend (Vercel)](#deploy-frontend-vercel)
5. [Verificação Pós-Deploy](#verificação-pós-deploy)
6. [Troubleshooting](#troubleshooting)
7. [Segurança em Produção](#segurança-em-produção)

---

## Pré-requisitos

- ✅ Conta Render.com
- ✅ Conta Vercel
- ✅ Repositório GitHub configurado
- ✅ Node.js 18+ instalado localmente
- ✅ Git configurado com SSH ou HTTPS

---

## Variáveis de Ambiente

### Backend (.env)

```env
# Server
PORT=10000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://www.srluissimon.com,http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# WhatsApp (estes são configurados nos controllers)
WHATSAPP_PHONE=5554997109051
```

**Arquivo:** `backend/.env` ou configurado em Render dashboard

### Frontend

Vite usa variáveis de environment automaticamente:

```env
# .env.production (opcional - Vercel detecta automático)
VITE_API_URL=https://techflow-solutions-backend.onrender.com
```

---

## Deploy Backend (Render)

### 1. Conectar Repositório no Render

```bash
# 1. Ir para https://dashboard.render.com
# 2. Clicar em "New +" → "Web Service"
# 3. Conectar GitHub repo: luissimon96/techflow-solutions
# 4. Preencher formulário:

Name:                 techflow-solutions-backend
Root Directory:       backend
Runtime:              Node
Build Command:        npm run build
Start Command:        npm start
Environment:          Production
```

### 2. Configurar Variáveis de Ambiente no Render

No dashboard Render → Web Service → Environment:

```
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://www.srluissimon.com,http://localhost:3000,http://localhost:5173
LOG_LEVEL=info
```

### 3. Configurar Build e Deploy

**render.yaml** (já configurado no repo):

```yaml
services:
  - type: web
    name: techflow-solutions-backend
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
      - key: CORS_ORIGIN
        value: https://www.srluissimon.com
```

### 4. Deploy

```bash
# Option 1: Auto-deploy (padrão)
# Push para master dispara deploy automático

git add .
git commit -m "Deploy: update backend"
git push origin master

# Option 2: Deploy manual via Render dashboard
# Render → Deploys → Manual Deploy → Deploy latest commit
```

### 5. Verificar Deploy

```bash
# Checar health endpoint
curl https://techflow-solutions-backend.onrender.com/health

# Resposta esperada:
# { "status": "ok", "message": "Server is running" }
```

---

## Deploy Frontend (Vercel)

### 1. Conectar Repositório no Vercel

```bash
# 1. Ir para https://vercel.com/dashboard
# 2. Clicar em "Add New..." → "Project"
# 3. Importar: luissimon96/techflow-solutions
# 4. Preencher:

Framework Preset:             Vite
Root Directory:               frontend
Build Command:                npm run build (detectado automaticamente)
Install Command:              npm ci (detectado automaticamente)
Output Directory:             dist (detectado automaticamente)
Development Command:          npm run dev
```

### 2. Configurar Domínio

**vercel.json** (já configurado no repo):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://techflow-solutions-backend.onrender.com/api/:path*"
    }
  ]
}
```

### 3. Configurar Custom Domain

No dashboard Vercel:
1. Project Settings → Domains
2. Add Domain → `www.srluissimon.com`
3. Seguir instruções DNS (apontar para Vercel)
4. Adicionar `srluissimon.com` (redirect para www)

### 4. Configurar Environment Variables (se necessário)

Em Vercel Dashboard → Settings → Environment Variables:

```
NODE_ENV=production
VITE_API_URL=https://techflow-solutions-backend.onrender.com
```

### 5. Deploy

```bash
# Option 1: Auto-deploy (padrão)
# Push para master dispara deploy automático

git add .
git commit -m "Deploy: update frontend"
git push origin master

# Option 2: Deploy manual via Vercel dashboard
# Project → Deployments → Redeploy
```

### 6. Verificar Deploy

```bash
# Abrir site
https://www.srluissimon.com

# Verificar console para erros
# F12 → Console
```

---

## Verificação Pós-Deploy

### Checklist de Validação

- [ ] Backend health check retorna 200
- [ ] Frontend carrega sem erros (F12 → Console)
- [ ] Links internos funcionam
- [ ] Formulário de contato abre WhatsApp corretamente
- [ ] Formulário de orçamento funciona
- [ ] SEO tags corretos (F12 → Head)
- [ ] Imagens carregam
- [ ] Mobile responsivo (F12 → Toggle device toolbar)
- [ ] Dark mode funciona (clicar ☀️/🌙)
- [ ] Lighthouse score > 90 (2-3 minutos après deploy)

### Lighthouse Audit

```bash
# 1. Abrir DevTools (F12)
# 2. Clicar em "Lighthouse"
# 3. Gerar relatório para: Desktop
# 4. Verificar Performance, Accessibility, Best Practices, SEO
```

### Verificar APIs

```bash
# Contact endpoint
curl -X POST https://techflow-solutions-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "phone": "11999999999",
    "message": "Test message"
  }'

# Esperar resposta: { "whatsappUrl": "https://wa.me/..." }
```

---

## Troubleshooting

### Erro: CORS Origin Not Allowed

**Sintoma:** Erro no console: "CORS policy: blocked"

**Solução:**
1. Checar `CORS_ORIGIN` em Render environment variables
2. Adicionar seu domínio: `https://www.srluissimon.com`
3. Redeploy backend

```env
CORS_ORIGIN=https://www.srluissimon.com,http://localhost:3000,http://localhost:5173
```

### Erro: 404 Not Found (API)

**Sintoma:** Requisições retornam 404

**Solução:**
1. Checar URL da API em `frontend/src/lib/api.ts`
2. Deve ser: `https://techflow-solutions-backend.onrender.com/api`
3. Verificar endpoint: `/contact`, `/quotes`

```ts
// frontend/src/lib/api.ts
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://techflow-solutions-backend.onrender.com/api'
  : '/api';
```

### Erro: 502 Bad Gateway

**Sintoma:** Render retorna 502

**Solução:**
1. Checar Backend Logs em Render dashboard
2. Verificar se todas as dependências foram instaladas
3. Testar build localmente: `cd backend && npm run build`
4. Redeploy: Render → Redeploy latest commit

### Erro: Build Falha no Vercel

**Sintoma:** Vercel mostra "Build Failed"

**Solução:**
1. Clicar em deployment failed para ver logs
2. Erros comuns:
   - TypeScript errors: `npm run build` localmente para debug
   - Missing dependencies: `npm install` em `frontend/`
   - Import paths: verificar caminhos relativos

```bash
# Debug local
cd frontend
npm run build
npm run preview  # testar build
```

### Render Sleep (Inatividade)

**Sintoma:** Primeira requisição é lenta (30+ segundos)

**Causa:** Plano gratuito Render coloca em sleep após 15min inatividade

**Solução Temporária:**
- Usar serviço de ping: https://cron-job.org para ativar a cada 15min
- `GET https://techflow-solutions-backend.onrender.com/health` a cada 14min

**Solução Permanente:**
- Upgrade para plano pago Render

---

## Segurança em Produção

### Rate Limiting

Backend implementa rate limiting:

```
- General: 100 requests per 15 minutes per IP
- Contact/Quotes: 20 requests per 15 minutes per IP
- Auth (future): 5 attempts per 15 minutes per IP
```

### Headers de Segurança

Todas as respostas incluem:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### CORS Validação

- ✅ Apenas origens whitelisted podem acessar API
- ✅ Validação de método HTTP (GET, POST permitidos)
- ✅ Validação de content-type

### Attack Detection

Middleware bloqueia automaticamente:

- XSS patterns: `<script>`, `javascript:`, etc
- SQL injection: `UNION`, `DROP`, `INSERT`, etc
- Path traversal: `../`, `..\\`, etc

### Logging & Monitoring

- ✅ Todos os erros são logados
- ✅ Requisições suspeitas registradas
- ✅ Logs salvos em `backend/logs/`
- ✅ Configure alertas no Render para erro rates altos

---

## Rollback de Deploy

Se algo der errado após deploy:

### Vercel Rollback

```
Vercel Dashboard → Deployments → Clicar em deployment anterior → Promote to Production
```

### Render Rollback

```
Render Dashboard → Web Service → Deployments → Clicar em deploy anterior → Redeploy
```

---

## Monitoramento em Produção

### Verificações Regulares

```bash
# Weekly health check
curl -s https://techflow-solutions-backend.onrender.com/health | jq

# Monitor Uptime (use cron job)
# 0 9 * * * curl -f https://www.srluissimon.com/ || notify-admin

# Check SSL certificate
curl -vI https://www.srluissimon.com 2>&1 | grep -i "subject:"
```

### Alertas Recomendados

Configure em Render:
- [ ] Alert on failed deploy
- [ ] Alert on high error rate (> 5%)
- [ ] Alert on response time > 5s

---

## Documentação de Referência

- [Render Docs](https://render.com/docs/)
- [Vercel Docs](https://vercel.com/docs/)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Production Deployment](https://react.dev/learn/deployment)
