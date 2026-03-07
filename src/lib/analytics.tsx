import { type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
};