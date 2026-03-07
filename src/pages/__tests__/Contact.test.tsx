import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import Contact from '../Contact';
import theme from '../../theme';

import { getWhatsAppUrl, sendWhatsAppContact } from '@/lib/whatsapp';

jest.mock('@/lib/whatsapp', () => ({
  getWhatsAppUrl: jest.fn(() => 'https://wa.me/5554997109051'),
  sendWhatsAppContact: jest.fn(),
}));

const getWhatsAppUrlMock = getWhatsAppUrl as jest.Mock;
const sendWhatsAppContactMock = sendWhatsAppContact as jest.Mock;

// Wrapper para providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  </HelmetProvider>
);

describe('Contact Page', () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    openSpy.mockRestore();
  });

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

  it('deve exibir erros de validacao quando formulario vazio for enviado', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    await user.type(screen.getByRole('textbox', { name: /nome/i }), 'A');
    await user.type(screen.getByRole('textbox', { name: /e-mail/i }), 'invalido@example.com');
    await user.type(screen.getByRole('textbox', { name: /assunto/i }), 'abc');
    await user.type(screen.getByRole('textbox', { name: /mensagem/i }), 'curta');
    await user.click(screen.getByRole('checkbox', { name: /concordo com o tratamento/i }));
    await user.click(screen.getByRole('button', { name: /enviar mensagem/i }));

    expect(await screen.findByText(/nome deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
    expect(sendWhatsAppContactMock).not.toHaveBeenCalled();
  });

  it('deve enviar dados validos via whatsappService ao submeter formulario', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    await user.type(screen.getByRole('textbox', { name: /nome/i }), 'Luis Simon');
    await user.type(screen.getByRole('textbox', { name: /e-mail/i }), 'luis@example.com');
    await user.type(screen.getByRole('textbox', { name: /assunto/i }), 'Novo projeto');
    await user.type(screen.getByRole('textbox', { name: /mensagem/i }), 'Gostaria de conversar sobre um sistema web completo.');
    await user.click(screen.getByRole('checkbox', { name: /concordo com o tratamento/i }));

    await user.click(screen.getByRole('button', { name: /enviar mensagem/i }));

    await waitFor(() => {
      expect(sendWhatsAppContactMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Luis Simon',
          email: 'luis@example.com',
          subject: 'Novo projeto',
          consent: true,
        }),
      );
    });
  });

  it('deve abrir o link de WhatsApp no botao de atalho', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /fale conosco no whatsapp/i }));

    expect(getWhatsAppUrlMock).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('https://wa.me/5554997109051', '_blank');
  });
}); 