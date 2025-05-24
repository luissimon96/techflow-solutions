import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useToast,
  Flex,
  Badge,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { ServiceCard } from '../components/common/ServiceCard';
import { ServiceModal } from '../components/common/ServiceModal';
import { SEOHead } from '../components/common/SEOHead';
import { services, getFeaturedServices, Service } from '../data/services';
import { useNavigate } from 'react-router-dom';

export default function Services() {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const featuredServices = getFeaturedServices();

  const handleLearnMore = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      onOpen();
    }

    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'service_detail_view', {
        event_category: 'Services',
        event_label: serviceId,
        value: 1,
      });
    }
  };

  const handleGetQuote = (serviceTitle: string) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quote_request_click', {
        event_category: 'Conversion',
        event_label: serviceTitle,
        value: 1,
      });
    }

    // Navigate to contact with service pre-selected
    navigate('/contact', {
      state: {
        prefilledSubject: `Orçamento para ${serviceTitle}`,
        serviceType: serviceTitle
      }
    });
  };

  const handleContactFromModal = () => {
    navigate('/contact');
  };

  return (
    <>
      <SEOHead
        title="Serviços | TechFlow Solutions"
        description="Conheça nossos serviços de desenvolvimento web, mobile, e-commerce, dashboards, consultoria técnica e suporte. Soluções tecnológicas completas para seu negócio."
        url="https://www.srluissimon.com/services"
        keywords="desenvolvimento web, aplicativo mobile, e-commerce, dashboard, consultoria técnica, react, node.js"
      />

      <Box py={20}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            {/* Header Section */}
            <Box textAlign="center" maxW="4xl">
              <Heading size="2xl" mb={4} lineHeight="shorter">
                Nossos Serviços
              </Heading>
              <Text fontSize="xl" color="gray.600" lineHeight="tall">
                Oferecemos soluções tecnológicas completas para impulsionar o crescimento do seu negócio.
                Do desenvolvimento web até consultoria especializada, temos a expertise para transformar suas ideias em realidade.
              </Text>
            </Box>

            {/* Featured Services Badge */}
            {featuredServices.length > 0 && (
              <Flex justify="center">
                <Badge
                  colorScheme="brand"
                  variant="solid"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  ⭐ {featuredServices.length} Serviço{featuredServices.length > 1 ? 's' : ''} em Destaque
                </Badge>
              </Flex>
            )}

            {/* Services Grid */}
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={8}
              w="full"
            >
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  subtitle={service.subtitle}
                  description={service.description}
                  icon={service.icon}
                  technologies={service.technologies}
                  duration={service.duration}
                  features={service.features}
                  featured={service.featured}
                  onLearnMore={() => handleLearnMore(service.id)}
                  onGetQuote={() => handleGetQuote(service.title)}
                />
              ))}
            </SimpleGrid>

            {/* Call-to-Action Section */}
            <Box
              textAlign="center"
              p={8}
              bg="brand.50"
              borderRadius="xl"
              maxW="4xl"
              w="full"
            >
              <Heading size="lg" mb={4}>
                Não encontrou o que procura?
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={6}>
                Desenvolvemos soluções personalizadas para atender às necessidades específicas do seu negócio.
              </Text>
              <Button
                colorScheme="brand"
                size="lg"
                onClick={() => navigate('/contact')}
                _hover={{
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
              >
                Fale Conosco
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isOpen}
        onClose={onClose}
        service={selectedService}
        onGetQuote={handleGetQuote}
        onContact={handleContactFromModal}
      />
    </>
  );
} 