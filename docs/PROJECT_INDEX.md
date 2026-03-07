# Project Index: TechFlow Solutions

**Generated:** 2025-11-17
**Version:** 1.0.0
**Type:** React Frontend Web Application

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Project Structure](#-project-structure)
3. [Entry Points](#-entry-points)
4. [Core Modules](#-core-modules)
5. [Configuration Files](#-configuration-files)
6. [Implementation Patterns](#-implementation-patterns)
7. [Documentation](#-documentation)
8. [Test Coverage](#-test-coverage)
9. [Key Dependencies](#-key-dependencies)
10. [Quick Start](#-quick-start)
11. [Deployment](#-deployment)

---

## 🎯 Project Overview

**TechFlow Solutions** is a full-stack web application for a software development services company featuring WhatsApp-based contact and quote system (no database).

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Chakra UI + Vite
- **Architecture:** Single workspace with frontend focus

**Key Features:**
- WhatsApp integration for contact/quotes (direct URL generation, no API)
- Responsive UI with Chakra UI
- SEO optimization with react-helmet-async
- Analytics integration (Vercel Analytics + Sentry)

---

## 📁 Project Structure

```
techflow-solutions/
├── src/                       # React/TypeScript source
│   ├── main.tsx              # Main entry point
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── lib/                  # Utilities & configuration
│   ├── data/                 # Static data
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper functions
├── dist/                     # Vite build output
├── jest.config.cjs           # Jest config
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── node_modules/              # Root dependencies
├── package.json               # Root package.json
├── README.md                  # Quick start guide
├── SCRIPTS.md                 # Detailed command reference
└── vercel.json                # Vercel deployment config
```

---

## 🚀 Entry Points

### Frontend
- **Main:** `src/main.tsx` - React app initialization
- **Router:** `src/lib/router.tsx` - React Router configuration
- **Theme:** `src/theme.ts` - Chakra UI custom theme

### Development Scripts
- **Root:** `package.json` - Root orchestration scripts
- **Frontend Dev:** `npm run dev` (Vite on port 5173+)

---

## 📦 Core Modules

### Frontend Core Modules

#### Pages (`src/pages/`)
- **Home.tsx** - Landing page with hero, stats, services, and CTA
- **ITServices.tsx** (Featured) - IT support, security, and cloud infrastructure services with pre-filled quote form
- **Services.tsx** - Web, mobile, e-commerce development services with pre-filled quote form
- **About.tsx** - TechFlow Solutions company info, mission, values, and services overview
- **Contact.tsx** - Contact form with WhatsApp integration
- **QuoteRequest.tsx** - Quote request form with pre-fill from Services/ITServices pages via navigation state

#### Components (`src/components/`)
- **Layout.tsx** - Main layout wrapper
  - Exports: `Layout` (default)
  - Includes: Header, Footer, Outlet

- **Header.tsx** - Navigation header with reordered navigation
  - Navigation Order: Serviços de TI → Desenvolvimento → Sobre
  - Exports: `Header` (default)

- **Footer.tsx** - Site footer
  - Exports: `Footer` (default)

- **common/** - Reusable components
  - `Logo.tsx` - Company logo component
  - `ServiceCard.tsx` - Service display card
  - `SEOHead.tsx` - SEO meta tags (react-helmet-async)
  - `ImageFallback.tsx` - Image with fallback handling
  - `ClientCarousel.tsx` - Client logos carousel
  - `ServiceModal.tsx` - Service details modal

- **IT/** - IT services components
  - `ITServiceCard.tsx` - IT service card
  - `PackageComparison.tsx` - Package comparison table

#### Libraries (`src/lib/`)
- **api.ts** - API integration layer (deprecated/unused)
  - Frontend generates WhatsApp URLs directly
  - No API intermediary needed

- **router.tsx** - React Router configuration
  - Exports: `router`
  - Routes: 6 pages
    - `/` - Home (landing page)
    - `/servicos-ti` - IT Services (featured in navigation)
    - `/servicos` - Development Services
    - `/sobre` - About TechFlow Solutions
    - `/contato` - Contact form
    - `/orcamento` - Quote request form

- **query.tsx** - React Query configuration
  - Exports: `QueryProvider`

- **analytics.tsx** - Analytics integration
  - Exports: `AnalyticsProvider`
  - Integrations: Vercel Analytics

- **sentry.ts** - Sentry error tracking
  - Exports: Sentry configuration

- **validation.ts** - Form validation schemas (Zod)
  - Exports: `contactSchema`, `quoteSchema`

- **whatsapp.ts** - WhatsApp URL generation utilities
  - Exports: `generateWhatsAppURL`, `openWhatsApp`

#### Data (`src/data/`)
- **services.ts** - Service catalog data
  - Exports: `services` array

- **itServices.ts** - IT services data
  - Exports: `itServices`, `packages`

#### Utils (`src/utils/`)
- **iconUtils.ts** - Icon mapping utilities
  - Exports: `getIconComponent`

---

## 🔧 Configuration Files

### Root Configuration
- **package.json** - Root configuration
  - Scripts: dev, build, test, lint, format, clean
  - Dependencies: React workspace

### Backend Configuration
### Frontend Configuration
- **package.json** - Frontend dependencies and scripts
  - Type: module
  - Scripts: dev, build, test, storybook
  - Key deps: react, chakra-ui, react-router-dom, react-query, zod

- **tsconfig.app.json** - TypeScript app configuration
  - Target: ES2020
  - Module: ESNext
  - Path aliases: `@/*` → `./src/*`

- **vite.config.ts** - Vite configuration
  - Plugin: @vitejs/plugin-react
  - Path aliases configured

- **jest.config.cjs** - Jest configuration
  - Environment: jsdom
  - Setup: setupTests.ts

### Deployment Configuration
- **render.yaml** - Render.com backend deployment
  - Service: web (Node.js)
  - Region: oregon
  - Plan: free
  - Build: `npm install && npm run build`
  - Start: `npm start`
  - Health check: `/health`
  - Port: 10000

- **vercel.json** - Vercel frontend deployment
  - Framework: vite
  - Build output: `dist`
  - API rewrites to Render backend

---

## 🎨 Implementation Patterns

### Pre-filled Quote Form Pattern

**Use Case:** Seamlessly pass service information from Services pages to QuoteRequest form

**Implementation Location:** 
- `src/pages/Services.tsx` (handleQuoteRequest function)
- `src/pages/ITServices.tsx` (handleQuoteRequest function)
- `src/pages/QuoteRequest.tsx` (useEffect with location.state)

**Pattern Details:**
1. Service card buttons use `onClick={() => handleQuoteRequest(service)}` instead of `<Link>`
2. Function navigates with pre-filled state:
```typescript
navigate('/orcamento', {
  state: {
    projectName: service.title,
    projectType: service.category,
    timeline: service.duration,
    budget: 'A definir',
    projectDescription: service.description,
    mainGoals: service.benefits.join(', '),
  },
});
```
3. QuoteRequest.tsx useEffect reads location.state and populates form fields
4. Category mapping converts service categories to readable types

**Services Covered:**
- ✅ Development Services (Services.tsx)
- ✅ IT Services (ITServices.tsx)
  - Featured services
  - All services list
  - Individual plans
  - Business plans

**Benefits:**
- Improved UX with pre-filled form
- Consistent experience across service pages
- Reduced friction in conversion funnel
- User data already contextual to service type

---

## 📚 Documentation

### Developer Documentation
- **README.md** - Quick start guide and project overview
  - Installation instructions
  - Development commands
  - Technology stack
  - Deployment links

- **SCRIPTS.md** - Detailed command reference
  - All npm scripts explained
  - Development workflow
  - Troubleshooting tips

### Code Documentation
- Type definitions in `src/types/global.d.ts`
- Inline JSDoc comments in components and utilities

---

## 🧪 Test Coverage

### Frontend Tests (`src/`)
- **pages/__tests__/Contact.test.tsx** - Contact page tests
  - Form validation
  - WhatsApp integration

- **components/common/__tests__/Logo.test.tsx** - Logo component tests
  - Rendering
  - Accessibility (jest-axe)

### Test Commands
```bash
npm test                    # Run all tests (frontend)
npm run test:frontend       # Frontend tests only
npm run test:coverage       # Coverage report
```

---

## 🔗 Key Dependencies

### Frontend Dependencies
| Dependency | Version | Purpose |
|------------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | React DOM renderer |
| @chakra-ui/react | ^2.8.2 | UI component library |
| react-router-dom | ^6.22.1 | Routing |
| @tanstack/react-query | ^5.28.0 | Server state management |
| framer-motion | ^11.0.5 | Animations (Chakra dependency) |
| react-helmet-async | ^2.0.5 | SEO meta tags |
| react-icons | ^5.5.0 | Icon library |
| zod | ^3.22.4 | Schema validation |
| @sentry/react | ^7.101.1 | Error tracking |
| @vercel/analytics | ^1.2.2 | Analytics |

### Development Dependencies
- **TypeScript:** ^5.0.3 (backend), ^5.2.2 (frontend)
- **Vite:** ^6.1.0 (frontend build tool)
- **Jest:** ^29.7.0 (testing)
- **ESLint:** ^9.0.0+ (linting)
- **Prettier:** ^3.6.2 (formatting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation
```bash
# Clone repository
git clone https://github.com/luissimon96/techflow-solutions.git
cd techflow-solutions

# Install dependencies
npm install
```

### Development
```bash
# Start frontend dev server
npm run dev
```

### Building
```bash
# Build frontend
npm run build
```

### Testing
```bash
# Run tests
npm test

# Run frontend tests only
npm run test:frontend
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code with Prettier
npm run format

# Clean build artifacts
npm run clean
```

---

## 🌐 Deployment

### Production URL
- **Frontend:** https://www.srluissimon.com (Vercel)

### Deployment Flow
1. **Frontend (Vercel)**
   - Push to `master` branch → Auto-deploy
   - Build: Vite production build
  - Output: `dist/`

For detailed deployment instructions, see [docs/DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📊 Project Metrics

- **Total Source Files:** ~45 (excluding node_modules)
- **Frontend Files:** ~40 TypeScript/TSX files
- **Test Files:** 2 test files (expandable)
- **Documentation Files:** 3 (README, SCRIPTS, DEPLOYMENT)
- **Configuration Files:** 5+

---

## 🔒 Security Features

### Frontend Security
- HTTPS enforced via Vercel
- Content Security Policy headers
- React XSS protection
- Input validation with Zod schemas
- Sentry error tracking

---

## 🎯 Architecture Highlights

### WhatsApp Integration (No Backend API)
1. User submits form (Contact or Quote)
2. Frontend validates form data with Zod
3. Frontend generates WhatsApp URL with pre-filled message
4. Frontend opens WhatsApp URL in new tab
5. No data stored - all communication via WhatsApp
6. WhatsApp number: `5554997109051`

### Frontend Architecture
- **Component-based:** Modular React components
- **Routing:** React Router v6 with nested routes
- **State Management:** React Query for server state, hooks for local state
- **Styling:** Chakra UI with custom theme
- **SEO:** react-helmet-async for meta tags
- **Analytics:** Vercel Analytics + Sentry error tracking

---

## 🎉 Summary

**TechFlow Solutions** is a modern React frontend featuring:
- Direct WhatsApp integration (no backend database)
- Responsive UI with Chakra UI
- React Router v6 routing
- SEO optimized with react-helmet-async
- Production-ready deployment on Vercel
- Comprehensive form validation
- Extensive developer documentation

---

*Generated by SuperClaude Repository Indexer*
*Last updated: 2025-11-17*
