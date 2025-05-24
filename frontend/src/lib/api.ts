/**
 * Configurações da API
 */

// URL base da API configurada através das variáveis de ambiente
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://techflow-solutions-backend.onrender.com/api';
export const API_URL = import.meta.env.VITE_API_URL || 'https://techflow-solutions-backend.onrender.com';

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Contato
  CONTACT: '/contact',

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
 * Função para enviar dados de contato
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
    throw new Error(errorData.message || `Erro ao enviar contato: ${response.statusText}`);
  }

  return response.json();
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