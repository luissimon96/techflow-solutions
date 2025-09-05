import { useCallback } from 'react';

// 📊 Analytics Hook - Single Responsibility Pattern
// ✅ Centralizes all analytics tracking logic
// ✅ Reusable across components
// ✅ Type-safe event tracking

type AnalyticsEvent = 
  | 'service_learn_more_click'
  | 'service_quote_request'
  | 'contact_form_submit'
  | 'quote_form_submit'
  | 'page_view'
  | 'user_engagement';

interface AnalyticsEventData {
  event_category: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = useCallback((event: AnalyticsEvent, data: AnalyticsEventData) => {
    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        event_category: data.event_category,
        event_label: data.event_label,
        value: data.value,
        ...data.custom_parameters,
      });
    }

    // Additional analytics providers can be added here
    // Sentry, Mixpanel, etc.
  }, []);

  const trackServiceInteraction = useCallback((action: 'learn_more' | 'quote_request', serviceTitle: string) => {
    trackEvent(
      action === 'learn_more' ? 'service_learn_more_click' : 'service_quote_request',
      {
        event_category: action === 'learn_more' ? 'Services' : 'Conversion',
        event_label: serviceTitle,
        value: 1,
      }
    );
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formType: 'contact' | 'quote', formData?: Record<string, any>) => {
    trackEvent(
      formType === 'contact' ? 'contact_form_submit' : 'quote_form_submit',
      {
        event_category: 'Form Submission',
        event_label: formType,
        value: 1,
        custom_parameters: formData,
      }
    );
  }, [trackEvent]);

  return {
    trackEvent,
    trackServiceInteraction,
    trackFormSubmit,
  };
};

// Type declaration for gtag (should be in global.d.ts in real project)
declare global {
  interface Window {
    gtag?: (command: string, event: string, parameters: Record<string, any>) => void;
  }
}