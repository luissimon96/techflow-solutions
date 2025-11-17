# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechFlow Solutions is a full-stack web application for a software development services company. The project uses a monorepo structure with separate backend and frontend workspaces.

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Chakra UI + Vite
- **Backend:** Node.js + Express + TypeScript
- **Key Integration:** WhatsApp-based contact and quote system (no database)

## Development Commands

### Initial Setup
```bash
npm run install:all  # Install dependencies for root, backend, and frontend
```

### Development
```bash
npm run dev          # Start both backend (port 10000) and frontend (port 3001+)
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### Testing
```bash
npm test                          # Run all tests (backend + frontend)
npm run test:backend              # Backend tests only
npm run test:frontend             # Frontend tests only
cd backend && npm run test:watch  # Backend tests in watch mode
cd backend && npm run test:security  # Security-specific tests
```

### Building
```bash
npm run build         # Build both backend and frontend
npm run build:backend # Compile TypeScript to dist/
npm run build:frontend # Vite production build
```

### Code Quality
```bash
npm run lint          # Lint backend and frontend
npm run format        # Format code with Prettier
```

### Utilities
```bash
npm run clean         # Remove dist/ and build artifacts
npm run health:check  # Verify both services are running
```

## Architecture Overview

### Monorepo Structure
This is a workspace-based monorepo with `backend/` and `frontend/` as npm workspaces. Each workspace has its own `package.json` and dependencies.

### Backend Architecture (Node.js + Express)

**Entry Point:** `backend/src/index.ts`

**Key Middleware Stack (order matters):**
1. Helmet (security headers)
2. Compression
3. Security logging (Morgan)
4. Header sanitization
5. Attack detection (XSS, SQL injection patterns)
6. Speed limiter (slow down)
7. CORS (with origin validation)
8. JSON/URL-encoded parsers (5MB limit)
9. General rate limiting (100 req/15min)
10. Origin validation

**Routes:**
- `/health` and `/api/health` - Health check endpoint
- `/api/contact` - Contact form (redirects to WhatsApp)
- `/api/quotes` - Quote request form (redirects to WhatsApp)

**Security Middleware:** `backend/src/middleware/security.ts`
- `generalRateLimit`: 100 requests per 15 minutes per IP
- `strictRateLimit`: 20 requests per 15 minutes (used for contact/quotes)
- `authRateLimit`: 5 attempts per 15 minutes (for future auth endpoints)
- `attackDetection`: Blocks suspicious patterns (XSS, SQL injection, path traversal)
- `originValidation`: Validates request origin against allowed domains
- `auditLog`: Logs sensitive actions to Winston logger

**WhatsApp Integration:**
The backend does NOT use a database. Instead, contact and quote forms generate WhatsApp URLs with pre-formatted messages. The frontend receives the URL and opens it in a new tab. See `backend/src/controllers/contactController.ts` for the message formatting logic.

**Controllers:**
- `contactController.ts`: Generates WhatsApp URL with contact data
- `quoteController.ts`: Generates WhatsApp URL with quote request data

**Important Notes:**
- Phone number for WhatsApp: `5554997109051` (defined in controllers)
- CORS origins are configurable via `CORS_ORIGIN` env var
- All security events are logged via Winston to `logs/` directory
- The backend runs on port 10000 by default (configured via `PORT` env var)

### Frontend Architecture (React + TypeScript)

**Entry Point:** `frontend/src/main.tsx`

**Routing:** React Router v6 configured in `frontend/src/lib/router.tsx`

**State Management:**
- React Query (@tanstack/react-query) for server state
- React hooks for local state
- Configuration in `frontend/src/lib/query.tsx`

**UI Framework:** Chakra UI with custom theme (`frontend/src/theme.ts`)

**API Integration:** `frontend/src/lib/api.ts`
- Uses fetch API
- Auto-redirects to WhatsApp after successful contact/quote submission
- API base URL: `https://techflow-solutions-backend.onrender.com/api` (production) or `/api` (development via Vite proxy)

**Key Pages:**
- `Home` - Landing page
- `Services` - Services overview
- `ITServices` - IT services with package comparison
- `Portfolio` - Project showcase
- `About` - Company information
- `Contact` - Contact form (WhatsApp integration)
- `QuoteRequest` - Quote request form (WhatsApp integration)
- `Clients` - Client logos/carousel
- `Blog` - Blog posts

**Components Structure:**
- `components/common/` - Reusable components (Logo, ServiceCard, SEOHead, etc.)
- `components/IT/` - IT services-specific components
- `pages/` - Page components

**Testing:**
- Jest + React Testing Library
- Storybook for component development (`npm run storybook`)
- Accessibility testing with jest-axe

**Important Notes:**
- The frontend uses Vite for development and building
- Chakra UI theme customization is in `theme.ts`
- SEO is handled via react-helmet-async (SEOHead component)
- Analytics integration via Vercel Analytics and Sentry

## Environment Variables

### Backend (.env)
```
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://www.srluissimon.com,http://localhost:3000
```

### Frontend
- `VITE_API_URL` - Backend API URL (auto-configured based on environment)

## Deployment

**Backend:** Deployed on Render.com
- Configuration: `render.yaml`
- Health check: `/health`
- Auto-deploy enabled from master branch
- URL: https://techflow-solutions-backend.onrender.com

**Frontend:** Deployed on Vercel
- Configuration: `vercel.json`
- Static build with API rewrites
- URL: https://www.srluissimon.com

## Critical Implementation Details

### WhatsApp Integration Flow
1. User submits contact/quote form on frontend
2. Frontend sends data to backend API endpoint
3. Backend validates data and generates WhatsApp URL with pre-formatted message
4. Backend returns JSON with `whatsappUrl` field
5. Frontend receives response and auto-opens WhatsApp in new tab after delay
6. No data is stored in database - all communication happens via WhatsApp

### Security Considerations
- All API endpoints are protected with rate limiting
- Attack detection middleware blocks common attack patterns
- CORS is strictly configured with allowed origins
- Headers are sanitized to prevent injection attacks
- All security events are logged with Winston
- Request/response size limits (5MB)
- Content-Type validation for POST/PUT/PATCH

### Testing Strategy
- Backend: Jest with supertest for API testing
- Frontend: Jest + React Testing Library for component testing
- Security tests: Dedicated security test suite in `backend/src/tests/security.test.ts`
- Run `npm run test:security` to verify security middleware

## Common Patterns

### Adding a New API Endpoint
1. Create route file in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add route to `backend/src/index.ts` with appropriate rate limiting
4. Add endpoint to `frontend/src/lib/api.ts` in `API_ENDPOINTS`
5. Create API function in `api.ts` if needed

### Adding a New Page
1. Create page component in `frontend/src/pages/`
2. Add route to `frontend/src/lib/router.tsx`
3. Update navigation in `frontend/src/components/Header.tsx` if needed

### Running Single Test File
```bash
cd backend && npx jest src/tests/security.test.ts
cd frontend && npx jest src/pages/__tests__/Contact.test.tsx
```

## Port Configuration
- Backend default: 10000 (configurable via PORT env var)
- Frontend dev: 3001+ (Vite auto-increments if port busy)
- Frontend production: Served by CDN (Vercel)

## Known Issues & Quirks
- The backend intentionally has no database - this is not a bug
- WhatsApp URLs open in new tab/window - popup blockers may interfere
- CORS origin validation is strict in production - requests without origin header are blocked
- Logs directory (`logs/`) is created at runtime by Winston
