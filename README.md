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
    └── 📋 PROJETO_COMPLETO.md  # Documentação consolidada
```

## 🌐 URLs da Aplicação

### Desenvolvimento Local

- **Frontend:** <http://localhost:5173>
- **Backend API:** <http://localhost:3000>
- **Health Check:** <http://localhost:3000/health>

### Produção

- **Site:** <https://www.srluissimon.com>
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
CORS_ORIGIN=http://localhost:5173,https://www.srluissimon.com

# JWT (preparado para admin)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Porta
PORT=3000
```

## 📊 Status do Projeto

**Progresso:** 97% → 100% (Meta: 23 de Fevereiro) ✅

### ✅ Funcionalidades Implementadas

- [x] Landing page responsiva
- [x] Sistema de contato completo
- [x] Sistema de orçamentos (25+ campos)
- [x] Validação robusta (frontend + backend)
- [x] Rate limiting e segurança
- [x] Deploy automatizado (Render + Vercel)
- [x] MongoDB Atlas configurado
- [x] TypeScript 100% coverage
- [x] Scripts de desenvolvimento unificados

### 🚀 **EM EXECUÇÃO - PLANO 30 DIAS (24 Jan - 23 Fev)**

#### **🔒 Semana 1: Segurança e Performance (24-30 Jan)**

- [ ] **Security audit** completo com melhorias
- [ ] **Performance optimization** (Lighthouse > 95)
- [ ] **Testing framework** robusto (>80% coverage)
- [ ] **Code quality** e best practices

#### **🏗️ Semana 2: Infraestrutura Admin (31 Jan - 6 Fev)**

- [ ] **JWT Authentication** sistema completo
- [ ] **ProjectController** CRUD avançado
- [ ] **Database optimization** com indexes
- [ ] **API documentation** com Swagger

#### **🎨 Semana 3: Interface Admin (7-13 Fev)**

- [ ] **Admin Dashboard** responsivo
- [ ] **Project Management** interface completa
- [ ] **Cloudinary Upload** sistema integrado
- [ ] **Advanced UI/UX** components

#### **🚀 Semana 4: Deploy e Polish (14-23 Fev)**

- [ ] **Production optimization** completa
- [ ] **Monitoring** e error tracking
- [ ] **Cross-browser testing** extensivo
- [ ] **Documentation** finalizada

### 🎯 **Próximas Funcionalidades (Após 30 dias)**

- [ ] **Cases de Sucesso**: Gallery de projetos públicos
- [ ] **Client Portal**: Dashboard para clientes
- [ ] **Blog System**: CMS para conteúdo
- [ ] **Analytics Dashboard**: Métricas avançadas

## 📚 Documentação

### 📋 Documentação Principal

- **[📋 PROJETO_COMPLETO.md](docs/PROJETO_COMPLETO.md)** - Documentação consolidada completa
  - Arquitetura e stack tecnológica
  - Guias de deploy e DevOps
  - Próximos passos e cronograma
  - Testes e qualidade
  - Segurança e performance
  - Acessibilidade e style guide
  - Guia de contribuição

### 📋 Documentação Específica

- **[🚀 DEPLOY.md](docs/DEPLOY.md)** - Guia de deploy e ambientes
- **[🗄️ MONGODB_SETUP_SUMMARY.md](docs/MONGODB_SETUP_SUMMARY.md)** - Configuração do MongoDB
- **[🔧 RENDER_DEPLOY_GUIDE.md](docs/RENDER_DEPLOY_GUIDE.md)** - Deploy no Render
- **[🌐 DOMAIN_UPDATE_SUMMARY.md](docs/DOMAIN_UPDATE_SUMMARY.md)** - Atualização de domínio

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Instale dependências: `npm run install:all`
4. Desenvolva: `npm run dev`
5. Teste: `npm test`
6. Commit: `git commit -m 'feat: nova feature'`
7. Push: `git push origin feature/nova-feature`
8. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Site:** <https://www.srluissimon.com>
- **Email:** Através do formulário de contato no site
- **GitHub:** [@luissimon96](https://github.com/luissimon96)

---

**🚀 TechFlow Solutions - Transformando ideias em soluções digitais!**
