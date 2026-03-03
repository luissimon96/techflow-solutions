# Project Guidelines (for AI coding agents)

This monorepo contains a TypeScript Node/Express backend and a React + TypeScript frontend (Vite + Chakra UI). Keep edits small, focused, and consistent with the patterns below.

## Code style
- Backend: TypeScript (Node 18). Refer to [backend/tsconfig.json](backend/tsconfig.json#L1) and [backend/package.json](backend/package.json#L1) for lint/format scripts.
- Frontend: React 18 + TypeScript with Vite. See [frontend/tsconfig.json](frontend/tsconfig.json#L1) and [frontend/package.json](frontend/package.json#L1).
- Use `async/await`, explicit return types, centralized error handling, and `express.Request`/`Response` types in backend code. Follow existing component patterns in `frontend/src/components/`.

## Architecture (quick)
- Root contains `backend/` and `frontend/` workspaces.
- Backend entry: [backend/src/index.ts](backend/src/index.ts#L1). Security and request handling live in `backend/src/middleware/`.
- Frontend routing: [frontend/src/lib/router.tsx](frontend/src/lib/router.tsx#L1). API helper: [frontend/src/lib/api.ts](frontend/src/lib/api.ts#L1).

## Build & test commands
- Install all: `npm run install:all`
- Start both services: `npm run dev`
- Run tests: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`

Backend-only: `cd backend && npm run test:security` (security middleware tests).

## Project conventions (must-follow)
- No DB: contact/quote flows create WhatsApp URLs (see [backend/src/controllers/contactController.ts](backend/src/controllers/contactController.ts#L1)).
- Keep middleware in `backend/src/middleware/` and import in `index.ts`.
- Place route tests next to route files under `backend/src/routes/__tests__/`.
- Frontend centralizes endpoints in `frontend/src/lib/api.ts` and uses React Query.
- UI examples: `frontend/src/components/common/Logo.tsx` and `frontend/src/pages/Contact.tsx`.
- **CRITICAL:** `HelmetProvider` from `react-helmet-async` must wrap the entire app in `frontend/src/main.tsx` - without it, pages using `<Helmet>` for SEO will crash with "Cannot read properties of undefined (reading 'add')".

## Integration & deployment
- Backend only communicates via generated WhatsApp links; no external DBs.
- Vite dev proxy is used in development. Production deploys: backend on Render (`render.yaml`), frontend on Vercel (`vercel.json`).

## Security notes
- Rate limiting and attack detection live in `backend/src/middleware/security.ts`. Respect existing limits and tests when adding endpoints.
- CORS is strict: update `backend/src/config/cors.ts` only when necessary and add tests.
- Logs are written to `logs/` via Winston — avoid printing secrets.

If a change touches security, CORS, or rate limits, add/adjust tests (see `backend/src/tests/`) and run `cd backend && npm run test:security` before opening a PR.

If anything here is unclear or you want more examples, ask and reference the file or area you plan to modify.

## Documentation & References
- See `docs/ARCHITECTURE.md` for detailed architecture and design patterns
- See `docs/DEPLOYMENT.md` for deployment procedures and production setup
- See `docs/CHANGELOG.md` for recent changes and removed features
