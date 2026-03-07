# Project Architecture Blueprint

## 1. Context and Goals

TechFlow Solutions is a frontend-first React application focused on lead conversion (contact and quote requests) with direct WhatsApp integration.

Primary non-functional goals:

- Keep first-load JavaScript small and route-focused.
- Ensure simple and maintainable folder/module boundaries.
- Keep observability optional but production-ready.
- Preserve SEO and accessibility for all primary pages.

## 2. Technology and Runtime

- Runtime: Browser SPA
- UI: React 18 + TypeScript + Chakra UI
- Build: Vite 6 + Rollup chunking
- Routing: React Router 6 (`createBrowserRouter`)
- Data layer: React Query (prepared for remote APIs)
- Observability: Sentry + Vercel Analytics
- Deployment: Vercel static build + SPA rewrite

## 3. High-Level Architecture

```text
User Browser
  -> index.html
  -> Vite bundles (route-split chunks)
  -> App bootstrap (main.tsx)
      -> HelmetProvider
      -> AnalyticsProvider
      -> QueryProvider
      -> ChakraProvider
      -> RouterProvider
          -> Layout (Header/Main/Footer)
          -> Lazy route pages
```

### External interactions

```text
Contact/Quote pages
  -> local validation
  -> build WhatsApp URL (wa.me)
  -> open WhatsApp app/web

Optional telemetry (prod)
  -> Sentry (errors + traces + replay)
  -> Vercel Analytics
```

## 4. Source Structure (Canonical)

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

Decisions:

- `src/src` removed as duplicated tree.
- `src/pages/Home/index.tsx` removed to avoid competing Home implementations.
- `src/pages/Home.tsx` is the canonical home route component.

## 5. Routing and Rendering Strategy

- Routes are now lazy-loaded using `React.lazy` + `Suspense` in `src/lib/router.tsx`.
- Each route renders behind a shared fallback (`RouteLoader`), reducing initial bundle pressure.
- `Layout` remains eagerly loaded to keep consistent navigation shell and fast route transitions.

Current routes:

- `/` -> `Home`
- `/servicos` -> `Services`
- `/servicos-ti` -> `ITServices`
- `/sobre` -> `About`
- `/contato` -> `Contact`
- `/orcamento` -> `QuoteRequest`

## 6. Providers and Cross-Cutting Concerns

`src/main.tsx` defines provider order:

1. `HelmetProvider` for SEO metadata management.
2. `AnalyticsProvider` for web analytics.
3. `QueryProvider` for API query cache and devtools in development.
4. `ChakraProvider` for theme and design tokens.
5. `RouterProvider` for route rendering.

Sentry initialization:

- `initSentry()` is executed at bootstrap.
- Starts only when `import.meta.env.PROD` and `VITE_SENTRY_DSN` are available.
- Sampling tuned to reduce performance overhead while keeping error visibility.

## 7. Performance Profile and Applied Improvements

Implemented:

- Route-level code splitting (`src/lib/router.tsx`).
- Removed duplicate source tree and duplicate Home implementation.
- Activated query/analytics/sentry providers in app bootstrap.
- Switched React Query devtools gate to `import.meta.env.DEV`.
- Improved image delivery in `ClientCarousel`:
  - `loading="lazy"`
  - width/height hints
  - reduced motion support (`useReducedMotion`).

Expected impact:

- Smaller initial JS payload.
- Lower maintenance cost and fewer wrong-import regressions.
- Better runtime observability.
- Improved rendering stability and accessibility for animated logo carousel.

## 8. Security and Platform Notes

- Security headers are set in Vite dev server and Vercel config.
- `Content-Security-Policy` currently allows `'unsafe-inline'` and `'unsafe-eval'` for scripts in dev; tighten in production headers when possible.
- SPA rewrite in `vercel.json` ensures deep-link routing works.

## 9. Testing Architecture

Current:

- Jest + Testing Library configured.
- Component/page tests under `src/**/__tests__`.

Recommended additions:

- Add route smoke tests to confirm lazy-loaded pages render fallback + content.
- Add Lighthouse CI budget checks in CI (LCP, CLS, bundle-size threshold).

## 10. Extension Blueprint (How to Add New Features)

When adding a new page:

1. Create `src/pages/NewPage.tsx`.
2. Add lazy import in `src/lib/router.tsx`.
3. Register route with `withSuspense(<NewPage />)`.
4. Add SEO tags via Helmet or `SEOHead` component.
5. Add tests in `src/pages/__tests__/`.

When adding API-backed features:

1. Create request function in `src/lib/api.ts`.
2. Consume through React Query hooks.
3. Keep backend URL/env config centralized.
4. Add error reporting via Sentry captures where needed.

## 11. Known Gaps and Next Iteration

- Several dependencies remain underused for a frontend-only flow; trim package.json after confirming business scope.
- Consider replacing heavy Framer Motion usage in simple sections with CSS transitions.
- Add static image optimization pipeline (WebP/AVIF + responsive sizes).
- Normalize SEO strategy: either global defaults + per-page override, or dedicated per-page metadata map.

## 12. Governance Checklist

Before each release:

- `npm run build` must pass.
- No duplicate source trees under `src/`.
- All routes lazy-loaded except shell-level components.
- Telemetry initialized only in production-safe mode.
- Lighthouse mobile score targets met (define budget in CI).

## 13. Baseline Metrics (Post-Refactor)

Source reports:

- `docs/lighthouse-mobile.json`
- `docs/lighthouse-desktop.json`

Lighthouse categories:

- Mobile: Performance 73, Accessibility 88, Best Practices 96, SEO 100.
- Desktop: Performance 89, Accessibility 87, Best Practices 96, SEO 100.

Key metrics:

- Mobile: FCP 2.2s, LCP 2.7s, TBT 0ms, CLS 0.489, Speed Index 2.2s.
- Desktop: FCP 0.5s, LCP 0.6s, TBT 0ms, CLS 0.221, Speed Index 0.7s.

Interpretation:

- Core latency metrics are good, but CLS is still high on both profiles.
- Priority for next iteration is reducing layout shifts in hero/stat sections.

Validation status:

- `npm run build`: pass.
- `npm run lint`: fail (ESLint v9 expects `eslint.config.*`, repo still uses `.eslintrc.json`).
- `npm run test -- --runInBand`: fail (`jest.config.cjs` requires missing `./tsconfig.json`).
