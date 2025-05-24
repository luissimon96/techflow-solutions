import { Box, Container, HStack, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function Header() {
  return (
    <Box as="header" position="fixed" w="100%" bg="white" boxShadow="sm" zIndex="sticky">
      <Container>
        <HStack h="16" justify="space-between">
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            fontSize="xl"
            fontWeight="bold"
            color="brand.500"
          >
            TechFlow Solutions
          </Button>

          <HStack spacing={4}>
            <Button as={RouterLink} to="/servicos" variant="ghost">
              Serviços
            </Button>
            <Button as={RouterLink} to="/clientes" variant="ghost">
              Clientes
            </Button>
            <Button as={RouterLink} to="/blog" variant="ghost">
              Blog
            </Button>
            <Button as={RouterLink} to="/contato" variant="ghost">
              Contato
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
} 