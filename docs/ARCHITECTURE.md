# 🏗️ ARCHITECTURE

Documentação sobre a arquitetura, padrões e decisões de design do TechFlow Solutions.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Alto Nível](#arquitetura-de-alto-nível)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Padrões & Convenções](#padrões--convenções)
6. [Segurança](#segurança)
7. [Fluxos Principais](#fluxos-principais)

---

## Visão Geral

TechFlow Solutions é uma **aplicação web full-stack com monorepo** que demonstra uma empresa de desenvolvimento de software. 

**Características principais:**
- ✅ Sem banco de dados (WhatsApp como canal de comunicação)
- ✅ Integração direta com WhatsApp para contato/orçamentos
- ✅ Segurança em camada (rate limiting, detecção de ataque, validação CORS)
- ✅ Deploy automático (Render + Vercel)
- ✅ SEO otimizado
- ✅ Responsivo em todos os dispositivos

---

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ├─ Pages: Home, Services, ITServices, About, Clients       │
│  ├─ Components: Header, Footer, Layout, Common, IT          │
│  └─ Lib: API, Router, Query, Alerts, WhatsApp               │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/REST
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                       │
│  ├─ Routes: /health, /api/contact, /api/quotes              │
│  ├─ Controllers: contactController, quoteController         │
│  ├─ Middleware: Security, Error Handling, CORS              │
│  └─ Config: CORS, Security Headers                          │
└────────────────┬────────────────────────────────────────────┘
                 │ Generate WhatsApp URL
                 ▼
            ┌──────────────────┐
            │  WhatsApp (URL)  │
            └──────────────────┘
```

---

## Frontend

### Estrutura de Pastas

```
frontend/src/
├── pages/                 # Página components
│  ├── Home.tsx           # Landing page (hero, stats, services, CTA)
│  ├── Services.tsx       # Serviços de desenvolvimento
│  ├── ITServices.tsx     # Serviços de TI (suporte, segurança, cloud)
│  ├── About.tsx          # Sobre mim e projetos
│  ├── Clients.tsx        # Carousel de clientes
│  ├── Contact.tsx        # Formulário de contato → WhatsApp
│  └── QuoteRequest.tsx   # Formulário de orçamento → WhatsApp
│
├── components/           # Componentes reutilizáveis
│  ├── Header.tsx         # Navegação principal
│  ├── Footer.tsx         # Rodapé com contato
│  ├── Layout.tsx         # Layout wrapper
│  ├── common/            # Componentes genéricos
│  │  ├── Logo.tsx
│  │  ├── ServiceCard.tsx
│  │  ├── SEOHead.tsx
│  │  ├── ImageFallback.tsx
│  │  ├── ClientCarousel.tsx
│  │  └── ServiceModal.tsx
│  └── IT/               # Componentes específicos IT
│     └── PackageComparison.tsx
│
├── lib/                 # Utilidades e configurações
│  ├── api.ts            # Chamadas HTTP para backend
│  ├── router.tsx        # React Router config
│  ├── query.tsx         # React Query setup
│  ├── validation.ts     # Validação de formulários
│  ├── whatsapp.ts       # Geração de URLs WhatsApp
│  └── ...
│
├── data/               # Dados estáticos
│  ├── services.ts      # Serviços de desenvolvimento
│  └── itServices.ts    # Serviços de TI
│
├── types/              # TypeScript type definitions
│  ├── global.d.ts
│  └── vacation.ts (removido)
│
├── utils/              # Funções auxiliares
│  └── iconUtils.ts
│
├── main.tsx            # Entry point
├── App.tsx
└── theme.ts            # Chakra UI custom theme
```

### Stack Frontend

| Função | Tecnologia |
|--------|-----------|
| Framework | React 18 |
| Linguagem | TypeScript |
| UI | Chakra UI |
| Build | Vite |
| Routing | React Router v6 |
| State | React Hooks + React Query |
| Animações | Framer Motion |
| HTTP | Fetch API |
| SEO | react-helmet-async |
| Forms | React Hook Form |

### Padrões Frontend

#### 1. **Page Components**
- Cada página é um componente funcional independente
- Use `useColorModeValue` para dark mode support
- Sempre inclua `Helmet` para SEO (exemplo: Services.tsx)

```tsx
import { Helmet } from 'react-helmet-async';

export default function MyPage() {
  return (
    <>
      <Helmet>
        <title>Page Title</title>
        <meta name="description" content="..." />
      </Helmet>
      {/* Conteúdo da página */}
    </>
  );
}
```

#### 2. **Componentes Reutilizáveis**
- Colocar em `components/common/` ou `components/IT/`
- Passar props tipadas com TypeScript
- Manter componentes simples e focados

#### 3. **Chamadas HTTP**
- Centralizar em `frontend/src/lib/api.ts`
- Usar `fetch` com try/catch
- Retornar tipos tipados

```tsx
// lib/api.ts
export async function submitContactForm(data: ContactFormData) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Failed');
  return response.json();
}
```

#### 4. **Integração WhatsApp**
- Função `getWhatsAppUrl()` em `whatsapp.ts`
- Gera URL com mensagem pré-preenchida
- Frontend abre link em nova aba após submeter

```tsx
const whatsappUrl = getWhatsAppUrl('Olá! Gostaria...');
window.open(whatsappUrl, '_blank');
```

---

## Backend

### Estrutura de Pastas

```
backend/src/
├── index.ts                    # Entry point + server setup
├── config/
│  └── cors.ts                 # CORS configuration
├── controllers/
│  ├── contactController.ts     # Gera WhatsApp URL para contato
│  └── quoteController.ts       # Gera WhatsApp URL para orçamento
├── middleware/
│  ├── security.ts             # Rate limiting, attack detection
│  ├── errorHandler.ts         # Global error handling
│  └── cache.ts                # Caching (se implementado)
├── routes/
│  ├── health.ts               # GET /health e /api/health
│  ├── contact.ts              # POST /api/contact
│  ├── quotes.ts               # POST /api/quotes
│  └── __tests__/
│     └── health.test.ts
├── types/
│  └── express.d.ts            # Express type augmentation
└── tests/
   └── security.test.ts        # Security middleware tests
```

### Stack Backend

| Função | Tecnologia |
|--------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Linguagem | TypeScript |
| Teste | Jest + Supertest |
| Logging | Winston |
| Segurança | Helmet, express-rate-limit |

### Middleware Stack (Ordem Importa)

1. **Helmet** - Security headers
2. **Compression** - Comprime responses
3. **Morgan** - HTTP request logging
4. **Header Sanitization** - Limpa headers perigosos
5. **Attack Detection** - Bloqueia XSS, SQL injection, path traversal
6. **Speed Limiter** - Desacelera requisições suspeitas
7. **CORS** - Validação de origem
8. **JSON Parser** - Parseia request body
9. **Rate Limiter** - 100 req/15min por IP
10. **Origin Validation** - Validação adicional de origem

### Controladores

#### contactController.ts
```
POST /api/contact
├─ Input: { name, email, phone, message, projectType }
├─ Output: { whatsappUrl: "https://wa.me/..." }
└─ Função: Cria URL WhatsApp com mensagem pré-formatada
```

#### quoteController.ts
```
POST /api/quotes
├─ Input: { name, email, phone, projectType, timeline, budget, description }
├─ Output: { whatsappUrl: "https://wa.me/..." }
└─ Função: Cria URL WhatsApp com detalhes do orçamento
```

### Segurança

See [DEPLOYMENT.md](./DEPLOYMENT.md#segurança) para detalhes de segurança.

---

## Padrões & Convenções

### TypeScript
- ✅ Tipos explícitos em funções públicas
- ✅ Tipos genéricos para reutilização
- ✅ Avoid `any` - use `unknown` com type guards se necessário

```tsx
// ✅ Bom
function submitForm(data: FormData): Promise<SubmitResponse> {
  return fetch(...);
}

// ❌ Evitar
function submitForm(data: any): Promise<any> {
  return fetch(...);
}
```

### Componentes React
- ✅ Componentes funcionais com hooks
- ✅ Props com tipos TypeScript
- ✅ Nomes descritivos (MyComponent, not MC)

### Arquivos
- ✅ PascalCase para componentes: `MyComponent.tsx`
- ✅ camelCase para utilitários: `helpers.ts`
- ✅ camelCase para constantes: `apiEndpoints.ts`

### Feedback do Usuário
- ✅ Use Chakra UI `useToast()` para notificações
- ✅ Mostre feedback de loading
- ✅ Trate erros com mensagens úteis

---

## Fluxos Principais

### 1. Fluxo de Contato

```
User (Frontend)
    │
    ├─> Preenche formulário Contact.tsx
    │
    ├─> submitContactForm(data)
    │       │
    │       ├─> POST /api/contact
    │       │
    │       └─> Backend contactController.ts
    │               ├─ Valida dados
    │               ├─ Gera WhatsApp URL (wa.me/5554997109051?text=...)
    │               └─ Retorna { whatsappUrl }
    │
    ├─> Frontend recebe URL
    │
    └─> window.open(whatsappUrl) → Abre WhatsApp em nova aba
```

### 2. Fluxo de Orçamento

```
Similar ao fluxo de contato, mas:
- Endpoint: POST /api/quotes
- Incluir mais dados: timeline, budget, description
- Mensagem no WhatsApp é mais detalhada
```

### 3. Fluxo de Renderização (Home → ITServices)

```
App (main.tsx)
  │
  └─> HelmetProvider (context para react-helmet-async)
      │
      └─> ChakraProvider (tema Chakra UI)
          │
          └─> RouterProvider (React Router)
              │
              ├─> Layout (Header + Outlet + Footer)
              │
              └─> Page Component (Home, Services, ITServices, etc)
                  │
                  └─> Helmet (SEO tags)
```

---

## 🔄 Decisões Arquiteturais

### Por que sem banco de dados?
- Projeto é portfólio/landing page
- Todos os contatos vão para WhatsApp (não precisa armazenar)
- Simplifica deploy e reduz custos
- Melhor UX - usuário já está no WhatsApp

### Por que monorepo?
- Frontend e Backend separados logicamente
- Compartilham package.json (npm workspaces)
- Scripts unificados (npm run dev inicia ambos)
- Facilita deployment coordenado

### Por que Chakra UI?
- Componentes acessíveis out-of-the-box
- Dark mode integrado
- TypeScript support
- Customizável com theme

### Por que React Query?
- Simplifica gerenciamento de estado remoto
- Caching automático
- Retry automático em falhas
- Sincronização em background

---

## 📚 Referências

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Chakra UI Docs](https://chakra-ui.com/)
- [Vite Docs](https://vitejs.dev/)
