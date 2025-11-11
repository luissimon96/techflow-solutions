/**
 * Configurações da API
 */

// URL base da API configurada através das variáveis de ambiente
// Em desenvolvimento, usa o proxy do Vite (/api)
// Em produção, usa a URL completa do backend
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://techflow-solutions-backend.onrender.com/api'
  : '/api';

export const API_URL = import.meta.env.PROD
  ? 'https://techflow-solutions-backend.onrender.com'
  : '';

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Contato
  CONTACT: '/contact',

  // Orçamentos
  QUOTES: '/quotes',

  // Portfolio
  PROJECTS: '/projects',

  // Serviços
  SERVICES: '/services',

  // Blog (se implementado)
  BLOG: '/blog',
  POSTS: '/blog/posts',

  // Autenticação (se implementado)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  // Cliente (se implementado)
  CLIENT: {
    DASHBOARD: '/client/dashboard',
    PROJECTS: '/client/projects',
    PROFILE: '/client/profile',
  },
};

/**
 * Configurações do axios ou fetch
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
 * Função para enviar dados de contato (agora redireciona para WhatsApp)
 */
export const sendContactData = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  consent: boolean;
}) => {
  const response = await fetch(buildApiUrl(API_ENDPOINTS.CONTACT), {
    method: 'POST',
    headers: API_CONFIG.headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ao processar contato: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Redirecionar automaticamente para o WhatsApp se a URL foi fornecida
  if (result.data?.whatsappUrl) {
    // Aguardar um momento para mostrar o feedback ao usuário
    setTimeout(() => {
      window.open(result.data.whatsappUrl, '_blank');
    }, 1500);
  }
  
  return result;
};

/**
 * Função para verificar status da API
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Erro ao verificar status da API:', error);
    return false;
  }
};

/**
 * Função para lidar com erros da API
 */
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Erro interno do servidor. Tente novamente mais tarde.';
};

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * Função para enviar solicitação de orçamento (agora redireciona para WhatsApp)
 */
export const sendQuoteRequest = async (data: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  clientPosition?: string;
  projectName: string;
  projectDescription: string;
  projectType: string;
  projectCategory: string;
  technologies?: string[];
  timeline: string;
  budget: string;
  features?: string[];
  integrations?: string[];
  platforms?: string[];
  hasExistingSystem?: boolean;
  existingSystemDetails?: string;
  mainGoals?: string;
  targetAudience?: string;
  consent: boolean;
}) => {
  const response = await fetch(buildApiUrl(API_ENDPOINTS.QUOTES), {
    method: 'POST',
    headers: API_CONFIG.headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ao processar orçamento: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Redirecionar automaticamente para o WhatsApp se a URL foi fornecida
  if (result.data?.whatsappUrl) {
    // Aguardar um momento para mostrar o feedback ao usuário
    setTimeout(() => {
      window.open(result.data.whatsappUrl, '_blank');
    }, 2000); // Um pouco mais de tempo para orçamentos (mais dados)
  }
  
  return result;
}; 