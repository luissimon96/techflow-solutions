import { Box, Container, Heading, Text, Button, SimpleGrid, VStack, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaDigitalTachograph, FaLaptopCode, FaRobot } from 'react-icons/fa';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="brand.500" color="white" py={20}>
        <Container>
          <VStack spacing={6} align="center" textAlign="center">
            <Heading size="2xl">Transformação Digital para seu Negócio</Heading>
            <Text fontSize="xl" maxW="2xl">
              Soluções tecnológicas inovadoras para impulsionar seu negócio e alcançar resultados
              extraordinários.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Button
                as={RouterLink}
                to="/services"
                size="lg"
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.800' }}
              >
                Nossos Serviços
              </Button>
              <Button
                as="a"
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.800' }}
              >
                Fale Conosco
              </Button>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container>
          <VStack spacing={12}>
            <Heading textAlign="center">Por que escolher a TechFlow?</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <VStack spacing={4} align="center" textAlign="center">
                <Icon as={FaDigitalTachograph} boxSize={12} color="brand.500" />
                <Heading size="md">Expertise</Heading>
                <Text>
                  Equipe altamente qualificada com vasta experiência em desenvolvimento de software e
                  transformação digital.
                </Text>
              </VStack>
              <VStack spacing={4} align="center" textAlign="center">
                <Icon as={FaLaptopCode} boxSize={12} color="brand.500" />
                <Heading size="md">Inovação</Heading>
                <Text>
                  Utilizamos as mais recentes tecnologias e metodologias para entregar soluções
                  inovadoras e eficientes.
                </Text>
              </VStack>
              <VStack spacing={4} align="center" textAlign="center">
                <Icon as={FaRobot} boxSize={12} color="brand.500" />
                <Heading size="md">Suporte</Heading>
                <Text>
                  Oferecemos suporte contínuo e personalizado para garantir o sucesso do seu projeto.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
} 