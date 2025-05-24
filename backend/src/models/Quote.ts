import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento Quote
export interface IQuote extends Document {
  // Dados do Cliente
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  clientPosition?: string;

  // Dados do Projeto
  projectName: string;
  projectDescription: string;
  projectType: 'Desenvolvimento Web' | 'Aplicativo Mobile' | 'E-commerce' | 'Dashboard/Analytics' | 'Sistema ERP' | 'API/Backend' | 'Consultoria Técnica' | 'Manutenção/Suporte' | 'Outro';
  projectCategory: 'Novo desenvolvimento' | 'Migração/Refatoração' | 'Integração' | 'Melhoria/Otimização' | 'Correção de bugs' | 'Consultoria';
  technologies: string[];
  timeline: '1-2 semanas' | '3-4 semanas' | '1-2 meses' | '3-4 meses' | '5-6 meses' | 'Mais de 6 meses' | 'Flexível';
  budget: 'R$ 5.000 - R$ 15.000' | 'R$ 15.000 - R$ 30.000' | 'R$ 30.000 - R$ 50.000' | 'R$ 50.000 - R$ 100.000' | 'Acima de R$ 100.000' | 'A definir';

  // Funcionalidades e Características
  features?: string[];
  integrations?: string[];
  platforms?: string[];

  // Informações Adicionais
  hasExistingSystem: boolean;
  existingSystemDetails?: string;
  mainGoals?: string;
  targetAudience?: string;

  // Status da Proposta
  status: 'pending' | 'in_analysis' | 'proposal_sent' | 'accepted' | 'rejected' | 'canceled';

  // Dados da Proposta
  proposalValue?: number;
  proposalTimeline?: string;
  proposalNotes?: string;
  proposalSentAt?: Date;
  proposalAcceptedAt?: Date;

  // Metadados
  consent: boolean;
  source: 'website' | 'referral' | 'social_media' | 'direct';
  urgency: 'low' | 'medium' | 'high';
  notes?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtual
  responseTime?: number;

  // Métodos
  updateStatus(newStatus: string, notes?: string): Promise<IQuote>;
}

// Schema do MongoDB
const quoteSchema = new Schema<IQuote>({
  // Dados do Cliente
  clientName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  clientPhone: {
    type: String,
    trim: true,
    match: /^[\d\s\-()+ ]+$/
  },
  clientCompany: {
    type: String,
    trim: true,
    maxlength: 100
  },
  clientPosition: {
    type: String,
    trim: true,
    maxlength: 100
  },

  // Dados do Projeto
  projectName: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  projectDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 2000
  },
  projectType: {
    type: String,
    required: true,
    enum: [
      'Desenvolvimento Web',
      'Aplicativo Mobile',
      'E-commerce',
      'Dashboard/Analytics',
      'Sistema ERP',
      'API/Backend',
      'Consultoria Técnica',
      'Manutenção/Suporte',
      'Outro'
    ]
  },
  projectCategory: {
    type: String,
    required: true,
    enum: [
      'Novo desenvolvimento',
      'Migração/Refatoração',
      'Integração',
      'Melhoria/Otimização',
      'Correção de bugs',
      'Consultoria'
    ]
  },
  technologies: [{
    type: String,
    trim: true
  }],
  timeline: {
    type: String,
    required: true,
    enum: [
      '1-2 semanas',
      '3-4 semanas',
      '1-2 meses',
      '3-4 meses',
      '5-6 meses',
      'Mais de 6 meses',
      'Flexível'
    ]
  },
  budget: {
    type: String,
    required: true,
    enum: [
      'R$ 5.000 - R$ 15.000',
      'R$ 15.000 - R$ 30.000',
      'R$ 30.000 - R$ 50.000',
      'R$ 50.000 - R$ 100.000',
      'Acima de R$ 100.000',
      'A definir'
    ]
  },

  // Funcionalidades e Características
  features: [{
    type: String,
    trim: true
  }],
  integrations: [{
    type: String,
    trim: true
  }],
  platforms: [{
    type: String,
    trim: true
  }],

  // Informações Adicionais
  hasExistingSystem: {
    type: Boolean,
    default: false
  },
  existingSystemDetails: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  mainGoals: {
    type: String,
    trim: true,
    maxlength: 500
  },
  targetAudience: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Status da Proposta
  status: {
    type: String,
    enum: ['pending', 'in_analysis', 'proposal_sent', 'accepted', 'rejected', 'canceled'],
    default: 'pending'
  },

  // Dados da Proposta (quando elaborada)
  proposalValue: {
    type: Number,
    min: 0
  },
  proposalTimeline: {
    type: String
  },
  proposalNotes: {
    type: String,
    maxlength: 2000
  },
  proposalSentAt: {
    type: Date
  },
  proposalAcceptedAt: {
    type: Date
  },

  // Metadados
  consent: {
    type: Boolean,
    required: true,
    validate: {
      validator: function (v: boolean) {
        return v === true;
      },
      message: 'Consentimento é obrigatório'
    }
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'direct'],
    default: 'website'
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
quoteSchema.index({ clientEmail: 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ projectType: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ 'clientEmail': 1, 'createdAt': -1 });

// Virtual para calcular tempo de resposta
quoteSchema.virtual('responseTime').get(function (this: IQuote) {
  if (this.proposalSentAt) {
    return Math.floor((this.proposalSentAt.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)); // dias
  }
  return null;
});

// Middleware para sanitização antes de salvar
quoteSchema.pre('save', function (this: IQuote, next) {
  // Remover espaços extras
  if (this.projectDescription) {
    this.projectDescription = this.projectDescription.replace(/\s+/g, ' ').trim();
  }

  // Normalizar email
  if (this.clientEmail) {
    this.clientEmail = this.clientEmail.toLowerCase().trim();
  }

  next();
});

// Método estático para buscar por status
quoteSchema.statics.findByStatus = function (status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Método para atualizar status
quoteSchema.methods.updateStatus = function (this: IQuote, newStatus: string, notes = '') {
  this.status = newStatus as any;
  if (notes) {
    this.notes = notes;
  }

  if (newStatus === 'proposal_sent') {
    this.proposalSentAt = new Date();
  } else if (newStatus === 'accepted') {
    this.proposalAcceptedAt = new Date();
  }

  return this.save();
};

const Quote = mongoose.model<IQuote>('Quote', quoteSchema);

export default Quote; 