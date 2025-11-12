import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Avatar, 
  Stack, 
  Badge, 
  Card, 
  CardBody, 
  Icon, 
  Button,
  Link,
  Divider
} from '@chakra-ui/react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaCode, 
  FaUsers, 
  FaCalendarAlt,
  FaPlane
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const aboutData = {
  name: 'Luís Eduardo Simon',
  title: 'Desenvolvedor Full-Stack & Founder da TechFlow Solutions',
  bio: 'Com mais de 10 anos de experiência no setor de tecnologia, acredito em ser protagonista do meu próprio presente e futuro. Minha paixão é viajar.',
  location: 'Carazinho, RS - Brasil',
  company: 'Telefonica Brasil',
  avatar: 'https://avatars.githubusercontent.com/u/55896446?v=4',
  github: 'https://github.com/luissimon96',
  linkedin: 'https://www.linkedin.com/in/luis-eduardo-simon/',
  stats: {
    experience: '10+',
    projects: '44',
    followers: '13'
  }
};

const featuredProjects = [
  {
    name: 'TechFlow Solutions',
    description: 'Site institucional da TechFlow Solutions, uma empresa especializada em desenvolvimento de software e soluções tecnológicas.',
    language: 'TypeScript',
    url: 'https://techflow-solutions.vercel.app',
    featured: true
  },
  {
    name: 'TimeMedic',
    description: 'Sistema de gestão de medicamentos com foco em segurança',
    language: 'TypeScript',
    featured: false
  },
  {
    name: 'AI-Powered Migration Validation',
    description: 'Sistema de Validação de Migração por IA... QA (Quality Assurance) Automatizado Inteligente',
    language: 'Python',
    featured: false
  },
  {
    name: 'Estradeirando',
    description: 'Site oficial do estradeirando',
    language: 'TypeScript',
    url: 'https://estradeirando.vercel.app',
    featured: false
  }
];

const skills = [
  { category: 'Frontend', technologies: ['React', 'TypeScript', 'Next.js', 'Chakra UI', 'Vue.js'] },
  { category: 'Backend', technologies: ['Node.js', 'Python', 'Express', 'PostgreSQL', 'Firebase'] },
  { category: 'Mobile', technologies: ['React Native', 'Expo', 'Flutter'] },
  { category: 'DevOps', technologies: ['AWS', 'Docker', 'Vercel', 'Git', 'CI/CD'] }
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
              textShadow="0 2px 4px rgba(0,0,0,0.1)"
              letterSpacing="tight"
            >
              Sobre Nós
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color="gray.600" 
              maxW="3xl"
              mx="auto"
              lineHeight="tall"
              fontWeight="medium"
            >
              Conheça a história por trás da TechFlow Solutions e a experiência que nos move
            </Text>
          </Box>

          {/* Profile Section */}
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
                {/* Avatar and Basic Info */}
                <VStack spacing={6}>
                  <Avatar 
                    size="2xl" 
                    src={aboutData.avatar} 
                    name={aboutData.name}
                    border="4px solid"
                    borderColor="brand.500"
                    boxShadow="xl"
                  />
                  <VStack spacing={2} textAlign="center">
                    <Heading size="xl" color="gray.800">
                      {aboutData.name}
                    </Heading>
                    <Text fontSize="lg" color="brand.600" fontWeight="semibold">
                      {aboutData.title}
                    </Text>
                    <HStack spacing={4} fontSize="sm" color="gray.600">
                      <HStack spacing={1}>
                        <Icon as={FaMapMarkerAlt} />
                        <Text>{aboutData.location}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FaBuilding} />
                        <Text>{aboutData.company}</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </VStack>

                <Divider />

                {/* Bio */}
                <Box textAlign="center" maxW="3xl">
                  <Text fontSize="lg" color="gray.700" lineHeight="tall">
                    {aboutData.bio}
                  </Text>
                </Box>

                {/* Stats */}
                <SimpleGrid columns={3} spacing={8} w="full" maxW="md">
                  <VStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                      {aboutData.stats.experience}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Anos de Experiência
                    </Text>
                  </VStack>
                  <VStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                      {aboutData.stats.projects}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Projetos no GitHub
                    </Text>
                  </VStack>
                  <VStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                      {aboutData.stats.followers}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Seguidores
                    </Text>
                  </VStack>
                </SimpleGrid>

                {/* Social Links */}
                <HStack spacing={4}>
                  <Button
                    as={Link}
                    href={aboutData.github}
                    isExternal
                    leftIcon={<FaGithub />}
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    GitHub
                  </Button>
                  <Button
                    as={Link}
                    href={aboutData.linkedin}
                    isExternal
                    leftIcon={<FaLinkedin />}
                    colorScheme="linkedin"
                    size="lg"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    LinkedIn
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Skills Section */}
          <Box w="full" maxW="6xl" mx="auto">
            <Heading 
              size="lg" 
              mb={8} 
              textAlign="center" 
              color="gray.800"
            >
              Tecnologias & Especialidades
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {skills.map((skillGroup, index) => (
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
                    <VStack spacing={4} align="start">
                      <Heading size="md" color="brand.600">
                        {skillGroup.category}
                      </Heading>
                      <Stack direction="column" spacing={2} w="full">
                        {skillGroup.technologies.map((tech, techIndex) => (
                          <Badge 
                            key={techIndex}
                            variant="subtle"
                            colorScheme="brand"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </Stack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Featured Projects */}
          <Box w="full" maxW="6xl" mx="auto">
            <Heading 
              size="lg" 
              mb={8} 
              textAlign="center" 
              color="gray.800"
            >
              Projetos em Destaque
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {featuredProjects.map((project, index) => (
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
                  position="relative"
                  overflow="hidden"
                >
                  {project.featured && (
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
                      fontWeight="bold"
                    >
                      Destaque
                    </Badge>
                  )}
                  <CardBody p={0}>
                    <VStack spacing={4} align="start">
                      <VStack spacing={2} align="start" w="full">
                        <Heading size="md" color="gray.800">
                          {project.name}
                        </Heading>
                        <Badge variant="subtle" colorScheme="purple">
                          {project.language}
                        </Badge>
                      </VStack>
                      <Text color="gray.600" lineHeight="relaxed">
                        {project.description}
                      </Text>
                      {project.url && (
                        <Button
                          as={Link}
                          href={project.url}
                          isExternal
                          size="sm"
                          variant="outline"
                          colorScheme="brand"
                          _hover={{ transform: 'translateY(-2px)' }}
                          transition="all 0.2s"
                        >
                          Ver Projeto
                        </Button>
                      )}
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
          >
            <VStack spacing={6}>
              <HStack spacing={2} justify="center">
                <Icon as={FaPlane} color="brand.500" />
                <Heading size="lg" color="brand.700">
                  Vamos trabalhar juntos?
                </Heading>
              </HStack>
              <Text
                fontSize="lg"
                color="gray.600"
                maxW="2xl"
                mx="auto"
              >
                Com mais de 10 anos de experiência, estou pronto para transformar suas ideias em soluções tecnológicas inovadoras.
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