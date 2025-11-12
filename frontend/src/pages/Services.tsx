import { Box, Container, Heading, Text, SimpleGrid, VStack, Icon, Stack, Badge } from '@chakra-ui/react';
import { FaLaptopCode, FaMobileAlt, FaShoppingCart, FaChartLine, FaCogs, FaTools } from 'react-icons/fa';

const services = [
  {
    title: 'Desenvolvimento Web',
    subtitle: 'Sites e aplicações web modernas',
    description: 'Criamos sites e aplicações web utilizando as tecnologias mais modernas do mercado, com foco em performance, SEO e experiência do usuário.',
    icon: FaLaptopCode,
    technologies: ['React', 'TypeScript', 'Node.js', 'Next.js'],
    featured: true,
  },
  {
    title: 'Aplicações Mobile',
    subtitle: 'Apps nativos e híbridos',
    description: 'Desenvolvemos aplicativos móveis nativos e híbridos com React Native, garantindo performance e experiência nativa em ambas as plataformas.',
    icon: FaMobileAlt,
    technologies: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
  },
  {
    title: 'E-commerce',
    subtitle: 'Lojas online completas',
    description: 'Desenvolvemos lojas online completas com foco em conversão e experiência do usuário. Integração com gateways de pagamento e sistemas de gestão.',
    icon: FaShoppingCart,
    technologies: ['Next.js', 'Stripe', 'PayPal', 'WooCommerce'],
  },
  {
    title: 'Dashboards & Analytics',
    subtitle: 'Painéis de controle e análise',
    description: 'Criamos dashboards interativos e sistemas de análise de dados para ajudar na tomada de decisões estratégicas do seu negócio.',
    icon: FaChartLine,
    technologies: ['React', 'D3.js', 'Chart.js', 'PostgreSQL'],
  },
  {
    title: 'Consultoria Técnica',
    subtitle: 'Arquitetura e code review',
    description: 'Oferecemos consultoria especializada em arquitetura de software, code review, otimização de performance e melhores práticas de desenvolvimento.',
    icon: FaCogs,
    technologies: ['Arquitetura', 'DevOps', 'AWS', 'Docker'],
  },
  {
    title: 'Manutenção & Suporte',
    subtitle: 'Suporte técnico contínuo',
    description: 'Mantemos seus sistemas sempre atualizados e funcionando perfeitamente com nosso serviço de manutenção e suporte técnico especializado.',
    icon: FaTools,
    technologies: ['Monitoring', 'Updates', 'Backup', 'Security'],
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
                position="relative"
              >
                {service.featured && (
                  <Badge
                    colorScheme="brand"
                    variant="solid"
                    position="absolute"
                    top={4}
                    right={4}
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="xs"
                  >
                    Popular
                  </Badge>
                )}
                <Stack spacing={4}>
                  <Icon
                    as={service.icon}
                    boxSize={12}
                    color="brand.500"
                  />
                  <Heading size="md">{service.title}</Heading>
                  <Text color="gray.500" fontSize="sm" fontWeight="medium">
                    {service.subtitle}
                  </Text>
                  <Text color="gray.600">{service.description}</Text>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      Tecnologias:
                    </Text>
                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                      {service.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" fontSize="xs">
                          {tech}
                        </Badge>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 