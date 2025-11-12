import {
  Box,
  Container,
  HStack,
  VStack,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Divider,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Logo } from './common/Logo';
import { useEffect, useState } from 'react';

// Animation keyframes
const slideDown = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  isExternal?: boolean;
}

const NavItem = ({ to, children, isActive, onClick, isExternal }: NavItemProps) => (
  <Button
    as={isExternal ? 'a' : RouterLink}
    to={!isExternal ? to : undefined}
    href={isExternal ? to : undefined}
    target={isExternal ? '_blank' : undefined}
    rel={isExternal ? 'noopener noreferrer' : undefined}
    variant="ghost"
    size="md"
    fontWeight={isActive ? 'bold' : 'medium'}
    color={isActive ? 'brand.600' : 'gray.700'}
    _hover={{
      color: 'brand.500',
      transform: 'translateY(-2px)',
      transition: 'all 0.2s ease-in-out',
    }}
    _active={{
      transform: 'translateY(0px)',
    }}
    onClick={onClick}
    position="relative"
    _after={isActive ? {
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '2px',
      bg: 'brand.500',
      borderRadius: 'full',
    } : undefined}
    aria-current={isActive ? 'page' : undefined}
  >
    {children}
  </Button>
);

const CTAButton = ({ onClick }: { onClick?: () => void }) => (
  <Button
    as={RouterLink}
    to="/orcamento"
    colorScheme="brand"
    size="md"
    fontWeight="bold"
    px={6}
    _hover={{
      transform: 'translateY(-3px)',
      boxShadow: 'lg',
      animation: `${floatAnimation} 2s ease-in-out infinite`,
    }}
    _active={{
      transform: 'translateY(-1px)',
    }}
    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    onClick={onClick}
    aria-label="Solicitar orçamento - Preencha o formulário de orçamento"
  >
    Solicitar Orçamento
  </Button>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const navigationItems = [
    { path: '/servicos', label: 'Serviços', description: 'Nossos serviços especializados' },
    { path: 'https://www.srluissimon.com/clientes', label: 'Portfólio', description: 'Projetos desenvolvidos', isExternal: true },
    { path: '/sobre', label: 'Sobre', description: 'Nossa história e missão' },
    { path: '/blog', label: 'Blog', description: 'Artigos e insights' },
  ];

  return (
    <Box
      as="header"
      position="fixed"
      w="100%"
      zIndex="modal"
      transition="all 0.3s ease-in-out"
      animation={`${slideDown} 0.8s ease-out`}
      bg={hasScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)'}
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor={hasScrolled ? 'gray.200' : 'transparent'}
      boxShadow={hasScrolled ? 'lg' : 'sm'}
    >
      <Container maxW="container.xl">
        <HStack h="20" justify="space-between" align="center">
          {/* Logo */}
          <Box
            as={RouterLink}
            to="/"
            _hover={{
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out',
            }}
            aria-label="TechFlow Solutions - Página inicial"
          >
            <Logo size="lg" />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <HStack spacing={8} flex={1} justify="center">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.path}
                    to={item.path}
                    isActive={!item.isExternal && location.pathname === item.path}
                    isExternal={item.isExternal}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </HStack>

              <CTAButton />
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              aria-label="Abrir menu de navegação"
              icon={<HamburgerIcon />}
              variant="ghost"
              onClick={onOpen}
              size="lg"
              _hover={{
                transform: 'rotate(90deg)',
                bg: 'brand.50',
                color: 'brand.500',
              }}
              transition="all 0.3s ease-in-out"
            />
          )}
        </HStack>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerContent>
          <DrawerCloseButton
            size="lg"
            _hover={{
              transform: 'rotate(90deg)',
              bg: 'red.50',
              color: 'red.500',
            }}
            transition="all 0.3s ease-in-out"
          />
          
          <DrawerHeader borderBottomWidth="1px" pb={4}>
            <Logo size="md" />
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch" pt={6}>
              {/* Navigation Items */}
              {navigationItems.map((item, index) => (
                <Box key={item.path}>
                  <NavItem
                    to={item.path}
                    isActive={!item.isExternal && location.pathname === item.path}
                    isExternal={item.isExternal}
                    onClick={onClose}
                  >
                    {item.label}
                  </NavItem>
                  <Box fontSize="sm" color="gray.500" mt={1} pl={4}>
                    {item.description}
                  </Box>
                  {index < navigationItems.length - 1 && <Divider mt={4} />}
                </Box>
              ))}
              
              {/* CTA Button */}
              <Box pt={8}>
                <CTAButton onClick={onClose} />
              </Box>

              {/* Contact Info */}
              <Box pt={8} fontSize="sm" color="gray.500">
                <Box mb={2}>📧 contato@techflowsolutions.com</Box>
                <Box>📱 (11) 9 9999-9999</Box>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
} 