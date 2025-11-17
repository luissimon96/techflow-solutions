# Project Index: TechFlow Solutions

**Generated:** 2025-11-17
**Version:** 1.0.0
**Type:** Full-stack Web Application (Monorepo)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Project Structure](#-project-structure)
3. [Entry Points](#-entry-points)
4. [Core Modules](#-core-modules)
5. [Configuration Files](#-configuration-files)
6. [Documentation](#-documentation)
7. [Test Coverage](#-test-coverage)
8. [Key Dependencies](#-key-dependencies)
9. [Quick Start](#-quick-start)
10. [Deployment](#-deployment)

---

## 🎯 Project Overview

**TechFlow Solutions** is a full-stack web application for a software development services company featuring WhatsApp-based contact and quote system (no database).

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Chakra UI + Vite
- **Backend:** Node.js + Express + TypeScript
- **Architecture:** Monorepo with npm workspaces

**Key Features:**
- WhatsApp integration for contact/quotes (no database storage)
- Comprehensive security middleware stack
- Rate limiting and attack detection
- Responsive UI with Chakra UI
- SEO optimization with react-helmet-async
- Analytics integration (Vercel Analytics + Sentry)

---

## 📁 Project Structure

```
techflow-solutions/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts           # Main entry point
│   │   ├── controllers/       # API controllers
│   │   ├── middleware/        # Security & error handling
│   │   ├── routes/            # Express routes
│   │   ├── config/            # Configuration files
│   │   └── tests/             # Backend tests
│   ├── dist/                  # Compiled JavaScript (build output)
│   ├── logs/                  # Winston logs (runtime)
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/                   # React/TypeScript frontend
│   ├── src/
│   │   ├── main.tsx           # Main entry point
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # Utilities & configuration
│   │   ├── data/              # Static data
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Helper functions
│   ├── dist/                  # Vite build output
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── jest.config.ts
│
├── node_modules/              # Root dependencies
├── package.json               # Monorepo root package.json
├── README.md                  # Quick start guide
├── CLAUDE.md                  # Developer instructions (Claude Code)
├── SCRIPTS.md                 # Detailed command reference
├── render.yaml                # Render.com deployment config
└── vercel.json                # Vercel deployment config
```

---

## 🚀 Entry Points

### Backend
- **Main:** `backend/src/index.ts` - Express server with security middleware
- **Test Server:** `backend/src/index-test.ts` - Test environment server
- **Build Output:** `backend/dist/index.js` - Production entry point

### Frontend
- **Main:** `frontend/src/main.tsx` - React app initialization
- **Router:** `frontend/src/lib/router.tsx` - React Router configuration
- **Theme:** `frontend/src/theme.ts` - Chakra UI custom theme

### Development Scripts
- **Root:** `package.json` - Monorepo orchestration scripts
- **Backend Dev:** `npm run dev:backend` (ts-node-dev on port 10000)
- **Frontend Dev:** `npm run dev:frontend` (Vite on port 3001+)

---

## 📦 Core Modules

### Backend Core Modules

#### Controllers (`backend/src/controllers/`)
- **contactController.ts** - Generates WhatsApp URL with contact form data
  - Exports: `createContactRequest`
  - WhatsApp Phone: `5554997109051`

- **quoteController.ts** - Generates WhatsApp URL with quote request data
  - Exports: `createQuoteRequest`
  - Formats service details and project specifications

#### Middleware (`backend/src/middleware/`)
- **security.ts** - Comprehensive security middleware
  - Exports: `helmetConfig`, `compressionConfig`, `securityMorgan`
  - Rate limiters: `generalRateLimit` (100/15min), `strictRateLimit` (20/15min), `authRateLimit` (5/15min)
  - Security: `attackDetection`, `originValidation`, `sanitizeHeaders`, `auditLog`
  - Logger: `securityLogger` (Winston)

- **errorHandler.ts** - Global error handling middleware
  - Exports: `errorHandler`
  - Handles validation errors, rate limit errors, generic errors

- **cache.ts** - Response caching middleware
  - Exports: `cacheMiddleware`
  - In-memory cache with TTL

#### Routes (`backend/src/routes/`)
- **health.ts** - Health check endpoint
  - Path: `/health`, `/api/health`
  - Returns: Server status, uptime, timestamp

- **contact.ts** - Contact form route
  - Path: `/api/contact`
  - Middleware: `strictRateLimit`, `auditLog`
  - Returns: WhatsApp URL

- **quotes.ts** - Quote request route
  - Path: `/api/quotes`
  - Middleware: `strictRateLimit`, `auditLog`
  - Returns: WhatsApp URL

#### Configuration (`backend/src/config/`)
- **cors.ts** - CORS configuration
  - Allowed origins from `CORS_ORIGIN` env var
  - Default: `http://localhost:5173` (dev)

### Frontend Core Modules

#### Pages (`frontend/src/pages/`)
- **Home.tsx** - Landing page
- **Services.tsx** - Services overview
- **ITServices.tsx** - IT services with package comparison
- **Portfolio.tsx** - Project showcase
- **About.tsx** - Company information
- **Contact.tsx** - Contact form (WhatsApp integration)
- **QuoteRequest.tsx** - Quote request form (WhatsApp integration)
- **Clients.tsx** - Client logos/carousel
- **Blog.tsx** - Blog posts

#### Components (`frontend/src/components/`)
- **Layout.tsx** - Main layout wrapper
  - Exports: `Layout` (default)
  - Includes: Header, Footer, Outlet

- **Header.tsx** - Navigation header
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

#### Libraries (`frontend/src/lib/`)
- **api.ts** - API integration layer
  - Exports: `API_ENDPOINTS`, `submitContactForm`, `submitQuoteRequest`
  - Base URL: `https://techflow-solutions-backend.onrender.com/api` (production)

- **router.tsx** - React Router configuration
  - Exports: `router`
  - Routes: 9 pages (Home, Services, IT, Portfolio, About, Clients, Blog, Contact, Quote)

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

#### Data (`frontend/src/data/`)
- **services.ts** - Service catalog data
  - Exports: `services` array

- **itServices.ts** - IT services data
  - Exports: `itServices`, `packages`

#### Utils (`frontend/src/utils/`)
- **iconUtils.ts** - Icon mapping utilities
  - Exports: `getIconComponent`

---

## 🔧 Configuration Files

### Root Configuration
- **package.json** - Monorepo root with workspace configuration
  - Workspaces: `backend`, `frontend`
  - Scripts: dev, build, test, lint, format, clean
  - Dependencies: `concurrently`, `playwright`

### Backend Configuration
- **backend/package.json** - Backend dependencies and scripts
  - Main: `dist/index.js`
  - Scripts: dev, build, start, test, lint
  - Key deps: express, helmet, cors, winston, express-rate-limit

- **backend/tsconfig.json** - TypeScript configuration
  - Target: ES2020
  - Module: CommonJS
  - Output: `dist/`

- **backend/jest.config.js** - Jest test configuration
  - Preset: ts-jest
  - Environment: node

### Frontend Configuration
- **frontend/package.json** - Frontend dependencies and scripts
  - Type: module
  - Scripts: dev, build, test, storybook
  - Key deps: react, chakra-ui, react-router-dom, react-query, zod

- **frontend/tsconfig.json** - TypeScript configuration
  - Target: ES2020
  - Module: ESNext
  - Path aliases: `@/*` → `./src/*`

- **frontend/vite.config.ts** - Vite configuration
  - Plugin: @vitejs/plugin-react
  - Path aliases configured

- **frontend/jest.config.ts** - Jest configuration
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
  - Build output: `frontend/dist`
  - API rewrites to Render backend

---

## 📚 Documentation

### Developer Documentation
- **README.md** - Quick start guide and project overview
  - Installation instructions
  - Development commands
  - Technology stack
  - Deployment links

- **CLAUDE.md** - Comprehensive developer guide for Claude Code
  - Project architecture details
  - Development workflow
  - Security considerations
  - Testing strategy
  - WhatsApp integration flow
  - Common patterns and examples
  - **Size:** ~15KB
  - **Purpose:** Primary reference for AI-assisted development

- **SCRIPTS.md** - Detailed command reference
  - All npm scripts explained
  - Development workflow
  - Troubleshooting tips

### Code Documentation
- Type definitions in `backend/src/types/express.d.ts`
- Type definitions in `frontend/src/types/global.d.ts`
- Inline JSDoc comments in controllers and utilities

---

## 🧪 Test Coverage

### Backend Tests (`backend/src/tests/`)
- **security.test.ts** - Security middleware tests
  - Rate limiting verification
  - Attack detection (XSS, SQL injection)
  - CORS validation
  - Header sanitization
  - **Coverage:** Core security features

- **routes/__tests__/health.test.ts** - Health endpoint tests
  - Health check response validation

- **setup.ts** - Test environment setup

### Frontend Tests (`frontend/src/`)
- **pages/__tests__/Contact.test.tsx** - Contact page tests
  - Form validation
  - WhatsApp integration

- **components/common/__tests__/Logo.test.tsx** - Logo component tests
  - Rendering
  - Accessibility (jest-axe)

### Test Commands
```bash
npm test                    # Run all tests (backend + frontend)
npm run test:backend        # Backend tests only
npm run test:frontend       # Frontend tests only
npm run test:coverage       # Coverage report
cd backend && npm run test:watch      # Backend watch mode
cd backend && npm run test:security   # Security tests only
```

### Test Stack
- **Backend:** Jest + Supertest + ts-jest
- **Frontend:** Jest + React Testing Library + jest-axe + jest-environment-jsdom
- **Storybook:** Component development and testing

---

## 🔗 Key Dependencies

### Backend Dependencies
| Dependency | Version | Purpose |
|------------|---------|---------|
| express | ^4.18.2 | Web framework |
| helmet | ^8.1.0 | Security headers |
| cors | ^2.8.5 | CORS middleware |
| express-rate-limit | ^7.5.0 | Rate limiting |
| express-slow-down | ^2.1.0 | Speed limiting |
| express-validator | ^7.2.1 | Request validation |
| winston | ^3.17.0 | Logging |
| compression | ^1.8.0 | Response compression |
| morgan | ^1.10.0 | HTTP request logging |
| dotenv | ^16.6.1 | Environment variables |

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

# Install all dependencies (root + backend + frontend)
npm run install:all
```

### Development
```bash
# Start both backend and frontend
npm run dev

# OR start separately
npm run dev:backend   # Backend only (port 10000)
npm run dev:frontend  # Frontend only (port 3001+)
```

### Building
```bash
# Build both backend and frontend
npm run build

# OR build separately
npm run build:backend   # Compiles TypeScript to dist/
npm run build:frontend  # Vite production build
```

### Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:backend
npm run test:frontend

# Backend security tests
cd backend && npm run test:security
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

### Production URLs
- **Frontend:** https://www.srluissimon.com (Vercel)
- **Backend API:** https://techflow-solutions-backend.onrender.com (Render.com)
- **Health Check:** https://techflow-solutions-backend.onrender.com/health

### Deployment Flow
1. **Backend (Render.com)**
   - Push to `master` branch → Auto-deploy
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Port: 10000
   - Health check: `/health`
   - Region: Oregon (free tier)

2. **Frontend (Vercel)**
   - Push to `master` branch → Auto-deploy
   - Build: Vite production build
   - Output: `frontend/dist/`
   - API rewrites to Render backend

### Environment Variables

#### Backend (.env)
```
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://www.srluissimon.com,http://localhost:3000
RENDER=true
RENDER_EXTERNAL_URL=https://techflow-solutions-backend.onrender.com
```

#### Frontend
- `VITE_API_URL` - Auto-configured based on environment

---

## 📊 Project Metrics

- **Total Source Files:** ~60 (excluding node_modules)
- **Backend Files:** ~15 TypeScript files
- **Frontend Files:** ~45 TypeScript/TSX files
- **Test Files:** 4 test files (expandable)
- **Documentation Files:** 3 (README, CLAUDE, SCRIPTS)
- **Configuration Files:** 10+

---

## 🔒 Security Features

### Backend Security Middleware (Order Matters!)
1. **Helmet** - Security headers (CSP, HSTS, etc.)
2. **Compression** - Response compression
3. **Security Logging** - Morgan with custom format
4. **Header Sanitization** - Remove/sanitize dangerous headers
5. **Attack Detection** - XSS, SQL injection, path traversal detection
6. **Speed Limiter** - Slow down frequent requests
7. **CORS** - Origin validation
8. **Body Parsers** - JSON/URL-encoded (5MB limit)
9. **General Rate Limit** - 100 requests/15min per IP
10. **Origin Validation** - Additional origin checks

### Rate Limiting Strategy
- **General:** 100 requests per 15 minutes (all routes)
- **Strict:** 20 requests per 15 minutes (contact/quotes)
- **Auth:** 5 attempts per 15 minutes (future auth endpoints)

### Attack Detection
- XSS patterns (script tags, event handlers)
- SQL injection patterns (UNION, SELECT, DROP, etc.)
- Path traversal (../, ..\)
- All attacks logged via Winston

### Logging
- Winston logger with file rotation
- Security events logged to `logs/security.log`
- Error logs to `logs/error.log`
- Combined logs to `logs/combined.log`

---

## 🎯 Architecture Highlights

### Monorepo Benefits
- Shared tooling and configuration
- Coordinated builds and deployments
- Simplified dependency management
- Unified testing and linting

### WhatsApp Integration (No Database)
1. User submits form (Contact or Quote)
2. Backend validates and formats data
3. Backend generates WhatsApp URL with pre-filled message
4. Frontend receives URL and opens WhatsApp in new tab
5. No data stored - all communication via WhatsApp
6. WhatsApp number: `5554997109051`

### Frontend Architecture
- **Component-based:** Modular React components
- **Routing:** React Router v6 with nested routes
- **State Management:** React Query for server state, hooks for local state
- **Styling:** Chakra UI with custom theme
- **SEO:** react-helmet-async for meta tags
- **Analytics:** Vercel Analytics + Sentry error tracking

### Backend Architecture
- **RESTful API:** Express.js with TypeScript
- **Middleware Stack:** Comprehensive security layers
- **No Database:** Stateless API with WhatsApp integration
- **Logging:** Winston for structured logging
- **Error Handling:** Centralized error handler

---

## 🎉 Summary

**TechFlow Solutions** is a well-architected full-stack monorepo featuring:
- Comprehensive security middleware
- WhatsApp-based contact system (no database)
- Modern React frontend with Chakra UI
- TypeScript throughout
- Production-ready deployment (Render + Vercel)
- Automated CI/CD
- Extensive developer documentation

**Token Efficiency:**
- **Full codebase read:** ~58,000 tokens
- **This index read:** ~3,500 tokens
- **Savings:** 94% token reduction

---

*Generated by SuperClaude Repository Indexer*
*Last updated: 2025-11-17*
