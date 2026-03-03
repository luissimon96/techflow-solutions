import { Box, Container, Heading, Text, SimpleGrid, VStack, Icon, Stack, Badge, Button } from '@chakra-ui/react';
import { FaLaptopCode, FaMobileAlt, FaShoppingCart, FaChartLine, FaCogs, FaTools } from 'react-icons/fa';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

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
              Nossos Serviços
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color="gray.600" 
              maxW="3xl"
              mx="auto"
              lineHeight="tall"
              fontWeight="medium"
            >
              Oferecemos soluções tecnológicas completas para impulsionar o crescimento do seu negócio
            </Text>
          </Box>

          {/* Services Grid */}
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={{ base: 6, md: 8, lg: 10 }}
            w="full"
          >
            {services.map((service, index) => (
              <Box
                key={index}
                p={{ base: 6, md: 8 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ 
                  transform: 'translateY(-8px)', 
                  boxShadow: '2xl',
                  borderColor: 'brand.200'
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
                minH="520px"
              >
                {/* Background Pattern */}
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="100px"
                  h="100px"
                  bgGradient="linear(135deg, brand.50, transparent)"
                  borderBottomLeftRadius="full"
                  opacity={0.6}
                />
                
                {service.featured && (
                  <Badge
                    colorScheme="brand"
                    variant="solid"
                    position="absolute"
                    top={6}
                    right={6}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Popular
                  </Badge>
                )}
                
                <Stack spacing={6} h="full">
                  {/* Icon */}
                  <Box>
                    <Icon
                      as={service.icon}
                      boxSize={{ base: 14, md: 16 }}
                      color="brand.500"
                      filter="drop-shadow(0 4px 6px rgba(59, 130, 246, 0.1))"
                    />
                  </Box>
                  
                  {/* Content */}
                  <Box flex="1">
                    <Heading 
                      size={{ base: "md", md: "lg" }} 
                      mb={2}
                      color="gray.800"
                      lineHeight="short"
                    >
                      {service.title}
                    </Heading>
                    
                    <Text 
                      color="brand.600" 
                      fontSize="sm" 
                      fontWeight="semibold"
                      mb={4}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {service.subtitle}
                    </Text>
                    
                    <Text 
                      color="gray.600" 
                      lineHeight="relaxed"
                      fontSize="sm"
                      mb={6}
                    >
                      {service.description}
                    </Text>
                  </Box>
                  
                  {/* Technologies */}
                  <Box>
                    <Text 
                      fontSize="sm" 
                      fontWeight="semibold" 
                      mb={3}
                      color="gray.700"
                    >
                      Tecnologias:
                    </Text>
                    <Stack direction="row" flexWrap="wrap" spacing={2}>
                      {service.technologies.map((tech, techIndex) => (
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
                  </Box>
                  
                  {/* CTA Button */}
                  <Button
                    colorScheme="brand"
                    size="lg"
                    width="full"
                    onClick={() => handleQuoteRequest(service)}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl',
                      bg: 'brand.600'
                    }}
                    _active={{
                      transform: 'translateY(0px)',
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    fontWeight="bold"
                    borderRadius="xl"
                  >
                    Solicitar Orçamento
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Bottom CTA Section */}
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
            <Heading
              as="h2"
              size={{ base: "lg", md: "xl" }}
              mb={4}
              color="brand.700"
            >
              Pronto para transformar sua ideia em realidade?
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.600"
              mb={8}
              maxW="2xl"
              mx="auto"
            >
              Nossa equipe especializada está pronta para desenvolver a solução perfeita para o seu negócio.
              Entre em contato e receba uma proposta personalizada.
            </Text>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              justify="center"
              align="center"
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
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                Solicitar Orçamento Gratuito
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
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                Falar com Especialista
              </Button>
            </Stack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
} 