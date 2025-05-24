import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import Quote from '../models/Quote';

// Rate limiting - 2 solicitações por email por hora
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

// Validações para criação de orçamento
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
export const createQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar validações
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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

    // Sanitizar dados textuais
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
    const newQuote = new Quote(sanitizedData);
    const savedQuote = await newQuote.save();

    // Adicionar ao rate limiting
    addRateLimit(clientEmail);

    res.status(201).json({
      success: true,
      message: 'Solicitação de orçamento enviada com sucesso!',
      data: {
        id: savedQuote._id,
        clientName: savedQuote.clientName,
        projectName: savedQuote.projectName,
        status: savedQuote.status,
        createdAt: savedQuote.createdAt
      }
    });

  } catch (error: any) {
    console.error('Erro ao criar solicitação de orçamento:', error);

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Dados duplicados detectados'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente em alguns momentos.'
    });
  }
};

// Listar solicitações (admin apenas - a implementar)
export const getQuotes = async (req: Request, res: Response): Promise<void> => {
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
    const filters: any = {};
    if (status && status !== 'all') {
      filters.status = status;
    }
    if (projectType && projectType !== 'all') {
      filters.projectType = projectType;
    }

    // Construir ordenação
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Buscar com paginação
    const quotes = await Quote.find(filters)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-clientEmail -clientPhone') // Remover dados sensíveis
      .exec();

    const total = await Quote.countDocuments(filters);

    res.json({
      success: true,
      data: quotes,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
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
export const getQuoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const quote = await Quote.findById(id);
    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Solicitação não encontrada'
      });
      return;
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
export const updateQuoteStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes, proposalValue, proposalTimeline, proposalNotes } = req.body;

    const quote = await Quote.findById(id);
    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Solicitação não encontrada'
      });
      return;
    }

    // Atualizar status usando método do modelo
    await (quote as any).updateStatus(status, notes);

    // Atualizar dados da proposta se fornecidos
    if (proposalValue !== undefined) {
      (quote as any).proposalValue = proposalValue;
    }
    if (proposalTimeline !== undefined) {
      (quote as any).proposalTimeline = proposalTimeline;
    }
    if (proposalNotes !== undefined) {
      (quote as any).proposalNotes = proposalNotes;
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
export const getQuoteStats = async (req: Request, res: Response): Promise<void> => {
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