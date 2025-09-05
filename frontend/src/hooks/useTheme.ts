import { useColorModeValue } from '@chakra-ui/react';

// 🎨 Theme Hook - Single Responsibility Pattern
// ✅ Centralizes all theme-related color logic
// ✅ Consistent color schemes across components
// ✅ Reusable theme patterns

interface ServiceCardTheme {
  bgColor: string;
  borderColor: string;
  featuredBorderColor: string;
  textColor: string;
  subtitleColor: string;
}

interface ButtonTheme {
  primary: {
    bg: string;
    color: string;
    hoverBg: string;
  };
  secondary: {
    bg: string;
    color: string;
    hoverBg: string;
    hoverColor: string;
  };
}

export const useServiceCardTheme = (): ServiceCardTheme => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const featuredBorderColor = useColorModeValue('brand.500', 'brand.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const subtitleColor = useColorModeValue('gray.500', 'gray.400');

  return {
    bgColor,
    borderColor,
    featuredBorderColor,
    textColor,
    subtitleColor,
  };
};

export const useButtonTheme = (): ButtonTheme => {
  const primaryBg = useColorModeValue('brand.500', 'brand.300');
  const primaryColor = useColorModeValue('white', 'gray.900');
  const primaryHoverBg = useColorModeValue('brand.600', 'brand.400');
  
  const secondaryBg = useColorModeValue('transparent', 'transparent');
  const secondaryColor = useColorModeValue('gray.600', 'gray.300');
  const secondaryHoverBg = useColorModeValue('brand.50', 'brand.900');
  const secondaryHoverColor = useColorModeValue('brand.500', 'brand.300');

  return {
    primary: {
      bg: primaryBg,
      color: primaryColor,
      hoverBg: primaryHoverBg,
    },
    secondary: {
      bg: secondaryBg,
      color: secondaryColor,
      hoverBg: secondaryHoverBg,
      hoverColor: secondaryHoverColor,
    },
  };
};

export const useFormTheme = () => {
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.200', 'gray.600');
  const inputFocus = useColorModeValue('brand.500', 'brand.300');
  const labelColor = useColorModeValue('gray.700', 'gray.200');
  const errorColor = useColorModeValue('red.500', 'red.300');

  return {
    inputBg,
    inputBorder,
    inputFocus,
    labelColor,
    errorColor,
  };
};