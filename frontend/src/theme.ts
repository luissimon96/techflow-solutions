import { extendTheme, theme as chakraTheme } from '@chakra-ui/react'

const theme = extendTheme({
  // Professional Color Palette
  colors: {
    // Primary brand - Professional blue
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Primary brand blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // Accent color - Call-to-action red
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#f43f5e', // Primary accent red
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
    },
    // Enhanced gray scale with proper contrast
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Typography System
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Enhanced shadows and borders
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(59, 130, 246, 0.5)',
  },

  // Global Styles
  styles: {
    global: {
      // Smooth scroll behavior
      html: {
        scrollBehavior: 'smooth',
      },
      // Professional body styling
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        lineHeight: '1.6',
        fontFeatureSettings: '"cv11", "ss01"',
        fontVariantNumeric: 'tabular-nums',
      },
      // Accessibility-focused focus states
      '*:focus': {
        outline: 'none',
        boxShadow: 'outline',
      },
      // Enhanced link styles
      a: {
        color: 'brand.600',
        _hover: {
          color: 'brand.700',
          textDecoration: 'none',
        },
      },
    },
  },

  // Component Overrides
  components: {
    // Enhanced Button variants
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
        transition: 'all 0.2s ease-in-out',
        _focus: {
          boxShadow: 'outline',
        },
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
            _disabled: {
              bg: 'brand.500',
              transform: 'none',
              boxShadow: 'none',
            },
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0px)',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            borderColor: 'brand.600',
            color: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
        },
        ghost: {
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            color: 'brand.600',
          },
        },
        // Accent variant for call-to-action buttons
        accent: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'accent.700',
            transform: 'translateY(0px)',
          },
        },
      },
      sizes: {
        sm: {
          px: 4,
          py: 2,
          fontSize: 'sm',
        },
        md: {
          px: 6,
          py: 3,
          fontSize: 'md',
        },
        lg: {
          px: 8,
          py: 4,
          fontSize: 'lg',
        },
      },
    },

    // Enhanced Container styles
    Container: {
      baseStyle: {
        maxW: 'container.xl',
        px: { base: 4, md: 6, lg: 8 },
        py: { base: 4, md: 6 },
      },
    },

    // Card component styling
    Box: {
      variants: {
        card: {
          bg: 'white',
          borderRadius: 'xl',
          boxShadow: 'base',
          p: 6,
          border: '1px solid',
          borderColor: 'gray.200',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            boxShadow: 'md',
            borderColor: 'gray.300',
          },
        },
      },
    },

    // Enhanced heading styles
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        lineHeight: '1.2',
        color: 'gray.800',
      },
      sizes: {
        xl: {
          fontSize: { base: '2xl', md: '3xl', lg: '4xl' },
          fontWeight: 'extrabold',
        },
        lg: {
          fontSize: { base: 'xl', md: '2xl', lg: '3xl' },
          fontWeight: 'bold',
        },
        md: {
          fontSize: { base: 'lg', md: 'xl', lg: '2xl' },
          fontWeight: 'semibold',
        },
        sm: {
          fontSize: { base: 'md', md: 'lg', lg: 'xl' },
          fontWeight: 'medium',
        },
      },
    },

    // Text component enhancements
    Text: {
      baseStyle: {
        color: 'gray.700',
        lineHeight: '1.6',
      },
      variants: {
        subtitle: {
          fontSize: 'lg',
          color: 'gray.600',
          fontWeight: 'medium',
        },
        body: {
          fontSize: 'md',
          color: 'gray.700',
        },
        caption: {
          fontSize: 'sm',
          color: 'gray.500',
        },
      },
    },

    // Input field styling
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: 'outline',
            },
          },
        },
      },
    },

    // Divider styling
    Divider: {
      baseStyle: {
        borderColor: 'gray.200',
        opacity: 1,
      },
    },
  },

  // Configuration
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

export default theme 