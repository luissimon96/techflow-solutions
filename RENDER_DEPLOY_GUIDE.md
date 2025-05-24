# 🚀 Guia de Deploy no Render - TechFlow Solutions Backend

## 🚨 Problema Identificado

O erro `error TS5083: Cannot read file '/opt/render/project/src/tsconfig.json'` acontece porque o Render está tentando executar comandos de frontend no backend.

## ✅ Solução Implementada

### 1. Configuração Corrigida

**Arquivos atualizados:**

- ✅ `render.yaml` - Configuração principal
- ✅ `.render.yml` - Configuração alternativa
- ✅ `backend/src/index.ts` - Rotas de health e CORS
- ✅ `backend/Dockerfile` - Porta correta

### 2. Configuração no Dashboard do Render

#### Opção A: Usar o arquivo render.yaml (Recomendado)

1. **Acesse o dashboard do Render**
2. **Vá para o seu serviço backend**
3. **Settings → Environment**
4. **Verifique se as seguintes configurações estão corretas:**

```yaml
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

#### Opção B: Configuração Manual

Se o render.yaml não for reconhecido:

1. **Build & Deploy → Settings**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

2. **Environment Variables:**

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=[sua-connection-string-mongodb]
   JWT_SECRET=[sua-chave-jwt-segura]
   CORS_ORIGIN=https://techflow-solutions.vercel.app,http://localhost:3000
   RENDER=true
   RENDER_EXTERNAL_URL=https://techflow-solutions-backend.onrender.com
   ```

3. **Health Check:**
   - **Health Check Path:** `/health`

### 3. Variáveis de Ambiente Obrigatórias

Você precisa configurar no dashboard do Render:

```bash
# MongoDB Atlas (obrigatório)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techflow?retryWrites=true&w=majority

# JWT Secret (obrigatório)
JWT_SECRET=uma-chave-super-secreta-e-longa-para-jwt-2025

# Outras (já configuradas)
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://techflow-solutions.vercel.app,http://localhost:3000
RENDER=true
RENDER_EXTERNAL_URL=https://techflow-solutions-backend.onrender.com
```

### 4. Endpoints Disponíveis

Após o deploy, os seguintes endpoints estarão disponíveis:

- **Health Check:** `https://techflow-solutions-backend.onrender.com/health`
- **API Health:** `https://techflow-solutions-backend.onrender.com/api/health`

### 5. Como Fazer o Redeploy

1. **Acesse o dashboard do Render**
2. **Selecione o serviço backend**
3. **Clique em "Manual Deploy"**
4. **Aguarde o build e deploy**

### 6. Logs de Debug

Para verificar se está funcionando:

1. **Acesse "Logs" no dashboard**
2. **Procure por:**

   ```
   Servidor rodando na porta 10000
   Health check disponível em: http://localhost:10000/health
   ```

### 7. Teste de Funcionamento

Após o deploy, teste:

```bash
curl https://techflow-solutions-backend.onrender.com/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "uptime": 123.456
}
```

## 🔧 Estrutura de Arquivos Corrigida

```
backend/
├── src/
│   ├── index.ts          ✅ Arquivo principal
│   ├── routes/
│   │   └── health.ts     ✅ Rota de health
│   └── middleware/
│       └── errorHandler.ts ✅ Tratamento de erros
├── package.json          ✅ Scripts corretos
├── tsconfig.json         ✅ Configuração TS
└── Dockerfile           ✅ Docker para deploy
```

## 🚀 Próximos Passos

1. **Configurar MongoDB Atlas**
2. **Definir JWT_SECRET seguro**
3. **Fazer redeploy no Render**
4. **Testar endpoints**
5. **Conectar frontend à API**

## 📞 Troubleshooting

**Se ainda der erro:**

1. Verifique se o `rootDir` está configurado como `backend`
2. Certifique-se de que as variáveis de ambiente estão definidas
3. Verifique os logs no dashboard do Render
4. Teste o health check endpoint

**Comandos úteis para debug local:**

```bash
cd backend
npm install
npm run build
npm start
```

---

**✅ Status:** Configuração corrigida e pronta para deploy!
