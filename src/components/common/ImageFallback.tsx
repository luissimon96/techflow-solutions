import { Box, Text } from '@chakra-ui/react';

interface ImageFallbackProps {
  width?: string | number;
  height?: string | number;
  text?: string;
}

export function ImageFallback({ width = '100%', height = '100%', text = 'Imagem não disponível' }: ImageFallbackProps) {
  return (
    <Box
      width={width}
      height={height}
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="md"
    >
      <Text color="gray.500" fontSize="sm" textAlign="center" p={4}>
        {text}
      </Text>
    </Box>
  );
} 