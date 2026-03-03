import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  Icon,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  Flex
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaCode,
  FaCloud,
  FaMobile,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaWhatsapp,
  FaArrowRight
} from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Animated Counter Component
function AnimatedCounter({ endValue, suffix = '', duration = 2000 }: {
  endValue: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(endValue * easeOutCubic));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [endValue, duration, inView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Service Card Component
function ServiceCard({
  icon,
  title,
  description,
  technologies,
  index
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  technologies: string[];
  index: number;
}) {
  return (
    <MotionBox
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="base"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
      overflow="hidden"
      cursor="pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -5,
        boxShadow: "lg",
        borderColor: "brand.300"
      }}
    >
      <VStack spacing={4} align="start" textAlign="left">
        <Box
          bg="brand.50"
          p={4}
          borderRadius="xl"
          display="inline-flex"
        >
          <Icon as={icon} boxSize={8} color="brand.500" />
        </Box>
        <VStack spacing={2} align="start">
          <Heading size="lg" color="gray.800">
            {title}
          </Heading>
          <Text color="gray.600" fontSize="md" lineHeight="tall">
            {description}
          </Text>
        </VStack>
        <HStack spacing={2} flexWrap="wrap">
          {technologies.map((tech) => (
            <Badge
              key={tech}
              colorScheme="blue"
              variant="subtle"
              fontSize="xs"
              px={2}
              py={1}
            >
              {tech}
            </Badge>
          ))}
        </HStack>
      </VStack>

      {/* Hover effect gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-br, brand.500, brand.600)"
        opacity={0}
        transition="all 0.3s ease"
        _groupHover={{ opacity: 0.05 }}
        pointerEvents="none"
      />
    </MotionBox>
  );
}

export default function Home() {
  const services = [
    {
      icon: FaCode,
      title: "Desenvolvimento Personalizado",
      description: "Criamos soluções sob medida que atendem às necessidades específicas do seu negócio, garantindo eficiência e escalabilidade.",
      technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"]
    },
    {
      icon: FaCloud,
      title: "Migração para Nuvem",
      description: "Modernizamos sua infraestrutura com migração segura para a nuvem, reduzindo custos e aumentando a performance.",
      technologies: ["AWS", "Azure", "Docker", "Kubernetes"]
    },
    {
      icon: FaMobile,
      title: "Aplicativos Mobile",
      description: "Desenvolvemos aplicativos nativos e cross-platform que proporcionam uma experiência excepcional aos seus usuários.",
      technologies: ["React Native", "Flutter", "iOS", "Android"]
    }
  ];

  return (
    <Box>
      {/* Professional Hero Section */}
      <Box
        bgGradient="linear(to-br, gray.50, white, gray.50)"
        py={{ base: 20, md: 28 }}
        position="relative"
        overflow="hidden"
      >
        <Container>
          <MotionVStack
            spacing={8}
            align="center"
            textAlign="center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Professional Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Badge
                colorScheme="brand"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="semibold"
              >
                <Icon as={FaRocket} mr={2} />
                Transformação Digital Especializada
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Heading
                as="h1"
                size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                maxW="4xl"
                lineHeight="shorter"
                bgGradient="linear(to-r, brand.600, brand.400)"
                bgClip="text"
                fontWeight="extrabold"
                textShadow="0 2px 4px rgba(0,0,0,0.1)"
                letterSpacing="tight"
              >
                Desenvolva o Futuro do Seu Negócio com Soluções Sob Medida
              </Heading>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                maxW="3xl"
                color="gray.600"
                lineHeight="tall"
                fontWeight="medium"
              >
                Impulsionamos empresas através de tecnologia de ponta, entregando soluções que
                transformam processos, aumentam a eficiência e aceleram o crescimento do seu negócio.
              </Text>
            </motion.div>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mt={2}>
                <Button
                  as={RouterLink}
                  to="/orcamento"
                  size="lg"
                  colorScheme="brand"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "xl"
                  }}
                  rightIcon={<FaArrowRight />}
                  fontWeight="semibold"
                >
                  Começar Projeto
                </Button>
                <Button
                  as={RouterLink}
                  to="/clientes"
                  size="lg"
                  variant="outline"
                  colorScheme="brand"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "md"
                  }}
                >
                  Ver Projetos
                </Button>
              </SimpleGrid>
            </motion.div>
          </MotionVStack>
        </Container>
      </Box>

      {/* Trust Signals & Statistics */}
      <Box bg="white" py={16} boxShadow="lg">
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
              <Stat textAlign="center">
                <StatNumber fontSize="4xl" fontWeight="bold" color="brand.500">
                  <AnimatedCounter endValue={50} suffix="+" />
                </StatNumber>
                <StatLabel fontSize="sm" color="gray.600" fontWeight="medium">
                  Projetos Entregues
                </StatLabel>
              </Stat>
              <Stat textAlign="center">
                <StatNumber fontSize="4xl" fontWeight="bold" color="brand.500">
                  <AnimatedCounter endValue={98} suffix="%" />
                </StatNumber>
                <StatLabel fontSize="sm" color="gray.600" fontWeight="medium">
                  Satisfação Cliente
                </StatLabel>
              </Stat>
              <Stat textAlign="center">
                <StatNumber fontSize="4xl" fontWeight="bold" color="brand.500">
                  <AnimatedCounter endValue={5} suffix="+" />
                </StatNumber>
                <StatLabel fontSize="sm" color="gray.600" fontWeight="medium">
                  Anos Experiência
                </StatLabel>
              </Stat>
              <Stat textAlign="center">
                <StatNumber fontSize="4xl" fontWeight="bold" color="brand.500">
                  24/7
                </StatNumber>
                <StatLabel fontSize="sm" color="gray.600" fontWeight="medium">
                  Suporte Técnico
                </StatLabel>
              </Stat>
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>

      {/* Enhanced Services Section */}
      <Box py={20} bg="gray.50">
        <Container>
          <VStack spacing={16}>
            <MotionVStack
              spacing={4}
              textAlign="center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Heading size="2xl" color="gray.800">
                Soluções Especializadas
              </Heading>
              <Text
                fontSize="xl"
                color="gray.600"
                maxW="3xl"
                lineHeight="tall"
              >
                Oferecemos um portfólio completo de serviços de tecnologia,
                desde desenvolvimento personalizado até migração para nuvem.
              </Text>
            </MotionVStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  technologies={service.technologies}
                  index={index}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        bgGradient="linear(to-r, gray.800, gray.900)"
        color="white"
        py={20}
      >
        <Container>
          <MotionVStack
            spacing={8}
            textAlign="center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={4}>
              <Heading
                size="2xl"
                fontWeight="bold"
                color="white"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                Pronto para Transformar seu Negócio?
              </Heading>
              <Text
                fontSize="xl"
                maxW="2xl"
                color="white"
                fontWeight="medium"
                textShadow="0 1px 3px rgba(0,0,0,0.3)"
              >
                Entre em contato conosco e descubra como podemos acelerar o crescimento
                da sua empresa com soluções tecnológicas inovadoras.
              </Text>
            </VStack>

            <Flex
              direction={{ base: 'column', sm: 'row' }}
              gap={4}
              align="center"
            >
              <Button
                as="a"
                href={getWhatsAppUrl('Olá! Gostaria de falar com um especialista sobre transformação digital.')}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                colorScheme="green"
                leftIcon={<FaWhatsapp />}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "xl"
                }}
                fontWeight="semibold"
              >
                Falar com Especialista
              </Button>
              <Button
                as={RouterLink}
                to="/orcamento"
                size="lg"
                variant="outline"
                borderColor="whiteAlpha.400"
                color="white"
                _hover={{
                  bg: "whiteAlpha.200",
                  borderColor: "whiteAlpha.600",
                  transform: "translateY(-2px)"
                }}
              >
                Orçamento Online
              </Button>
            </Flex>
          </MotionVStack>
        </Container>
      </Box>
    </Box>
  );
} 