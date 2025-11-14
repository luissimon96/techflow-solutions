import React from 'react';
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
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaArrowRight, FaStar, FaUsers, FaBuilding, FaHome, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ITService } from '../../data/itServices';

// Motion wrapper para Chakra UI
const MotionBox = motion(Box);

interface ITServiceCardProps {
  service: ITService;
  onLearnMore?: (serviceId: string) => void;
  onGetQuote?: (serviceId: string) => void;
  onViewPackages?: (serviceId: string) => void;
}

export const ITServiceCard: React.FC<ITServiceCardProps> = ({
  service,
  onLearnMore,
  onGetQuote,
  onViewPackages,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const featuredBorderColor = useColorModeValue('brand.500', 'brand.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const subtitleColor = useColorModeValue('gray.500', 'gray.400');
  const categoryColors = {
    support: 'blue',
    security: 'red',
    cloud: 'purple',
    maintenance: 'green',
  };

  // Contagem de pacotes por tipo
  const individualPackages = service.packages.filter(p => p.targetUsers <= 10);
  const businessPackages = service.packages.filter(p => p.targetUsers > 10 || p.targetUsers === 'unlimited');

  // Animações
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4, transition: { duration: 0.2 } },
  };

  const handleLearnMoreClick = () => {
    // Analytics tracking pode ser adicionado aqui no futuro
    onLearnMore?.(service.id);
  };

  const handleGetQuoteClick = () => {
    // Analytics tracking pode ser adicionado aqui no futuro
    onGetQuote?.(service.id);
  };

  const handleViewPackagesClick = () => {
    // Analytics tracking pode ser adicionado aqui no futuro
    onViewPackages?.(service.id);
  };

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
    >
      <Box
        p={6}
        bg={bgColor}
        borderRadius="xl"
        boxShadow={service.featured ? 'xl' : 'md'}
        border="2px solid"
        borderColor={service.featured ? featuredBorderColor : borderColor}
        position="relative"
        h="full"
        _hover={{
          boxShadow: '2xl',
          borderColor: featuredBorderColor,
        }}
        transition="all 0.3s ease"
      >
        {/* Featured Badge */}
        {service.featured && (
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

        <VStack spacing={5} align="stretch" h="full">
          {/* Header Section */}
          <VStack spacing={3} align="start">
            {/* Category Badge */}
            <HStack spacing={2} mb={2}>
              <Badge
                colorScheme={categoryColors[service.category]}
                variant="subtle"
                borderRadius="md"
                px={2}
                py={1}
                fontSize="xs"
                textTransform="capitalize"
              >
                {service.category === 'support' && 'Suporte'}
                {service.category === 'security' && 'Segurança'}
                {service.category === 'cloud' && 'Cloud'}
                {service.category === 'maintenance' && 'Manutenção'}
              </Badge>

              {/* Target Audience Indicator */}
              <Tooltip 
                label={service.targetAudience === 'both' ? 'Pessoa Física e Jurídica' : 
                       service.targetAudience === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              >
                <Badge
                  colorScheme="gray"
                  variant="outline"
                  borderRadius="md"
                  px={2}
                  py={1}
                  fontSize="xs"
                >
                  <Icon 
                    as={service.targetAudience === 'individual' ? FaHome : 
                        service.targetAudience === 'business' ? FaBuilding : FaUsers} 
                    boxSize={3} 
                  />
                </Badge>
              </Tooltip>
            </HStack>

            <Box>
              <Icon
                as={service.icon}
                boxSize={12}
                color={service.featured ? 'brand.500' : 'brand.400'}
                mb={3}
              />
            </Box>

            <Box>
              <Heading size="lg" mb={1} lineHeight="short">
                {service.title}
              </Heading>
              <Text color={subtitleColor} fontSize="md" fontWeight="medium">
                {service.subtitle}
              </Text>
            </Box>
          </VStack>

          {/* Description */}
          <Text color={textColor} lineHeight="tall" flex="1">
            {service.description}
          </Text>

          {/* Key Benefits */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color={textColor}>
              Principais benefícios:
            </Text>
            <VStack spacing={1} align="start">
              {service.benefits.slice(0, 3).map((benefit, index) => (
                <Text key={index} fontSize="sm" color={textColor}>
                  • {benefit}
                </Text>
              ))}
            </VStack>
          </Box>

          <Divider />

          {/* Package Info */}
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between" align="center">
              <VStack spacing={0} align="start">
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                  Planos disponíveis:
                </Text>
                <HStack spacing={2}>
                  {service.targetAudience !== 'business' && (
                    <Badge colorScheme="green" variant="subtle" fontSize="xs">
                      <Icon as={FaHome} boxSize={2} mr={1} />
                      {individualPackages.length} planos PF
                    </Badge>
                  )}
                  {service.targetAudience !== 'individual' && (
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      <Icon as={FaBuilding} boxSize={2} mr={1} />
                      {businessPackages.length} planos PJ
                    </Badge>
                  )}
                </HStack>
              </VStack>

              {service.duration && (
                <VStack spacing={0} align="end">
                  <Text fontSize="xs" color={subtitleColor}>
                    <Icon as={FaClock} boxSize={3} mr={1} />
                    {service.duration}
                  </Text>
                </VStack>
              )}
            </HStack>

            {/* Price Range */}
            {service.packages.length > 0 && (
              <Box>
                <HStack spacing={1} align="baseline">
                  <Text fontSize="lg" fontWeight="bold" color="brand.500">
                    A partir de R$ {Math.min(...service.packages.map(p => p.price))}
                  </Text>
                  <Text fontSize="sm" color={subtitleColor}>
                    /mês
                  </Text>
                </HStack>
                {service.packages.length > 1 && (
                  <Text fontSize="xs" color={subtitleColor}>
                    Até R$ {Math.max(...service.packages.map(p => p.price))}/mês
                  </Text>
                )}
              </Box>
            )}
          </VStack>

          {/* Action Buttons */}
          <VStack spacing={3} pt={4}>
            <Button
              colorScheme="brand"
              size="md"
              width="full"
              rightIcon={<Icon as={FaArrowRight} />}
              onClick={handleGetQuoteClick}
              fontWeight="semibold"
              _hover={{
                transform: 'translateY(-1px)',
              }}
              transition="all 0.2s"
            >
              Solicitar Orçamento
            </Button>

            <HStack spacing={2} width="full">
              <Button
                variant="outline"
                size="sm"
                flex="1"
                onClick={handleViewPackagesClick}
                colorScheme="brand"
                _hover={{
                  bg: 'brand.50',
                }}
              >
                Ver Planos
              </Button>

              <Button
                variant="ghost"
                size="sm"
                flex="1"
                onClick={handleLearnMoreClick}
                color={textColor}
                _hover={{
                  color: 'brand.500',
                  bg: 'brand.50',
                }}
              >
                Saiba mais
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </MotionBox>
  );
};