# 🚀 DEPLOYMENT

Guia de deploy do TechFlow Solutions na Vercel (frontend React).

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Variáveis de Ambiente](#variáveis-de-ambiente)
3. [Deploy Frontend (Vercel)](#deploy-frontend-vercel)
4. [Verificação Pós-Deploy](#verificação-pós-deploy)
5. [Troubleshooting](#troubleshooting)
6. [Segurança em Produção](#segurança-em-produção)

---

## Pré-requisitos

- ✅ Conta Vercel
- ✅ Repositório GitHub configurado (GitHub CLI ou web interface)
- ✅ Node.js 18+ instalado localmente
- ✅ Git configurado

---

## Variáveis de Ambiente

O frontend não usa variáveis de environment para API (integração direta com WhatsApp).

Se necessário adicionar variáveis customizadas, use `frontend/.env`:



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
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist"
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
```

**Nota:** Frontend não usa variáveis de API - integração direta com WhatsApp.

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
# F12 → Console → verificar warnings/errors

# Testar funcionalidade
# 1. Clicar em "Contato" e enviar formulário
# 2. Verificar se abre WhatsApp
# 3. Testar responsividade em mobile (F12 → Toggle device toolbar)
```

---

## Verificação Pós-Deploy

### Checklist de Validação


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



---

## Troubleshooting

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

### Erro: Formulário não abre WhatsApp

**Sintoma:** Clicar em botão de envio não abre WhatsApp

**Solução:**
1. Verificar no console (F12) se há erros
2. Considerar que alguns navegadores/dispositivos podem bloquear window.open()
3. Testar em navegador diferente
4. Verificar se número WhatsApp está correto em `contactController.ts`

---

## Segurança em Produção

### Vercel Security Features

- ✅ HTTPS automático com certificado SSL/TLS
- ✅ DDoS protection integrado
- ✅ Firewall gerenciado
- ✅ Auto-scaling transparente
- ✅ Environment variables criptografadas

### Frontend Security Best Practices

- ✅ Usar HTTPS sempre
- ✅ Content-Security-Policy headers automáticos
- ✅ XSS protection via React
- ✅ Validação de input no frontend

---

## Rollback de Deploy

Se algo der errado após deploy:

### Vercel Rollback

```
Vercel Dashboard → Deployments → Clicar em deployment anterior → Promote to Production
```

---

## Monitoramento em Produção

### Verificações Regulares

```bash
# Manual check
curl -s https://www.srluissimon.com/ | head -20

# Check SSL certificate
curl -vI https://www.srluissimon.com 2>&1 | grep -i "subject:"
```

### Alertas Recomendados

Configure em Vercel (Project Settings → Integrations):
- [ ] Notificar em deployment falho
- [ ] Notificar em erro de build

---

## Documentação de Referência

- [Vercel Docs](https://vercel.com/docs/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Production Deployment](https://react.dev/learn/deployment)
