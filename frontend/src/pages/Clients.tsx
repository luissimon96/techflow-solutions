import { Box, Container, Heading, Text, SimpleGrid, VStack, Image, Stack } from '@chakra-ui/react';

const clients = [
  {
    name: 'E-commerce Plus',
    logo: '/clients/ecommerce-plus.svg',
    testimonial:
      'A TechFlow revolucionou nossa presença online. O novo site aumentou nossas vendas em 150% em apenas 3 meses.',
  },
  {
    name: 'Telecom Solutions',
    logo: '/clients/telecom-solutions.svg',
    testimonial:
      'A automação implementada pela TechFlow reduziu nossos custos operacionais em 40% e aumentou a satisfação dos clientes.',
  },
  {
    name: 'HealthTech',
    logo: '/clients/healthtech.svg',
    testimonial:
      'O sistema desenvolvido pela TechFlow transformou completamente nossa gestão hospitalar, tornando-a mais eficiente e segura.',
  },
];

const successCases = [
  {
    title: 'Transformação Digital do E-commerce Plus',
    description:
      'Desenvolvemos uma plataforma de e-commerce completa com integração de pagamentos, gestão de estoque e análise de dados em tempo real.',
    image: '/cases/ecommerce-case.jpg',
  },
  {
    title: 'Automação de Processos na Telecom Solutions',
    description:
      'Implementamos um sistema de automação que reduziu o tempo de atendimento em 60% e aumentou a satisfação dos clientes.',
    image: '/cases/telecom-case.jpg',
  },
  {
    title: 'Sistema de Gestão Hospitalar para HealthTech',
    description:
      'Criamos um sistema integrado de gestão hospitalar que melhorou a eficiência operacional e a qualidade do atendimento.',
    image: '/cases/healthtech-case.jpg',
  },
];

export default function Clients() {
  return (
    <Box py={20}>
      <Container>
        <VStack spacing={16}>
          {/* Depoimentos */}
          <Box textAlign="center">
            <Heading mb={4}>O que nossos clientes dizem</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Conheça alguns dos nossos clientes e suas experiências com a TechFlow
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {clients.map((client, index) => (
              <Box
                key={index}
                p={6}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <VStack spacing={4} align="center" textAlign="center">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fallbackSrc="https://via.placeholder.com/150"
                    boxSize="100px"
                    objectFit="contain"
                  />
                  <Heading size="md">{client.name}</Heading>
                  <Text color="gray.600">{client.testimonial}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Casos de Sucesso */}
          <Box textAlign="center">
            <Heading mb={4}>Casos de Sucesso</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Conheça alguns dos projetos que desenvolvemos e os resultados alcançados
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {successCases.map((case_, index) => (
              <Box
                key={index}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <Image
                  src={case_.image}
                  alt={case_.title}
                  fallbackSrc="https://via.placeholder.com/400x300"
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
                <Stack p={6} spacing={4}>
                  <Heading size="md">{case_.title}</Heading>
                  <Text color="gray.600">{case_.description}</Text>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 