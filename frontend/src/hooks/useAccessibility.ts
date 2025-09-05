import { useCallback, useEffect, useRef } from 'react';

// ♿ Accessibility Hook - WCAG Compliance
// ✅ Focus management utilities
// ✅ Screen reader announcements
// ✅ Keyboard navigation helpers
// ✅ Color contrast utilities

interface UseAccessibilityOptions {
  announcePageChange?: boolean;
  focusManagement?: boolean;
  skipLinks?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    announcePageChange = true,
    focusManagement = true,
    skipLinks = true
  } = options;

  const announcementRef = useRef<HTMLDivElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      // Clear previous announcement
      announcementRef.current.textContent = '';
      
      // Small delay to ensure screen reader picks up the change
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.setAttribute('aria-live', priority);
          announcementRef.current.textContent = message;
        }
      }, 100);
    }
  }, []);

  // Focus management
  const focusElement = useCallback((selector: string | HTMLElement) => {
    if (!focusManagement) return;
    
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) as HTMLElement
      : selector;
      
    if (element && element.focus) {
      // Ensure element is focusable
      if (element.tabIndex < 0) {
        element.tabIndex = -1;
      }
      element.focus({ preventScroll: false });
    }
  }, [focusManagement]);

  // Focus first error in form
  const focusFirstError = useCallback(() => {
    const firstError = document.querySelector('[aria-invalid="true"]') as HTMLElement;
    if (firstError) {
      focusElement(firstError);
      announce('Erro encontrado no formulário. Por favor, corrija os campos destacados.', 'assertive');
    }
  }, [focusElement, announce]);

  // Skip to main content
  const skipToMain = useCallback(() => {
    const mainContent = document.querySelector('main, [role="main"], #main-content') as HTMLElement;
    if (mainContent) {
      focusElement(mainContent);
      announce('Navegando para o conteúdo principal', 'polite');
    }
  }, [focusElement, announce]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent, callbacks: Record<string, () => void>) => {
    const { key, ctrlKey, altKey, shiftKey } = event;
    const keyCombo = [
      ctrlKey && 'ctrl',
      altKey && 'alt', 
      shiftKey && 'shift',
      key.toLowerCase()
    ].filter(Boolean).join('+');

    if (callbacks[keyCombo]) {
      event.preventDefault();
      callbacks[keyCombo]();
    }
  }, []);

  // Trap focus within a container (for modals)
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!containerRef.current) return () => {};

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  // Check color contrast (basic implementation)
  const checkColorContrast = useCallback((foreground: string, background: string): boolean => {
    // This is a simplified implementation
    // In a real project, you'd use a proper contrast ratio calculation
    const getLuminance = (color: string): number => {
      // Simple RGB to luminance conversion (simplified)
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return 0;
      
      const [r, g, b] = rgb.map(Number);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    const foregroundLum = getLuminance(foreground);
    const backgroundLum = getLuminance(background);
    const contrast = (Math.max(foregroundLum, backgroundLum) + 0.05) / 
                    (Math.min(foregroundLum, backgroundLum) + 0.05);
    
    return contrast >= 4.5; // WCAG AA standard
  }, []);

  // Generate accessible IDs for form associations
  const generateId = useCallback((prefix: string = 'a11y'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Page change announcement effect
  useEffect(() => {
    if (announcePageChange) {
      const pageTitle = document.title;
      announce(`Página carregada: ${pageTitle}`, 'polite');
    }
  }, [announce, announcePageChange]);

  return {
    announce,
    focusElement,
    focusFirstError,
    skipToMain,
    handleKeyDown,
    trapFocus,
    checkColorContrast,
    generateId,
    announcementRef,
    skipLinkRef,
  };
};

// Accessibility utilities for components
export const a11yUtils = {
  // ARIA label generators
  getButtonAriaLabel: (action: string, context?: string) => 
    context ? `${action} ${context}` : action,
  
  // Loading state ARIA attributes
  getLoadingAttributes: (isLoading: boolean) => ({
    'aria-busy': isLoading,
    'aria-live': 'polite' as const,
  }),
  
  // Form field ARIA attributes
  getFieldAttributes: (id: string, isRequired = false, isInvalid = false, describedBy?: string) => ({
    id,
    'aria-required': isRequired,
    'aria-invalid': isInvalid,
    'aria-describedby': describedBy,
  }),
  
  // Modal/Dialog ARIA attributes
  getModalAttributes: (titleId: string, descriptionId?: string) => ({
    role: 'dialog' as const,
    'aria-modal': true,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
  }),
};