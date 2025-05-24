const Quote = require('../models/Quote');
const { body, validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');

// Rate limiting - 2 solicitações por email por hora
const rateLimitMap = new Map();

const isRateLimited = (email) => {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000); // 1 hora atrás
  
  if (!rateLimitMap.has(email)) {
    rateLimitMap.set(email, []);
  }
  
  const requests = rateLimitMap.get(email);
  
  // Remove requests antigas (mais de 1 hora)
  const recentRequests = requests.filter(timestamp => timestamp > hourAgo);
  rateLimitMap.set(email, recentRequests);
  
  return recentRequests.length >= 2;
};

const addRateLimit = (email) => {
  const now = Date.now();
  if (!rateLimitMap.has(email)) {
    rateLimitMap.set(email, []);
  }
  rateLimitMap.get(email).push(now);
};

// Validações para criação de orçamento
const quoteValidation = [
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
  
  body('technologies.*')
    .optional()
    .trim()
    .escape(),
  
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

  // Arrays opcionais
  body('features')
    .optional()
    .isArray(),
  
  body('integrations')
    .optional()
    .isArray(),
  
  body('platforms')
    .optional()
    .isArray(),

  // Informações adicionais
  body('hasExistingSystem')
    .isBoolean()
    .withMessage('hasExistingSystem deve ser um boolean'),
  
  body('existingSystemDetails')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Detalhes do sistema existente deve ter no máximo 1000 caracteres'),
  
  body('mainGoals')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Objetivos principais deve ter no máximo 500 caracteres'),
  
  body('targetAudience')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Público-alvo deve ter no máximo 500 caracteres'),

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

// Criar nova solicitação de orçamento
const createQuote = async (req, res) => {
  try {
    // Verificar validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { clientEmail } = req.body;

    // Verificar rate limiting
    if (isRateLimited(clientEmail)) {
      return res.status(429).json({
        success: false,
        message: 'Você pode fazer até 2 solicitações por hora. Tente novamente mais tarde.',
        retryAfter: 3600
      });
    }

    // Sanitizar dados
    const sanitizedData = {
      ...req.body,
      projectDescription: DOMPurify.sanitize(req.body.projectDescription),
      existingSystemDetails: req.body.existingSystemDetails ? 
        DOMPurify.sanitize(req.body.existingSystemDetails) : undefined,
      mainGoals: req.body.mainGoals ? 
        DOMPurify.sanitize(req.body.mainGoals) : undefined,
      targetAudience: req.body.targetAudience ? 
        DOMPurify.sanitize(req.body.targetAudience) : undefined
    };

    // Criar nova solicitação
    const quote = new Quote(sanitizedData);
    await quote.save();

    // Adicionar ao rate limit
    addRateLimit(clientEmail);

    // Resposta de sucesso (sem dados sensíveis)
    res.status(201).json({
      success: true,
      message: 'Solicitação de orçamento enviada com sucesso! Entraremos em contato em até 24 horas.',
      data: {
        id: quote._id,
        projectName: quote.projectName,
        projectType: quote.projectType,
        status: quote.status,
        createdAt: quote.createdAt
      }
    });

    // Log para monitoramento (em produção, usar logger adequado)
    console.log(`Nova solicitação de orçamento: ${quote._id} - ${quote.clientEmail} - ${quote.projectType}`);

  } catch (error) {
    console.error('Erro ao criar solicitação de orçamento:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Dados duplicados detectados'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente em alguns momentos.'
    });
  }
};

// Listar solicitações (admin apenas - a implementar)
const getQuotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      projectType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters = {};
    if (status && status !== 'all') {
      filters.status = status;
    }
    if (projectType && projectType !== 'all') {
      filters.projectType = projectType;
    }

    // Construir ordenação
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Buscar com paginação
    const quotes = await Quote.find(filters)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-clientEmail -clientPhone') // Remover dados sensíveis
      .exec();

    const total = await Quote.countDocuments(filters);

    res.json({
      success: true,
      data: quotes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar solicitação específica (admin apenas)
const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Solicitação não encontrada'
      });
    }

    res.json({
      success: true,
      data: quote
    });

  } catch (error) {
    console.error('Erro ao buscar solicitação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar status da solicitação (admin apenas)
const updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, proposalValue, proposalTimeline, proposalNotes } = req.body;

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Solicitação não encontrada'
      });
    }

    // Atualizar status usando método do modelo
    await quote.updateStatus(status, notes);

    // Atualizar dados da proposta se fornecidos
    if (proposalValue !== undefined) {
      quote.proposalValue = proposalValue;
    }
    if (proposalTimeline !== undefined) {
      quote.proposalTimeline = proposalTimeline;
    }
    if (proposalNotes !== undefined) {
      quote.proposalNotes = proposalNotes;
    }

    await quote.save();

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: quote
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Estatísticas de solicitações (admin apenas)
const getQuoteStats = async (req, res) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          in_analysis: { $sum: { $cond: [{ $eq: ['$status', 'in_analysis'] }, 1, 0] } },
          proposal_sent: { $sum: { $cond: [{ $eq: ['$status', 'proposal_sent'] }, 1, 0] } },
          accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);

    const projectTypeStats = await Quote.aggregate([
      {
        $group: {
          _id: '$projectType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          total: 0,
          pending: 0,
          in_analysis: 0,
          proposal_sent: 0,
          accepted: 0,
          rejected: 0
        },
        projectTypes: projectTypeStats
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuoteStatus,
  getQuoteStats,
  quoteValidation
}; 