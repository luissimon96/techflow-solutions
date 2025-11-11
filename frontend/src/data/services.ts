import {
  FaLaptopCode,
  FaMobileAlt,
  FaShoppingCart,
  FaChartLine,
  FaCogs,
  FaTools,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: IconType;
  technologies: string[];
  duration: string;
  features: string[];
  featured?: boolean;
  category: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'consultoria' | 'manutencao';
}

export const services: Service[] = [
  {
    id: 'web-development',
    title: 'Desenvolvimento Web',
    subtitle: 'Sites e aplicações web modernas e responsivas',
    description: 'Criamos sites e aplicações web utilizando as tecnologias mais modernas do mercado, com foco em performance, SEO e experiência do usuário. Desde landing pages até sistemas complexos.',
    icon: FaLaptopCode,
    technologies: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Chakra UI', 'WhatsApp Integration'],
    duration: '2-8 semanas',
    features: [
      'Design responsivo e moderno',
      'SEO otimizado',
      'Performance alta (>90 Lighthouse)',
      'Segurança avançada',
      'Integração com APIs',
      'Dashboard administrativo',
      'Suporte técnico incluído'
    ],
    featured: true,
    category: 'web',
  },
  {
    id: 'mobile-development',
    title: 'Aplicações Mobile',
    subtitle: 'Apps nativos e híbridos para iOS e Android',
    description: 'Desenvolvemos aplicativos móveis nativos e híbridos com React Native, garantindo performance e experiência nativa em ambas as plataformas.',
    icon: FaMobileAlt,
    technologies: ['React Native', 'Expo', 'Firebase', 'TypeScript', 'Redux'],
    duration: '4-12 semanas',
    features: [
      'Apps para iOS e Android',
      'Performance nativa',
      'Push notifications',
      'Integração com API',
      'Testes automatizados',
      'Deploy nas stores'
    ],
    category: 'mobile',
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    subtitle: 'Lojas online completas e otimizadas',
    description: 'Desenvolvemos lojas online completas com foco em conversão e experiência do usuário. Integração com gateways de pagamento e sistemas de gestão.',
    icon: FaShoppingCart,
    technologies: ['Next.js', 'Stripe', 'PayPal', 'WooCommerce', 'Shopify'],
    duration: '3-10 semanas',
    features: [
      'Catálogo de produtos',
      'Carrinho de compras',
      'Gateway de pagamento',
      'Painel administrativo',
      'Gestão de estoque',
      'Relatórios de vendas'
    ],
    category: 'ecommerce',
  },
  {
    id: 'dashboard-analytics',
    title: 'Dashboards & Analytics',
    subtitle: 'Painéis de controle e análise de dados',
    description: 'Criamos dashboards interativos e sistemas de análise de dados para ajudar na tomada de decisões estratégicas do seu negócio.',
    icon: FaChartLine,
    technologies: ['React', 'D3.js', 'Chart.js', 'Python', 'PostgreSQL'],
    duration: '2-6 semanas',
    features: [
      'Gráficos interativos',
      'Relatórios automáticos',
      'Filtros avançados',
      'Exportação de dados',
      'Alertas personalizados',
      'API de integração'
    ],
    category: 'dashboard',
  },
  {
    id: 'consultoria-tecnica',
    title: 'Consultoria Técnica',
    subtitle: 'Arquitetura de software e code review',
    description: 'Oferecemos consultoria especializada em arquitetura de software, code review, otimização de performance e melhores práticas de desenvolvimento.',
    icon: FaCogs,
    technologies: ['Arquitetura', 'Code Review', 'DevOps', 'AWS', 'Docker'],
    duration: '1-4 semanas',
    features: [
      'Análise de arquitetura',
      'Code review detalhado',
      'Documentação técnica',
      'Otimização de performance',
      'Plano de melhorias',
      'Mentoria da equipe'
    ],
    category: 'consultoria',
  },
  {
    id: 'manutencao-suporte',
    title: 'Manutenção & Suporte',
    subtitle: 'Atualizações e suporte técnico contínuo',
    description: 'Mantemos seus sistemas sempre atualizados e funcionando perfeitamente com nosso serviço de manutenção e suporte técnico especializado.',
    icon: FaTools,
    technologies: ['Monitoring', 'Updates', 'Backup', 'Security', 'Performance'],
    duration: 'Contínuo',
    features: [
      'Monitoramento 24/7',
      'Atualizações de segurança',
      'Backup automático',
      'Suporte técnico',
      'Relatórios mensais',
      'SLA garantido'
    ],
    category: 'manutencao',
  },
];

// Função para obter serviços por categoria
export const getServicesByCategory = (category: Service['category']): Service[] => {
  return services.filter(service => service.category === category);
};

// Função para obter serviços em destaque
export const getFeaturedServices = (): Service[] => {
  return services.filter(service => service.featured);
};

// Função para obter serviço por ID
export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
}; 