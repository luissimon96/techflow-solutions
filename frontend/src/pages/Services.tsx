import { Box, Container, Heading, Text, SimpleGrid, VStack, Icon, Stack, Badge, Button } from '@chakra-ui/react';
import { FaLaptopCode, FaMobileAlt, FaShoppingCart, FaChartLine, FaCogs, FaTools } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    title: 'Desenvolvimento Web',
    subtitle: 'Sites e aplicações web modernas',
    description: 'Soluções web desenvolvidas com tecnologias modernas, priorizando alta performance, otimização para motores de busca e experiência excepcional do usuário. Arquitetura escalável e responsiva para todos os dispositivos.',
    icon: FaLaptopCode,
    technologies: ['React', 'TypeScript', 'Node.js', 'Next.js'],
    featured: true,
    objectives: 'Estabelecer presença digital profissional, aumentar credibilidade da marca, capturar leads qualificados, vender produtos/serviços online 24/7, melhorar comunicação com clientes e expandir alcance geográfico do negócio.',
  },
  {
    title: 'Aplicações Mobile',
    subtitle: 'Apps nativos e híbridos',
    description: 'Aplicações móveis nativas e híbridas com React Native, entregando performance otimizada e experiência consistente em iOS e Android. Integração completa com recursos nativos do dispositivo.',
    icon: FaMobileAlt,
    technologies: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
    objectives: 'Conectar-se diretamente com clientes através de dispositivos móveis, aumentar engagement com notificações push, oferecer conveniência e acesso instantâneo aos serviços, criar fidelização através de experiência personalizada e capturar dados valiosos de comportamento do usuário.',
  },
  {
    title: 'E-commerce',
    subtitle: 'Lojas online completas',
    description: 'Plataformas de e-commerce robustas e otimizadas para conversão máxima. Integração nativa com gateways de pagamento, gestão de estoque, relatórios avançados e ferramentas de marketing digital.',
    icon: FaShoppingCart,
    technologies: ['Next.js', 'Stripe', 'PayPal', 'WooCommerce'],
    objectives: 'Vender produtos 24 horas por dia sem limitação geográfica, reduzir custos operacionais, automatizar processos de venda, aumentar margem de lucro, acompanhar métricas de conversão em tempo real e escalar o negócio rapidamente.',
  },
  {
    title: 'Dashboards & Analytics',
    subtitle: 'Painéis de controle e análise',
    description: 'Dashboards interativos e sistemas de Business Intelligence para análise estratégica de dados. Visualizações em tempo real, relatórios automatizados e insights acionáveis para otimização de processos.',
    icon: FaChartLine,
    technologies: ['React', 'D3.js', 'Chart.js', 'PostgreSQL'],
    objectives: 'Tomar decisões baseadas em dados reais, identificar oportunidades de crescimento, otimizar recursos e custos, monitorar performance em tempo real, prever tendências e comportamentos, e aumentar produtividade da equipe.',
  },
  {
    title: 'Consultoria Técnica',
    subtitle: 'Arquitetura e code review',
    description: 'Consultoria especializada em arquitetura de software, auditoria de código, otimização de performance e implementação de melhores práticas. Análise técnica profunda para maximizar eficiência e qualidade.',
    icon: FaCogs,
    technologies: ['Arquitetura', 'DevOps', 'AWS', 'Docker'],
    objectives: 'Evitar retrabalho e custos desnecessários, melhorar qualidade e segurança do código, acelerar desenvolvimento de projetos, reduzir bugs em produção, implementar melhores práticas do mercado e capacitar equipe técnica.',
  },
  {
    title: 'Manutenção & Suporte',
    subtitle: 'Suporte técnico contínuo',
    description: 'Serviços de manutenção preventiva e corretiva para sistemas em produção. Monitoramento 24/7, atualizações de segurança, backups automatizados e suporte técnico especializado com SLA garantido.',
    icon: FaTools,
    technologies: ['Monitoring', 'Updates', 'Backup', 'Security'],
    objectives: 'Garantir disponibilidade máxima dos sistemas, prevenir perda de dados e receita, manter segurança atualizada contra ameaças, reduzir tempo de inatividade, ter suporte especializado quando precisar e focar no core business sem se preocupar com tecnologia.',
  },
];

export default function Services() {
  const navigate = useNavigate();

  const handleQuoteRequest = (service: typeof services[0]) => {
    // Navigate to quote page with service data pre-filled
    navigate('/orcamento', {
      state: {
        projectName: service.title,
        projectType: 'Outro',
        timeline: 'Flexível',
        budget: 'A definir',
        projectDescription: service.description,
        mainGoals: service.objectives,
      },
    });
  };

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
                  <Button
                    colorScheme="brand"
                    size="md"
                    width="full"
                    onClick={() => handleQuoteRequest(service)}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Solicitar Orçamento
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 