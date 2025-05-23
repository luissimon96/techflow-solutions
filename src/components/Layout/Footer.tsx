import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre', path: '/sobre' },
      { label: 'Serviços', path: '/servicos' },
      { label: 'Clientes', path: '/clientes' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Blog', path: '/blog' },
      { label: 'Contato', path: '/contato' },
      { label: 'FAQ', path: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidade', path: '/privacidade' },
      { label: 'Termos', path: '/termos' },
    ],
  },
];

export function Footer() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="footer"
      bg={bg}
      borderTop="1px"
      borderColor={borderColor}
      py={8}
    >
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
        >
          {footerLinks.map((group) => (
            <Stack key={group.title} spacing={4} align={{ base: 'center', md: 'flex-start' }}>
              <Text fontWeight="bold" fontSize="sm">
                {group.title}
              </Text>
              {group.links.map((link) => (
                <Link
                  key={link.path}
                  as={RouterLink}
                  to={link.path}
                  fontSize="sm"
                  color="gray.600"
                  _hover={{ color: 'brand.500' }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          ))}
        </Stack>

        <Box
          mt={8}
          pt={8}
          borderTop="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.600">
            © {new Date().getFullYear()} TechFlow Solutions. Todos os direitos reservados.
          </Text>
        </Box>
      </Container>
    </Box>
  );
} 