import { useState, useEffect } from 'react';
import { ZodError } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Select,
  Checkbox,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaLaptopCode, FaUser, FaDollarSign } from 'react-icons/fa';
import { quoteRequestSchema, validateAndSanitize } from '@/lib/validation';
import { getWhatsAppUrl, sendWhatsAppQuote } from '@/lib/whatsapp';

interface QuoteFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  projectName: string;
  projectDescription: string;
  projectType: string;
  timeline: string;
  budget: string;
  mainGoals: string;
  consent: boolean;
}

type QuotePrefillState = Partial<
  Pick<
    QuoteFormData,
    'projectName' | 'projectType' | 'timeline' | 'budget' | 'projectDescription' | 'mainGoals'
  >
>;

export default function QuoteRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const [formData, setFormData] = useState<QuoteFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    projectName: '',
    projectDescription: '',
    projectType: '',
    timeline: '',
    budget: '',
    mainGoals: '',
    consent: false,
  });

  // Pre-fill form data if coming from Services page
  useEffect(() => {
    const prefillData = location.state as QuotePrefillState | null;
    if (prefillData) {
      const { projectName, projectType, timeline, budget, projectDescription, mainGoals } = prefillData;
      
      setFormData(prev => ({
        ...prev,
        projectName: projectName || prev.projectName,
        projectType: projectType || prev.projectType,
        timeline: timeline || prev.timeline,
        budget: budget || prev.budget,
        projectDescription: projectDescription || prev.projectDescription,
        mainGoals: mainGoals || prev.mainGoals,
      }));
    }
  }, [location.state]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const validatedData = validateAndSanitize(quoteRequestSchema, {
        ...formData,
        clientPhone: formData.clientPhone || undefined,
        clientCompany: formData.clientCompany || undefined,
        projectCategory: formData.projectType || 'Projeto personalizado',
        technologies: [],
        features: [],
        integrations: [],
        platforms: [],
        hasExistingSystem: false,
      });

      sendWhatsAppQuote(validatedData);
      setSubmitSuccess(true);

      toast({
        title: 'Redirecionando para WhatsApp... 📱',
        description: 'Se o WhatsApp não abrir automaticamente, clique no botão abaixo.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          clientCompany: '',
          projectName: '',
          projectDescription: '',
          projectType: '',
          timeline: '',
          budget: '',
          mainGoals: '',
          consent: false,
        });
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        toast({
          title: 'Dados inválidos',
          description: error.issues[0]?.message ?? 'Revise os campos obrigatórios do formulário.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Erro ao enviar solicitação',
          description: 'Tente novamente em alguns minutos.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box py={20}>
        <Container maxW="4xl">
          <VStack spacing={12}>
            <Box textAlign="center">
              <Badge colorScheme="brand" fontSize="sm" p={2} borderRadius="md" mb={4}>
                Orçamento Personalizado
              </Badge>
              <Heading as="h1" mb={4}>Solicite seu Orçamento</Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Preencha o formulário abaixo para recebermos as informações
                necessárias para elaborar uma proposta personalizada para seu projeto.
              </Text>
            </Box>

            {submitSuccess && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Solicitação enviada!</AlertTitle>
                <AlertDescription>
                  <VStack spacing={3} align="stretch">
                    <Text>
                      Recebemos sua solicitação e analisaremos seu projeto. Entraremos em contato em até 24 horas.
                    </Text>
                    <Button
                      colorScheme="green"
                      size="sm"
                      leftIcon={<Icon as={FaUser} />}
                      onClick={() => {
                        const basicMessage = 'Olá! Acabei de enviar uma solicitação de orçamento pelo site da TechFlow Solutions. Gostaria de conversar sobre meu projeto.';
                        window.open(getWhatsAppUrl(basicMessage), '_blank');
                      }}
                    >
                      Abrir WhatsApp Manualmente
                    </Button>
                  </VStack>
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
            >
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
                      <FormControl isRequired>
                        <FormLabel>Nome Completo</FormLabel>
                        <Input
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          placeholder="Seu nome completo"
                          disabled={isSubmitting}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>E-mail</FormLabel>
                        <Input
                          name="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                          disabled={isSubmitting}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Telefone</FormLabel>
                        <Input
                          name="clientPhone"
                          type="tel"
                          value={formData.clientPhone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          disabled={isSubmitting}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Empresa</FormLabel>
                        <Input
                          name="clientCompany"
                          value={formData.clientCompany}
                          onChange={handleChange}
                          placeholder="Nome da empresa"
                          disabled={isSubmitting}
                        />
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
                        <FormControl isRequired>
                          <FormLabel>Nome do Projeto</FormLabel>
                          <Input
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            placeholder="Ex: Sistema de Vendas Online"
                            disabled={isSubmitting}
                          />
                        </FormControl>

                        <FormControl isRequired>
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
                        </FormControl>

                        <FormControl>
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
                        </FormControl>

                        <FormControl>
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
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel>Descrição do Projeto</FormLabel>
                        <Textarea
                          name="projectDescription"
                          value={formData.projectDescription}
                          onChange={handleChange}
                          placeholder="Descreva seu projeto: o que faz, principais funcionalidades, público-alvo..."
                          rows={4}
                          disabled={isSubmitting}
                        />
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
                    </VStack>
                  </CardBody>
                </Card>

                {/* Consentimento */}
                <FormControl isRequired>
                  <Checkbox
                    name="consent"
                    isChecked={formData.consent}
                    onChange={handleChange}
                    colorScheme="brand"
                    disabled={isSubmitting}
                  >
                    <Text fontSize="sm">
                      Concordo com o tratamento dos meus dados pessoais de acordo com a
                      Política de Privacidade e autorizo o contato para elaboração da proposta comercial.
                    </Text>
                  </Checkbox>
                </FormControl>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Enviando..."
                  >
                    Solicitar Orçamento
                  </Button>
                </SimpleGrid>
              </VStack>
            </Box>
          </VStack>
        </Container>
    </Box>
  );
}