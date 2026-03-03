# Project Guidelines (for AI coding agents)

This is a React + TypeScript frontend application (Vite + Chakra UI) with direct WhatsApp integration. Keep edits small, focused, and consistent with the patterns below.

## Code style
- Frontend: React 18 + TypeScript with Vite. See [frontend/tsconfig.json](frontend/tsconfig.json#L1) and [frontend/package.json](frontend/package.json#L1).
- Follow existing component patterns in `frontend/src/components/`.

## Architecture (quick)
- Frontend routing: [frontend/src/lib/router.tsx](frontend/src/lib/router.tsx#L1).
- API helper: [frontend/src/lib/api.ts](frontend/src/lib/api.ts#L1) (deprecated - frontend generates WhatsApp URLs directly).

## Build & test commands
- Install: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Run tests: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`

## Project conventions (must-follow)
- No backend API: frontend generates WhatsApp URLs directly for contact/quote flows.
- Frontend centralizes endpoints in `frontend/src/lib/api.ts` (deprecated - use direct WhatsApp URLs).
- UI examples: `frontend/src/components/common/Logo.tsx` and `frontend/src/pages/Contact.tsx`.
- **CRITICAL:** `HelmetProvider` from `react-helmet-async` must wrap the entire app in `frontend/src/main.tsx` - without it, pages using `<Helmet>` for SEO will crash with "Cannot read properties of undefined (reading 'add')".

## Integration & deployment
- Frontend directly integrates with WhatsApp; no backend API needed.
- Vite dev server used in development. Production deployment: frontend on Vercel (`vercel.json`).

## Security notes
- Input validation: Use Zod schemas in `frontend/src/lib/validation.ts` for form validation.
- Error handling: Sentry integration logs errors; avoid printing sensitive data to console.

If anything here is unclear or you want more examples, ask and reference the file or area you plan to modify.

## Documentation & References
- See `docs/ARCHITECTURE.md` for detailed architecture and design patterns
- See `docs/DEPLOYMENT.md` for deployment procedures and production setup
- See `docs/CHANGELOG.md` for recent changes and removed features
