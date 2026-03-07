# 🏗️ ARCHITECTURE

Documentação sobre a arquitetura, padrões e decisões de design do TechFlow Solutions.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Alto Nível](#arquitetura-de-alto-nível)
3. [Frontend](#frontend)
4. [Padrões & Convenções](#padrões--convenções)
5. [Fluxos Principais](#fluxos-principais)

---

## Visão Geral

TechFlow Solutions é uma **aplicação web frontend-only** que demonstra uma empresa de desenvolvimento de software. 

**Características principais:**
- ✅ Frontend React (TypeScript + Chakra UI)
- ✅ Integração direta com WhatsApp para contato/orçamentos
- ✅ SEO otimizado com react-helmet-async
- ✅ Responsivo em todos os dispositivos
- ✅ Deploy automático (Vercel)
- ✅ Estado gerenciado com React Query e hooks

---

## Arquitetura de Alto Nível

```
┌──────────────────────────────────────────────┐
│            FRONTEND (React)                  │
│  ├─ Pages (6): Home, Services, ITServices,   │
│  │             About, Contact, QuoteRequest  │
│  ├─ Components: Header, Footer, Layout        │
│  ├─ Lib: API, Router, Query, WhatsApp        │
│  └─ Theme: Chakra UI custom theme            │
└────────────┬─────────────────────────────────┘
             │ Direct WhatsApp integration
             ▼
      ┌──────────────────┐
      │  WhatsApp URL    │  (wa.me/...)
      └──────────────────┘
```

**Fluxo Simplificado:**
1. User fills form (Contact/Quote)
2. Frontend validates locally
3. Frontend generates WhatsApp URL with pre-filled message
4. User redirected to WhatsApp (native app or web)

---

## Frontend

### Estrutura de Pastas

```
src/
├── pages/                 # Página components
│  ├── Home.tsx           # Landing page (hero, stats, services, CTA)
│  ├── ITServices.tsx     # Serviços de TI (suporte, segurança, cloud) [Em destaque na navegação]
│  ├── Services.tsx       # Serviços de desenvolvimento (web, mobile, e-commerce)
│  ├── About.tsx          # Sobre TechFlow Solutions (missão, valores, serviços)
│  ├── Contact.tsx        # Formulário de contato → WhatsApp
│  └── QuoteRequest.tsx   # Formulário de orçamento → WhatsApp (com pré-preenchimento)
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
│  │  └── ServiceModal.tsx
│  └── IT/               # Componentes específicos IT
│     └── PackageComparison.tsx
│
├── lib/                 # Utilidades e configurações
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
│  └── (vacation.ts - removido em v2.0.0)
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

#### 3. **Fluxo WhatsApp (Frontend-Only)**
- Centralizar validação em `src/lib/validation.ts`
- Centralizar geração de links em `src/lib/whatsapp.ts`
- Abrir URL com `window.open(url, '_blank')`

```tsx
// lib/whatsapp.ts
export function openWhatsApp(url: string) {
  window.open(url, '_blank');
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

## 📋 Padrões de Implementação

### 1. Pré-preenchimento de Formulário de Orçamento

**Páginas Afetadas:**
- `Services.tsx` - Serviços de Desenvolvimento
- `ITServices.tsx` - Serviços de TI
- `QuoteRequest.tsx` - Formulário de Orçamento

**Fluxo:**

```
ServiçoCard (Services/ITServices)
    ↓ click: "Solicitar Orçamento"
handleQuoteRequest(service)
    ↓ navigate with location.state
QuoteRequest.tsx (useEffect)
    ↓ reads location.state
setFormData (pre-filled)
```

**Dados Transferidos:**
| Campo | Origem | Destino |
|-------|--------|---------|
| `projectName` | `service.title` | `projectName` |
| `projectType` | `service.category` (mapped) | `projectType` |
| `timeline` | `service.duration` | `timeline` |
| `budget` | Literal: 'A definir' | `budget` |
| `projectDescription` | `service.description` | `projectDescription` |
| `mainGoals` | `service.benefits` (joined) | `mainGoals` |

**Implementação em ITServices:**
- Função `handleQuoteRequest` com category mapping
- Botões em 4 locais: serviços destacados, serviços full list, planos PF, planos PJ
- Acesso ao serviço correto via closure em maps

### 2. Navegação Reordenada

**Ordem Atual (Header.tsx):**
1. **Serviços de TI** → `/servicos-ti` (destaque em negócio)
2. **Desenvolvimento** → `/servicos`
3. **Sobre** → `/sobre`

**Aplicado em:**
- Desktop Navigation (HStack)
- Mobile Menu (DrawerBody)

### 3. Página About Corporativa

**Mudança de Escopo:**
- De: Página de perfil pessoal
- Para: Página de apresentação corporativa TechFlow Solutions

**Seções:**
1. Apresentação da Empresa
   - Logo oficial (favicon)
   - Nome e localização (Foz do Iguaçu, PR)
   - Estatísticas (150+ clientes, 250+ projetos, 10+ anos)

2. Missão & Visão
   - Duas cards lado-a-lado

3. Valores 
   - 4 cards: Inovação, Excelência, Confiabilidade, Transparência

4. Serviços
   - Mantém a exposição dos 3 pilares
   - Ordem: TI, Web, Mobile

### 4. Remoção de Páginas

**Removidas:**
- `/clientes` - Página de Clients.tsx
- `/blog` - Página de Blog
- `/portfolio` - Página de Portfolio
**Impacto:**
- Router simplificado (6 rotas principais: Home, Serviços, Serviços de TI, Sobre, Contato, Orçamento)
- Header limpo (4 itens de navegação)
- Eliminado botão "Ver Projetos" de Home

---

## 📚 Referências

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Chakra UI Docs](https://chakra-ui.com/)
- [Vite Docs](https://vitejs.dev/)
