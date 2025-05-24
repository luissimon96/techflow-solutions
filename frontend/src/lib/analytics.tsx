import { Analytics } from '@vercel/analytics/react';
import { ReactNode } from 'react';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}; 