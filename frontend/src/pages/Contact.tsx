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
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

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
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.subject.trim()) newErrors.subject = 'Assunto é obrigatório';
    if (!formData.message.trim()) newErrors.message = 'Mensagem é obrigatória';
    if (!formData.consent) newErrors.consent = 'Você deve aceitar os termos';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));

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

    } catch (error) {
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Tente novamente em alguns minutos.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = 'Olá! Gostaria de saber mais sobre os serviços da TechFlow Solutions.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5554997109051?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box py={20}>
      <Container>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading as="h1" mb={4}>Entre em Contato</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Estamos prontos para ajudar você a transformar seu negócio. Entre em contato conosco e
              descubra como podemos contribuir para o seu sucesso.
            </Text>
          </Box>

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
            >
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">Nome</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    disabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
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
                    disabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.company}>
                  <FormLabel htmlFor="company">Empresa (opcional)</FormLabel>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Nome da sua empresa"
                    disabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.company}</FormErrorMessage>
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
                    disabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.subject}>
                  <FormLabel htmlFor="subject">Assunto</FormLabel>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sobre o que você gostaria de falar?"
                    disabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.subject}</FormErrorMessage>
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
                    disabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.message}</FormErrorMessage>
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
                    <Icon as={FaEnvelope} boxSize={6} color="brand.500" />
                    <Text>luissimonazure@gmail.com</Text>
                  </Stack>

                  <Stack direction="row" align="center" spacing={4}>
                    <Icon as={FaPhone} boxSize={6} color="brand.500" />
                    <Text>(54) 99710-9051</Text>
                  </Stack>

                  <Stack direction="row" align="center" spacing={4}>
                    <Icon as={FaMapMarkerAlt} boxSize={6} color="brand.500" />
                    <Text>Carazinho, RS - Brasil</Text>
                  </Stack>
                </VStack>
              </Box>

              <Button
                onClick={openWhatsApp}
                colorScheme="green"
                size="lg"
                leftIcon={<Icon as={FaPhone} />}
              >
                Fale Conosco pelo WhatsApp
              </Button>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}