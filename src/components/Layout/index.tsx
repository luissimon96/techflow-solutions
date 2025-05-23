import { Box, Container } from '@chakra-ui/react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box as="main" flex="1">
        <Container py={8}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
} 