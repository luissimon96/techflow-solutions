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
  Card,
  CardBody,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

const MotionBox = motion(Box);

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
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
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
    <Box
      as="section"
      minH="100vh"
      pt={{ base: 32, md: 40, lg: 44 }}
      pb={{ base: 16, md: 20, lg: 24 }}
      bgGradient="linear(to-br, gray.50, white, gray.50)"
    >
      <Container maxW={{ base: "container.sm", md: "container.md", lg: "container.lg", xl: "container.xl" }}>
        <VStack spacing={{ base: 12, md: 16, lg: 20 }}>
          {/* Hero Section */}
          <MotionBox
            textAlign="center"
            maxW="3xl"
            mx="auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              mb={{ base: 6, md: 8 }}
              bgGradient="linear(to-r, brand.600, brand.400)"
              bgClip="text"
              fontWeight="extrabold"
              lineHeight="shorter"
              letterSpacing="tight"
            >
              Entre em Contato
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              maxW="2xl"
              mx="auto"
              lineHeight="tall"
              fontWeight="medium"
            >
              Estamos prontos para ajudar você a transformar seu negócio. Preencha o formulário ou entre em contato através de um dos nossos canais de comunicação.
            </Text>
          </MotionBox>

          {submitSuccess && (
            <MotionBox
              width="100%"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                status="success"
                borderRadius="lg"
                boxShadow="md"
                bg="green.50"
                borderLeft="4px solid"
                borderColor="green.500"
              >
                <AlertIcon as={FaCheckCircle} color="green.600" />
                <Box>
                  <AlertTitle color="green.800">Mensagem enviada com sucesso!</AlertTitle>
                  <AlertDescription color="green.700">
                    Recebemos sua mensagem e entraremos em contato em breve.
                  </AlertDescription>
                </Box>
              </Alert>
            </MotionBox>
          )}

          {/* Contact Content */}
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, md: 12 }}
            width="100%"
            alignItems="start"
          >
            {/* Formulário de Contato */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              width="100%"
            >
              <Card
                bg={cardBg}
                boxShadow="lg"
                borderRadius="xl"
                border="1px solid"
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack
                    as="form"
                    onSubmit={handleSubmit}
                    spacing={6}
                  >
                    <FormControl isRequired isInvalid={!!errors.name}>
                      <FormLabel htmlFor="name" fontWeight="semibold">
                        Nome
                      </FormLabel>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        disabled={isSubmitting}
                        borderRadius="md"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.email}>
                      <FormLabel htmlFor="email" fontWeight="semibold">
                        E-mail
                      </FormLabel>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        disabled={isSubmitting}
                        borderRadius="md"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.company}>
                      <FormLabel htmlFor="company" fontWeight="semibold">
                        Empresa (opcional)
                      </FormLabel>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Nome da sua empresa"
                        disabled={isSubmitting}
                        borderRadius="md"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                      />
                      <FormErrorMessage>{errors.company}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.phone}>
                      <FormLabel htmlFor="phone" fontWeight="semibold">
                        Telefone (opcional)
                      </FormLabel>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        disabled={isSubmitting}
                        borderRadius="md"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                      />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.subject}>
                      <FormLabel htmlFor="subject" fontWeight="semibold">
                        Assunto
                      </FormLabel>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Sobre o que você gostaria de falar?"
                        disabled={isSubmitting}
                        borderRadius="md"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
                      />
                      <FormErrorMessage>{errors.subject}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.message}>
                      <FormLabel htmlFor="message" fontWeight="semibold">
                        Mensagem
                      </FormLabel>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Como podemos ajudar? Descreva seu projeto ou necessidade..."
                        rows={5}
                        disabled={isSubmitting}
                        borderRadius="md"
                        _focus={{
                          borderColor: 'brand.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                        }}
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
                        <Text fontSize="sm" color={textColor}>
                          Concordo com o tratamento dos meus dados pessoais de acordo com a{' '}
                          <Text as="span" color="brand.500" fontWeight="semibold" textDecoration="underline">
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
                      fontWeight="bold"
                      h="14"
                      fontSize="md"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Enviar Mensagem
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </MotionBox>

            {/* Informações de Contato */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              width="100%"
            >
              <VStack spacing={6}>
                <Card
                  bg={cardBg}
                  boxShadow="lg"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={borderColor}
                  width="100%"
                >
                  <CardBody>
                    <VStack spacing={6} align="start" width="100%">
                      <VStack spacing={4} align="start" width="100%">
                        <Heading
                          as="h3"
                          size="md"
                          fontWeight="bold"
                          color="brand.600"
                        >
                          Informações de Contato
                        </Heading>
                      </VStack>

                      <HStack
                        spacing={4}
                        width="100%"
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.600')}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={borderColor}
                      >
                        <Icon
                          as={FaEnvelope}
                          boxSize={5}
                          color="brand.500"
                          flexShrink={0}
                        />
                        <VStack spacing={1} align="start" flex={1}>
                          <Text fontSize="sm" color={textColor} fontWeight="medium">
                            E-mail
                          </Text>
                          <Text fontWeight="semibold">
                            contato@techflowsolutions.com
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack
                        spacing={4}
                        width="100%"
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.600')}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={borderColor}
                      >
                        <Icon
                          as={FaPhone}
                          boxSize={5}
                          color="brand.500"
                          flexShrink={0}
                        />
                        <VStack spacing={1} align="start" flex={1}>
                          <Text fontSize="sm" color={textColor} fontWeight="medium">
                            Telefone
                          </Text>
                          <Text fontWeight="semibold">
                            (54) 99710-9051
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack
                        spacing={4}
                        width="100%"
                        p={4}
                        bg={useColorModeValue('gray.50', 'gray.600')}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={borderColor}
                      >
                        <Icon
                          as={FaMapMarkerAlt}
                          boxSize={5}
                          color="brand.500"
                          flexShrink={0}
                        />
                        <VStack spacing={1} align="start" flex={1}>
                          <Text fontSize="sm" color={textColor} fontWeight="medium">
                            Localização
                          </Text>
                          <Text fontWeight="semibold">
                            Foz do Iguaçu, Paraná - Brasil
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Button
                  onClick={openWhatsApp}
                  colorScheme="whatsapp"
                  size="lg"
                  width="100%"
                  leftIcon={<Icon as={FaWhatsapp} />}
                  fontWeight="bold"
                  h="14"
                  fontSize="md"
                  boxShadow="md"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  Fale Conosco no WhatsApp
                </Button>
              </VStack>
            </MotionBox>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}