import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Badge,
  Button,
  Wrap,
  WrapItem,
  List,
  ListItem,
  ListIcon,
  Divider,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FaCheck, FaArrowRight, FaEnvelope } from 'react-icons/fa';
import { Service } from '../../data/services';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onGetQuote?: (serviceTitle: string) => void;
  onContact?: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onGetQuote,
  onContact,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!service) return null;

  const handleGetQuoteClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'service_modal_quote_request', {
        event_category: 'Conversion',
        event_label: service.title,
        value: 1,
      });
    }
    onGetQuote?.(service.title);
    onClose();
  };

  const handleContactClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'service_modal_contact_click', {
        event_category: 'Services',
        event_label: service.title,
        value: 1,
      });
    }
    onContact?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} mx={4}>
        <ModalHeader pb={4}>
          <VStack spacing={3} align="start">
            <HStack spacing={4}>
              <Icon
                as={service.icon}
                boxSize={8}
                color={service.featured ? 'brand.500' : 'brand.400'}
              />
              <VStack spacing={1} align="start">
                <Heading size="lg" lineHeight="short">
                  {service.title}
                </Heading>
                <Text color={textColor} fontSize="md" fontWeight="medium">
                  {service.subtitle}
                </Text>
              </VStack>
            </HStack>
            {service.featured && (
              <Badge
                colorScheme="brand"
                variant="solid"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="bold"
              >
                ⭐ Serviço Popular
              </Badge>
            )}
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Description */}
            <Box>
              <Heading size="sm" mb={3} color="brand.500">
                Sobre o Serviço
              </Heading>
              <Text color={textColor} lineHeight="tall" fontSize="md">
                {service.description}
              </Text>
            </Box>

            <Divider borderColor={borderColor} />

            {/* Technologies */}
            <Box>
              <Heading size="sm" mb={3} color="brand.500">
                Tecnologias Utilizadas
              </Heading>
              <Wrap spacing={2}>
                {service.technologies.map((tech, index) => (
                  <WrapItem key={index}>
                    <Badge
                      colorScheme="gray"
                      variant="subtle"
                      borderRadius="md"
                      px={3}
                      py={1}
                      fontSize="sm"
                    >
                      {tech}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>

            <Divider borderColor={borderColor} />

            {/* Features */}
            <Box>
              <Heading size="sm" mb={3} color="brand.500">
                O que está incluído
              </Heading>
              <List spacing={2}>
                {service.features.map((feature, index) => (
                  <ListItem key={index} fontSize="sm" color={textColor}>
                    <ListIcon as={FaCheck} color="green.500" />
                    {feature}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider borderColor={borderColor} />

            {/* Timeline */}
            <Box>
              <Heading size="sm" mb={3} color="brand.500">
                Prazo de Entrega
              </Heading>
              <HStack spacing={3}>
                <Icon as={FaArrowRight} color="brand.400" />
                <Text fontSize="md" color={textColor} fontWeight="medium">
                  {service.duration}
                </Text>
              </HStack>
              <Text fontSize="sm" color={textColor} mt={2}>
                O prazo pode variar dependendo da complexidade e escopo do projeto.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter pt={6} borderTop="1px solid" borderColor={borderColor}>
          <VStack spacing={3} w="full">
            <Button
              colorScheme="brand"
              size="lg"
              width="full"
              rightIcon={<FaArrowRight />}
              onClick={handleGetQuoteClick}
              fontWeight="semibold"
              _hover={{
                transform: 'translateY(-1px)',
              }}
              transition="all 0.2s"
            >
              Solicitar Orçamento
            </Button>

            <Button
              variant="ghost"
              size="md"
              width="full"
              leftIcon={<FaEnvelope />}
              onClick={handleContactClick}
              color={textColor}
              _hover={{
                color: 'brand.500',
                bg: 'brand.50',
              }}
            >
              Falar sobre este serviço
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 