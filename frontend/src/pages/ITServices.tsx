import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  HStack,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { FaRocket, FaHeadset, FaLock, FaCogs, FaArrowRight, FaQuestionCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

import { ITServiceCard } from '../components/IT/ITServiceCard';
import { PackageComparison } from '../components/IT/PackageComparison';
import { ITQuoteForm } from '../components/IT/ITQuoteForm';
import { 
  itServices, 
  getITServicesByCategory, 
  getITServicesByAudience,
  itServiceCategories,
  getIndividualPackages,
  getBusinessPackages 
} from '../data/itServices';

const ITServices: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'individual' | 'business'>('all');
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>();
  
  const { isOpen: isQuoteModalOpen, onOpen: onQuoteModalOpen, onClose: onQuoteModalClose } = useDisclosure();
  const { isOpen: isPackagesModalOpen, onOpen: onPackagesModalOpen, onClose: onPackagesModalClose } = useDisclosure();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('brand.600', 'brand.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Filtrar serviços baseado na categoria e audiência selecionadas
  const getFilteredServices = () => {
    let filtered = itServices;
    
    if (selectedCategory !== 'all') {
      filtered = getITServicesByCategory(selectedCategory as any);
    }
    
    if (selectedAudience !== 'all') {
      filtered = filtered.filter(service => 
        service.targetAudience === selectedAudience || service.targetAudience === 'both'
      );
    }
    
    return filtered;
  };

  const handleGetQuote = (serviceId?: string) => {
    setSelectedServiceForQuote(serviceId);
    onQuoteModalOpen();
  };

  const handleViewPackages = (serviceId: string) => {
    onPackagesModalOpen();
  };

  const handleQuoteSubmit = async (data: any) => {
    // Implementar envio do formulário
    console.log('Quote data:', data);
    // Aqui você integraria com a API do backend
  };

  const filteredServices = getFilteredServices();
  const featuredServices = filteredServices.filter(service => service.featured);

  return (
    <>
      <Helmet>
        <title>Serviços de TI - TechFlow Solutions</title>
        <meta 
          name="description" 
          content="Suporte técnico especializado, segurança digital e infraestrutura em nuvem. Monitoramento 24/7, backup automatizado e resposta imediata." 
        />
        <meta name="keywords" content="suporte técnico, TI, segurança digital, cloud, backup, monitoramento" />
      </Helmet>

      <Box bg={bgColor} minH="100vh">
        {/* Hero Section */}
        <Box bg={headerBg} color="white" py={20}>
          <Container maxW="6xl">
            <VStack spacing={6} textAlign="center" maxW="4xl" mx="auto">
                <Badge colorScheme="brand" variant="solid" px={4} py={2} borderRadius="full">
                  🔧 Tecnologia + Atendimento Humano
                </Badge>
                
                <Heading size="2xl" fontWeight="bold">
                  Serviços de TI que Realmente Funcionam
                </Heading>
                
                <Text fontSize="xl" opacity={0.9} maxW="3xl">
                  Suporte técnico proativo, segurança avançada e infraestrutura moderna. 
                  Monitore, proteja e otimize sua TI com especialistas dedicados.
                </Text>

                <HStack spacing={4} pt={4}>
                  <Button
                    size="lg"
                    colorScheme="brand"
                    variant="solid"
                    rightIcon={<Icon as={FaArrowRight} />}
                    onClick={() => handleGetQuote()}
                    _hover={{ transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                  >
                    Solicitar Orçamento
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    colorScheme="whiteAlpha"
                    leftIcon={<Icon as={FaQuestionCircle} />}
                    onClick={onPackagesModalOpen}
                  >
                    Ver Planos
                  </Button>
                </HStack>

                {/* Stats */}
                <HStack spacing={8} pt={8}>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold">95%</Text>
                    <Text fontSize="sm" opacity={0.8}>Problemas resolvidos remotamente</Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold">&lt;15min</Text>
                    <Text fontSize="sm" opacity={0.8}>Tempo médio de resposta</Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold">24/7</Text>
                    <Text fontSize="sm" opacity={0.8}>Monitoramento ativo</Text>
                  </VStack>
                </HStack>
            </VStack>
          </Container>
        </Box>

        {/* Featured Services */}
        {featuredServices.length > 0 && (
          <Container maxW="6xl" py={16}>
            <VStack spacing={8}>
              <VStack spacing={4} textAlign="center">
                <Heading size="xl">Serviços em Destaque</Heading>
                <Text fontSize="lg" color={textColor} maxW="2xl">
                  Nossas soluções mais procuradas para transformar sua infraestrutura de TI
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
                {featuredServices.map((service) => (
                  <ITServiceCard
                    key={service.id}
                    service={service}
                    onGetQuote={handleGetQuote}
                    onViewPackages={handleViewPackages}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        )}

        {/* All Services */}
        <Container maxW="6xl" py={16}>
          <VStack spacing={8}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">Todos os Serviços</Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Soluções completas para suas necessidades de TI
              </Text>
            </VStack>

            {/* Filters */}
            <Tabs variant="enclosed" colorScheme="brand" align="center">
              <TabList>
                <Tab onClick={() => setSelectedCategory('all')}>
                  Todos
                </Tab>
                {itServiceCategories.map((category) => (
                  <Tab 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <HStack spacing={2}>
                      <Icon as={category.icon} />
                      <Text display={{ base: 'none', md: 'block' }}>
                        {category.name}
                      </Text>
                    </HStack>
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                <TabPanel>
                  {/* Audience Filter */}
                  <HStack spacing={4} justify="center" mb={8}>
                    <Text fontSize="sm" color={textColor}>Filtrar por:</Text>
                    <Button
                      size="sm"
                      variant={selectedAudience === 'all' ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setSelectedAudience('all')}
                    >
                      Todos
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedAudience === 'individual' ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setSelectedAudience('individual')}
                    >
                      Pessoa Física
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedAudience === 'business' ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setSelectedAudience('business')}
                    >
                      Pessoa Jurídica
                    </Button>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                    {filteredServices.map((service) => (
                      <ITServiceCard
                        key={service.id}
                        service={service}
                        onGetQuote={handleGetQuote}
                        onViewPackages={handleViewPackages}
                      />
                    ))}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Container>

        {/* CTA Section */}
        <Box bg="brand.50" py={16}>
          <Container maxW="4xl">
            <VStack spacing={6} textAlign="center">
              <Heading size="xl">Pronto para Transformar sua TI?</Heading>
              <Text fontSize="lg" color={textColor}>
                Entre em contato e receba um orçamento personalizado em até 2 horas
              </Text>
              <HStack spacing={4}>
                <Button
                  size="lg"
                  colorScheme="brand"
                  rightIcon={<Icon as={FaArrowRight} />}
                  onClick={() => handleGetQuote()}
                >
                  Solicitar Orçamento Gratuito
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="brand"
                  leftIcon={<Icon as={FaHeadset} />}
                  as="a"
                  href="https://wa.me/5511999999999"
                  target="_blank"
                >
                  Falar no WhatsApp
                </Button>
              </HStack>
            </VStack>
          </Container>
        </Box>

        {/* Quote Modal */}
        <Modal isOpen={isQuoteModalOpen} onClose={onQuoteModalClose} size="4xl">
          <ModalOverlay />
          <ModalContent maxW="90vw">
            <ModalCloseButton />
            <ITQuoteForm
              initialService={selectedServiceForQuote}
              onSubmit={handleQuoteSubmit}
              onClose={onQuoteModalClose}
            />
          </ModalContent>
        </Modal>

        {/* Packages Modal */}
        <Modal isOpen={isPackagesModalOpen} onClose={onPackagesModalClose} size="6xl">
          <ModalOverlay />
          <ModalContent maxW="95vw">
            <ModalCloseButton />
            <Box p={8}>
              <Tabs>
                <TabList>
                  <Tab>Pessoa Física</Tab>
                  <Tab>Pessoa Jurídica</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <PackageComparison
                      packages={getIndividualPackages()}
                      title="Planos para Pessoa Física"
                      subtitle="Proteção e suporte para sua casa e família"
                      showCalculator={false}
                      onSelectPackage={handleGetQuote}
                    />
                  </TabPanel>
                  <TabPanel>
                    <PackageComparison
                      packages={getBusinessPackages()}
                      title="Planos para Empresas"
                      subtitle="Soluções escaláveis para seu negócio"
                      showCalculator={true}
                      onSelectPackage={handleGetQuote}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ITServices;