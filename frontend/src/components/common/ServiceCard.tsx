import React, { memo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Badge,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { asChakraIcon } from '../../utils/iconUtils';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useServiceCardTheme } from '../../hooks/useTheme';
import { cardAnimationVariants } from '../../constants/animations';

// 🎮 ServiceCard - Refactored with SOLID Principles
// ✅ Single Responsibility: Only handles service card UI rendering
// ✅ Open/Closed: Extensible through props, closed for modification
// ✅ Dependency Inversion: Depends on hooks abstractions
// ✅ Performance: React.memo for re-render optimization

const MotionBox = motion(Box);

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: IconType;
  technologies: string[];
  duration: string;
  features: string[];
  featured?: boolean;
  onLearnMore?: () => void;
  onGetQuote?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = memo(({
  title,
  subtitle,
  description,
  icon,
  technologies,
  duration,
  features,
  featured = false,
  onLearnMore,
  onGetQuote,
}) => {
  // ✅ Dependency Inversion: Using abstractions instead of concrete implementations
  const { trackServiceInteraction } = useAnalytics();
  const theme = useServiceCardTheme();

  // ✅ Single Responsibility: Clean event handlers focused only on coordination
  const handleLearnMoreClick = () => {
    trackServiceInteraction('learn_more', title);
    onLearnMore?.();
  };

  const handleGetQuoteClick = () => {
    trackServiceInteraction('quote_request', title);
    onGetQuote?.();
  };

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardAnimationVariants}
    >
      <Box
        p={6}
        bg={theme.bgColor}
        borderRadius="xl"
        boxShadow={featured ? 'xl' : 'md'}
        border="2px solid"
        borderColor={featured ? theme.featuredBorderColor : theme.borderColor}
        position="relative"
        h="full"
        _hover={{
          boxShadow: 'xl',
        }}
        transition="box-shadow 0.2s ease"
      >
        {/* Featured Badge */}
        {featured && (
          <Box position="absolute" top={4} right={4}>
            <Badge
              colorScheme="brand"
              variant="solid"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="bold"
            >
              <HStack spacing={1}>
                <Icon as={FaStar as React.ElementType} boxSize={3} />
                <Text>Popular</Text>
              </HStack>
            </Badge>
          </Box>
        )}

        <VStack spacing={4} align="stretch" h="full">
          {/* Header Section */}
          <VStack spacing={3} align="start">
            <Box>
              <Icon
                as={icon as React.ElementType}
                boxSize={12}
                color={featured ? 'brand.500' : 'brand.400'}
                mb={2}
              />
            </Box>

            <Box>
              <Heading size="lg" mb={1} lineHeight="short">
                {title}
              </Heading>
              <Text color={theme.subtitleColor} fontSize="md" fontWeight="medium">
                {subtitle}
              </Text>
            </Box>
          </VStack>

          {/* Description */}
          <Text color={theme.textColor} lineHeight="tall" flex="1">
            {description}
          </Text>

          {/* Technologies */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color={theme.textColor}>
              Tecnologias:
            </Text>
            <Wrap spacing={1}>
              {technologies.slice(0, 4).map((tech, index) => (
                <WrapItem key={index}>
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    borderRadius="md"
                    px={2}
                    py={1}
                    fontSize="xs"
                  >
                    {tech}
                  </Badge>
                </WrapItem>
              ))}
              {technologies.length > 4 && (
                <WrapItem>
                  <Badge
                    colorScheme="brand"
                    variant="subtle"
                    borderRadius="md"
                    px={2}
                    py={1}
                    fontSize="xs"
                  >
                    +{technologies.length - 4}
                  </Badge>
                </WrapItem>
              )}
            </Wrap>
          </Box>

          {/* Features & Duration */}
          <VStack spacing={3} align="stretch">
            <Box>
              <Text 
                fontSize="sm" 
                fontWeight="semibold" 
                mb={2} 
                color={theme.textColor}
                id={featuresId}
                as="h4"
              >
                Inclui:
              </Text>
              <VStack spacing={1} align="start" role="list" aria-labelledby={featuresId}>
                {features.slice(0, 3).map((feature, index) => (
                  <Text key={index} fontSize="sm" color={theme.textColor}>
                    • {feature}
                  </Text>
                ))}
                {features.length > 3 && (
                  <Text fontSize="sm" color="brand.500" fontWeight="medium">
                    +{features.length - 3} recursos adicionais
                  </Text>
                )}
              </VStack>
            </Box>

            <Box>
              <Text fontSize="sm" color={theme.textColor}>
                <Text as="span" fontWeight="semibold" aria-label="Prazo estimado para conclusão">Prazo típico:</Text> {duration}
              </Text>
            </Box>
          </VStack>

          {/* Action Buttons */}
          <VStack spacing={3} pt={4}>
            <Button
              colorScheme="brand"
              size="md"
              width="full"
              rightIcon={React.createElement(asChakraIcon(FaArrowRight))}
              onClick={handleGetQuoteClick}
              fontWeight="semibold"
              _hover={{
                transform: 'translateY(-1px)',
              }}
              transition="all 0.2s"
            >
              Solicitar Orçamento
            </Button>

            <Button
              variant="ghost"
              size="sm"
              width="full"
              onClick={handleLearnMoreClick}
              color={theme.textColor}
              _hover={{
                color: 'brand.500',
                bg: 'brand.50',
              }}
            >
              Saiba mais
            </Button>
          </VStack>
        </VStack>
      </Box>
    </MotionBox>
  );
});

// ✅ Performance: Display name for debugging
ServiceCard.displayName = 'ServiceCard';