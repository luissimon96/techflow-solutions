import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'ecommerce' | 'custom';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  priority: number;

  // Tecnologias
  technologies: string[];

  // Imagens e mídia
  images: {
    hero: string; // URL principal
    gallery: string[]; // URLs da galeria
    thumbnail: string; // URL do thumbnail
  };

  // Detalhes do projeto
  client: {
    name: string;
    company?: string;
    website?: string;
    testimonial?: string;
    rating?: number;
  };

  // Métricas e resultados
  metrics: {
    duration: string; // Ex: "3 meses"
    teamSize: number;
    budget?: string; // Ex: "R$ 50.000 - R$ 100.000"
    results?: string[];
  };

  // Links
  links: {
    live?: string;
    github?: string;
    demo?: string;
    case_study?: string;
  };

  // SEO
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // Analytics
  views: number;
  likes: number;
}

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [100, 'Título deve ter no máximo 100 caracteres'],
    index: true
  },

  slug: {
    type: String,
    required: [true, 'Slug é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'],
    index: true
  },

  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [2000, 'Descrição deve ter no máximo 2000 caracteres']
  },

  shortDescription: {
    type: String,
    required: [true, 'Descrição curta é obrigatória'],
    trim: true,
    maxlength: [200, 'Descrição curta deve ter no máximo 200 caracteres']
  },

  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: {
      values: ['web', 'mobile', 'desktop', 'api', 'ecommerce', 'custom'],
      message: 'Categoria deve ser: web, mobile, desktop, api, ecommerce ou custom'
    },
    index: true
  },

  status: {
    type: String,
    required: true,
    enum: {
      values: ['draft', 'published', 'archived'],
      message: 'Status deve ser: draft, published ou archived'
    },
    default: 'draft',
    index: true
  },

  featured: {
    type: Boolean,
    default: false,
    index: true
  },

  priority: {
    type: Number,
    default: 0,
    min: [0, 'Prioridade deve ser no mínimo 0'],
    max: [100, 'Prioridade deve ser no máximo 100'],
    index: true
  },

  technologies: [{
    type: String,
    trim: true,
    maxlength: [50, 'Nome da tecnologia deve ter no máximo 50 caracteres']
  }],

  images: {
    hero: {
      type: String,
      required: [true, 'Imagem principal é obrigatória'],
      match: [/^https?:\/\/.+/, 'URL da imagem deve ser válida']
    },
    gallery: [{
      type: String,
      match: [/^https?:\/\/.+/, 'URL da imagem deve ser válida']
    }],
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail é obrigatório'],
      match: [/^https?:\/\/.+/, 'URL do thumbnail deve ser válida']
    }
  },

  client: {
    name: {
      type: String,
      required: [true, 'Nome do cliente é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome do cliente deve ter no máximo 100 caracteres']
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Nome da empresa deve ter no máximo 100 caracteres']
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'URL do website deve ser válida']
    },
    testimonial: {
      type: String,
      trim: true,
      maxlength: [500, 'Depoimento deve ter no máximo 500 caracteres']
    },
    rating: {
      type: Number,
      min: [1, 'Avaliação deve ser no mínimo 1'],
      max: [5, 'Avaliação deve ser no máximo 5']
    }
  },

  metrics: {
    duration: {
      type: String,
      required: [true, 'Duração do projeto é obrigatória'],
      trim: true,
      maxlength: [50, 'Duração deve ter no máximo 50 caracteres']
    },
    teamSize: {
      type: Number,
      required: [true, 'Tamanho da equipe é obrigatório'],
      min: [1, 'Equipe deve ter no mínimo 1 pessoa'],
      max: [50, 'Equipe deve ter no máximo 50 pessoas']
    },
    budget: {
      type: String,
      trim: true,
      maxlength: [100, 'Orçamento deve ter no máximo 100 caracteres']
    },
    results: [{
      type: String,
      trim: true,
      maxlength: [200, 'Resultado deve ter no máximo 200 caracteres']
    }]
  },

  links: {
    live: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'URL do site deve ser válida']
    },
    github: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?github\.com\/.+/, 'URL do GitHub deve ser válida']
    },
    demo: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'URL da demo deve ser válida']
    },
    case_study: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'URL do case study deve ser válida']
    }
  },

  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, 'Meta título deve ter no máximo 60 caracteres']
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta descrição deve ter no máximo 160 caracteres']
    },
    keywords: [{
      type: String,
      trim: true,
      maxlength: [50, 'Palavra-chave deve ter no máximo 50 caracteres']
    }]
  },

  publishedAt: {
    type: Date,
    index: true
  },

  views: {
    type: Number,
    default: 0,
    min: [0, 'Views não pode ser negativo']
  },

  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes não pode ser negativo']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compostos para otimização de performance
projectSchema.index({ status: 1, featured: -1, priority: -1 }); // Lista principal
projectSchema.index({ category: 1, status: 1, publishedAt: -1 }); // Filtro por categoria
projectSchema.index({ featured: 1, publishedAt: -1 }); // Projetos em destaque
projectSchema.index({ views: -1, likes: -1 }); // Projetos populares
projectSchema.index({ 'client.company': 1, status: 1 }); // Busca por cliente
projectSchema.index({ technologies: 1, status: 1 }); // Filtro por tecnologia

// Índice de texto para busca full-text
projectSchema.index({
  title: 'text',
  description: 'text',
  shortDescription: 'text',
  'client.name': 'text',
  'client.company': 'text',
  technologies: 'text'
}, {
  name: 'project_text_search',
  weights: {
    title: 10,
    shortDescription: 8,
    description: 5,
    'client.company': 3,
    technologies: 2
  }
});

// Middleware para gerar slug automaticamente
projectSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  }

  // Atualizar publishedAt quando status muda para published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Virtual para URL do projeto
projectSchema.virtual('url').get(function () {
  return `/projetos/${this.slug}`;
});

// Virtual para calcular score de popularidade
projectSchema.virtual('popularityScore').get(function () {
  return (this.views * 0.1) + (this.likes * 2);
});

// Método estático para busca avançada
projectSchema.statics.findPublished = function (filters = {}) {
  return this.find({
    status: 'published',
    ...filters
  }).sort({ featured: -1, publishedAt: -1 });
};

// Método estático para busca por texto
projectSchema.statics.searchText = function (query: string, filters = {}) {
  return this.find({
    $text: { $search: query },
    status: 'published',
    ...filters
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore' },
    featured: -1
  });
};

// Método para incrementar views
projectSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Método para incrementar likes
projectSchema.methods.incrementLikes = function () {
  this.likes += 1;
  return this.save();
};

export const Project = mongoose.model<IProject>('Project', projectSchema); 