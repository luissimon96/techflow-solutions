import { Box, Text } from '@chakra-ui/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Logo = ({ size = 'md', color = 'brand.500' }: LogoProps) => {
  const sizes = {
    sm: { fontSize: 'lg', fontWeight: 'bold' },
    md: { fontSize: 'xl', fontWeight: 'bold' },
    lg: { fontSize: '2xl', fontWeight: 'bold' },
  };

  return (
    <Box>
      <Text color={color} {...sizes[size]}>
        TechFlow
      </Text>
    </Box>
  );
}; 