.const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Informações Básicas
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 300
  },

  // Categorização
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'ecommerce', 'dashboard', 'erp', 'api', 'consultoria']
  },
  subcategory: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    enum: [
      'e-commerce',
      'saude',
      'educacao',
      'financeiro',
      'logistica',
      'varejo',
      'servicos',
      'tecnologia',
      'manufatura',
      'agricultura',
      'outro'
    ]
  },

  // Tecnologias
  technologies: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'cloud', 'mobile', 'other'],
      default: 'other'
    }
  }],

  // Cliente e Contexto
  client: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    industry: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      enum: ['startup', 'pequena', 'media', 'grande', 'multinacional']
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },

  // Desenvolvimento
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    duration: {
      type: String, // "3 meses", "6 semanas", etc
      trim: true
    }
  },
  teamSize: {
    type: Number,
    min: 1,
    max: 50
  },
  methodology: {
    type: String,
    enum: ['agile', 'scrum', 'kanban', 'waterfall', 'custom'],
    default: 'agile'
  },

  // Funcionalidades e Características
  features: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['core', 'advanced', 'integration', 'security', 'performance', 'other'],
      default: 'other'
    }
  }],

  // Resultados e Métricas
  results: {
    performanceImprovement: {
      type: String,
      trim: true
    },
    userSatisfaction: {
      type: String,
      trim: true
    },
    businessImpact: {
      type: String,
      trim: true
    },
    metrics: [{
      name: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      description: {
        type: String
      }
    }]
  },

  // Mídia
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['screenshot', 'mockup', 'architecture', 'logo', 'other'],
      default: 'screenshot'
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['demo', 'presentation', 'tutorial', 'testimonial'],
      default: 'demo'
    }
  }],

  // Links
  links: {
    live: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'URL deve começar com http:// ou https://']
    },
    github: {
      type: String,
      trim: true,
      match: [/^https?:\/\/github\.com\//, 'URL deve ser um link válido do GitHub']
    },
    documentation: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'URL deve começar com http:// ou https://']
    },
    case_study: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'URL deve começar com http:// ou https://']
    }
  },

  // Status e Visibilidade
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'client_only'],
    default: 'public'
  },

  // SEO e Metadados
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  seo: {
    title: {
      type: String,
      maxlength: 60
    },
    description: {
      type: String,
      maxlength: 160
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },

  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    lastViewed: {
      type: Date
    }
  },

  // Metadados do Sistema
  author: {
    type: String,
    default: 'TechFlow Solutions'
  },
  lastModifiedBy: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
projectSchema.index({ status: 1, featured: -1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ 'client.industry': 1, status: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ slug: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ 'analytics.views': -1 });

// Texto completo para busca
projectSchema.index({
  title: 'text',
  description: 'text',
  'client.name': 'text',
  tags: 'text'
});

// Virtual para URL completa
projectSchema.virtual('url').get(function() {
  return `/projects/${this.slug}`;
});

// Virtual para imagem principal
projectSchema.virtual('primaryImage').get(function() {
  return this.images.find(img => img.isPrimary) || this.images[0];
});

// Virtual para duração calculada
projectSchema.virtual('calculatedDuration').get(function() {
  if (this.timeline.startDate && this.timeline.endDate) {
    const diffTime = Math.abs(this.timeline.endDate - this.timeline.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} dias`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.round(diffDays / 365);
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  }
  return this.timeline.duration || 'Não especificado';
});

// Middleware para gerar slug automaticamente
projectSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim('-'); // Remove hífens do início e fim
  }
  next();
});

// Middleware para atualizar lastModified
projectSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = 'system'; // Pode ser substituído por userId quando houver auth
  }
  next();
});

// Método estático para buscar projetos públicos
projectSchema.statics.findPublic = function(limit = 10) {
  return this.find({ 
    status: 'published', 
    visibility: 'public' 
  })
  .sort({ featured: -1, createdAt: -1 })
  .limit(limit);
};

// Método estático para buscar projetos em destaque
projectSchema.statics.findFeatured = function(limit = 6) {
  return this.find({ 
    status: 'published', 
    visibility: 'public',
    featured: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Método para incrementar visualizações
projectSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

// Método para obter tecnologias por categoria
projectSchema.methods.getTechnologiesByCategory = function() {
  const grouped = {};
  this.technologies.forEach(tech => {
    if (!grouped[tech.category]) {
      grouped[tech.category] = [];
    }
    grouped[tech.category].push(tech.name);
  });
  return grouped;
};

module.exports = mongoose.model('Project', projectSchema); 