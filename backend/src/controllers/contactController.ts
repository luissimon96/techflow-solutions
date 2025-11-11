import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Interface para dados de contato
interface ContactData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
}

// Função para gerar URL do WhatsApp
function generateWhatsAppUrl(contactData: ContactData): string {
  const phoneNumber = '5511999999999'; // Substitua pelo número do WhatsApp da empresa
  
  let message = `🏢 *TechFlow Solutions - Novo Contato*\n\n`;
  message += `👤 *Nome:* ${contactData.name}\n`;
  message += `📧 *Email:* ${contactData.email}\n`;
  
  if (contactData.company) {
    message += `🏢 *Empresa:* ${contactData.company}\n`;
  }
  
  if (contactData.phone) {
    message += `📞 *Telefone:* ${contactData.phone}\n`;
  }
  
  message += `📋 *Assunto:* ${contactData.subject}\n\n`;
  message += `💬 *Mensagem:*\n${contactData.message}\n\n`;
  message += `⏰ *Enviado em:* ${new Date().toLocaleString('pt-BR')}`;
  
  // Codificar a mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Processar contato e gerar URL do WhatsApp
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📞 Processando novo contato para WhatsApp...');
    
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array(),
      });
      return;
    }

    const contactData: ContactData = req.body;
    
    console.log('📧 Novo contato:', {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject
    });

    // Verificar consentimento
    if (!contactData.consent) {
      res.status(400).json({
        success: false,
        message: 'É necessário aceitar os termos de privacidade.',
      });
      return;
    }

    // Gerar URL do WhatsApp
    const whatsappUrl = generateWhatsAppUrl(contactData);
    
    console.log('✅ URL do WhatsApp gerada com sucesso');

    res.status(200).json({
      success: true,
      message: 'Dados processados com sucesso! Você será redirecionado para o WhatsApp.',
      data: {
        whatsappUrl,
        redirectMessage: 'Clique no link para continuar a conversa no WhatsApp'
      },
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao processar contato:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.',
    });
  }
};

// Health check para contatos (sem funcionalidades de banco)
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Sistema de contatos funcionando',
    info: 'Contatos são redirecionados para WhatsApp - sem armazenamento em banco de dados',
    whatsappIntegration: true
  });
};

// Não há busca por ID (sem banco de dados)
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  res.status(404).json({
    success: false,
    message: 'Funcionalidade não disponível',
    info: 'Contatos são redirecionados para WhatsApp - sem armazenamento em banco de dados'
  });
};

// Não há deleção (sem banco de dados)
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  res.status(404).json({
    success: false,
    message: 'Funcionalidade não disponível',
    info: 'Contatos são redirecionados para WhatsApp - sem armazenamento em banco de dados'
  });
};