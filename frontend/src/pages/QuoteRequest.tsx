import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  SimpleGrid,
  Stack,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Checkbox,
  Spinner,
  Progress,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Badge,
  Icon,
  Divider,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { FaLaptopCode, FaCalendarAlt, FaDollarSign, FaUser, FaEnvelope, FaBuilding } from 'react-icons/fa';
import { SEOHead } from '@/components/common/SEOHead';
import {
  quoteRequestSchema,
  type QuoteRequestData,
  rateLimiter,
  validateAndSanitize
} from '@/lib/validation';
import { sendQuoteRequest, handleApiError } from '@/lib/api';
import { sendWhatsAppQuote, type WhatsAppQuote } from '@/lib/whatsapp';

type FormErrors = Partial<Record<keyof QuoteRequestData, string>>;

export default function QuoteRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState<QuoteRequestData>({
    // Dados do Cliente
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    clientPosition: '',

    // Dados do Projeto
    projectName: '',
    projectDescription: '',
    projectType: '',
    projectCategory: '',
    technologies: [],
    timeline: '',
    budget: '',

    // Funcionalidades Específicas
    features: [],
    integrations: [],
    platforms: [],

    // Informações Adicionais
    hasExistingSystem: false,
    existingSystemDetails: '',
    mainGoals: '',
    targetAudience: '',

    // LGPD
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);

  // Listas de opções
  const projectTypes = [
    'Desenvolvimento Web',
    'Aplicativo Mobile',
    'E-commerce',
    'Dashboard/Analytics',
    'Sistema ERP',
    'API/Backend',
    'Consultoria Técnica',
    'Manutenção/Suporte',
    'Outro'
  ];

  const projectCategories = [
    'Novo desenvolvimento',
    'Migração/Refatoração',
    'Integração',
    'Melhoria/Otimização',
    'Correção de bugs',
    'Consultoria'
  ];

  const technologyOptions = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript',
    'Node.js', 'Python', 'Java', 'PHP', 'C#',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'AWS', 'Google Cloud', 'Azure', 'Docker',
    'React Native', 'Flutter', 'iOS', 'Android'
  ];

  const timelineOptions = [
    '1-2 semanas',
    '3-4 semanas',
    '1-2 meses',
    '3-4 meses',
    '5-6 meses',
    'Mais de 6 meses',
    'Flexível'
  ];

  const budgetRanges = [
    'R$ 5.000 - R$ 15.000',
    'R$ 15.000 - R$ 30.000',
    'R$ 30.000 - R$ 50.000',
    'R$ 50.000 - R$ 100.000',
    'Acima de R$ 100.000',
    'A definir'
  ];

  // Preencher dados se vieram do serviço
  useEffect(() => {
    if (location.state?.serviceType) {
      setFormData(prev => ({
        ...prev,
        projectType: location.state.serviceType,
        projectName: `Projeto ${location.state.serviceType}`
      }));
    }
  }, [location.state]);

  const validateField = (name: keyof QuoteRequestData, value: any) => {
    try {
      const fieldSchema = quoteRequestSchema.shape[name];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Campo inválido';
      setErrors(prev => ({ ...prev, [name]: message }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Validação em tempo real
    if (value.trim() || type === 'checkbox') {
      validateField(name as keyof QuoteRequestData, fieldValue);
    }
  };

  const addTechnology = (tech: string) => {
    if (Array.isArray(formData.technologies) && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), tech]
      }));
    } else if (!Array.isArray(formData.technologies)) {
      setFormData(prev => ({
        ...prev,
        technologies: [tech]
      }));
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: Array.isArray(prev.technologies) 
        ? prev.technologies.filter(t => t !== tech)
        : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar rate limiting
    const clientId = `quote_${formData.clientEmail}`;
    if (!rateLimiter.isAllowed(clientId, 2, 3600000)) { // 2 tentativas por hora
      setRateLimitExceeded(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(0);
    setErrors({});

    try {
      // Validar e sanitizar dados
      const validatedData = validateAndSanitize(quoteRequestSchema, formData);

      // Progresso de envio
      setSubmitProgress(25);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Enviar dados para a API
      setSubmitProgress(75);
      await sendQuoteRequest(validatedData);

      setSubmitProgress(100);

      setSubmitSuccess(true);

      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'quote_request_submitted', {
          event_category: 'Conversion',
          event_label: formData.projectType,
          value: 1,
        });
      }

      toast({
        title: 'Orçamento processado com sucesso! 📱',
        description: 'Você será redirecionado para o WhatsApp para enviar sua solicitação detalhada.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientCompany: '',
        clientPosition: '',
        projectName: '',
        projectDescription: '',
        projectType: '',
        projectCategory: '',
        technologies: [],
        timeline: '',
        budget: '',
        features: [],
        integrations: [],
        platforms: [],
        hasExistingSystem: false,
        existingSystemDetails: '',
        mainGoals: '',
        targetAudience: '',
        consent: false,
      });

    } catch (error: any) {
      if (error.name === 'ZodError') {
        const fieldErrors: FormErrors = {};
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof QuoteRequestData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Check for network errors and offer WhatsApp fallback
        const isNetworkError = error.message?.includes('fetch') || 
                              error.name === 'TypeError' || 
                              error.message?.includes('Failed to fetch');
        
        if (isNetworkError) {
          toast({
            title: 'Problema de conexão detectado',
            description: 'Clique no botão abaixo para continuar pelo WhatsApp diretamente.',
            status: 'warning',
            duration: 10000,
            isClosable: true,
            action: (
              <Button 
                size="sm" 
                colorScheme="green" 
                onClick={() => {
                  createWhatsAppFallback(formData);
                  setSubmitSuccess(true);
                }}
              >
                Ir para WhatsApp
              </Button>
            ),
          });
        } else {
          const errorMessage = handleApiError(error);
          toast({
            title: 'Erro ao enviar solicitação',
            description: errorMessage,
            status: 'error',
            duration: 7000,
            isClosable: true,
          });
        }
      }
    } finally {
      setIsSubmitting(false);
      setSubmitProgress(0);
    }
  };

  const resetRateLimit = () => {
    const clientId = `quote_${formData.clientEmail}`;
    rateLimiter.reset(clientId);
    setRateLimitExceeded(false);
  };

  const createWhatsAppFallback = (data: QuoteRequestData): void => {
    const whatsappData: WhatsAppQuote = {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientCompany: data.clientCompany,
      clientPosition: data.clientPosition,
      projectName: data.projectName,
      projectDescription: data.projectDescription + '\n\n⚠️ Nota: Formulário enviado com problema técnico - continuando pelo WhatsApp',
      projectType: data.projectType,
      projectCategory: data.projectCategory,
      technologies: data.technologies,
      timeline: data.timeline,
      budget: data.budget,
      features: data.features,
      integrations: data.integrations,
      platforms: data.platforms,
      mainGoals: data.mainGoals,
      targetAudience: data.targetAudience,
      hasExistingSystem: data.hasExistingSystem,
      existingSystemDetails: data.existingSystemDetails
    };
    
    sendWhatsAppQuote(whatsappData);
  };

  return (
    <>
      <SEOHead
        title="Solicitar Orçamento"
        description="Solicite um orçamento personalizado para seu projeto. Preencha o formulário detalhado e receba uma proposta em até 24 horas."
        keywords="orçamento, proposta, desenvolvimento software, TechFlow Solutions"
        url="https://www.srluissimon.com/orcamento"
      />

      <Box py={20}>
        <Container maxW="5xl">
          <VStack spacing={12}>
            <Box textAlign="center">
              <Badge colorScheme="brand" fontSize="sm" p={2} borderRadius="md" mb={4}>
                Orçamento Personalizado
              </Badge>
              <Heading as="h1" mb={4}>Solicite seu Orçamento</Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Preencha o formulário detalhado abaixo para recebermos todas as informações
                necessárias para elaborar uma proposta personalizada para seu projeto.
              </Text>
            </Box>

            {rateLimitExceeded && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Muitas tentativas!</AlertTitle>
                <AlertDescription>
                  Você pode fazer até 2 solicitações por hora.
                  <Button size="sm" ml={4} onClick={resetRateLimit}>
                    Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {submitSuccess && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Solicitação enviada!</AlertTitle>
                <AlertDescription>
                  Recebemos sua solicitação e analisaremos seu projeto. Entraremos em contato em até 24 horas.
                </AlertDescription>
              </Alert>
            )}

            <Box
              as="form"
              onSubmit={handleSubmit}
              w="full"
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
              p={8}
              position="relative"
            >
              {isSubmitting && (
                <Progress
                  value={submitProgress}
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  borderTopRadius="lg"
                  colorScheme="brand"
                  size="sm"
                />
              )}

              <VStack spacing={8}>
                {/* Dados do Cliente */}
                <Card w="full">
                  <CardHeader>
                    <Heading size="md" display="flex" alignItems="center" gap={2}>
                      <Icon as={FaUser} color="brand.500" />
                      Dados do Cliente
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired isInvalid={!!errors.clientName}>
                        <FormLabel>Nome Completo</FormLabel>
                        <Input
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          placeholder="Seu nome completo"
                          disabled={isSubmitting}
                        />
                        <FormErrorMessage>{errors.clientName}</FormErrorMessage>
                      </FormControl>

                      <FormControl isRequired isInvalid={!!errors.clientEmail}>
                        <FormLabel>E-mail</FormLabel>
                        <Input
                          name="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                          disabled={isSubmitting}
                        />
                        <FormErrorMessage>{errors.clientEmail}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.clientPhone}>
                        <FormLabel>Telefone</FormLabel>
                        <Input
                          name="clientPhone"
                          type="tel"
                          value={formData.clientPhone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          disabled={isSubmitting}
                        />
                        <FormErrorMessage>{errors.clientPhone}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.clientCompany}>
                        <FormLabel>Empresa</FormLabel>
                        <Input
                          name="clientCompany"
                          value={formData.clientCompany}
                          onChange={handleChange}
                          placeholder="Nome da empresa"
                          disabled={isSubmitting}
                        />
                        <FormErrorMessage>{errors.clientCompany}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.clientPosition} gridColumn={{ md: 'span 2' }}>
                        <FormLabel>Cargo/Posição</FormLabel>
                        <Input
                          name="clientPosition"
                          value={formData.clientPosition}
                          onChange={handleChange}
                          placeholder="Seu cargo na empresa"
                          disabled={isSubmitting}
                        />
                        <FormErrorMessage>{errors.clientPosition}</FormErrorMessage>
                      </FormControl>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Dados do Projeto */}
                <Card w="full">
                  <CardHeader>
                    <Heading size="md" display="flex" alignItems="center" gap={2}>
                      <Icon as={FaLaptopCode} color="brand.500" />
                      Detalhes do Projeto
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                        <FormControl isRequired isInvalid={!!errors.projectName}>
                          <FormLabel>Nome do Projeto</FormLabel>
                          <Input
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            placeholder="Ex: Sistema de Vendas Online"
                            disabled={isSubmitting}
                          />
                          <FormErrorMessage>{errors.projectName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.projectType}>
                          <FormLabel>Tipo de Projeto</FormLabel>
                          <Select
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            placeholder="Selecione o tipo"
                            disabled={isSubmitting}
                          >
                            {projectTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </Select>
                          <FormErrorMessage>{errors.projectType}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.projectCategory}>
                          <FormLabel>Categoria</FormLabel>
                          <Select
                            name="projectCategory"
                            value={formData.projectCategory}
                            onChange={handleChange}
                            placeholder="Selecione a categoria"
                            disabled={isSubmitting}
                          >
                            {projectCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </Select>
                          <FormErrorMessage>{errors.projectCategory}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.timeline}>
                          <FormLabel>Prazo Desejado</FormLabel>
                          <Select
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            placeholder="Selecione o prazo"
                            disabled={isSubmitting}
                          >
                            {timelineOptions.map(timeline => (
                              <option key={timeline} value={timeline}>{timeline}</option>
                            ))}
                          </Select>
                          <FormErrorMessage>{errors.timeline}</FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired isInvalid={!!errors.projectDescription}>
                        <FormLabel>Descrição Detalhada</FormLabel>
                        <Textarea
                          name="projectDescription"
                          value={formData.projectDescription}
                          onChange={handleChange}
                          placeholder="Descreva seu projeto em detalhes: o que faz, quem são os usuários, principais funcionalidades..."
                          rows={4}
                          disabled={isSubmitting}
                        />
                        <FormErrorMessage>{errors.projectDescription}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Tecnologias Preferidas (opcional)</FormLabel>
                        <Wrap>
                          {technologyOptions.map(tech => (
                            <WrapItem key={tech}>
                              <Button
                                size="sm"
                                variant={Array.isArray(formData.technologies) && formData.technologies.includes(tech) ? 'solid' : 'outline'}
                                colorScheme={Array.isArray(formData.technologies) && formData.technologies.includes(tech) ? 'brand' : 'gray'}
                                onClick={() =>
                                  Array.isArray(formData.technologies) && formData.technologies.includes(tech)
                                    ? removeTechnology(tech)
                                    : addTechnology(tech)
                                }
                                disabled={isSubmitting}
                              >
                                {tech}
                              </Button>
                            </WrapItem>
                          ))}
                        </Wrap>
                        {Array.isArray(formData.technologies) && formData.technologies.length > 0 && (
                          <Wrap mt={2}>
                            {formData.technologies.map(tech => (
                              <WrapItem key={tech}>
                                <Tag colorScheme="brand">
                                  <TagLabel>{tech}</TagLabel>
                                  <TagCloseButton onClick={() => removeTechnology(tech)} />
                                </Tag>
                              </WrapItem>
                            ))}
                          </Wrap>
                        )}
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Orçamento e Timeline */}
                <Card w="full">
                  <CardHeader>
                    <Heading size="md" display="flex" alignItems="center" gap={2}>
                      <Icon as={FaDollarSign} color="brand.500" />
                      Orçamento e Cronograma
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired isInvalid={!!errors.budget}>
                        <FormLabel>Faixa de Orçamento</FormLabel>
                        <Select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="Selecione a faixa"
                          disabled={isSubmitting}
                        >
                          {budgetRanges.map(range => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </Select>
                        <FormErrorMessage>{errors.budget}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Objetivos Principais</FormLabel>
                        <Textarea
                          name="mainGoals"
                          value={formData.mainGoals}
                          onChange={handleChange}
                          placeholder="Quais são os principais objetivos com este projeto?"
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl mt={4}>
                      <FormLabel>Público-alvo</FormLabel>
                      <Input
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        placeholder="Ex: Empresas de médio porte, consumidores finais, equipe interna..."
                        disabled={isSubmitting}
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <Checkbox
                        name="hasExistingSystem"
                        isChecked={formData.hasExistingSystem}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      >
                        Possuo sistema existente que precisa ser integrado/migrado
                      </Checkbox>
                    </FormControl>

                    {formData.hasExistingSystem && (
                      <FormControl mt={4}>
                        <FormLabel>Detalhes do Sistema Existente</FormLabel>
                        <Textarea
                          name="existingSystemDetails"
                          value={formData.existingSystemDetails}
                          onChange={handleChange}
                          placeholder="Descreva o sistema atual, tecnologias utilizadas, dados a serem migrados..."
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    )}
                  </CardBody>
                </Card>

                <Divider />

                {/* Consentimento LGPD */}
                <FormControl isRequired isInvalid={!!errors.consent}>
                  <Checkbox
                    name="consent"
                    isChecked={formData.consent}
                    onChange={handleChange}
                    colorScheme="brand"
                    disabled={isSubmitting}
                  >
                    <Text fontSize="sm">
                      Concordo com o tratamento dos meus dados pessoais de acordo com a{' '}
                      <Text as="span" color="brand.500" textDecoration="underline">
                        Política de Privacidade
                      </Text>
                      {' '}e autorizo o contato para elaboração da proposta comercial.
                    </Text>
                  </Checkbox>
                  <FormErrorMessage>{errors.consent}</FormErrorMessage>
                </FormControl>

                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} w="full">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    flex={1}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Enviando..."
                    disabled={rateLimitExceeded}
                    leftIcon={isSubmitting ? <Spinner size="sm" /> : undefined}
                    flex={2}
                  >
                    Solicitar Orçamento
                  </Button>
                </Stack>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
} 