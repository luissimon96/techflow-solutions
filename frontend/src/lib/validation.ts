import { z } from 'zod';

// Schema para formulário de contato
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .transform(val => val.trim()),

  email: z
    .string()
    .email('Email deve ter um formato válido')
    .max(254, 'Email deve ter no máximo 254 caracteres')
    .transform(val => val.toLowerCase().trim()),

  company: z
    .string()
    .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
    .optional()
    .transform(val => val?.trim()),

  phone: z
    .string()
    .regex(/^[\d\s\+\-\(\)]+$/, 'Telefone deve conter apenas números e símbolos válidos')
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .transform(val => val?.trim()),

  subject: z
    .string()
    .min(5, 'Assunto deve ter pelo menos 5 caracteres')
    .max(200, 'Assunto deve ter no máximo 200 caracteres')
    .transform(val => val.trim()),

  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(2000, 'Mensagem deve ter no máximo 2000 caracteres')
    .transform(val => val.trim()),

  consent: z
    .boolean()
    .refine(val => val === true, 'Você deve aceitar os termos para continuar'),
});

// Schema para newsletter
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Email deve ter um formato válido')
    .max(254, 'Email deve ter no máximo 254 caracteres')
    .transform(val => val.toLowerCase().trim()),

  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional()
    .transform(val => val?.trim()),
});

// Schema para comentários do blog
export const commentSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .transform(val => val.trim()),

  email: z
    .string()
    .email('Email deve ter um formato válido')
    .max(254, 'Email deve ter no máximo 254 caracteres')
    .transform(val => val.toLowerCase().trim()),

  website: z
    .string()
    .url('Website deve ter um formato válido')
    .optional()
    .or(z.literal('')),

  content: z
    .string()
    .min(10, 'Comentário deve ter pelo menos 10 caracteres')
    .max(1000, 'Comentário deve ter no máximo 1000 caracteres')
    .transform(val => val.trim()),
});

// Schema para busca
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Busca deve ter pelo menos 1 caractere')
    .max(100, 'Busca deve ter no máximo 100 caracteres')
    .transform(val => val.trim()),

  category: z
    .string()
    .optional(),

  tags: z
    .array(z.string())
    .optional(),
});

/**
 * Schema para solicitação de orçamento
 */
export const quoteRequestSchema = z.object({
  // Dados do Cliente
  clientName: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  clientEmail: z.string()
    .email('Email deve ter um formato válido')
    .min(1, 'Email é obrigatório'),

  clientPhone: z.string()
    .optional()
    .refine((val) => !val || /^[\d\s\-()+ ]+$/.test(val), {
      message: 'Telefone deve conter apenas números e símbolos válidos'
    }),

  clientCompany: z.string()
    .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
    .optional(),

  clientPosition: z.string()
    .max(100, 'Cargo deve ter no máximo 100 caracteres')
    .optional(),

  // Dados do Projeto
  projectName: z.string()
    .min(5, 'Nome do projeto deve ter pelo menos 5 caracteres')
    .max(200, 'Nome do projeto deve ter no máximo 200 caracteres'),

  projectDescription: z.string()
    .min(20, 'Descrição deve ter pelo menos 20 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),

  projectType: z.string()
    .min(1, 'Tipo de projeto é obrigatório'),

  projectCategory: z.string()
    .min(1, 'Categoria é obrigatória'),

  technologies: z.array(z.string()).default([]),

  timeline: z.string()
    .min(1, 'Prazo é obrigatório'),

  budget: z.string()
    .min(1, 'Faixa de orçamento é obrigatória'),

  // Funcionalidades e Características
  features: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),

  // Informações Adicionais
  hasExistingSystem: z.boolean().default(false),
  existingSystemDetails: z.string().optional(),
  mainGoals: z.string().optional(),
  targetAudience: z.string().optional(),

  // LGPD
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Você deve aceitar os termos para continuar'
    }),
});

// Tipos derivados dos schemas
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type CommentData = z.infer<typeof commentSchema>;
export type SearchData = z.infer<typeof searchSchema>;

/**
 * Tipo inferido do schema de orçamento
 */
export type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

// Função utilitária para sanitizar HTML
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// Função para validar e sanitizar dados
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const validated = schema.parse(data);

  // Sanitizar strings recursivamente
  function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return sanitizeHtml(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  }

  return sanitizeObject(validated);
}

// Rate limiting simples (client-side)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove tentativas antigas
    const recentAttempts = attempts.filter(time => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter(); 