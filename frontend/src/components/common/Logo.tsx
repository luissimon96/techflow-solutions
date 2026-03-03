import { Box, Image } from '@chakra-ui/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ size = 'md' }: LogoProps) => {
  // determine height based on size prop
  const heights: Record<string, string> = {
    sm: '24px',
    md: '32px',
    lg: '48px',
  };
  const height = heights[size] || heights.md;

  return (
    <Box>
      <Image
        src="/logos/logo.png"
        alt="TechFlow Solutions"
        h={height}
        objectFit="contain"
      />
    </Box>
  );
}; 