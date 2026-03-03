/**
 * Configurações da API
 * 
 * NOTA: O backend foi removido (Opção 1 de simplificação).
 * O projeto agora usa integração WhatsApp direta do frontend.
 * Formulários de contato e orçamento abrem WhatsApp sem intermediário.
 */

// Mantido para referência futura (caso queira adicionar servços na cloud)
export const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : '/api';

export const API_URL = import.meta.env.PROD
  ? ''
  : '';

/**
 * Endpoints da API (Desativados - não usar)
 * @deprecated Backend foi removido. Use integração WhatsApp direta.
 */
export const API_ENDPOINTS = {
  // Integração WhatsApp (feita diretamente no frontend)
  CONTACT: '/contact',
  QUOTES: '/quotes',

  // Serviços (se adicionar API no futuro)
  SERVICES: '/services',
};

/**
 * Configurações gerais
 */
export const API_CONFIG = {
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Função para construir URL completa do endpoint
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Utilitário para lidar com erros
 * @param error - Erro a ser processado
 * @returns Mensagem de erro formatada
 */
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Erro ao processar sua solicitação. Tente novamente.';
};

/**
 * NOTA: Backend foi removido (Opção 1).
 * As funções sendContactData e sendQuoteRequest foram removidas.
 * 
 * Integração WhatsApp agora é feita diretamente no frontend:
 * - Contact.tsx: openWhatsApp()
 * - QuoteRequest.tsx: sendToWhatsApp()
 * 
 * Se precisar adicionar lógica de API no futuro:
 * 1. Criar novo backend (Supabase, Firebase, etc)
 * 2. Restaurar esta seção com novo API_BASE_URL
 * 3. Implementar endpoints necessários
 */ 