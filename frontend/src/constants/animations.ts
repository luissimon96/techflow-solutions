// 🎦 Animation Constants - DRY Principle
// ✅ Reusable animation variants across components
// ✅ Consistent animation timings
// ✅ Performance-optimized configurations

export const ANIMATION_DURATIONS = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
} as const;

export const EASING = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
} as const;

// Card Animation Variants
export const cardAnimationVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: EASING.easeOut,
    },
  },
  hover: { 
    y: -4,
    scale: 1.02,
    transition: { 
      duration: ANIMATION_DURATIONS.fast,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
    },
  },
} as const;

// Button Animation Variants
export const buttonAnimationVariants = {
  hover: {
    y: -1,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: EASING.easeOut,
    },
  },
  tap: {
    y: 0,
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
    },
  },
} as const;

// Stagger Animation for Lists
export const staggerAnimationVariants = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.normal,
        ease: EASING.easeOut,
      },
    },
  },
} as const;

// Modal/Sheet Animation Variants
export const modalAnimationVariants = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.normal,
        ease: EASING.easeOut,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: {
        duration: ANIMATION_DURATIONS.fast,
      },
    },
  },
} as const;