import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Badge,
  Button,
  useColorModeValue,
  Flex,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Motion wrapper para Chakra UI
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

export const ServiceCard: React.FC<ServiceCardProps> = ({
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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const featuredBorderColor = useColorModeValue('brand.500', 'brand.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const subtitleColor = useColorModeValue('gray.500', 'gray.400');

  // Animações sutis para performance
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4, transition: { duration: 0.2 } },
  };

  const handleLearnMoreClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'service_learn_more_click', {
        event_category: 'Services',
        event_label: title,
        value: 1,
      });
    }
    onLearnMore?.();
  };

  const handleGetQuoteClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'service_quote_request', {
        event_category: 'Conversion',
        event_label: title,
        value: 1,
      });
    }
    onGetQuote?.();
  };

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
      transition={{ duration: 0.2 }}
    >
      <Box
        p={6}
        bg={bgColor}
        borderRadius="xl"
        boxShadow={featured ? 'xl' : 'md'}
        border="2px solid"
        borderColor={featured ? featuredBorderColor : borderColor}
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
                <Icon as={FaStar} boxSize={3} />
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
                as={icon}
                boxSize={12}
                color={featured ? 'brand.500' : 'brand.400'}
                mb={2}
              />
            </Box>

            <Box>
              <Heading size="lg" mb={1} lineHeight="short">
                {title}
              </Heading>
              <Text color={subtitleColor} fontSize="md" fontWeight="medium">
                {subtitle}
              </Text>
            </Box>
          </VStack>

          {/* Description */}
          <Text color={textColor} lineHeight="tall" flex="1">
            {description}
          </Text>

          {/* Technologies */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color={textColor}>
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
              <Text fontSize="sm" fontWeight="semibold" mb={2} color={textColor}>
                Inclui:
              </Text>
              <VStack spacing={1} align="start">
                {features.slice(0, 3).map((feature, index) => (
                  <Text key={index} fontSize="sm" color={textColor}>
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
              <Text fontSize="sm" color={textColor}>
                <Text as="span" fontWeight="semibold">Prazo típico:</Text> {duration}
              </Text>
            </Box>
          </VStack>

          {/* Action Buttons */}
          <VStack spacing={3} pt={4}>
            <Button
              colorScheme="brand"
              size="md"
              width="full"
              rightIcon={<FaArrowRight />}
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
              color={textColor}
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
}; 