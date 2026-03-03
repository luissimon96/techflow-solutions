/**
 * WhatsApp Integration Service
 * Centralized service for sending messages to WhatsApp with different templates
 */

export interface WhatsAppContact {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
}

export interface WhatsAppQuote {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  clientPosition?: string;
  projectName: string;
  projectDescription: string;
  projectType: string;
  projectCategory?: string;
  technologies?: string[];
  timeline?: string;
  budget?: string;
  features?: string[];
  integrations?: string[];
  platforms?: string[];
  mainGoals?: string;
  targetAudience?: string;
  hasExistingSystem?: boolean;
  existingSystemDetails?: string;
}

export interface WhatsAppConfig {
  phoneNumber: string;
  baseUrl: string;
}

class WhatsAppService {
  private config: WhatsAppConfig = {
    phoneNumber: '5554997109051',
    baseUrl: 'https://wa.me'
  };

  /**
   * Updates the WhatsApp configuration
   */
  updateConfig(config: Partial<WhatsAppConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Encodes a message for WhatsApp URL
   */
  private encodeMessage(message: string): string {
    return encodeURIComponent(message);
  }

  /**
   * Generates WhatsApp URL with message
   */
  private generateWhatsAppUrl(message: string): string {
    const encodedMessage = this.encodeMessage(message);
    return `${this.config.baseUrl}/${this.config.phoneNumber}?text=${encodedMessage}`;
  }

  /**
   * Opens WhatsApp with the provided message
   */
  private openWhatsApp(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Creates a contact message template
   */
  private createContactMessage(data: WhatsAppContact): string {
    let message = `🏢 *TechFlow Solutions - Novo Contato*\n\n`;
    message += `👤 *Nome:* ${data.name}\n`;
    message += `📧 *Email:* ${data.email}\n`;
    
    if (data.company) {
      message += `🏢 *Empresa:* ${data.company}\n`;
    }
    
    if (data.phone) {
      message += `📞 *Telefone:* ${data.phone}\n`;
    }
    
    if (data.subject) {
      message += `📋 *Assunto:* ${data.subject}\n\n`;
    }
    
    if (data.message) {
      message += `💬 *Mensagem:*\n${data.message}\n\n`;
    }
    
    message += `⏰ *Enviado em:* ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `💼 Aguardo seu contato para darmos continuidade!`;
    
    return message;
  }

  /**
   * Creates a quote request message template
   */
  private createQuoteMessage(data: WhatsAppQuote): string {
    let message = `💼 *TechFlow Solutions - Solicitação de Orçamento*\n\n`;
    
    // Client Information
    message += `👤 *DADOS DO CLIENTE*\n`;
    message += `Nome: ${data.clientName}\n`;
    message += `Email: ${data.clientEmail}\n`;
    
    if (data.clientPhone) {
      message += `Telefone: ${data.clientPhone}\n`;
    }
    
    if (data.clientCompany) {
      message += `Empresa: ${data.clientCompany}\n`;
    }
    
    if (data.clientPosition) {
      message += `Cargo: ${data.clientPosition}\n`;
    }
    
    // Project Information
    message += `\n🚀 *DETALHES DO PROJETO*\n`;
    message += `Nome: ${data.projectName}\n`;
    message += `Tipo: ${data.projectType}\n`;
    
    if (data.projectCategory) {
      message += `Categoria: ${data.projectCategory}\n`;
    }
    
    message += `Descrição: ${data.projectDescription}\n`;
    
    // Technologies
    if (data.technologies && data.technologies.length > 0) {
      message += `\n💻 *TECNOLOGIAS PREFERIDAS*\n`;
      message += `${data.technologies.join(', ')}\n`;
    }
    
    // Timeline & Budget
    if (data.timeline || data.budget) {
      message += `\n💰 *CRONOGRAMA E ORÇAMENTO*\n`;
      
      if (data.timeline) {
        message += `Prazo: ${data.timeline}\n`;
      }
      
      if (data.budget) {
        message += `Orçamento: ${data.budget}\n`;
      }
    }
    
    // Additional Information
    if (data.mainGoals) {
      message += `\n🎯 *OBJETIVOS PRINCIPAIS*\n${data.mainGoals}\n`;
    }
    
    if (data.targetAudience) {
      message += `\n👥 *PÚBLICO-ALVO*\n${data.targetAudience}\n`;
    }
    
    if (data.hasExistingSystem && data.existingSystemDetails) {
      message += `\n🔄 *SISTEMA EXISTENTE*\n${data.existingSystemDetails}\n`;
    }
    
    message += `\n⏰ *Solicitado em:* ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `📋 Nossa equipe analisará sua solicitação e retornará em até 24 horas com uma proposta detalhada!`;
    
    return message;
  }

  /**
   * Creates a generic message template
   */
  private createGenericMessage(title: string, data: Record<string, any>): string {
    let message = `🏢 *TechFlow Solutions - ${title}*\n\n`;
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        
        if (Array.isArray(value)) {
          if (value.length > 0) {
            message += `📋 *${formattedKey}:* ${value.join(', ')}\n`;
          }
        } else if (typeof value === 'boolean') {
          message += `✅ *${formattedKey}:* ${value ? 'Sim' : 'Não'}\n`;
        } else {
          message += `📝 *${formattedKey}:* ${value}\n`;
        }
      }
    });
    
    message += `\n⏰ *Enviado em:* ${new Date().toLocaleString('pt-BR')}\n\n`;
    message += `💼 Aguardo seu contato!`;
    
    return message;
  }

  /**
   * Sends a contact message via WhatsApp
   */
  sendContactMessage(data: WhatsAppContact): void {
    const message = this.createContactMessage(data);
    const url = this.generateWhatsAppUrl(message);
    this.openWhatsApp(url);
  }

  /**
   * Sends a quote request message via WhatsApp
   */
  sendQuoteMessage(data: WhatsAppQuote): void {
    const message = this.createQuoteMessage(data);
    const url = this.generateWhatsAppUrl(message);
    this.openWhatsApp(url);
  }

  /**
   * Sends a generic message via WhatsApp
   */
  sendGenericMessage(title: string, data: Record<string, any>): void {
    const message = this.createGenericMessage(title, data);
    const url = this.generateWhatsAppUrl(message);
    this.openWhatsApp(url);
  }

  /**
   * Sends a simple text message via WhatsApp
   */
  sendTextMessage(message: string): void {
    const url = this.generateWhatsAppUrl(message);
    this.openWhatsApp(url);
  }

  /**
   * Returns the formatted message without sending (for preview)
   */
  previewContactMessage(data: WhatsAppContact): string {
    return this.createContactMessage(data);
  }

  /**
   * Returns the formatted quote message without sending (for preview)
   */
  previewQuoteMessage(data: WhatsAppQuote): string {
    return this.createQuoteMessage(data);
  }

  /**
   * Returns the formatted generic message without sending (for preview)
   */
  previewGenericMessage(title: string, data: Record<string, any>): string {
    return this.createGenericMessage(title, data);
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();

// Export utility functions for backward compatibility
export const sendWhatsAppContact = (data: WhatsAppContact) => 
  whatsappService.sendContactMessage(data);

export const sendWhatsAppQuote = (data: WhatsAppQuote) => 
  whatsappService.sendQuoteMessage(data);

export const sendWhatsAppMessage = (title: string, data: Record<string, any>) => 
  whatsappService.sendGenericMessage(title, data);

export const sendWhatsAppText = (message: string) => 
  whatsappService.sendTextMessage(message);

// Configuration helper
export const configureWhatsApp = (config: Partial<WhatsAppConfig>) => 
  whatsappService.updateConfig(config);

// Legacy function for backward compatibility
export const getWhatsAppUrl = (message: string): string => {
  const phoneNumber = '5554997109051';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export default whatsappService;