import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Stack,
  Badge,
  Card,
  CardBody,
  Icon,
  Button,
  Link,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import {
  FaMapMarkerAlt,
  FaAward,
  FaLaptopCode,
  FaMobileAlt,
  FaServer,
  FaCheckCircle,
  FaRocket,
  FaHeartbeat,
  FaUsers,
  FaHandshake
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const companyData = {
  name: 'TechFlow Solutions',
  tagline: 'Transformando ideias em soluções tecnológicas inovadoras',
  location: 'Foz do Iguaçu, Paraná - Brasil',
  founded: '2015',
  description: 'Especializada em oferecer serviços tecnológicos de alto padrão para pequenas e grandes empresas. Com uma equipe dedicada de profissionais, transformamos desafios digitais em oportunidades de crescimento.',
  stats: {
    clients: '150+',
    projects: '250+',
    yearsExperience: '10+'
  }
};

const values = [
  {
    title: 'Inovação',
    description: 'Buscamos constantemente novas tecnologias e metodologias para oferecer as melhores soluções',
    icon: FaRocket
  },
  {
    title: 'Excelência',
    description: 'Comprometidos com a qualidade em cada projeto, entrega e interação',
    icon: FaAward
  },
  {
    title: 'Confiabilidade',
    description: 'Somos parceiros de confiança com suporte técnico sempre disponível',
    icon: FaHeartbeat
  },
  {
    title: 'Transparência',
    description: 'Comunicação clara e honesta em todas as etapas do projeto',
    icon: FaHandshake
  }
];

const serviceCategories = [
  {
    title: 'Manutenção de TI & Suporte Técnico',
    description: 'Suporte proativo para manter seus sistemas funcionando com máximo desempenho',
    icon: FaServer,
    features: [
      'Manutenção de Computadores & Servidores',
      'Suporte Técnico 24/7',
      'Monitoramento de Sistemas',
      'Backup e Recuperação de Dados',
      'Segurança de Rede',
      'Consultoria Técnica'
    ]
  },
  {
    title: 'Desenvolvimento de Sistemas & Sites',
    description: 'Criamos soluções web personalizadas com as tecnologias mais modernas do mercado',
    icon: FaLaptopCode,
    features: [
      'Desenvolvimento Web Full-Stack',
      'Aplicações E-commerce',
      'Dashboards e Painéis Analíticos',
      'PWAs e Aplicações Responsivas',
      'Integração com APIs',
      'SEO Otimizado'
    ]
  },
  {
    title: 'Desenvolvimento Mobile',
    description: 'Aplicativos móveis nativos e híbridos para iOS e Android',
    icon: FaMobileAlt,
    features: [
      'Apps para iOS e Android',
      'React Native & Flutter',
      'Push Notifications',
      'Sincronização em tempo real',
      'Integração com APIs',
      'Deploy nas App Stores'
    ]
  }
];

const missionVision = [
  {
    title: 'Nossa Missão',
    content: 'Empoderar empresas de todos os tamanhos com soluções tecnológicas inovadoras, confiáveis e personalizadas que impulsionam crescimento digital e transformação empresarial.'
  },
  {
    title: 'Nossa Visão',
    content: 'Ser a principal parceira de tecnologia para empresas na região, reconhecida pela excelência, inovação e comprometimento com o sucesso de nossos clientes.'
  }
];

export default function About() {
  return (
    <Box
      as="section"
      minH="100vh"
      pt={{ base: 32, md: 40, lg: 44 }}
      pb={{ base: 16, md: 20, lg: 24 }}
      bg="gradient-to-b"
      bgGradient="linear(to-br, gray.50, white, gray.50)"
    >
      <Container maxW={{ base: "container.sm", md: "container.md", lg: "container.lg", xl: "container.xl" }}>
        <VStack spacing={{ base: 12, md: 16, lg: 20 }}>
          {/* Hero Section */}
          <Box textAlign="center" maxW="5xl" mx="auto" px={{ base: 4, md: 6 }}>
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              mb={{ base: 6, md: 8 }}
              bgGradient="linear(to-r, brand.600, brand.400)"
              bgClip="text"
              fontWeight="extrabold"
              lineHeight="shorter"
              letterSpacing="tight"
            >
              Sobre a TechFlow Solutions
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color="gray.600"
              maxW="3xl"
              mx="auto"
              lineHeight="tall"
              fontWeight="medium"
            >
              {companyData.tagline}
            </Text>
          </Box>

          {/* Company Info Section */}
          <Card
            w="full"
            maxW="4xl"
            mx="auto"
            p={{ base: 6, md: 8, lg: 10 }}
            bg="white"
            borderRadius="3xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="gray.100"
          >
            <CardBody>
              <VStack spacing={8}>
                {/* Logo and Basic Info */}
                <VStack spacing={6}>
                  <Box
                    w={24}
                    h={24}
                    bg="white"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="3px solid"
                    borderColor="brand.500"
                    boxShadow="xl"
                    p={2}
                  >
                    <Image
                      src="/logos/favicon.png"
                      alt="TechFlow Solutions"
                      loading="eager"
                      width="76"
                      height="76"
                      h="80%"
                      objectFit="contain"
                    />
                  </Box>
                  <VStack spacing={2} textAlign="center">
                    <Heading size="xl" color="gray.800">
                      {companyData.name}
                    </Heading>
                    <HStack spacing={4} fontSize="sm" color="gray.600" justify="center" flexWrap="wrap">
                      <HStack spacing={1}>
                        <Icon as={FaMapMarkerAlt} />
                        <Text>{companyData.location}</Text>
                      </HStack>
                      <Text>•</Text>
                      <Text fontWeight="semibold">Desde {companyData.founded}</Text>
                    </HStack>
                  </VStack>
                </VStack>

                <Divider />

                {/* Description */}
                <Box textAlign="center" maxW="3xl">
                  <Text fontSize="lg" color="gray.700" lineHeight="tall">
                    {companyData.description}
                  </Text>
                </Box>

                {/* Stats */}
                <SimpleGrid columns={3} spacing={8} w="full" maxW="md">
                  <VStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                      {companyData.stats.clients}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Clientes Atendidos
                    </Text>
                  </VStack>
                  <VStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                      {companyData.stats.projects}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Projetos Realizados
                    </Text>
                  </VStack>
                  <VStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                      {companyData.stats.yearsExperience}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Anos Experiência
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Mission & Vision Section */}
          <Box w="full" maxW="6xl" mx="auto">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {missionVision.map((item, index) => (
                <Card
                  key={index}
                  p={8}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                    borderColor: 'brand.200'
                  }}
                  transition="all 0.3s"
                >
                  <CardBody p={0}>
                    <VStack spacing={4} align="start">
                      <Heading size="md" color="brand.600">
                        {item.title}
                      </Heading>
                      <Text color="gray.600" lineHeight="relaxed" fontSize="md">
                        {item.content}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Values Section */}
          <Box w="full" maxW="6xl" mx="auto">
            <Heading
              size="lg"
              mb={8}
              textAlign="center"
              color="gray.800"
            >
              Nossos Valores
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {values.map((value, index) => (
                <Card
                  key={index}
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                    borderColor: 'brand.200'
                  }}
                  transition="all 0.3s"
                >
                  <CardBody p={0}>
                    <VStack spacing={4} align="center">
                      <Icon
                        as={value.icon}
                        w={10}
                        h={10}
                        color="brand.500"
                      />
                      <Heading size="sm" textAlign="center" color="gray.800">
                        {value.title}
                      </Heading>
                      <Text
                        color="gray.600"
                        fontSize="sm"
                        lineHeight="relaxed"
                        textAlign="center"
                      >
                        {value.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Services Section */}
          <Box w="full" maxW="6xl" mx="auto">
            <Heading
              size="lg"
              mb={8}
              textAlign="center"
              color="gray.800"
            >
              Nossos Serviços
            </Heading>
            <VStack spacing={8} w="full">
              {serviceCategories.map((service, index) => (
                <Card
                  key={index}
                  w="full"
                  p={{ base: 6, md: 8 }}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{
                    boxShadow: 'xl',
                    borderColor: 'brand.200'
                  }}
                  transition="all 0.3s"
                >
                  <CardBody p={0}>
                    <VStack spacing={6} align="start">
                      <HStack spacing={4} pb={4} borderBottom="1px solid" borderColor="gray.100">
                        <Icon
                          as={service.icon}
                          w={8}
                          h={8}
                          color="brand.500"
                        />
                        <VStack spacing={1} align="start">
                          <Heading size="md" color="gray.800">
                            {service.title}
                          </Heading>
                          <Text color="gray.600">
                            {service.description}
                          </Text>
                        </VStack>
                      </HStack>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                        {service.features.map((feature, featureIndex) => (
                          <HStack key={featureIndex} spacing={3}>
                            <Icon as={FaCheckCircle} color="brand.500" />
                            <Text color="gray.600" fontSize="sm">
                              {feature}
                            </Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
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
          >
            <VStack spacing={6}>
              <HStack spacing={2} justify="center">
                <Icon as={FaRocket} color="brand.500" />
                <Heading size="lg" color="brand.700">
                  Vamos transformar seu negócio?
                </Heading>
              </HStack>
              <Text
                fontSize="lg"
                color="gray.600"
                maxW="2xl"
                mx="auto"
              >
                Com mais de 10 anos de experiência, somos o parceiro ideal para impulsionar sua transformação digital. Entre em contato e descubra como podemos ajudar!
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
                  _hover={{
                    transform: 'translateY(-3px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                >
                  Solicitar Orçamento
                </Button>
                <Button
                  as={RouterLink}
                  to="/contato"
                  size="lg"
                  variant="outline"
                  colorScheme="brand"
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
                  Entrar em Contato
                </Button>
              </Stack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}