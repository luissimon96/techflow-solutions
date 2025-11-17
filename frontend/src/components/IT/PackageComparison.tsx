import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  useColorModeValue,
  Grid,
  GridItem,
  Switch,
  FormLabel,
  Divider,
  Icon,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Container,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaInfo, FaStar, FaCalculator } from 'react-icons/fa';
import { motion, isValidMotionProp } from 'framer-motion';
import { ITPackage } from '../../data/itServices';
import { chakra, shouldForwardProp } from '@chakra-ui/react';

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

interface PackageComparisonProps {
  packages: ITPackage[];
  title?: string;
  subtitle?: string;
  showCalculator?: boolean;
  onSelectPackage?: (packageId: string) => void;
}

export const PackageComparison: React.FC<PackageComparisonProps> = ({
  packages,
  title = 'Compare nossos planos',
  subtitle,
  showCalculator = false,
  onSelectPackage,
}) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const highlightColor = useColorModeValue('brand.500', 'brand.300');

  // Obter todas as features únicas
  const allFeatures = Array.from(
    new Set(packages.flatMap(pkg => pkg.features.map(f => f.name)))
  );

  const displayFeatures = showAllFeatures ? allFeatures : allFeatures.slice(0, 8);

  // Calcular preço com desconto anual
  const getPrice = (pkg: ITPackage) => {
    const basePrice = pkg.price;
    return isAnnual ? Math.round(basePrice * 0.83) : basePrice; // 17% desconto anual (2 meses grátis)
  };

  const getSavings = (pkg: ITPackage) => {
    if (!isAnnual) return 0;
    return Math.round(pkg.price * 12 * 0.17); // 17% de economia anual
  };

  const handleSelectPackage = (packageId: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'package_selection', {
        event_category: 'IT Packages',
        event_label: packageId,
        billing: isAnnual ? 'annual' : 'monthly',
      });
    }
    onSelectPackage?.(packageId);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -8, transition: { duration: 0.2 } },
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8}>
        {/* Header */}
        <VStack spacing={4} textAlign="center" maxW="3xl">
          <Heading size="xl">{title}</Heading>
          {subtitle && (
            <Text fontSize="lg" color={textColor}>
              {subtitle}
            </Text>
          )}

          {/* Billing Toggle */}
          <HStack spacing={4} p={4} bg={headerBg} borderRadius="xl">
            <FormLabel htmlFor="billing-toggle" mb={0} fontSize="sm">
              Mensal
            </FormLabel>
            <Switch
              id="billing-toggle"
              colorScheme="brand"
              isChecked={isAnnual}
              onChange={(e) => setIsAnnual(e.target.checked)}
            />
            <FormLabel htmlFor="billing-toggle" mb={0} fontSize="sm">
              Anual
            </FormLabel>
            {isAnnual && (
              <Badge colorScheme="green" variant="solid" borderRadius="full">
                Economize 17%
              </Badge>
            )}
          </HStack>
        </VStack>

        {/* Mobile View - Cards */}
        <Box display={{ base: 'block', lg: 'none' }} w="full">
          <VStack spacing={6}>
            {packages.map((pkg, index) => (
              <MotionBox
                key={pkg.id}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={cardVariants}
                // @ts-ignore - framer-motion transition prop type conflict
                transition={{ duration: 0.3, delay: index * 0.1 }}
                w="full"
                maxW="400px"
              >
                <Box
                  p={6}
                  bg={bgColor}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={pkg.popular ? highlightColor : borderColor}
                  boxShadow={pkg.popular ? 'xl' : 'md'}
                  position="relative"
                  _hover={{
                    borderColor: highlightColor,
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s ease"
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <Badge
                      position="absolute"
                      top="-10px"
                      left="50%"
                      transform="translateX(-50%)"
                      colorScheme="brand"
                      variant="solid"
                      borderRadius="full"
                      px={4}
                      py={1}
                    >
                      <Icon as={FaStar} boxSize={3} mr={1} />
                      Mais Popular
                    </Badge>
                  )}

                  <VStack spacing={4} align="stretch">
                    {/* Package Header */}
                    <VStack spacing={2}>
                      <Heading size="lg">{pkg.name}</Heading>
                      <VStack spacing={0}>
                        <HStack align="baseline">
                          <Text fontSize="3xl" fontWeight="bold" color={highlightColor}>
                            R$ {getPrice(pkg)}
                          </Text>
                          <Text fontSize="md" color={textColor}>
                            /{isAnnual ? 'mês' : 'mês'}
                          </Text>
                        </HStack>
                        {isAnnual && getSavings(pkg) > 0 && (
                          <Text fontSize="sm" color="green.500">
                            Economize R$ {getSavings(pkg)}/ano
                          </Text>
                        )}
                      </VStack>
                    </VStack>

                    {/* Package Info */}
                    <VStack spacing={2} align="start">
                      <HStack>
                        <Text fontSize="sm" fontWeight="semibold">Usuários:</Text>
                        <Text fontSize="sm">
                          {typeof pkg.targetUsers === 'number' ? `até ${pkg.targetUsers}` : 'Ilimitados'}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" fontWeight="semibold">SLA:</Text>
                        <Text fontSize="sm">{pkg.sla}</Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" fontWeight="semibold">Resposta:</Text>
                        <Text fontSize="sm">{pkg.responseTime}</Text>
                      </HStack>
                    </VStack>

                    <Divider />

                    {/* Features */}
                    <VStack spacing={2} align="start">
                      <Text fontWeight="semibold" fontSize="sm">
                        Principais recursos:
                      </Text>
                      {pkg.features.slice(0, 6).map((feature, idx) => (
                        <HStack key={idx} spacing={2}>
                          <Icon
                            as={feature.included ? FaCheck : FaTimes}
                            color={feature.included ? 'green.500' : 'red.500'}
                            boxSize={3}
                          />
                          <Text fontSize="sm" flex="1">
                            {feature.name}
                            {feature.limit && ` (${feature.limit})`}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    {/* CTA Button */}
                    <Button
                      colorScheme="brand"
                      size="lg"
                      width="full"
                      variant={pkg.popular ? 'solid' : 'outline'}
                      onClick={() => handleSelectPackage(pkg.id)}
                      _hover={{
                        transform: 'translateY(-2px)',
                      }}
                      transition="all 0.2s"
                    >
                      Escolher {pkg.name}
                    </Button>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </VStack>
        </Box>

        {/* Desktop View - Table */}
        <Box display={{ base: 'none', lg: 'block' }} w="full">
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th w="250px">
                    <Text fontSize="sm" fontWeight="semibold">
                      Recursos
                    </Text>
                  </Th>
                  {packages.map((pkg) => (
                    <Th key={pkg.id} textAlign="center" position="relative">
                      <VStack spacing={3}>
                        {pkg.popular && (
                          <Badge
                            colorScheme="brand"
                            variant="solid"
                            borderRadius="full"
                            fontSize="xs"
                          >
                            <Icon as={FaStar} boxSize={2} mr={1} />
                            Popular
                          </Badge>
                        )}
                        <VStack spacing={1}>
                          <Heading size="md">{pkg.name}</Heading>
                          <VStack spacing={0}>
                            <HStack align="baseline">
                              <Text fontSize="2xl" fontWeight="bold" color={highlightColor}>
                                R$ {getPrice(pkg)}
                              </Text>
                              <Text fontSize="sm" color={textColor}>
                                /mês
                              </Text>
                            </HStack>
                            {isAnnual && getSavings(pkg) > 0 && (
                              <Text fontSize="xs" color="green.500">
                                -R$ {getSavings(pkg)}/ano
                              </Text>
                            )}
                          </VStack>
                        </VStack>
                        <Button
                          colorScheme="brand"
                          size="sm"
                          variant={pkg.popular ? 'solid' : 'outline'}
                          onClick={() => handleSelectPackage(pkg.id)}
                          minW="120px"
                        >
                          Escolher
                        </Button>
                      </VStack>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {/* Basic Info Rows */}
                <Tr>
                  <Td fontWeight="semibold">Usuários</Td>
                  {packages.map((pkg) => (
                    <Td key={pkg.id} textAlign="center">
                      {typeof pkg.targetUsers === 'number' ? `até ${pkg.targetUsers}` : 'Ilimitados'}
                    </Td>
                  ))}
                </Tr>
                <Tr>
                  <Td fontWeight="semibold">SLA Garantido</Td>
                  {packages.map((pkg) => (
                    <Td key={pkg.id} textAlign="center">
                      <Badge colorScheme="green" variant="subtle">
                        {pkg.sla}
                      </Badge>
                    </Td>
                  ))}
                </Tr>
                <Tr>
                  <Td fontWeight="semibold">Tempo de Resposta</Td>
                  {packages.map((pkg) => (
                    <Td key={pkg.id} textAlign="center">
                      {pkg.responseTime}
                    </Td>
                  ))}
                </Tr>

                {/* Feature Rows */}
                {displayFeatures.map((featureName) => (
                  <Tr key={featureName}>
                    <Td>
                      <HStack>
                        <Text fontSize="sm">{featureName}</Text>
                        <Tooltip label="Clique para mais informações" fontSize="xs">
                          <Icon as={FaInfo} boxSize={3} color="gray.400" />
                        </Tooltip>
                      </HStack>
                    </Td>
                    {packages.map((pkg) => {
                      const feature = pkg.features.find(f => f.name === featureName);
                      return (
                        <Td key={pkg.id} textAlign="center">
                          {feature ? (
                            <VStack spacing={0}>
                              <Icon
                                as={feature.included ? FaCheck : FaTimes}
                                color={feature.included ? 'green.500' : 'red.500'}
                                boxSize={4}
                              />
                              {feature.limit && feature.included && (
                                <Text fontSize="xs" color={textColor}>
                                  {feature.limit}
                                </Text>
                              )}
                            </VStack>
                          ) : (
                            <Icon as={FaTimes} color="red.500" boxSize={4} />
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Show More Features Button */}
          {allFeatures.length > 8 && (
            <Flex justify="center" mt={4}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllFeatures(!showAllFeatures)}
              >
                {showAllFeatures ? 'Ver menos recursos' : `Ver todos os recursos (${allFeatures.length})`}
              </Button>
            </Flex>
          )}
        </Box>

        {/* Calculator Section */}
        {showCalculator && (
          <Box
            w="full"
            p={6}
            bg={headerBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <VStack spacing={4}>
              <HStack spacing={2}>
                <Icon as={FaCalculator} color={highlightColor} />
                <Heading size="md">Calculadora de Economia</Heading>
              </HStack>
              <Text fontSize="sm" color={textColor} textAlign="center" maxW="2xl">
                Com nossos serviços de TI, empresas economizam em média 40% nos custos 
                de TI e reduzem 85% dos problemas técnicos. 
                <Button variant="link" colorScheme="brand" size="sm" ml={1}>
                  Calcular minha economia
                </Button>
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};