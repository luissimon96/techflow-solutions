import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Rate limiting em memória - 2 solicitações por email por hora
const rateLimitMap = new Map<string, number[]>();

const isRateLimited = (email: string): boolean => {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000); // 1 hora atrás

  if (!rateLimitMap.has(email)) {
    rateLimitMap.set(email, []);
  }

  const requests = rateLimitMap.get(email)!;

  // Remove requests antigas (mais de 1 hora)
  const recentRequests = requests.filter(timestamp => timestamp > hourAgo);
  rateLimitMap.set(email, recentRequests);

  return recentRequests.length >= 2;
};

const addRateLimit = (email: string): void => {
  const now = Date.now();
  if (!rateLimitMap.has(email)) {
    rateLimitMap.set(email, []);
  }
  rateLimitMap.get(email)!.push(now);
};

// Validações para criação de orçamento (mantidas para garantir qualidade dos dados)
export const quoteValidation = [
  // Dados do Cliente
  body('clientName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .escape(),

  body('clientEmail')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ter um formato válido'),

  body('clientPhone')
    .optional()
    .trim()
    .matches(/^[\d\s\-()+ ]+$/)
    .withMessage('Telefone deve conter apenas números e símbolos válidos')
    .escape(),

  body('clientCompany')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nome da empresa deve ter no máximo 100 caracteres')
    .escape(),

  body('clientPosition')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Cargo deve ter no máximo 100 caracteres')
    .escape(),

  // Dados do Projeto
  body('projectName')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Nome do projeto deve ter entre 5 e 200 caracteres')
    .escape(),

  body('projectDescription')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Descrição deve ter entre 20 e 2000 caracteres'),

  body('projectType')
    .trim()
    .isIn([
      'Desenvolvimento Web',
      'Aplicativo Mobile',
      'E-commerce',
      'Dashboard/Analytics',
      'Sistema ERP',
      'API/Backend',
      'Consultoria Técnica',
      'Manutenção/Suporte',
      'Outro'
    ])
    .withMessage('Tipo de projeto inválido'),

  body('projectCategory')
    .trim()
    .isIn([
      'Novo desenvolvimento',
      'Migração/Refatoração',
      'Integração',
      'Melhoria/Otimização',
      'Correção de bugs',
      'Consultoria'
    ])
    .withMessage('Categoria de projeto inválida'),

  body('technologies')
    .isArray()
    .withMessage('Tecnologias deve ser um array'),

  body('timeline')
    .trim()
    .isIn([
      '1-2 semanas',
      '3-4 semanas',
      '1-2 meses',
      '3-4 meses',
      '5-6 meses',
      'Mais de 6 meses',
      'Flexível'
    ])
    .withMessage('Prazo inválido'),

  body('budget')
    .trim()
    .isIn([
      'R$ 5.000 - R$ 15.000',
      'R$ 15.000 - R$ 30.000',
      'R$ 30.000 - R$ 50.000',
      'R$ 50.000 - R$ 100.000',
      'Acima de R$ 100.000',
      'A definir'
    ])
    .withMessage('Faixa de orçamento inválida'),

  // LGPD
  body('consent')
    .isBoolean()
    .custom((value) => {
      if (value !== true) {
        throw new Error('Consentimento é obrigatório');
      }
      return true;
    })
];

// Função para gerar mensagem do WhatsApp para orçamento
function generateWhatsAppQuoteMessage(quoteData: any): string {
  const phoneNumber = '5511999999999'; // Substitua pelo número do WhatsApp da empresa

  let message = `💼 *TechFlow Solutions - Solicitação de Orçamento*\n\n`;
  
  // Dados do Cliente
  message += `👤 *DADOS DO CLIENTE*\n`;
  message += `Nome: ${quoteData.clientName}\n`;
  message += `Email: ${quoteData.clientEmail}\n`;
  if (quoteData.clientPhone) message += `Telefone: ${quoteData.clientPhone}\n`;
  if (quoteData.clientCompany) message += `Empresa: ${quoteData.clientCompany}\n`;
  if (quoteData.clientPosition) message += `Cargo: ${quoteData.clientPosition}\n`;
  
  message += `\n🚀 *DADOS DO PROJETO*\n`;
  message += `Nome: ${quoteData.projectName}\n`;
  message += `Tipo: ${quoteData.projectType}\n`;
  message += `Categoria: ${quoteData.projectCategory}\n`;
  message += `Prazo: ${quoteData.timeline}\n`;
  message += `Orçamento: ${quoteData.budget}\n\n`;
  
  message += `📝 *DESCRIÇÃO*\n${quoteData.projectDescription}\n\n`;
  
  if (quoteData.technologies && quoteData.technologies.length > 0) {
    message += `💻 *TECNOLOGIAS*\n${quoteData.technologies.join(', ')}\n\n`;
  }
  
  if (quoteData.features && quoteData.features.length > 0) {
    message += `⚡ *FUNCIONALIDADES*\n${quoteData.features.join(', ')}\n\n`;
  }
  
  if (quoteData.platforms && quoteData.platforms.length > 0) {
    message += `📱 *PLATAFORMAS*\n${quoteData.platforms.join(', ')}\n\n`;
  }
  
  if (quoteData.integrations && quoteData.integrations.length > 0) {
    message += `🔗 *INTEGRAÇÕES*\n${quoteData.integrations.join(', ')}\n\n`;
  }
  
  if (quoteData.hasExistingSystem && quoteData.existingSystemDetails) {
    message += `🏢 *SISTEMA EXISTENTE*\n${quoteData.existingSystemDetails}\n\n`;
  }
  
  if (quoteData.mainGoals) {
    message += `🎯 *OBJETIVOS PRINCIPAIS*\n${quoteData.mainGoals}\n\n`;
  }
  
  if (quoteData.targetAudience) {
    message += `👥 *PÚBLICO-ALVO*\n${quoteData.targetAudience}\n\n`;
  }
  
  message += `⏰ *Solicitado em:* ${new Date().toLocaleString('pt-BR')}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Criar nova solicitação de orçamento (redirecionar para WhatsApp)
export const createQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('💼 Processando nova solicitação de orçamento para WhatsApp...');

    // Verificar validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
      return;
    }

    const { clientEmail } = req.body;

    // Verificar rate limiting
    if (isRateLimited(clientEmail)) {
      res.status(429).json({
        success: false,
        message: 'Muitas solicitações. Aguarde 1 hora antes de enviar novamente.'
      });
      return;
    }

    console.log('📊 Nova solicitação de orçamento:', {
      cliente: req.body.clientName,
      projeto: req.body.projectName,
      tipo: req.body.projectType,
      orçamento: req.body.budget
    });

    // Verificar consentimento
    if (!req.body.consent) {
      res.status(400).json({
        success: false,
        message: 'É necessário aceitar os termos de privacidade.'
      });
      return;
    }

    // Gerar URL do WhatsApp com a mensagem formatada
    const whatsappUrl = generateWhatsAppQuoteMessage(req.body);
    
    // Adicionar ao rate limiting
    addRateLimit(clientEmail);

    console.log('✅ URL do WhatsApp gerada com sucesso para orçamento');

    res.status(200).json({
      success: true,
      message: 'Solicitação de orçamento processada! Você será redirecionado para o WhatsApp.',
      data: {
        whatsappUrl,
        redirectMessage: 'Clique no link para enviar sua solicitação via WhatsApp',
        projectSummary: {
          clientName: req.body.clientName,
          projectName: req.body.projectName,
          projectType: req.body.projectType,
          budget: req.body.budget,
          timeline: req.body.timeline
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Erro ao processar solicitação de orçamento:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente em alguns momentos.'
    });
  }
};

// Health check para orçamentos (sem funcionalidades de banco)
export const getQuotes = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Sistema de orçamentos funcionando',
    info: 'Orçamentos são redirecionados para WhatsApp - sem armazenamento em banco de dados',
    whatsappIntegration: true
  });
};

// Não há busca por ID (sem banco de dados)
export const getQuoteById = async (req: Request, res: Response): Promise<void> => {
  res.status(404).json({
    success: false,
    message: 'Funcionalidade não disponível',
    info: 'Orçamentos são redirecionados para WhatsApp - sem armazenamento em banco de dados'
  });
};

// Não há atualização de status (sem banco de dados)
export const updateQuoteStatus = async (req: Request, res: Response): Promise<void> => {
  res.status(404).json({
    success: false,
    message: 'Funcionalidade não disponível',
    info: 'Orçamentos são redirecionados para WhatsApp - sem armazenamento em banco de dados'
  });
};

// Não há estatísticas (sem banco de dados)
export const getQuoteStats = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Sistema de orçamentos funcionando com WhatsApp',
    data: {
      overview: {
        info: 'Todos os orçamentos são redirecionados para WhatsApp',
        databaseIntegration: false,
        whatsappIntegration: true
      }
    }
  });
};