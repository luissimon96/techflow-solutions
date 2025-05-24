import { Box, Button, Container, Heading, Text, Stack, Image, SimpleGrid, Icon, useColorModeValue, Flex, VStack, useColorMode } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaUsers, FaShieldAlt, FaCode, FaMobileAlt, FaBuilding } from 'react-icons/fa';
import { ClientCarousel } from '@/components/common/ClientCarousel';

const MotionBox = motion(Box);

export function Home() {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="brand.500"
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={8}
            align="center"
          >
            <Stack flex={1} spacing={6}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  Transformando ideias em soluções digitais inovadoras
                </Heading>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Text fontSize="xl" opacity={0.9}>
                  Desenvolvemos soluções tecnológicas personalizadas para impulsionar
                  o crescimento do seu negócio com qualidade e inovação.
                </Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/contato"
                    size="lg"
                    colorScheme="whiteAlpha"
                    _hover={{ bg: 'whiteAlpha.900' }}
                  >
                    Fale Conosco
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/servicos"
                    size="lg"
                    variant="outline"
                    color="white"
                    borderColor="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    Nossos Serviços
                  </Button>
                </Stack>
              </MotionBox>
            </Stack>

            <MotionBox
              flex={1}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Image
                src="/hero-image.svg"
                alt="TechFlow Solutions"
                fallbackSrc="https://via.placeholder.com/600x400"
                maxW="100%"
                h="auto"
              />
            </MotionBox>
          </Stack>
        </Container>
      </Box>

      {/* Services Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Stack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Nossos Serviços
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Soluções completas para transformar sua visão em realidade
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {services.map((service, index) => (
                <MotionBox
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
                >
                  <Stack spacing={4}>
                    <Icon as={service.icon} w={10} h={10} color="brand.500" />
                    <Heading as="h3" size="md">
                      {service.title}
                    </Heading>
                    <Text color={textColor}>
                      {service.description}
                    </Text>
                  </Stack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Client Carousel */}
      <ClientCarousel />

      {/* Differentiators Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Stack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Por que escolher a TechFlow?
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Compromisso com qualidade e resultados
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {diferenciais.map((diferencial, index) => (
                <MotionBox
                  key={diferencial.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  textAlign="center"
                >
                  <Stack spacing={4}>
                    <Icon as={diferencial.icon} w={12} h={12} color="brand.500" mx="auto" />
                    <Heading as="h3" size="md">
                      {diferencial.title}
                    </Heading>
                    <Text color={textColor}>
                      {diferencial.description}
                    </Text>
                  </Stack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Clientes Section */}
      <Box py={20} bg={bgColor}>
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Stack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Empresas que confiam em nós
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Parceiros que já transformaram seus negócios com nossas soluções
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {clientes.map((cliente, index) => (
                <MotionBox
                  key={cliente.nome}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
                >
                  <Stack spacing={4}>
                    <Flex justify="center" align="center" h="100px">
                      <Image
                        src={cliente.logo}
                        alt={cliente.nome}
                        maxH="80px"
                        objectFit="contain"
                        fallbackSrc="https://via.placeholder.com/200x80"
                      />
                    </Flex>
                    <VStack spacing={2}>
                      <Heading as="h3" size="md" textAlign="center">
                        {cliente.nome}
                      </Heading>
                      <Text color={textColor} textAlign="center" fontSize="sm">
                        {cliente.descricao}
                      </Text>
                    </VStack>
                  </Stack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="brand.500" color="white">
        <Container maxW="container.xl">
          <Stack spacing={8} align="center" textAlign="center">
            <Heading as="h2" size="xl">
              Pronto para transformar seu negócio?
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              Entre em contato conosco hoje mesmo e descubra como podemos ajudar
              sua empresa a alcançar novos patamares de sucesso.
            </Text>
            <Button
              as={RouterLink}
              to="/contato"
              size="lg"
              colorScheme="whiteAlpha"
              _hover={{ bg: 'whiteAlpha.900' }}
            >
              Fale Conosco
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

const services = [
  {
    title: 'Desenvolvimento Web',
    description: 'Criamos sites e aplicações web modernas, responsivas e otimizadas para SEO.',
    icon: FaCode,
  },
  {
    title: 'Aplicativos Móveis',
    description: 'Desenvolvemos aplicativos nativos e híbridos para iOS e Android.',
    icon: FaMobileAlt,
  },
  {
    title: 'Consultoria Técnica',
    description: 'Oferecemos consultoria especializada em tecnologia e transformação digital.',
    icon: FaChartLine,
  },
  {
    title: 'Gestão de Projetos',
    description: 'Gerenciamos seus projetos com metodologias ágeis e práticas modernas.',
    icon: FaRocket,
  },
  {
    title: 'Suporte Contínuo',
    description: 'Garantimos suporte e manutenção contínua para suas soluções.',
    icon: FaUsers,
  },
  {
    title: 'Segurança Digital',
    description: 'Implementamos as melhores práticas de segurança para proteger seus dados.',
    icon: FaShieldAlt,
  },
];

const diferenciais = [
  {
    title: 'Experiência',
    description: 'Equipe altamente qualificada com vasta experiência no mercado.',
    icon: FaUsers,
  },
  {
    title: 'Inovação',
    description: 'Sempre à frente com as últimas tecnologias e tendências.',
    icon: FaRocket,
  },
  {
    title: 'Qualidade',
    description: 'Compromisso com a excelência em todas as entregas.',
    icon: FaShieldAlt,
  },
  {
    title: 'Resultados',
    description: 'Foco em entregar valor real para o seu negócio.',
    icon: FaChartLine,
  },
];

const clientes = [
  {
    nome: 'Magazine Luiza',
    logo: '/logos/magalu.svg',
    descricao: 'Parceria estratégica em transformação digital e e-commerce',
  },
  {
    nome: 'Magalu Tech',
    logo: '/logos/magalu-tech.svg',
    descricao: 'Desenvolvimento de soluções tecnológicas inovadoras',
  },
  {
    nome: 'Kabum',
    logo: '/logos/kabum.svg',
    descricao: 'Soluções em e-commerce e marketplace',
  },
  {
    nome: 'Telefônica',
    logo: '/logos/telefonica.svg',
    descricao: 'Parceria em projetos de telecomunicações',
  },
  {
    nome: 'Vivo',
    logo: '/logos/vivo.svg',
    descricao: 'Desenvolvimento de aplicações móveis e web',
  },
]; 