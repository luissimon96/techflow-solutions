import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Badge,
  Stack,
  Icon,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaRocket,
  FaHeadset,
  FaShieldAlt,
  FaCloud,
  FaArrowRight,
  FaStar,
  FaCheck,
  FaWhatsapp
} from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  itServices,
  getIndividualPackages,
  getBusinessPackages
} from '../data/itServices';

const ITServices = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  // Handle quote request with pre-filled form
  const handleQuoteRequest = (service: typeof itServices[0]) => {
    // Convert category to a more readable format
    const serviceTypeMap: Record<string, string> = {
      'support': 'Suporte Técnico',
      'security': 'Segurança Cibernética',
      'cloud': 'Serviços em Nuvem',
      'maintenance': 'Manutenção de TI'
    };

    navigate('/orcamento', {
      state: {
        projectName: service.title,
        projectType: serviceTypeMap[service.category] || service.category,
        timeline: service.duration,
        budget: 'A definir',
        projectDescription: service.description,
        mainGoals: service.benefits.join(', '),
      },
    });
  };

  // Serviços em destaque
  const featuredServices = itServices.filter(service => service.featured);

  // Pacotes para pessoa física e jurídica
  const individualPackages = getIndividualPackages();
  const businessPackages = getBusinessPackages();

  // Stats
  const stats = [
    { value: '95%', label: 'Problemas resolvidos remotamente' },
    { value: '<15min', label: 'Tempo médio de resposta' },
    { value: '24/7', label: 'Monitoramento ativo' },
    { value: '100%', label: 'Satisfação dos clientes' }
  ];

  return (
    <>
      <Helmet>
        <title>Serviços de TI - TechFlow Solutions</title>
        <meta
          name="description"
          content="Suporte técnico especializado, segurança digital e infraestrutura em nuvem. Monitoramento 24/7, backup automatizado e resposta imediata."
        />
        <meta name="keywords" content="suporte técnico, TI, segurança digital, cloud, backup, monitoramento" />
      </Helmet>

      <Box
        as="section"
        minH="100vh"
        pt={{ base: 32, md: 40, lg: 44 }}
        pb={{ base: 16, md: 20, lg: 24 }}
        bg={bgColor}
      >
        <Container maxW={{ base: "container.sm", md: "container.md", lg: "container.lg", xl: "container.xl" }}>
          <VStack spacing={{ base: 12, md: 16, lg: 20 }}>

            {/* Hero Section */}
            <Box textAlign="center" maxW="5xl" mx="auto" px={{ base: 4, md: 6 }}>
              <Badge
                colorScheme="brand"
                variant="solid"
                px={4}
                py={2}
                borderRadius="full"
                mb={6}
                fontSize="sm"
              >
                🔧 Tecnologia + Atendimento Humano
              </Badge>

              <Heading
                as="h1"
                size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                mb={{ base: 6, md: 8 }}
                bgGradient="linear(to-r, brand.600, brand.400)"
                bgClip="text"
                fontWeight="extrabold"
                lineHeight="shorter"
                textShadow="0 2px 4px rgba(0,0,0,0.1)"
                letterSpacing="tight"
              >
                Serviços de TI que Realmente Funcionam
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                color={textColor}
                maxW="3xl"
                mx="auto"
                lineHeight="tall"
                fontWeight="medium"
                mb={8}
              >
                Suporte técnico proativo, segurança avançada e infraestrutura moderna.
                Monitore, proteja e otimize sua TI com especialistas dedicados.
              </Text>

              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                justify="center"
              >
                <Button
                  as={RouterLink}
                  to="/orcamento"
                  size="lg"
                  colorScheme="brand"
                  rightIcon={<Icon as={FaArrowRight} />}
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="xl"
                  _hover={{
                    transform: 'translateY(-3px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                >
                  Solicitar Orçamento
                </Button>
                <Button
                  as="a"
                  href="https://wa.me/5554997109051"
                  target="_blank"
                  size="lg"
                  variant="outline"
                  colorScheme="brand"
                  leftIcon={<Icon as={FaWhatsapp} />}
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="semibold"
                  borderRadius="xl"
                  _hover={{
                    transform: 'translateY(-3px)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.3s"
                >
                  Falar no WhatsApp
                </Button>
              </Stack>
            </Box>

            {/* Stats Section */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full" maxW="4xl">
              {stats.map((stat, index) => (
                <VStack key={index} spacing={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color={textColor} textAlign="center">
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>

            {/* Serviços em Destaque */}
            <Box w="full" maxW="6xl" mx="auto">
              <Heading
                size="lg"
                mb={8}
                textAlign="center"
                color="gray.800"
              >
                Serviços em Destaque
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {featuredServices.map((service) => (
                  <Card
                    key={service.id}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="xl"
                    border="2px solid"
                    borderColor="brand.200"
                    _hover={{
                      transform: 'translateY(-8px)',
                      boxShadow: '2xl',
                      borderColor: 'brand.400'
                    }}
                    transition="all 0.3s"
                    overflow="hidden"
                  >
                    <Box position="relative">
                      <Box
                        h="120px"
                        bg="gradient-to-br"
                        bgGradient="linear(135deg, brand.400, brand.600)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={service.icon} boxSize={12} color="white" opacity={0.9} />
                      </Box>
                      <Badge
                        colorScheme="brand"
                        variant="solid"
                        position="absolute"
                        top={4}
                        right={4}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        <Icon as={FaStar} boxSize={2} mr={1} />
                        Popular
                      </Badge>
                    </Box>
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <VStack spacing={2} align="start" w="full">
                          <Heading size="md" color="gray.800">
                            {service.title}
                          </Heading>
                          <Text fontSize="sm" fontWeight="semibold" color="brand.600">
                            {service.subtitle}
                          </Text>
                          <Badge
                            variant="subtle"
                            colorScheme={
                              service.category === 'support' ? 'blue' :
                                service.category === 'security' ? 'red' :
                                  service.category === 'cloud' ? 'purple' : 'green'
                            }
                          >
                            {service.category === 'support' && 'Suporte'}
                            {service.category === 'security' && 'Segurança'}
                            {service.category === 'cloud' && 'Cloud'}
                            {service.category === 'maintenance' && 'Manutenção'}
                          </Badge>
                        </VStack>

                        <Text color={textColor} fontSize="sm" lineHeight="relaxed">
                          {service.description}
                        </Text>

                        <VStack spacing={2} align="start" w="full">
                          <Text fontSize="xs" fontWeight="semibold" color={textColor}>
                            Principais benefícios:
                          </Text>
                          {service.benefits.slice(0, 3).map((benefit, idx) => (
                            <HStack key={idx} spacing={2}>
                              <Icon as={FaCheck} color="green.500" boxSize={3} />
                              <Text fontSize="xs" color={textColor}>
                                {benefit}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>

                        <Box w="full" pt={2}>
                          <HStack justify="space-between" align="baseline">
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                              A partir de
                            </Text>
                            <VStack spacing={0} align="end">
                              <HStack align="baseline">
                                <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                                  R$ {Math.min(...service.packages.map(p => p.price))}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                  /mês
                                </Text>
                              </HStack>
                            </VStack>
                          </HStack>
                        </Box>

                        <Button
                          onClick={() => handleQuoteRequest(service)}
                          colorScheme="brand"
                          size="md"
                          width="full"
                          rightIcon={<Icon as={FaArrowRight} />}
                          _hover={{ transform: 'translateY(-2px)' }}
                          transition="all 0.2s"
                        >
                          Solicitar Orçamento
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>

            {/* Todos os Serviços */}
            <Box w="full" maxW="6xl" mx="auto">
              <Heading
                size="lg"
                mb={8}
                textAlign="center"
                color="gray.800"
              >
                Todos os Serviços
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {itServices.map((service) => (
                  <Card
                    key={service.id}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="md"
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'lg',
                      borderColor: 'brand.200'
                    }}
                    transition="all 0.3s"
                    overflow="hidden"
                  >
                    <Box
                      h="100px"
                      bg="gradient-to-br"
                      bgGradient={service.featured ?
                        "linear(135deg, brand.400, brand.600)" :
                        "linear(135deg, gray.400, gray.600)"
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={service.icon} boxSize={8} color="white" opacity={0.9} />
                    </Box>
                    <CardBody p={4}>
                      <VStack spacing={3} align="start">
                        <VStack spacing={1} align="start" w="full">
                          <Heading size="sm" color="gray.800">
                            {service.title}
                          </Heading>
                          <Text fontSize="xs" color="brand.600" fontWeight="semibold">
                            {service.subtitle}
                          </Text>
                        </VStack>

                        <Text color={textColor} fontSize="xs" lineHeight="relaxed">
                          {service.description.substring(0, 100)}...
                        </Text>

                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color={textColor}>
                            A partir de
                          </Text>
                          <Text fontSize="md" fontWeight="bold" color="brand.600">
                            R$ {Math.min(...service.packages.map(p => p.price))}
                          </Text>
                        </HStack>

                        <Button
                          onClick={() => handleQuoteRequest(service)}
                          size="sm"
                          colorScheme="brand"
                          width="full"
                          rightIcon={<Icon as={FaArrowRight} />}
                        >
                          Solicitar Orçamento
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>

            {/* Planos - Pessoa Física */}
            <Box w="full" maxW="6xl" mx="auto">
              <Heading
                size="lg"
                mb={4}
                textAlign="center"
                color="gray.800"
              >
                Planos para Pessoa Física
              </Heading>
              <Text
                fontSize="md"
                color={textColor}
                textAlign="center"
                mb={8}
              >
                Proteção e suporte para sua casa e família
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {individualPackages.slice(0, 3).map((pkg) => (
                  <Card
                    key={pkg.id}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow={pkg.popular ? "xl" : "md"}
                    border="2px solid"
                    borderColor={pkg.popular ? "brand.400" : borderColor}
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.3s"
                    position="relative"
                  >
                    {pkg.popular && (
                      <Badge
                        colorScheme="brand"
                        variant="solid"
                        position="absolute"
                        top={-3}
                        left="50%"
                        transform="translateX(-50%)"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        <Icon as={FaStar} boxSize={2} mr={1} />
                        Mais Popular
                      </Badge>
                    )}
                    <CardBody p={6}>
                      <VStack spacing={4} align="stretch">
                        <VStack spacing={2} align="start">
                          <Heading size="md" color="gray.800">
                            {pkg.name}
                          </Heading>
                          <HStack align="baseline">
                            <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                              R$ {pkg.price}
                            </Text>
                            <Text fontSize="md" color={textColor}>
                              /mês
                            </Text>
                          </HStack>
                        </VStack>

                        <VStack spacing={2} align="start">
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                            Inclui:
                          </Text>
                          {pkg.features.slice(0, 5).map((feature, idx) => (
                            feature.included && (
                              <HStack key={idx} spacing={2}>
                                <Icon as={FaCheck} color="green.500" boxSize={3} />
                                <Text fontSize="xs" color={textColor}>
                                  {feature.name}
                                </Text>
                              </HStack>
                            )
                          ))}
                        </VStack>

                        <Button
                          onClick={() => {
                            const selectedService = itServices.find(s => s.featured) || itServices[0];
                            handleQuoteRequest(selectedService);
                          }}
                          colorScheme="brand"
                          size="md"
                          width="full"
                          variant={pkg.popular ? "solid" : "outline"}
                        >
                          Escolher Plano
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>

            {/* Planos - Pessoa Jurídica */}
            <Box w="full" maxW="6xl" mx="auto">
              <Heading
                size="lg"
                mb={4}
                textAlign="center"
                color="gray.800"
              >
                Planos para Empresas
              </Heading>
              <Text
                fontSize="md"
                color={textColor}
                textAlign="center"
                mb={8}
              >
                Soluções escaláveis para seu negócio
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {businessPackages.slice(0, 3).map((pkg) => (
                  <Card
                    key={pkg.id}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow={pkg.popular ? "xl" : "md"}
                    border="2px solid"
                    borderColor={pkg.popular ? "brand.400" : borderColor}
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.3s"
                    position="relative"
                  >
                    {pkg.popular && (
                      <Badge
                        colorScheme="brand"
                        variant="solid"
                        position="absolute"
                        top={-3}
                        left="50%"
                        transform="translateX(-50%)"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        <Icon as={FaStar} boxSize={2} mr={1} />
                        Mais Popular
                      </Badge>
                    )}
                    <CardBody p={6}>
                      <VStack spacing={4} align="stretch">
                        <VStack spacing={2} align="start">
                          <Heading size="md" color="gray.800">
                            {pkg.name}
                          </Heading>
                          <HStack align="baseline">
                            <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                              R$ {pkg.price}
                            </Text>
                            <Text fontSize="md" color={textColor}>
                              /mês
                            </Text>
                          </HStack>
                          <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                            {typeof pkg.targetUsers === 'number' ?
                              `Até ${pkg.targetUsers} usuários` :
                              'Usuários ilimitados'
                            }
                          </Badge>
                        </VStack>

                        <VStack spacing={2} align="start">
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                            Inclui:
                          </Text>
                          {pkg.features.slice(0, 5).map((feature, idx) => (
                            feature.included && (
                              <HStack key={idx} spacing={2}>
                                <Icon as={FaCheck} color="green.500" boxSize={3} />
                                <Text fontSize="xs" color={textColor}>
                                  {feature.name}
                                </Text>
                              </HStack>
                            )
                          ))}
                        </VStack>

                        <Button
                          onClick={() => {
                            const selectedService = itServices.find(s => s.featured) || itServices[0];
                            handleQuoteRequest(selectedService);
                          }}
                          colorScheme="brand"
                          size="md"
                          width="full"
                          variant={pkg.popular ? "solid" : "outline"}
                        >
                          Escolher Plano
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>

            {/* CTA Section */}
            <Box
              textAlign="center"
              bg="brand.50"
              borderRadius="3xl"
              p={{ base: 8, md: 12, lg: 16 }}
              maxW="4xl"
              mx="auto"
              border="1px solid"
              borderColor="brand.100"
              w="full"
            >
              <VStack spacing={6}>
                <Heading size="lg" color="brand.700">
                  Pronto para Transformar sua TI?
                </Heading>
                <Text
                  fontSize="lg"
                  color={textColor}
                  maxW="2xl"
                  mx="auto"
                >
                  Entre em contato e receba um orçamento personalizado em até 2 horas
                </Text>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  spacing={4}
                  justify="center"
                >
                  <Button
                    as={RouterLink}
                    to="/orcamento"
                    size="lg"
                    colorScheme="brand"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="xl"
                    rightIcon={<Icon as={FaArrowRight} />}
                    _hover={{
                      transform: 'translateY(-3px)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.3s"
                  >
                    Solicitar Orçamento Gratuito
                  </Button>
                  <Button
                    as="a"
                    href="https://wa.me/5554997109051"
                    target="_blank"
                    size="lg"
                    variant="outline"
                    colorScheme="brand"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="semibold"
                    borderRadius="xl"
                    leftIcon={<Icon as={FaWhatsapp} />}
                    _hover={{
                      transform: 'translateY(-3px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s"
                  >
                    Falar no WhatsApp
                  </Button>
                </Stack>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default ITServices;
