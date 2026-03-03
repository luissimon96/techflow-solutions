import { Analytics } from '@vercel/analytics/react';

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    { children }
    < Analytics />
    </>
  );
};