import { useState } from 'react';
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
  Icon,
  Stack,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Checkbox,
  Spinner,
  Progress,
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { SEOHead, SCHEMA_TEMPLATES } from '@/components/common/SEOHead';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import {
  contactFormSchema,
  type ContactFormData,
  rateLimiter,
  validateAndSanitize
} from '@/lib/validation';
import { sendContactData, handleApiError } from '@/lib/api';

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);

  const toast = useToast();

  const validateField = (name: keyof ContactFormData, value: any) => {
    try {
      const fieldSchema = contactFormSchema.shape[name];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Campo inválido';
      setErrors(prev => ({ ...prev, [name]: message }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Validação em tempo real
    if (value.trim() || type === 'checkbox') {
      validateField(name as keyof ContactFormData, fieldValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar rate limiting
    const clientId = `contact_${formData.email}`;
    if (!rateLimiter.isAllowed(clientId, 3, 300000)) { // 3 tentativas por 5 minutos
      setRateLimitExceeded(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(0);
    setErrors({});

    try {
      // Validar e sanitizar dados
      const validatedData = validateAndSanitize(contactFormSchema, formData);

      // Progresso de envio
      setSubmitProgress(25);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Enviar dados para a API
      setSubmitProgress(75);
      await sendContactData(validatedData);

      setSubmitProgress(100);

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        consent: false,
      });

      toast({
        title: 'Mensagem enviada com sucesso!',
        description: 'Entraremos em contato em breve.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (error: any) {
      if (error.name === 'ZodError') {
        // Mapear erros de validação
        const fieldErrors: FormErrors = {};
        error.errors.forEach((err: any) => {
          const field = err.path[0] as keyof ContactFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        const errorMessage = handleApiError(error);
        toast({
          title: 'Erro ao enviar mensagem',
          description: errorMessage,
          status: 'error',
          duration: 7000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
      setSubmitProgress(0);
    }
  };

  const resetRateLimit = () => {
    const clientId = `contact_${formData.email}`;
    rateLimiter.reset(clientId);
    setRateLimitExceeded(false);
  };

  return (
    <>
      <SEOHead
        title="Contato"
        description="Entre em contato com a TechFlow Solutions. Estamos prontos para ajudar você a transformar seu negócio com soluções tecnológicas inovadoras."
        keywords="contato, TechFlow Solutions, orçamento, consultoria, desenvolvimento software"
        url="https://techflow.solutions/contact"
        schema={SCHEMA_TEMPLATES.contact}
      />

      <Box py={20}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <Box textAlign="center">
              <Heading as="h1" mb={4}>Entre em Contato</Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Estamos prontos para ajudar você a transformar seu negócio. Entre em contato conosco e
                descubra como podemos contribuir para o seu sucesso.
              </Text>
            </Box>

            {rateLimitExceeded && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Muitas tentativas!</AlertTitle>
                <AlertDescription>
                  Aguarde alguns minutos antes de tentar novamente.
                  <Button size="sm" ml={4} onClick={resetRateLimit}>
                    Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {submitSuccess && (
              <Alert status="success" borderRadius="md">
                <AlertIcon as={FaCheckCircle} />
                <AlertTitle>Mensagem enviada!</AlertTitle>
                <AlertDescription>
                  Recebemos sua mensagem e entraremos em contato em breve.
                </AlertDescription>
              </Alert>
            )}

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="100%">
              {/* Formulário de Contato */}
              <Box
                as="form"
                onSubmit={handleSubmit}
                p={8}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
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

                <VStack spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.name}>
                    <FormLabel htmlFor="name">Nome</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      aria-describedby={errors.name ? "name-error" : undefined}
                      disabled={isSubmitting}
                    />
                    <FormErrorMessage id="name-error">{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">E-mail</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      disabled={isSubmitting}
                    />
                    <FormErrorMessage id="email-error">{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.company}>
                    <FormLabel htmlFor="company">Empresa (opcional)</FormLabel>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Nome da sua empresa"
                      aria-describedby={errors.company ? "company-error" : undefined}
                      disabled={isSubmitting}
                    />
                    <FormErrorMessage id="company-error">{errors.company}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel htmlFor="phone">Telefone (opcional)</FormLabel>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      disabled={isSubmitting}
                    />
                    <FormErrorMessage id="phone-error">{errors.phone}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.subject}>
                    <FormLabel htmlFor="subject">Assunto</FormLabel>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sobre o que você gostaria de falar?"
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                      disabled={isSubmitting}
                    />
                    <FormErrorMessage id="subject-error">{errors.subject}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.message}>
                    <FormLabel htmlFor="message">Mensagem</FormLabel>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Como podemos ajudar? Descreva seu projeto ou necessidade..."
                      rows={5}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      disabled={isSubmitting}
                    />
                    <FormErrorMessage id="message-error">{errors.message}</FormErrorMessage>
                  </FormControl>

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
                      </Text>
                    </Checkbox>
                    <FormErrorMessage>{errors.consent}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    width="100%"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Enviando..."
                    disabled={rateLimitExceeded}
                    leftIcon={isSubmitting ? <Spinner size="sm" /> : undefined}
                  >
                    Enviar Mensagem
                  </Button>
                </VStack>
              </Box>

              {/* Informações de Contato */}
              <VStack spacing={8} align="stretch">
                <Box p={8} bg="white" borderRadius="lg" boxShadow="md">
                  <VStack spacing={6} align="start">
                    <Stack direction="row" align="center" spacing={4}>
                      <Icon as={FaEnvelope} boxSize={6} color="brand.500" aria-hidden="true" />
                      <Text>contato@techflow.com.br</Text>
                    </Stack>

                    <Stack direction="row" align="center" spacing={4}>
                      <Icon as={FaPhone} boxSize={6} color="brand.500" aria-hidden="true" />
                      <Text>(11) 99999-9999</Text>
                    </Stack>

                    <Stack direction="row" align="center" spacing={4}>
                      <Icon as={FaMapMarkerAlt} boxSize={6} color="brand.500" aria-hidden="true" />
                      <Text>São Paulo, SP - Brasil</Text>
                    </Stack>
                  </VStack>
                </Box>

                <Button
                  as="a"
                  href={getWhatsAppUrl('Olá! Gostaria de saber mais sobre os serviços da TechFlow Solutions.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="green"
                  size="lg"
                  leftIcon={<Icon as={FaPhone} />}
                  aria-label="Falar conosco pelo WhatsApp"
                >
                  Fale Conosco pelo WhatsApp
                </Button>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </>
  );
} 