# 🚀 TechFlow Solutions

**Full-stack web application** para empresa de desenvolvimento de software, construída com React/TypeScript (frontend) e Node.js/Express/MongoDB (backend).

## 📋 Funcionalidades

✅ **Landing Page Responsiva** com design moderno  
✅ **Sistema de Contato** com validação e rate limiting  
✅ **Sistema de Orçamentos** completo com 25+ campos estruturados  
✅ **Analytics e Tracking** de conversões  
✅ **Dashboard Admin** (API endpoints prontos)  
✅ **Banco de dados MongoDB** com schemas otimizados  
✅ **Deploy automatizado** no Render  

## 🛠️ Stack Tecnológica

### Frontend

- **React 18** + **TypeScript**
- **Chakra UI** para design system
- **React Router** para navegação
- **Framer Motion** para animações
- **Zod** para validação
- **Vite** como build tool

### Backend

- **Node.js** + **Express** + **TypeScript**
- **MongoDB** com **Mongoose**
- **Express Validator** para validação
- **CORS** e **Rate Limiting**
- **JWT** para autenticação (preparado)

## 🚀 Desenvolvimento Local

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB Atlas (ou local)

### 🔧 Configuração Inicial

```bash
# Clonar repositório
git clone https://github.com/luissimon96/techflow-solutions.git
cd techflow-solutions

# Instalar dependências de todos os projetos
npm run install:all

# Configurar variáveis de ambiente
cp backend/env.example backend/.env
# Edite backend/.env com suas configurações
```

### ⚡ Scripts de Desenvolvimento

```bash
# 🚀 Iniciar desenvolvimento (backend + frontend simultaneamente)
npm run dev

# 📱 Iniciar apenas frontend (porta 5173)
npm run dev:frontend

# 🖥️ Iniciar apenas backend (porta 3000)
npm run dev:backend

# 🔍 Verificar saúde da aplicação
npm run health:check
```

### 🏗️ Scripts de Build e Produção

```bash
# 🔨 Build completo (backend + frontend)
npm run build

# 🔨 Build apenas backend
npm run build:backend

# 🔨 Build apenas frontend
npm run build:frontend

# 🚀 Iniciar produção (após build)
npm start

# 📦 Preparar para deploy
npm run deploy:prepare
```

### 🧪 Scripts de Teste e Qualidade

```bash
# 🧪 Executar todos os testes
npm test

# 🧪 Testes apenas backend
npm run test:backend

# 🧪 Testes apenas frontend
npm run test:frontend

# 🔍 Linting completo
npm run lint

# ✨ Formatação de código
npm run format

# 🧹 Limpeza completa
npm run clean
```

## 📁 Estrutura do Projeto

```
techflow-solutions/
├── 📦 package.json          # Scripts raiz e workspaces
├── 📋 README.md            # Este arquivo
├── 🖥️ backend/            # API Node.js + Express
│   ├── 📦 package.json
│   ├── 🔧 src/
│   │   ├── 📋 index.ts     # Entrada principal
│   │   ├── 🛣️ routes/      # Rotas da API
│   │   ├── 🎮 controllers/ # Lógica de negócio
│   │   ├── 📊 models/      # Schemas MongoDB
│   │   └── 🔧 middleware/  # Middlewares
│   └── 📁 dist/           # Build compilado
├── 📱 frontend/           # App React + TypeScript
│   ├── 📦 package.json
│   ├── 🔧 src/
│   │   ├── 📋 main.tsx    # Entrada principal
│   │   ├── 📄 pages/      # Páginas da aplicação
│   │   ├── 🧩 components/ # Componentes reutilizáveis
│   │   └── 🔧 lib/        # Utilitários e APIs
│   └── 📁 dist/          # Build estático
└── 📚 docs/              # Documentação
    └── 📋 PROJECT_ROADMAP_UPDATED.md
```

## 🌐 URLs da Aplicação

### Desenvolvimento Local

- **Frontend:** <http://localhost:5173>
- **Backend API:** <http://localhost:3000>
- **Health Check:** <http://localhost:3000/health>

### Produção

- **Site:** <https://techflow-solutions-frontend.onrender.com>
- **API:** <https://techflow-solutions-backend.onrender.com>

## 🔗 Principais Endpoints da API

```bash
# 🏥 Saúde do servidor
GET /health

# 📧 Sistema de contato
POST /api/contact

# 💼 Sistema de orçamentos
POST /api/quotes              # Criar solicitação
GET  /api/quotes              # Listar (admin)
GET  /api/quotes/:id          # Obter específico (admin)
GET  /api/quotes/stats        # Estatísticas (admin)
PUT  /api/quotes/:id/status   # Atualizar status (admin)
```

## 🔧 Configuração de Ambiente

### Backend (.env)

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# CORS
CORS_ORIGIN=http://localhost:5173,https://your-domain.com

# JWT (preparado para admin)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Porta
PORT=3000
```

## 📊 Status do Projeto

**Progresso:** 95% Completo ✅

### ✅ Funcionalidades Implementadas

- [x] Landing page responsiva
- [x] Sistema de contato completo
- [x] Sistema de orçamentos (25+ campos)
- [x] Validação robusta (frontend + backend)
- [x] Rate limiting e segurança
- [x] Schemas MongoDB otimizados
- [x] API RESTful completa
- [x] Analytics e tracking
- [x] Deploy automatizado

### 🔄 Próximas Fases

- [ ] **Fase 3:** Dashboard administrativo
- [ ] **Fase 4:** Autenticação admin
- [ ] **Fase 5:** Sistema de cases de sucesso

## 🚀 Deploy

O projeto está configurado para deploy automático no **Render**:

1. **Backend:** Build automático do TypeScript
2. **Frontend:** Build estático com Vite
3. **MongoDB:** Atlas com connection pooling

## 📞 Suporte

Para dúvidas ou suporte:

- 📧 Email: <contato@techflowsolutions.com>
- 🐛 Issues: [GitHub Issues](https://github.com/luissimon96/techflow-solutions/issues)

---

**TechFlow Solutions** - Transformando ideias em soluções tecnológicas 🚀
