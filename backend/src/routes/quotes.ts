import express from 'express';
import {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuoteStatus,
  getQuoteStats,
  quoteValidation
} from '../controllers/quoteController';

const router = express.Router();

/**
 * @route   POST /api/quotes
 * @desc    Criar nova solicitação de orçamento
 * @access  Public
 */
router.post('/', quoteValidation, createQuote);

/**
 * @route   GET /api/quotes
 * @desc    Listar solicitações de orçamento (Admin apenas)
 * @access  Private (Admin)
 * @query   page, limit, status, projectType, sortBy, sortOrder
 */
router.get('/', getQuotes); // TODO: Adicionar middleware de autenticação admin

/**
 * @route   GET /api/quotes/stats
 * @desc    Obter estatísticas de solicitações (Admin apenas)
 * @access  Private (Admin)
 */
router.get('/stats', getQuoteStats); // TODO: Adicionar middleware de autenticação admin

/**
 * @route   GET /api/quotes/:id
 * @desc    Obter solicitação específica (Admin apenas)
 * @access  Private (Admin)
 */
router.get('/:id', getQuoteById); // TODO: Adicionar middleware de autenticação admin

/**
 * @route   PUT /api/quotes/:id/status
 * @desc    Atualizar status da solicitação (Admin apenas)
 * @access  Private (Admin)
 */
router.put('/:id/status', updateQuoteStatus); // TODO: Adicionar middleware de autenticação admin

export { router as quoteRouter }; 