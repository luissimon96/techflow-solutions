# 🚀 TechFlow Solutions

**Full-stack web application** para empresa de desenvolvimento de software, construída com React/TypeScript (frontend) e Node.js/Express (backend) com integração WhatsApp.

## 🚀 Início Rápido

```bash
# Clonar repositório
git clone https://github.com/luissimon96/techflow-solutions.git
cd techflow-solutions

# Instalar dependências
npm run install:all

# Iniciar desenvolvimento
npm run dev
```

## 📋 Scripts Principais

```bash
npm run dev          # Backend + Frontend
npm run dev:backend  # Apenas backend (porta 10000)
npm run dev:frontend # Apenas frontend (porta 3001+)
npm run build        # Build completo
npm test             # Testes
npm run lint         # Verificação de código
```

## 🛠️ Stack Tecnológica

### Frontend
- React 18 + TypeScript + Chakra UI + Vite

### Backend  
- Node.js + Express + TypeScript + WhatsApp Integration

## 📱 Funcionalidades

- ✅ Landing page responsiva
- ✅ Sistema de contato com WhatsApp
- ✅ Sistema de orçamentos
- ✅ Fallback inteligente para erros
- ✅ Deploy automatizado

## 📂 Estrutura

```
techflow-solutions/
├── backend/         # API Node.js
├── frontend/        # React App
├── docs/            # Documentação centralizada
│   ├── CHANGELOG.md # Histórico de mudanças
│   ├── ARCHITECTURE.md # Arquitetura do projeto
│   └── DEPLOYMENT.md   # Guia de deployment
├── SCRIPTS.md       # Comandos detalhados
└── package.json     # Scripts raiz
```

## 📚 Documentação

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Arquitetura, padrões e estrutura do projeto
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guia completo para deploy em Render e Vercel
- **[CHANGELOG.md](./docs/CHANGELOG.md)** - Histórico de todas as mudanças
- **[CLAUDE.md](./CLAUDE.md)** - Instruções para IA (Claude Code)
- **[PROJECT_INDEX.md](./PROJECT_INDEX.md)** - Índice detalhado do projeto
- **[SCRIPTS.md](./SCRIPTS.md)** - Referência de comandos

## 🔗 Links

- **Site:** https://www.srluissimon.com
- **API:** https://techflow-solutions-backend.onrender.com
- **Health:** https://techflow-solutions-backend.onrender.com/health

## 🚀 Deploy

O projeto usa deploy automático no Render. Push para `master` dispara deploy automático.

---

**Desenvolvido com ❤️ pela TechFlow Solutions**