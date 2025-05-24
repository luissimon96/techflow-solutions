import { Box, Container, Heading, Text, SimpleGrid, VStack, Image, Stack } from '@chakra-ui/react';
import { ImageFallback } from '@/components/common/ImageFallback';

const clients = [
  {
    name: 'Magazine Luiza',
    logo: '/logos/magalu.svg',
    testimonial:
      'A TechFlow revolucionou nossa presença online. O novo site aumentou nossas vendas em 150% em apenas 3 meses.',
  },
  {
    name: 'Magalu Tech',
    logo: '/logos/magalu-tech.svg',
    testimonial:
      'A automação implementada pela TechFlow reduziu nossos custos operacionais em 40% e aumentou a satisfação dos clientes.',
  },
  {
    name: 'Kabum',
    logo: '/logos/kabum.svg',
    testimonial:
      'O sistema desenvolvido pela TechFlow transformou completamente nossa gestão de e-commerce, tornando-a mais eficiente e segura.',
  },
  {
    name: 'Telefônica',
    logo: '/logos/telefonica.svg',
    testimonial:
      'A parceria com a TechFlow nos permitiu modernizar nossa infraestrutura e melhorar significativamente nossos serviços.',
  },
  {
    name: 'Vivo',
    logo: '/logos/vivo.svg',
    testimonial:
      'As soluções da TechFlow nos ajudaram a otimizar nossos processos e entregar uma melhor experiência aos nossos clientes.',
  },
];

const successCases = [
  {
    title: 'Transformação Digital do Magazine Luiza',
    description:
      'Desenvolvemos uma plataforma de e-commerce completa com integração de pagamentos, gestão de estoque e análise de dados em tempo real.',
    image: '/cases/magalu-case.jpg',
  },
  {
    title: 'Automação de Processos na Telefônica',
    description:
      'Implementamos um sistema de automação que reduziu o tempo de atendimento em 60% e aumentou a satisfação dos clientes.',
    image: '/cases/telefonica-case.jpg',
  },
  {
    title: 'Sistema de E-commerce para Kabum',
    description:
      'Criamos um sistema integrado de gestão de e-commerce que melhorou a eficiência operacional e a qualidade do atendimento.',
    image: '/cases/kabum-case.jpg',
  },
];

export function Clients() {
  return (
    <Box py={20}>
      <Container maxW="container.xl">
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
                    fallback={<ImageFallback width="100px" height="100px" text={client.name} />}
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
                  fallback={<ImageFallback width="100%" height="200px" text={case_.title} />}
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