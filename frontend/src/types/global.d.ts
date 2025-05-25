import { IconType } from 'react-icons';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        [key: string]: any;
        event_category?: string;
        event_label?: string;
        value?: number;
        custom_parameter?: any;
      }
    ) => void;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Extend JSX elements if needed
    }
  }
}

// Extend IconType to be compatible with Chakra UI
declare module 'react-icons' {
  interface IconType extends React.ComponentType<any> { }
}

// Extend React to include bigint in ReactNode (newer React versions)
declare module 'react' {
  interface ReactNode {
    bigint?: never;
  }
}

export { }; 