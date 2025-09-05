import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';

// 📊 Analytics Hook Tests - Centralized Tracking Logic
// ✅ Unit tests for analytics abstraction
// ✅ Google Analytics integration testing
// ✅ Event tracking validation

// Mock window.gtag
const mockGtag = jest.fn();

Object.defineProperty(window, 'gtag', {
  writable: true,
  value: mockGtag,
});

describe('useAnalytics Hook', () => {
  beforeEach(() => {
    mockGtag.mockClear();
  });

  describe('trackEvent', () => {
    it('should call gtag with correct parameters', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackEvent('page_view', {
          event_category: 'Navigation',
          event_label: 'Home Page',
          value: 1,
        });
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        event_category: 'Navigation',
        event_label: 'Home Page',
        value: 1,
      });
    });

    it('should handle custom parameters', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackEvent('user_engagement', {
          event_category: 'Interaction',
          event_label: 'Button Click',
          custom_parameters: {
            section: 'hero',
            user_type: 'new',
          },
        });
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'user_engagement', {
        event_category: 'Interaction',
        event_label: 'Button Click',
        section: 'hero',
        user_type: 'new',
      });
    });

    it('should not throw when gtag is not available', () => {
      // Temporarily remove gtag
      const originalGtag = window.gtag;
      // @ts-ignore
      delete window.gtag;
      
      const { result } = renderHook(() => useAnalytics());
      
      expect(() => {
        act(() => {
          result.current.trackEvent('test_event', {
            event_category: 'Test',
          });
        });
      }).not.toThrow();
      
      // Restore gtag
      window.gtag = originalGtag;
    });
  });

  describe('trackServiceInteraction', () => {
    it('should track learn more interaction correctly', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackServiceInteraction('learn_more', 'Web Development');
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'service_learn_more_click', {
        event_category: 'Services',
        event_label: 'Web Development',
        value: 1,
      });
    });

    it('should track quote request interaction correctly', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackServiceInteraction('quote_request', 'Mobile App');
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'service_quote_request', {
        event_category: 'Conversion',
        event_label: 'Mobile App',
        value: 1,
      });
    });
  });

  describe('trackFormSubmit', () => {
    it('should track contact form submission', () => {
      const { result } = renderHook(() => useAnalytics());
      const formData = { name: 'John Doe', email: 'john@example.com' };
      
      act(() => {
        result.current.trackFormSubmit('contact', formData);
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'contact_form_submit', {
        event_category: 'Form Submission',
        event_label: 'contact',
        value: 1,
        custom_parameters: formData,
      });
    });

    it('should track quote form submission', () => {
      const { result } = renderHook(() => useAnalytics());
      const formData = { service: 'Web Development', budget: '5000-10000' };
      
      act(() => {
        result.current.trackFormSubmit('quote', formData);
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'quote_form_submit', {
        event_category: 'Form Submission',
        event_label: 'quote',
        value: 1,
        custom_parameters: formData,
      });
    });

    it('should handle form submission without data', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackFormSubmit('contact');
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'contact_form_submit', {
        event_category: 'Form Submission',
        event_label: 'contact',
        value: 1,
        custom_parameters: undefined,
      });
    });
  });

  describe('Memoization', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useAnalytics());
      
      const firstRender = {
        trackEvent: result.current.trackEvent,
        trackServiceInteraction: result.current.trackServiceInteraction,
        trackFormSubmit: result.current.trackFormSubmit,
      };
      
      rerender();
      
      const secondRender = {
        trackEvent: result.current.trackEvent,
        trackServiceInteraction: result.current.trackServiceInteraction,
        trackFormSubmit: result.current.trackFormSubmit,
      };
      
      // Functions should be the same reference due to useCallback
      expect(firstRender.trackEvent).toBe(secondRender.trackEvent);
      expect(firstRender.trackServiceInteraction).toBe(secondRender.trackServiceInteraction);
      expect(firstRender.trackFormSubmit).toBe(secondRender.trackFormSubmit);
    });
  });
});