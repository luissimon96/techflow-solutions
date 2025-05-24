import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
  schema?: Record<string, any>;
}

const DEFAULT_SEO = {
  title: 'TechFlow Solutions - Desenvolvimento de Software',
  description: 'Transformamos ideias em soluções tecnológicas inovadoras. Desenvolvimento de software, aplicações web e mobile de alta qualidade.',
  keywords: 'desenvolvimento software, aplicações web, mobile, soluções tecnológicas, programação, React, Node.js',
  image: 'https://www.srluissimon.com/og-image.jpg',
  url: 'https://www.srluissimon.com',
  type: 'website',
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  schema
}) => {
  const seoTitle = title ? `${title} | TechFlow Solutions` : DEFAULT_SEO.title;
  const seoDescription = description || DEFAULT_SEO.description;
  const seoKeywords = keywords || DEFAULT_SEO.keywords;
  const seoImage = image || DEFAULT_SEO.image;
  const seoUrl = url || DEFAULT_SEO.url;

  return (
    <Helmet>
      {/* Título da página */}
      <title>{seoTitle}</title>

      {/* Meta tags básicas */}
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="TechFlow Solutions" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />

      {/* Schema.org JSON-LD personalizado */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

// Schemas pré-definidos para diferentes tipos de página
export const SCHEMA_TEMPLATES = {
  homepage: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechFlow Solutions",
    "url": "https://www.srluissimon.com",
    "logo": "https://www.srluissimon.com/logo.png",
    "description": "Empresa especializada em desenvolvimento de software e soluções tecnológicas",
    "foundingDate": "2023",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressLocality": "São Paulo"
    },
    "sameAs": [
      "https://www.linkedin.com/company/techflow-solutions",
      "https://github.com/techflow-solutions"
    ]
  },

  services: {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Desenvolvimento de Software",
    "provider": {
      "@type": "Organization",
      "name": "TechFlow Solutions"
    },
    "areaServed": "Brasil",
    "description": "Serviços de desenvolvimento de software, aplicações web e mobile"
  },

  contact: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "TechFlow Solutions",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-11-99999-9999",
        "contactType": "customer service"
      }
    }
  },

  blog: {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "TechFlow Solutions Blog",
    "description": "Blog técnico sobre desenvolvimento de software e tecnologia",
    "publisher": {
      "@type": "Organization",
      "name": "TechFlow Solutions"
    }
  },

  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechFlow Solutions",
    "url": "https://www.srluissimon.com",
    "logo": "https://www.srluissimon.com/logo.png",
    "description": "Empresa especializada em desenvolvimento de software e soluções tecnológicas",
    "foundingDate": "2023",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressRegion": "SP",
      "addressLocality": "São Paulo"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese", "English"]
    }
  },
}; 