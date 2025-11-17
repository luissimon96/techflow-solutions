import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Progress,
  Divider,
  Badge,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import {
  FaUser,
  FaBuilding,
  FaDesktop,
  FaShieldAlt,
  FaCloud,
  FaTools,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { motion, isValidMotionProp } from 'framer-motion';
import { itServices, getIndividualPackages, getBusinessPackages } from '../../data/itServices';
import { chakra, shouldForwardProp } from '@chakra-ui/react';

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

interface FormData {
  // Step 1: Tipo de Cliente
  clientType: 'individual' | 'business';
  
  // Step 2: Dados básicos
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  
  // Step 3: Serviços de interesse
  interestedServices: string[];
  
  // Step 4: Detalhes específicos
  numberOfUsers?: number;
  currentInfrastructure?: string;
  mainChallenges?: string[];
  budget?: string;
  timeline?: string;
  
  // Step 5: Informações adicionais
  additionalInfo?: string;
  preferredContact: 'whatsapp' | 'email' | 'phone';
  bestTimeToContact?: string;
}

interface ITQuoteFormProps {
  initialService?: string;
  onSubmit?: (data: FormData) => Promise<void>;
  onClose?: () => void;
}

const steps = [
  { id: 1, title: 'Tipo de Cliente', icon: FaUser },
  { id: 2, title: 'Dados de Contato', icon: FaEnvelope },
  { id: 3, title: 'Serviços', icon: FaDesktop },
  { id: 4, title: 'Detalhes', icon: FaTools },
  { id: 5, title: 'Finalização', icon: FaWhatsapp },
];

export const ITQuoteForm: React.FC<ITQuoteFormProps> = ({
  initialService,
  onSubmit,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    clientType: 'business',
    name: '',
    email: '',
    phone: '',
    interestedServices: initialService ? [initialService] : [],
    preferredContact: 'whatsapp',
  });
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Calcular preço estimado baseado nas seleções
  useEffect(() => {
    if (formData.interestedServices.length > 0 && formData.numberOfUsers) {
      const packages = formData.clientType === 'individual' 
        ? getIndividualPackages() 
        : getBusinessPackages();
      
      const basePrice = packages[0]?.price || 0;
      const serviceMultiplier = formData.interestedServices.length * 0.8; // Desconto por bundling
      const userMultiplier = formData.clientType === 'business' 
        ? Math.max(1, (formData.numberOfUsers || 1) / 10)
        : 1;
      
      setEstimatedPrice(Math.round(basePrice * serviceMultiplier * userMultiplier));
    }
  }, [formData.interestedServices, formData.numberOfUsers, formData.clientType]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.clientType) {
          newErrors.clientType = 'Selecione o tipo de cliente';
        }
        break;
      case 2:
        if (!formData.name.trim()) {
          newErrors.name = 'Nome é obrigatório';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email inválido';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Telefone é obrigatório';
        }
        if (formData.clientType === 'business' && !formData.company?.trim()) {
          newErrors.company = 'Nome da empresa é obrigatório';
        }
        break;
      case 3:
        if (formData.interestedServices.length === 0) {
          newErrors.interestedServices = 'Selecione pelo menos um serviço';
        }
        break;
      case 4:
        if (formData.clientType === 'business' && !formData.numberOfUsers) {
          newErrors.numberOfUsers = 'Informe o número de usuários';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
      toast({
        title: 'Orçamento solicitado!',
        description: 'Entraremos em contato em até 2 horas.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose?.();
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente ou entre em contato via WhatsApp.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md">Você é pessoa física ou jurídica?</Heading>
            <RadioGroup
              value={formData.clientType}
              onChange={(value: 'individual' | 'business') => 
                updateFormData({ clientType: value })}
            >
              <VStack spacing={4} align="stretch">
                <Box
                  p={4}
                  border="2px solid"
                  borderColor={formData.clientType === 'individual' ? 'brand.500' : borderColor}
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ borderColor: 'brand.300' }}
                >
                  <Radio value="individual" size="lg">
                    <VStack spacing={2} align="start" ml={3}>
                      <HStack>
                        <Icon as={FaUser} color="blue.500" />
                        <Text fontWeight="semibold">Pessoa Física</Text>
                      </HStack>
                      <Text fontSize="sm" color={textColor}>
                        Suporte pessoal, família ou home office
                      </Text>
                    </VStack>
                  </Radio>
                </Box>

                <Box
                  p={4}
                  border="2px solid"
                  borderColor={formData.clientType === 'business' ? 'brand.500' : borderColor}
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ borderColor: 'brand.300' }}
                >
                  <Radio value="business" size="lg">
                    <VStack spacing={2} align="start" ml={3}>
                      <HStack>
                        <Icon as={FaBuilding} color="purple.500" />
                        <Text fontWeight="semibold">Pessoa Jurídica</Text>
                      </HStack>
                      <Text fontSize="sm" color={textColor}>
                        Empresa, startup ou organização
                      </Text>
                    </VStack>
                  </Radio>
                </Box>
              </VStack>
            </RadioGroup>
            {errors.clientType && (
              <Text color="red.500" fontSize="sm">{errors.clientType}</Text>
            )}
          </VStack>
        );

      case 2:
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Dados de Contato</Heading>
            
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Nome {formData.clientType === 'business' ? 'do Responsável' : 'Completo'}</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="Seu nome completo"
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="seu@email.com"
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.phone}>
              <FormLabel>Telefone/WhatsApp</FormLabel>
              <Input
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </FormControl>

            {formData.clientType === 'business' && (
              <>
                <FormControl isRequired isInvalid={!!errors.company}>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <Input
                    value={formData.company || ''}
                    onChange={(e) => updateFormData({ company: e.target.value })}
                    placeholder="Nome da sua empresa"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cargo/Posição</FormLabel>
                  <Input
                    value={formData.position || ''}
                    onChange={(e) => updateFormData({ position: e.target.value })}
                    placeholder="CEO, CTO, Gerente de TI..."
                  />
                </FormControl>
              </>
            )}

            {Object.values(errors).map((error, index) => (
              <Text key={index} color="red.500" fontSize="sm">{error}</Text>
            ))}
          </VStack>
        );

      case 3:
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md">Quais serviços te interessam?</Heading>
            <Text color={textColor}>Selecione todos os serviços que podem ser úteis:</Text>
            
            <CheckboxGroup
              value={formData.interestedServices}
              onChange={(values: string[]) => 
                updateFormData({ interestedServices: values })}
            >
              <VStack spacing={4} align="stretch">
                {itServices
                  .filter(service => 
                    service.targetAudience === formData.clientType || 
                    service.targetAudience === 'both')
                  .map((service) => (
                    <Box
                      key={service.id}
                      p={4}
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="lg"
                      _hover={{ borderColor: 'brand.300', bg: 'brand.50' }}
                    >
                      <Checkbox value={service.id} size="lg">
                        <HStack spacing={3} ml={3}>
                          <Icon as={service.icon} color="brand.500" />
                          <VStack spacing={1} align="start">
                            <Text fontWeight="semibold">{service.title}</Text>
                            <Text fontSize="sm" color={textColor}>
                              {service.subtitle}
                            </Text>
                          </VStack>
                        </HStack>
                      </Checkbox>
                    </Box>
                  ))}
              </VStack>
            </CheckboxGroup>

            {errors.interestedServices && (
              <Text color="red.500" fontSize="sm">{errors.interestedServices}</Text>
            )}
          </VStack>
        );

      case 4:
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md">Detalhes do Projeto</Heading>

            {formData.clientType === 'business' && (
              <FormControl isRequired isInvalid={!!errors.numberOfUsers}>
                <FormLabel>Quantos usuários/dispositivos?</FormLabel>
                <NumberInput
                  value={formData.numberOfUsers || ''}
                  onChange={(value) => updateFormData({ numberOfUsers: parseInt(value) || undefined })}
                  min={1}
                  max={1000}
                >
                  <NumberInputField placeholder="Ex: 10" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Infraestrutura atual</FormLabel>
              <Textarea
                value={formData.currentInfrastructure || ''}
                onChange={(e) => updateFormData({ currentInfrastructure: e.target.value })}
                placeholder="Descreva brevemente sua infraestrutura atual de TI..."
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Principais desafios</FormLabel>
              <CheckboxGroup
                value={formData.mainChallenges || []}
                onChange={(values: string[]) => 
                  updateFormData({ mainChallenges: values })}
              >
                <VStack spacing={2} align="start">
                  {[
                    'Lentidão dos sistemas',
                    'Problemas de segurança',
                    'Falta de backup',
                    'Suporte técnico deficiente',
                    'Custos altos de TI',
                    'Falta de monitoramento',
                    'Dificuldade para escalar',
                  ].map((challenge) => (
                    <Checkbox key={challenge} value={challenge}>
                      {challenge}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Orçamento estimado (mensal)</FormLabel>
              <Select
                value={formData.budget || ''}
                onChange={(e) => updateFormData({ budget: e.target.value })}
                placeholder="Selecione uma faixa"
              >
                {formData.clientType === 'individual' ? (
                  <>
                    <option value="até-100">Até R$ 100</option>
                    <option value="100-200">R$ 100 - R$ 200</option>
                    <option value="200-500">R$ 200 - R$ 500</option>
                    <option value="500+">Acima de R$ 500</option>
                  </>
                ) : (
                  <>
                    <option value="até-1000">Até R$ 1.000</option>
                    <option value="1000-3000">R$ 1.000 - R$ 3.000</option>
                    <option value="3000-5000">R$ 3.000 - R$ 5.000</option>
                    <option value="5000+">Acima de R$ 5.000</option>
                  </>
                )}
              </Select>
            </FormControl>

            {estimatedPrice && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Preço Estimado:</AlertTitle>
                  <AlertDescription>
                    R$ {estimatedPrice}/mês baseado nas suas seleções
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {errors.numberOfUsers && (
              <Text color="red.500" fontSize="sm">{errors.numberOfUsers}</Text>
            )}
          </VStack>
        );

      case 5:
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md">Quase pronto!</Heading>
            
            <FormControl>
              <FormLabel>Informações adicionais</FormLabel>
              <Textarea
                value={formData.additionalInfo || ''}
                onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
                placeholder="Alguma informação adicional que gostaria de compartilhar..."
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Como prefere ser contatado?</FormLabel>
              <RadioGroup
                value={formData.preferredContact}
                onChange={(value: 'whatsapp' | 'email' | 'phone') => 
                  updateFormData({ preferredContact: value })}
              >
                <HStack spacing={6}>
                  <Radio value="whatsapp">
                    <HStack>
                      <Icon as={FaWhatsapp} color="green.500" />
                      <Text>WhatsApp</Text>
                    </HStack>
                  </Radio>
                  <Radio value="email">
                    <HStack>
                      <Icon as={FaEnvelope} color="blue.500" />
                      <Text>Email</Text>
                    </HStack>
                  </Radio>
                  <Radio value="phone">
                    <HStack>
                      <Icon as={FaPhone} color="purple.500" />
                      <Text>Ligação</Text>
                    </HStack>
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Melhor horário para contato</FormLabel>
              <Select
                value={formData.bestTimeToContact || ''}
                onChange={(e) => updateFormData({ bestTimeToContact: e.target.value })}
                placeholder="Selecione o horário"
              >
                <option value="manha">Manhã (8h - 12h)</option>
                <option value="tarde">Tarde (12h - 18h)</option>
                <option value="noite">Noite (18h - 22h)</option>
                <option value="qualquer">Qualquer horário</option>
              </Select>
            </FormControl>

            {/* Resumo do Orçamento */}
            <Box p={4} bg="brand.50" borderRadius="lg" border="1px solid" borderColor="brand.200">
              <VStack spacing={3} align="start">
                <Heading size="sm" color="brand.600">Resumo da Solicitação</Heading>
                <Text fontSize="sm">
                  <strong>Cliente:</strong> {formData.name} 
                  {formData.company && ` - ${formData.company}`}
                </Text>
                <Text fontSize="sm">
                  <strong>Tipo:</strong> {formData.clientType === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Text>
                <Text fontSize="sm">
                  <strong>Serviços:</strong> {formData.interestedServices.length} selecionados
                </Text>
                {formData.numberOfUsers && (
                  <Text fontSize="sm">
                    <strong>Usuários:</strong> {formData.numberOfUsers}
                  </Text>
                )}
                {estimatedPrice && (
                  <Text fontSize="sm">
                    <strong>Preço estimado:</strong> R$ {estimatedPrice}/mês
                  </Text>
                )}
              </VStack>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      // @ts-ignore - framer-motion transition prop type conflict
      transition={{ duration: 0.3 }}
    >
      <Box
        p={8}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="2xl"
        border="1px solid"
        borderColor={borderColor}
        maxW="2xl"
        mx="auto"
      >
        <VStack spacing={6}>
          {/* Progress Header */}
          <VStack spacing={4} w="full">
            <Heading size="lg" textAlign="center">
              Solicitar Orçamento de TI
            </Heading>
            
            <Box w="full">
              <Progress
                value={(currentStep / steps.length) * 100}
                colorScheme="brand"
                borderRadius="full"
                size="lg"
              />
              <HStack justify="space-between" mt={2}>
                {steps.map((step) => (
                  <VStack key={step.id} spacing={1}>
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={step.id <= currentStep ? 'brand.500' : 'gray.300'}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={step.icon} boxSize={3} />
                    </Box>
                    <Text fontSize="xs" color={textColor} textAlign="center" maxW="60px">
                      {step.title}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </Box>
          </VStack>

          <Divider />

          {/* Form Content */}
          <Box w="full" minH="400px">
            {renderStep()}
          </Box>

          {/* Navigation Buttons */}
          <HStack justify="space-between" w="full" pt={4}>
            <Button
              variant="ghost"
              leftIcon={<Icon as={FaArrowLeft} />}
              onClick={handleBack}
              isDisabled={currentStep === 1}
            >
              Voltar
            </Button>

            {currentStep < steps.length ? (
              <Button
                colorScheme="brand"
                rightIcon={<Icon as={FaArrowRight} />}
                onClick={handleNext}
              >
                Próximo
              </Button>
            ) : (
              <Button
                colorScheme="brand"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Enviando..."
                leftIcon={<Icon as={FaWhatsapp} />}
              >
                Solicitar Orçamento
              </Button>
            )}
          </HStack>

          {/* Help Text */}
          <Text fontSize="xs" color={textColor} textAlign="center" maxW="md">
            Suas informações são seguras e utilizadas apenas para elaborar seu orçamento personalizado.
            Resposta garantida em até 2 horas.
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
};