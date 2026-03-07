# Copilot Instructions (TechFlow Solutions)

_Last init refresh: 2026-03-07_

## 1) Project Scope

TechFlow Solutions is a frontend-first React + TypeScript application (Vite + Chakra UI) with WhatsApp-driven lead flows.

Core behavior:

- Contact and quote flows are handled in the frontend.
- Data is validated client-side and sent to WhatsApp URL (`wa.me`) format.
- No database persistence is required for the current business scope.

## 2) Canonical Structure

Use these paths as source of truth:

```text
src/
  components/
    common/
  data/
  lib/
    analytics.tsx
    query.tsx
    router.tsx
    sentry.ts
    validation.ts
    whatsapp.ts
  pages/
    Home.tsx
    Services.tsx
    ITServices.tsx
    About.tsx
    Contact.tsx
    QuoteRequest.tsx
  main.tsx
  theme.ts
```

Important:

- Do not use `frontend/src` paths.
- Do not recreate duplicated trees like `src/src`.

## 3) Architecture Rules

- Components: functional components + hooks only.
- Public interfaces: explicit TypeScript types.
- Avoid `any`; prefer `unknown` + narrowing.
- Use route-level lazy loading for pages via `src/lib/router.tsx`.
- Keep layout shell (`Header`, `Footer`, `Layout`) stable and reusable.

Providers in `src/main.tsx` must stay ordered as:

1. `HelmetProvider`
2. `AnalyticsProvider`
3. `QueryProvider`
4. `ChakraProvider`
5. `RouterProvider`

Sentry:

- Initialize only in production and only when DSN exists.
- Never send sensitive personal data.

## 4) Routing Contract

Current routes:

- `/` -> `Home`
- `/servicos` -> `Services`
- `/servicos-ti` -> `ITServices`
- `/sobre` -> `About`
- `/contato` -> `Contact`
- `/orcamento` -> `QuoteRequest`

When adding a page:

1. Create `src/pages/NewPage.tsx`.
2. Add lazy import in `src/lib/router.tsx`.
3. Register route using shared suspense wrapper.
4. Add metadata (`Helmet` or shared SEO component).
5. Add tests.

## 5) Form and WhatsApp Flow

Contact/quote forms must follow this pattern:

1. Validate with Zod (`src/lib/validation.ts`).
2. Build WhatsApp URL (`src/lib/whatsapp.ts`).
3. Open with `window.open(url, '_blank')`.

Do not introduce backend endpoints for this flow unless explicitly requested.

## 6) UI and Accessibility

- Use Chakra components and theme tokens first.
- Keep loading, success, and error states visible to user.
- Respect reduced motion when using animations.
- Keep image dimensions defined to reduce CLS.

## 7) Testing and Quality Gates

Before finalizing relevant changes, run:

- `npm run build`
- `npm run lint`
- `npm run test -- --runInBand`

Current known repo blockers (not product regressions):

- ESLint v9 expects `eslint.config.*` but repo still uses `.eslintrc.json`.
- Jest config references missing root `tsconfig.json`.

If these are part of the task, fix them first and then rerun quality gates.

## 8) Naming and File Conventions

- Components: `PascalCase.tsx`
- Utilities/helpers: `camelCase.ts`
- Tests: `*.test.tsx` near feature folders (`__tests__`).

## 9) Observability and Analytics

- Keep analytics lightweight.
- Keep Sentry sampling conservative.
- Prefer actionable logs over noisy logs.

## 10) Performance Priorities

Prioritize, in this order:

1. Avoid regressions in route-splitting.
2. Keep initial JS payload small.
3. Reduce layout shifts (CLS) on hero and stats sections.
4. Avoid heavy runtime work on first paint.

## 11) Security and Data Handling

- Do not hardcode secrets.
- Do not log PII to telemetry.
- Keep CSP/header updates aligned with deployment configs.
