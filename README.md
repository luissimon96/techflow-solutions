# TechFlow Solutions

Site institucional da TechFlow Solutions, uma empresa especializada em desenvolvimento de software e soluções tecnológicas.

## 🚀 Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Chakra UI
- React Router
- React Query
- Framer Motion
- Vercel Analytics

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- JWT
- Zod (validação)

## 🌐 URLs de Produção

- **Frontend**: <https://www.srluissimon.com>
- **Backend API**: <https://techflow-solutions-backend.onrender.com>
- **Documentação da API**: <https://techflow-solutions-backend.onrender.com/docs>

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/techflow-solutions.git
cd techflow-solutions
```

2. Configure o Frontend:

```bash
cd frontend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Configure o Backend:

```bash
cd ../backend
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações (MongoDB, JWT, etc.)
```

4. Inicie os servidores:

**Frontend (desenvolvimento):**

```bash
cd frontend
npm run dev
```

**Backend (desenvolvimento):**

```bash
cd backend
npm run dev
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:5000`

## 🛠️ Scripts Disponíveis

### Frontend

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes

### Backend

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila TypeScript
- `npm start` - Inicia o servidor de produção
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter

## 📦 Estrutura do Projeto

```
techflow-solutions/
├── frontend/              # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── lib/           # Utilitários e configurações
│   │   ├── theme/         # Configuração do tema
│   │   └── assets/        # Recursos estáticos
│   ├── public/            # Arquivos públicos
│   └── tests/            # Testes
├── backend/               # API Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── models/        # Modelos de dados
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares
│   │   └── utils/         # Utilitários
│   └── tests/            # Testes
└── docs/                 # Documentação
```

## ⚙️ Variáveis de Ambiente

### Frontend (.env)

```env
VITE_API_URL=https://techflow-solutions-backend.onrender.com
VITE_API_BASE_URL=https://techflow-solutions-backend.onrender.com/api
```

### Backend (.env)

```env
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techflow
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://www.srluissimon.com,http://localhost:3000
RENDER=true
RENDER_EXTERNAL_URL=https://techflow-solutions-backend.onrender.com
```

## 🌐 Deploy

### Frontend - Vercel

O frontend está hospedado na Vercel e é automaticamente atualizado quando há push na branch main.

### Backend - Render

O backend está hospedado no Render:

- URL: <https://techflow-solutions-backend.onrender.com>
- Deploy automático a partir da branch main
- Configurações de ambiente gerenciadas no dashboard do Render

## 🧪 Testes

### Frontend

```bash
cd frontend
npm run test              # Testes unitários
npm run test:coverage     # Testes com cobertura
npm run test:a11y         # Testes de acessibilidade
```

### Backend

```bash
cd backend
npm run test              # Testes unitários
npm run test:integration  # Testes de integração
```

## 🔒 Segurança

- Headers de segurança configurados (CSP, HSTS, etc.)
- Validação de entrada com Zod
- Rate limiting implementado
- CORS configurado adequadamente
- Sanitização de dados

## ♿ Acessibilidade

- ARIA labels implementados
- Navegação por teclado
- Testes automatizados com jest-axe
- Contraste de cores WCAG AA

## 📈 Performance

- Code splitting e lazy loading
- Otimização de imagens
- Cache de recursos estáticos
- Bundle optimization

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **TechFlow Solutions** - *Desenvolvimento* - [TechFlow Solutions](https://www.srluissimon.com)

## 🙏 Agradecimentos

- Todos os clientes e parceiros que confiam em nossas soluções
- Comunidade open source que disponibiliza as ferramentas utilizadas

## 📚 Documentação Adicional

- [Roadmap do Projeto](docs/PROJECT_ROADMAP.md)
- [Guia de Contribuição](docs/CONTRIBUTING.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Guia de Deploy](docs/DEPLOYMENT.md)
