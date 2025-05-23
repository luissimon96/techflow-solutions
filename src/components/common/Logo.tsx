import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export function Logo() {
  const color = useColorModeValue('brand.500', 'brand.200');

  return (
    <Box
      as={RouterLink}
      to="/"
      display="flex"
      alignItems="center"
      gap={2}
      _hover={{ textDecoration: 'none' }}
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={color}
      >
        TechFlow
      </Text>
      <Text
        fontSize="xl"
        fontWeight="medium"
        color="gray.600"
      >
        Solutions
      </Text>
    </Box>
  );
} 