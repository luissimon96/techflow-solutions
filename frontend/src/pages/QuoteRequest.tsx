import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function QuoteRequest() {
  const navigate = useNavigate();
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

  const sendToWhatsApp = (data: QuoteFormData) => {
    let message = `🏢 *TechFlow Solutions - Solicitação de Orçamento*\n\n`;
    
    // Client Information
    message += `👤 *DADOS DO CLIENTE*\n`;
    message += `Nome: ${data.clientName}\n`;
    message += `Email: ${data.clientEmail}\n`;
    
    if (data.clientPhone) {
      message += `Telefone: ${data.clientPhone}\n`;
    }
    
    if (data.clientCompany) {
      message += `Empresa: ${data.clientCompany}\n`;
    }
    
    // Project Information
    message += `\n🚀 *DETALHES DO PROJETO*\n`;
    message += `Nome: ${data.projectName}\n`;
    message += `Tipo: ${data.projectType}\n`;
    message += `Descrição: ${data.projectDescription}\n`;
    
    // Timeline & Budget
    if (data.timeline || data.budget) {
      message += `\n💰 *CRONOGRAMA E ORÇAMENTO*\n`;
      
      if (data.timeline) {
        message += `Prazo: ${data.timeline}\n`;
      }
      
      if (data.budget) {
        message += `Orçamento: ${data.budget}\n`;
      }
    }
    
    // Additional Information
    if (data.mainGoals) {
      message += `\n🎯 *OBJETIVOS PRINCIPAIS*\n${data.mainGoals}\n`;
    }
    
    message += `\n⏰ *Solicitado em:* ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `📋 Nossa equipe analisará sua solicitação e retornará em até 24 horas com uma proposta detalhada!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5554997109051?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.clientName || !formData.clientEmail || !formData.projectName || 
        !formData.projectDescription || !formData.projectType || !formData.consent) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send via WhatsApp
      sendToWhatsApp(formData);

      // Show success
      setSubmitSuccess(true);
      
      toast({
        title: 'Orçamento enviado com sucesso! 📱',
        description: 'Você será redirecionado para o WhatsApp para finalizar sua solicitação.',
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
        projectName: '',
        projectDescription: '',
        projectType: '',
        timeline: '',
        budget: '',
        mainGoals: '',
        consent: false,
      });

    } catch (error) {
      console.error('Error sending quote:', error);
      toast({
        title: 'Erro ao enviar solicitação',
        description: 'Tente novamente ou entre em contato diretamente conosco.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
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