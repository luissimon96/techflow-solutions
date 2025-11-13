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
  Link,
  Badge,
  Stack,
  Icon,
  Image
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaGithub, FaCalendarAlt, FaCode, FaStar } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const portfolioData = {
  stats: {
    projects: '15+',
    clients: '10+',
    experience: '10',
    satisfaction: '100%'
  },
  featuredProjects: [
    {
      title: 'TechFlow Solutions',
      description: 'Site institucional da empresa com design moderno, sistema de orçamentos e integração WhatsApp. Desenvolvido com React, TypeScript e Chakra UI.',
      image: '/placeholder-project1.jpg',
      technologies: ['React', 'TypeScript', 'Chakra UI', 'Vite'],
      liveUrl: 'https://techflow-solutions.vercel.app',
      githubUrl: 'https://github.com/luissimon96/techflow-solutions',
      category: 'Website Institucional',
      year: '2024',
      featured: true
    },
    {
      title: 'Sistema de Exames',
      description: 'Plataforma completa para gestão de exames médicos com dashboard administrativo, agendamento e relatórios em tempo real.',
      image: '/placeholder-project2.jpg',
      technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      liveUrl: 'https://sistema-exames.vercel.app',
      githubUrl: '#',
      category: 'Sistema Web',
      year: '2024',
      featured: true
    },
    {
      title: 'TimeMedic',
      description: 'Sistema de gestão de medicamentos com foco em segurança, lembretes automáticos e controle de estoque para farmácias.',
      image: '/placeholder-project3.jpg',
      technologies: ['TypeScript', 'React', 'Firebase', 'PWA'],
      liveUrl: '#',
      githubUrl: 'https://github.com/luissimon96/timemedic',
      category: 'Aplicação Web',
      year: '2024',
      featured: false
    },
    {
      title: 'Estradeirando',
      description: 'Site oficial do projeto Estradeirando com galeria de fotos, blog e sistema de contato integrado.',
      image: '/placeholder-project4.jpg',
      technologies: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
      liveUrl: 'https://estradeirando.vercel.app',
      githubUrl: '#',
      category: 'Website',
      year: '2024',
      featured: false
    },
    {
      title: 'AI Migration Validator',
      description: 'Sistema de validação de migração com IA para QA automatizado inteligente, reduzindo erros em 90%.',
      image: '/placeholder-project5.jpg',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
      liveUrl: '#',
      githubUrl: 'https://github.com/luissimon96/AI-Powered-Migration-Validation-System',
      category: 'IA & Machine Learning',
      year: '2024',
      featured: false
    },
    {
      title: 'E-commerce Platform',
      description: 'Plataforma de e-commerce completa com carrinho, pagamentos, gestão de produtos e dashboard administrativo.',
      image: '/placeholder-project6.jpg',
      technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
      liveUrl: '#',
      githubUrl: '#',
      category: 'E-commerce',
      year: '2023',
      featured: false
    }
  ]
};

const categories = ['Todos', 'Website', 'Sistema Web', 'E-commerce', 'IA & Machine Learning'];

export default function Portfolio() {
  const featuredProjects = portfolioData.featuredProjects.filter(project => project.featured);
  const allProjects = portfolioData.featuredProjects;

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
              Nosso Portfólio
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color="gray.600" 
              maxW="3xl"
              mx="auto"
              lineHeight="tall"
              fontWeight="medium"
            >
              Conheça alguns dos projetos que desenvolvemos com tecnologias modernas e soluções inovadoras
            </Text>
          </Box>

          {/* Stats Section */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full" maxW="4xl">
            <VStack spacing={2}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                {portfolioData.stats.projects}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Projetos Concluídos
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                {portfolioData.stats.clients}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Clientes Satisfeitos
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                {portfolioData.stats.experience}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Anos de Experiência
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.600">
                {portfolioData.stats.satisfaction}
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Satisfação
              </Text>
            </VStack>
          </SimpleGrid>

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
                  bg="white"
                  borderRadius="xl"
                  boxShadow="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ 
                    transform: 'translateY(-8px)', 
                    boxShadow: '2xl',
                    borderColor: 'brand.200'
                  }}
                  transition="all 0.3s"
                  overflow="hidden"
                >
                  <Box position="relative">
                    {/* Placeholder para imagem do projeto */}
                    <Box
                      h="200px"
                      bg="gradient-to-br"
                      bgGradient="linear(135deg, brand.400, brand.600)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FaCode} boxSize={12} color="white" opacity={0.7} />
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
                      Destaque
                    </Badge>
                  </Box>
                  <CardBody p={6}>
                    <VStack spacing={4} align="start">
                      <VStack spacing={2} align="start" w="full">
                        <Heading size="md" color="gray.800">
                          {project.title}
                        </Heading>
                        <Stack direction="row" spacing={2}>
                          <Badge variant="subtle" colorScheme="purple">
                            {project.category}
                          </Badge>
                          <Badge variant="outline" colorScheme="gray">
                            {project.year}
                          </Badge>
                        </Stack>
                      </VStack>
                      
                      <Text color="gray.600" lineHeight="relaxed">
                        {project.description}
                      </Text>
                      
                      <Stack direction="row" flexWrap="wrap" spacing={2}>
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
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
                        {project.technologies.length > 3 && (
                          <Badge 
                            variant="subtle"
                            colorScheme="gray"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </Stack>
                      
                      <Stack direction="row" spacing={3} pt={2}>
                        {project.liveUrl !== '#' && (
                          <Button
                            as={Link}
                            href={project.liveUrl}
                            isExternal
                            size="sm"
                            colorScheme="brand"
                            leftIcon={<FaExternalLinkAlt />}
                            _hover={{ transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            Ver Projeto
                          </Button>
                        )}
                        {project.githubUrl !== '#' && (
                          <Button
                            as={Link}
                            href={project.githubUrl}
                            isExternal
                            size="sm"
                            variant="outline"
                            colorScheme="gray"
                            leftIcon={<FaGithub />}
                            _hover={{ transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                          >
                            GitHub
                          </Button>
                        )}
                      </Stack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* All Projects */}
          <Box w="full" maxW="6xl" mx="auto">
            <Heading 
              size="lg" 
              mb={8} 
              textAlign="center" 
              color="gray.800"
            >
              Todos os Projetos
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {allProjects.map((project, index) => (
                <Card 
                  key={index}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    boxShadow: 'lg',
                    borderColor: 'brand.200'
                  }}
                  transition="all 0.3s"
                  overflow="hidden"
                >
                  <Box
                    h="150px"
                    bg="gradient-to-br"
                    bgGradient={`linear(135deg, ${project.featured ? 'brand.400, brand.600' : 'gray.400, gray.600'})`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaCode} boxSize={8} color="white" opacity={0.7} />
                  </Box>
                  <CardBody p={4}>
                    <VStack spacing={3} align="start">
                      <VStack spacing={1} align="start" w="full">
                        <Heading size="sm" color="gray.800">
                          {project.title}
                        </Heading>
                        <Badge variant="subtle" colorScheme="purple" fontSize="xs">
                          {project.category}
                        </Badge>
                      </VStack>
                      
                      <Text color="gray.600" fontSize="sm" lineHeight="relaxed">
                        {project.description.substring(0, 80)}...
                      </Text>
                      
                      <Stack direction="row" spacing={2} pt={1}>
                        {project.liveUrl !== '#' && (
                          <Button
                            as={Link}
                            href={project.liveUrl}
                            isExternal
                            size="xs"
                            colorScheme="brand"
                            leftIcon={<FaExternalLinkAlt />}
                          >
                            Ver
                          </Button>
                        )}
                        {project.githubUrl !== '#' && (
                          <Button
                            as={Link}
                            href={project.githubUrl}
                            isExternal
                            size="xs"
                            variant="outline"
                            leftIcon={<FaGithub />}
                          >
                            Code
                          </Button>
                        )}
                      </Stack>
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
              <Heading size="lg" color="brand.700">
                Gostou do que viu?
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                maxW="2xl"
                mx="auto"
              >
                Vamos conversar sobre como podemos transformar suas ideias em soluções digitais incríveis.
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