import * as Sentry from '@sentry/react';

export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (import.meta.env.PROD && dsn) {
    Sentry.init({
      dsn,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.2, // Balanceia visibilidade e overhead
      // Session Replay
      replaysSessionSampleRate: 0.05, // Coleta leve para sessões normais
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    });
  }
}; 