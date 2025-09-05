import React, { memo } from 'react';
import { Spinner, Center, Text, VStack } from '@chakra-ui/react';

// 🔄 Loading Spinner Component - Performance Optimized
// ✅ Memoized to prevent unnecessary re-renders
// ✅ Reusable across the application
// ✅ Consistent loading UX

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  height?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({
  size = 'xl',
  message,
  height = '200px',
  color = 'brand.500',
}) => {
  return (
    <Center h={height}>
      <VStack spacing={4}>
        <Spinner 
          size={size} 
          color={color} 
          thickness="3px"
          speed="0.65s"
        />
        {message && (
          <Text 
            fontSize="sm" 
            color="gray.500" 
            textAlign="center"
            maxW="200px"
          >
            {message}
          </Text>
        )}
      </VStack>
    </Center>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';