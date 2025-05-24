import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
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

// Criar novo contato
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array(),
      });
      return;
    }

    const contactData: ContactData = req.body;

    // Verificar se já existe um contato com o mesmo email recentemente (últimas 24h)
    const existingContact = await User.findOne({
      email: contactData.email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingContact) {
      res.status(429).json({
        success: false,
        message: 'Você já enviou uma mensagem recentemente. Aguarde 24 horas para enviar outra.',
      });
      return;
    }

    // Criar novo contato
    const newContact = new User(contactData);
    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data: {
        id: savedContact._id,
        name: savedContact.name,
        email: savedContact.email,
        subject: savedContact.subject,
        createdAt: savedContact.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Erro ao criar contato:', error);

    // Tratar erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validationErrors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.',
    });
  }
};

// Listar contatos (para admin - futuro)
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const contacts = await User.find()
      .select('-__v') // Excluir campo __v
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

// Buscar contato por ID
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await User.findById(id).select('-__v');

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contato não encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

// Deletar contato (para admin - futuro)
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedContact = await User.findByIdAndDelete(id);

    if (!deletedContact) {
      res.status(404).json({
        success: false,
        message: 'Contato não encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Contato deletado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao deletar contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
}; 