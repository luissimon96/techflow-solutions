import { Box, Container, Heading, Text, SimpleGrid, VStack, Icon } from '@chakra-ui/react';
import {
  FaDigitalTachograph,
  FaLaptopCode,
  FaRobot,
  FaMobileAlt,
  FaDatabase,
  FaChartLine,
} from 'react-icons/fa';

const services = [
  {
    title: 'Digitalização de Negócios',
    description:
      'Transforme seus processos analógicos em digitais, aumentando a eficiência e reduzindo custos operacionais.',
    icon: FaDigitalTachograph,
  },
  {
    title: 'Criação de Sites',
    description:
      'Desenvolvemos sites modernos, responsivos e otimizados para SEO, proporcionando uma experiência única aos seus clientes.',
    icon: FaLaptopCode,
  },
  {
    title: 'Automação de Processos',
    description:
      'Automatize tarefas repetitivas e otimize seus fluxos de trabalho com soluções personalizadas.',
    icon: FaRobot,
  },
  {
    title: 'Aplicativos Mobile',
    description:
      'Criamos aplicativos nativos e híbridos para iOS e Android, com foco em performance e experiência do usuário.',
    icon: FaMobileAlt,
  },
  {
    title: 'Desenvolvimento de Sistemas',
    description:
      'Sistemas sob medida para atender às necessidades específicas do seu negócio, com foco em escalabilidade e segurança.',
    icon: FaDatabase,
  },
  {
    title: 'Análise de Dados',
    description:
      'Transforme seus dados em insights valiosos com nossas soluções de análise e visualização de dados.',
    icon: FaChartLine,
  },
];

export default function Services() {
  return (
    <Box py={20}>
      <Container>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading mb={4}>Nossos Serviços</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Oferecemos soluções tecnológicas completas para impulsionar o crescimento do seu negócio
              e aumentar sua competitividade no mercado.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {services.map((service, index) => (
              <Box
                key={index}
                p={6}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <VStack spacing={4} align="start">
                  <Icon as={service.icon} boxSize={8} color="brand.500" />
                  <Heading size="md">{service.title}</Heading>
                  <Text color="gray.600">{service.description}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 