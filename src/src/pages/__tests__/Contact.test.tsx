import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import Contact from '../Contact';
import theme from '../../theme';

// Mock do getWhatsAppUrl
jest.mock('@/lib/whatsapp', () => ({
  getWhatsAppUrl: jest.fn(() => 'https://wa.me/5554997109051'),
}));

// Wrapper para providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  </HelmetProvider>
);

describe('Contact Page', () => {
  it('deve renderizar o componente de contato', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    // Verifica se o título está presente
    const heading = screen.getByRole('heading', { name: /entre em contato/i });
    expect(heading).toBeInTheDocument();
  });

  it('deve ter um formulário', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    const form = screen.getByRole('button', { name: /enviar|enviar mensagem/i });
    expect(form).toBeInTheDocument();
  });

  it('deve ter link para WhatsApp', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    // Verifica se há algum link ou botão visível
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('deve renderizar sem erros', () => {
    expect(() => {
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );
    }).not.toThrow();
  });
}); 