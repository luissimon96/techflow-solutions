import {
  FaDesktop,
  FaServer,
  FaMobileAlt,
  FaTabletAlt,
  FaTools,
  FaCogs,
  FaShieldAlt,
  FaUserShield,
  FaCloud,
  FaDatabase,
  FaCloudUploadAlt,
  FaExchangeAlt,
  FaChartLine,
  FaEye,
  FaHeadset,
  FaLock,
  FaRocket,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

// Interfaces para serviços de TI
export interface ITPackageFeature {
  name: string;
  included: boolean;
  description?: string;
  limit?: string | number;
}

export interface ITPackage {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'annual';
  features: ITPackageFeature[];
  limitations?: string[];
  popular?: boolean;
  targetUsers: number | 'unlimited';
  sla: string;
  supportType: 'business' | '24x7' | 'priority';
  responseTime: string;
  visits?: string;
  backupStorage?: string;
  monitoring?: string;
}

export interface UseCase {
  title: string;
  description: string;
  result: string;
  industry?: string;
}

export interface ITService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: IconType;
  category: 'support' | 'security' | 'cloud' | 'maintenance';
  targetAudience: 'individual' | 'business' | 'both';
  packages: ITPackage[];
  features: string[];
  benefits: string[];
  useCases: UseCase[];
  technologies: string[];
  duration: string;
  featured?: boolean;
}

// Pacotes para Pessoa Física
const individualPackages: ITPackage[] = [
  {
    id: 'essencial-pf',
    name: 'Essencial',
    price: 89,
    billing: 'monthly',
    targetUsers: 2,
    sla: '95%',
    supportType: 'business',
    responseTime: '24h',
    visits: 'Trimestral',
    backupStorage: '100GB',
    monitoring: 'Manual',
    features: [
      { name: 'Suporte remoto ilimitado', included: true, description: 'WhatsApp + TeamViewer' },
      { name: 'Backup automático', included: true, limit: '100GB' },
      { name: 'Antivírus premium', included: true },
      { name: 'Visitas técnicas', included: true, limit: '1/trimestre' },
      { name: 'Dispositivos suportados', included: true, limit: '2' },
      { name: 'Suporte 24/7', included: false },
      { name: 'Configuração de rede', included: false },
      { name: 'Smart home setup', included: false },
    ],
  },
  {
    id: 'completo-pf',
    name: 'Completo',
    price: 149,
    billing: 'monthly',
    targetUsers: 5,
    sla: '97%',
    supportType: 'business',
    responseTime: '8h',
    visits: 'Mensal',
    backupStorage: '500GB',
    monitoring: 'Automático',
    popular: true,
    features: [
      { name: 'Suporte remoto ilimitado', included: true },
      { name: 'Backup automático', included: true, limit: '500GB' },
      { name: 'Antivírus premium', included: true },
      { name: 'Visitas técnicas', included: true, limit: '1/mês' },
      { name: 'Dispositivos suportados', included: true, limit: '5' },
      { name: 'Configuração de rede doméstica', included: true },
      { name: 'Smart home setup', included: true },
      { name: 'Suporte 24/7', included: false },
    ],
  },
  {
    id: 'premium-pf',
    name: 'Premium',
    price: 239,
    billing: 'monthly',
    targetUsers: 'unlimited',
    sla: '99%',
    supportType: '24x7',
    responseTime: '2h',
    visits: 'Ilimitadas',
    backupStorage: 'Ilimitado',
    monitoring: 'IA + Human',
    features: [
      { name: 'Suporte remoto ilimitado', included: true },
      { name: 'Backup automático', included: true, limit: 'Ilimitado' },
      { name: 'Antivírus premium', included: true },
      { name: 'Visitas técnicas', included: true, limit: 'Ilimitadas' },
      { name: 'Dispositivos suportados', included: true, limit: 'Ilimitados' },
      { name: 'Configuração de rede doméstica', included: true },
      { name: 'Smart home setup', included: true },
      { name: 'Suporte 24/7 prioritário', included: true },
      { name: 'Consultoria tech personalizada', included: true },
      { name: 'Home office profissional setup', included: true },
    ],
  },
];

// Pacotes para Pessoa Jurídica
const businessPackages: ITPackage[] = [
  {
    id: 'startup-pj',
    name: 'Startup',
    price: 599,
    billing: 'monthly',
    targetUsers: 10,
    sla: '99.5%',
    supportType: 'business',
    responseTime: '4h',
    visits: '2/mês',
    backupStorage: '1TB',
    monitoring: '24/7 Basic',
    features: [
      { name: 'Monitoramento 24/7', included: true },
      { name: 'Backup corporativo', included: true, limit: '1TB' },
      { name: 'Suporte técnico horário comercial', included: true },
      { name: 'Segurança básica', included: true },
      { name: 'Consultor dedicado', included: true, limit: '1' },
      { name: 'Visitas técnicas', included: true, limit: '2/mês' },
      { name: 'SOC 24/7', included: false },
      { name: 'Disaster Recovery', included: false },
      { name: 'Cloud migration', included: false },
    ],
  },
  {
    id: 'business-pj',
    name: 'Business',
    price: 1299,
    billing: 'monthly',
    targetUsers: 50,
    sla: '99.5%',
    supportType: '24x7',
    responseTime: '1h',
    visits: '4/mês',
    backupStorage: '5TB',
    monitoring: '24/7 SOC',
    popular: true,
    features: [
      { name: 'Monitoramento 24/7', included: true },
      { name: 'Backup corporativo', included: true, limit: '5TB' },
      { name: 'SOC 24/7 com analistas', included: true },
      { name: 'Disaster Recovery', included: true },
      { name: 'Cloud migration assistance', included: true },
      { name: 'Consultor dedicado', included: true },
      { name: 'Consultoria estratégica mensal', included: true },
      { name: 'Visitas técnicas', included: true, limit: '4/mês' },
      { name: 'CISO dedicado', included: false },
    ],
  },
  {
    id: 'enterprise-pj',
    name: 'Enterprise',
    price: 2999,
    billing: 'monthly',
    targetUsers: 'unlimited',
    sla: '99.9%',
    supportType: 'priority',
    responseTime: '30min',
    visits: 'Ilimitadas',
    backupStorage: 'Ilimitado',
    monitoring: '24/7 CISO',
    features: [
      { name: 'Monitoramento 24/7', included: true },
      { name: 'Backup corporativo', included: true, limit: 'Ilimitado' },
      { name: 'SOC 24/7 com analistas', included: true },
      { name: 'Disaster Recovery', included: true },
      { name: 'Cloud migration assistance', included: true },
      { name: 'CISO dedicado', included: true },
      { name: 'Compliance framework', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Visitas técnicas', included: true, limit: 'Ilimitadas' },
      { name: 'Suporte on-site garantido', included: true },
    ],
  },
];

// Definição dos serviços de TI
export const itServices: ITService[] = [
  {
    id: 'suporte-desktop-infraestrutura',
    title: 'Suporte Desktop & Infraestrutura',
    subtitle: 'Gerenciamento completo de equipamentos e rede',
    description: 'Suporte técnico especializado para desktops, notebooks, servidores e infraestrutura de rede. Configuração, manutenção e troubleshooting com resposta rápida e soluções eficazes.',
    icon: FaDesktop,
    category: 'support',
    targetAudience: 'both',
    packages: [...individualPackages, ...businessPackages],
    features: [
      'Suporte remoto 24/7',
      'Configuração de equipamentos',
      'Troubleshooting especializado',
      'Gerenciamento de rede',
      'Active Directory',
      'Monitoramento proativo',
    ],
    benefits: [
      'Redução de 85% no tempo de resolução',
      'Prevenção proativa de problemas',
      'Técnicos certificados e especializados',
      'Atendimento humanizado via WhatsApp',
    ],
    useCases: [
      {
        title: 'Home Office Empresarial',
        description: 'Configuração completa de workstation para trabalho remoto',
        result: '100% uptime em 6 meses de operação',
      },
      {
        title: 'Rede Corporativa',
        description: 'Implementação de rede segura para empresa de 30 funcionários',
        result: 'Zero incidentes de segurança em 1 ano',
      },
    ],
    technologies: ['Windows', 'Linux', 'macOS', 'Active Directory', 'TeamViewer', 'Zabbix'],
    duration: 'Contínuo',
    featured: true,
  },
  {
    id: 'seguranca-cibernetica',
    title: 'Segurança Cibernética',
    subtitle: 'Proteção avançada contra ameaças digitais',
    description: 'Solução completa de segurança digital com monitoramento 24/7, detecção de ameaças em tempo real e resposta imediata. Proteja seus dados e sistemas com tecnologia de ponta.',
    icon: FaShieldAlt,
    category: 'security',
    targetAudience: 'both',
    packages: [...individualPackages, ...businessPackages],
    features: [
      'SOC 24/7 com analistas',
      'SIEM avançado',
      'Detecção de ameaças por IA',
      'Response team dedicado',
      'Firewall empresarial',
      'Educação em segurança',
    ],
    benefits: [
      'Bloqueio de 99.7% das tentativas de invasão',
      'Resposta em menos de 30 minutos',
      'Compliance LGPD garantido',
      'Redução de riscos em 95%',
    ],
    useCases: [
      {
        title: 'Proteção contra Ransomware',
        description: 'Implementação de camadas de proteção para empresa financeira',
        result: 'Zero ataques bem-sucedidos em 2 anos',
      },
      {
        title: 'Compliance LGPD',
        description: 'Adequação completa à Lei Geral de Proteção de Dados',
        result: 'Certificação obtida em 45 dias',
      },
    ],
    technologies: ['SIEM', 'EDR', 'Firewall', 'IDS/IPS', 'Threat Intelligence', 'SOAR'],
    duration: 'Contínuo',
  },
  {
    id: 'backup-recuperacao',
    title: 'Backup & Recuperação',
    subtitle: 'Seus dados protegidos e sempre acessíveis',
    description: 'Sistema avançado de backup automatizado com múltiplas camadas de proteção. Disaster Recovery planejado e testado para garantir a continuidade do seu negócio.',
    icon: FaDatabase,
    category: 'security',
    targetAudience: 'both',
    packages: [...individualPackages, ...businessPackages],
    features: [
      'Backup automático na nuvem',
      'Disaster Recovery Plan',
      'Testes de restore mensais',
      'Replicação geográfica',
      'Versionamento de arquivos',
      'Recovery em minutos',
    ],
    benefits: [
      'RTO de 4 horas garantido',
      'RPO de 15 minutos',
      '99.99% de durabilidade dos dados',
      'Testes automatizados de integridade',
    ],
    useCases: [
      {
        title: 'Recovery Crítico',
        description: 'Recuperação completa de servidor após falha de hardware',
        result: 'Restauração em 2 horas, zero perda de dados',
      },
      {
        title: 'Backup Familiar',
        description: 'Proteção de fotos e documentos pessoais de família',
        result: '10 anos de memórias sempre seguras',
      },
    ],
    technologies: ['AWS S3', 'Veeam', 'Acronis', 'Restic', 'Cloud Storage', 'Encryption'],
    duration: 'Contínuo',
  },
  {
    id: 'migracao-cloud',
    title: 'Migração para Cloud',
    subtitle: 'Modernize sua infraestrutura sem riscos',
    description: 'Migração completa para cloud com zero downtime. Planejamento detalhado, execução cuidadosa e otimização contínua de custos. Especialistas em AWS, Azure e Google Cloud.',
    icon: FaCloudUploadAlt,
    category: 'cloud',
    targetAudience: 'business',
    packages: businessPackages,
    features: [
      'Assessment completo',
      'Migração sem downtime',
      'Otimização de custos',
      'Hybrid cloud strategy',
      'Auto-scaling configurado',
      'Monitoramento cloud-native',
    ],
    benefits: [
      '60% redução nos custos de TI',
      'Escalabilidade automática',
      'ROI de 300% em 18 meses',
      'Disponibilidade 99.99%',
    ],
    useCases: [
      {
        title: 'E-commerce para AWS',
        description: 'Migração de loja online com 50k usuários simultâneos',
        result: '70% redução de custos e 3x melhor performance',
      },
      {
        title: 'Sistema ERP Híbrido',
        description: 'Migração parcial mantendo dados sensíveis on-premise',
        result: 'Flexibilidade total com segurança maximizada',
      },
    ],
    technologies: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker'],
    duration: '2-8 semanas',
    featured: true,
  },
  {
    id: 'monitoramento-analytics',
    title: 'Monitoramento & Analytics',
    subtitle: 'Visibilidade total da sua infraestrutura',
    description: 'Dashboard executivo com métricas em tempo real, alertas inteligentes e relatórios automatizados. Tome decisões baseadas em dados concretos sobre sua infraestrutura de TI.',
    icon: FaChartLine,
    category: 'maintenance',
    targetAudience: 'both',
    packages: [...individualPackages, ...businessPackages],
    features: [
      'Dashboard em tempo real',
      'Alertas inteligentes',
      'Relatórios executivos',
      'KPIs personalizados',
      'Integração com BI',
      'Mobile app dedicado',
    ],
    benefits: [
      'Decisões 5x mais rápidas',
      'Prevenção de 90% dos problemas',
      'ROI tracking automatizado',
      'Compliance reporting integrado',
    ],
    useCases: [
      {
        title: 'Dashboard CEO',
        description: 'Visão executiva dos KPIs de TI em tempo real',
        result: 'Decisões estratégicas baseadas em dados reais',
      },
      {
        title: 'Monitoramento Familiar',
        description: 'Controle de uso de internet e dispositivos para crianças',
        result: 'Família digital mais segura e controlada',
      },
    ],
    technologies: ['Grafana', 'Prometheus', 'ELK Stack', 'Power BI', 'Tableau', 'Custom APIs'],
    duration: 'Contínuo',
  },
  {
    id: 'manutencao-preventiva',
    title: 'Manutenção Preventiva',
    subtitle: 'Evite problemas antes que aconteçam',
    description: 'Programa completo de manutenção preventiva com IA para prever falhas. Atualizações automáticas, otimização de performance e relatórios detalhados de saúde do sistema.',
    icon: FaTools,
    category: 'maintenance',
    targetAudience: 'both',
    packages: [...individualPackages, ...businessPackages],
    features: [
      'IA para predição de falhas',
      'Atualizações automáticas',
      'Limpeza e otimização',
      'Auditoria de segurança',
      'Planejamento de upgrades',
      'Relatórios de saúde',
    ],
    benefits: [
      'Redução de 95% em falhas críticas',
      'Aumento de 40% na vida útil dos equipamentos',
      'Performance 30% melhor',
      'Custos de TI 50% menores',
    ],
    useCases: [
      {
        title: 'Parque de TI Corporativo',
        description: 'Manutenção preventiva de 200 equipamentos',
        result: 'Zero falhas críticas em 18 meses',
      },
      {
        title: 'Setup Gaming',
        description: 'Otimização contínua de PC gamer de alta performance',
        result: 'Performance máxima mantida por 3 anos',
      },
    ],
    technologies: ['AI/ML', 'PowerShell', 'Ansible', 'WSUS', 'SCCM', 'Custom Scripts'],
    duration: 'Contínuo',
  },
];

// Funções utilitárias para IT Services
export const getITServicesByCategory = (category: ITService['category']): ITService[] => {
  return itServices.filter(service => service.category === category);
};

export const getITServicesByAudience = (audience: ITService['targetAudience']): ITService[] => {
  return itServices.filter(service => service.targetAudience === audience || service.targetAudience === 'both');
};

export const getFeaturedITServices = (): ITService[] => {
  return itServices.filter(service => service.featured);
};

export const getITServiceById = (id: string): ITService | undefined => {
  return itServices.find(service => service.id === id);
};

export const getIndividualPackages = (): ITPackage[] => {
  return individualPackages;
};

export const getBusinessPackages = (): ITPackage[] => {
  return businessPackages;
};

// Categorias de IT Services
export const itServiceCategories = [
  {
    id: 'support',
    name: 'Suporte & Infraestrutura',
    description: 'Suporte técnico completo e gerenciamento de infraestrutura',
    icon: FaHeadset,
  },
  {
    id: 'security',
    name: 'Segurança Digital',
    description: 'Proteção avançada contra ameaças cibernéticas',
    icon: FaLock,
  },
  {
    id: 'cloud',
    name: 'Cloud & Modernização',
    description: 'Migração e otimização na nuvem',
    icon: FaRocket,
  },
  {
    id: 'maintenance',
    name: 'Manutenção & Monitoramento',
    description: 'Prevenção proativa e monitoramento inteligente',
    icon: FaCogs,
  },
] as const;