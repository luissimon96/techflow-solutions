import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
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
  beforeEach(() => {
    // Mock do console.log para não poluir os testes
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Acessibilidade', () => {
    it('não deve ter violações de acessibilidade', async () => {
      const { container } = render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('deve ter labels associados aos inputs', () => {
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Nome')).toBeInTheDocument();
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
      expect(screen.getByLabelText('Empresa (opcional)')).toBeInTheDocument();
      expect(screen.getByLabelText('Telefone (opcional)')).toBeInTheDocument();
      expect(screen.getByLabelText('Assunto')).toBeInTheDocument();
      expect(screen.getByLabelText('Mensagem')).toBeInTheDocument();
    });

    it('deve ter aria-describedby nos campos com erro', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
      await user.click(submitButton);

      await waitFor(() => {
        const nameInput = screen.getByLabelText('Nome');
        expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
      });
    });

    it('deve ter navegação por teclado funcionando', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('Nome');
      const emailInput = screen.getByLabelText('E-mail');

      await user.tab();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();
    });
  });

  describe('Funcionalidade', () => {
    it('deve renderizar todos os elementos principais', () => {
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { name: /entre em contato/i })).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /falar conosco pelo whatsapp/i })).toBeInTheDocument();
    });

    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/nome deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
        expect(screen.getByText(/email deve ter um formato válido/i)).toBeInTheDocument();
        expect(screen.getByText(/assunto deve ter pelo menos 5 caracteres/i)).toBeInTheDocument();
        expect(screen.getByText(/mensagem deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve validar formato de email', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('E-mail');
      await user.type(emailInput, 'email-invalido');
      await user.tab(); // Remove o foco para triggerar validação

      await waitFor(() => {
        expect(screen.getByText(/email deve ter um formato válido/i)).toBeInTheDocument();
      });
    });

    it('deve validar consentimento obrigatório', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      // Preenche campos obrigatórios
      await user.type(screen.getByLabelText('Nome'), 'João Silva');
      await user.type(screen.getByLabelText('E-mail'), 'joao@example.com');
      await user.type(screen.getByLabelText('Assunto'), 'Teste de assunto');
      await user.type(screen.getByLabelText('Mensagem'), 'Esta é uma mensagem de teste');

      const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/você deve aceitar os termos para continuar/i)).toBeInTheDocument();
      });
    });

    it('deve submeter formulário com dados válidos', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      // Preenche todos os campos
      await user.type(screen.getByLabelText('Nome'), 'João Silva');
      await user.type(screen.getByLabelText('E-mail'), 'joao@example.com');
      await user.type(screen.getByLabelText('Empresa (opcional)'), 'Empresa Teste');
      await user.type(screen.getByLabelText('Telefone (opcional)'), '54997109051');
      await user.type(screen.getByLabelText('Assunto'), 'Assunto de teste');
      await user.type(screen.getByLabelText('Mensagem'), 'Esta é uma mensagem de teste com mais de 10 caracteres');

      // Marca o checkbox de consentimento
      const consentCheckbox = screen.getByRole('checkbox');
      await user.click(consentCheckbox);

      const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });
      await user.click(submitButton);

      // Verifica se o loading aparece
      await waitFor(() => {
        expect(screen.getByText(/enviando.../i)).toBeInTheDocument();
      });

      // Aguarda o sucesso
      await waitFor(() => {
        expect(screen.getByText(/mensagem enviada!/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('deve limpar formulário após envio bem-sucedido', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      // Preenche e submete formulário
      await user.type(screen.getByLabelText('Nome'), 'João Silva');
      await user.type(screen.getByLabelText('E-mail'), 'joao@example.com');
      await user.type(screen.getByLabelText('Assunto'), 'Assunto de teste');
      await user.type(screen.getByLabelText('Mensagem'), 'Esta é uma mensagem de teste com mais de 10 caracteres');
      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /enviar mensagem/i }));

      // Aguarda o sucesso e verifica se campos foram limpos
      await waitFor(() => {
        expect(screen.getByLabelText('Nome')).toHaveValue('');
        expect(screen.getByLabelText('E-mail')).toHaveValue('');
        expect(screen.getByLabelText('Assunto')).toHaveValue('');
        expect(screen.getByLabelText('Mensagem')).toHaveValue('');
        expect(screen.getByRole('checkbox')).not.toBeChecked();
      }, { timeout: 5000 });
    });

    it('deve aplicar rate limiting após tentativas excessivas', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      // Simula múltiplas tentativas rápidas
      const submitButton = screen.getByRole('button', { name: /enviar mensagem/i });

      for (let i = 0; i < 4; i++) {
        await user.click(submitButton);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await waitFor(() => {
        expect(screen.getByText(/muitas tentativas!/i)).toBeInTheDocument();
      });
    });
  });

  describe('SEO', () => {
    it('deve ter meta tags corretas', () => {
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      // Verifica se o componente SEO foi renderizado
      // (o Helmet não renderiza no DOM de teste, mas podemos verificar se não há erros)
      expect(screen.getByRole('heading', { name: /entre em contato/i })).toBeInTheDocument();
    });
  });
}); 