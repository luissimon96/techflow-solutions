# Guia de Performance - TechFlow Solutions

## Princípios de Performance

1. **Carregamento Rápido**: Primeiro byte em menos de 1s
2. **Interatividade**: Tempo de resposta < 100ms
3. **Fluidez**: 60 FPS em animações
4. **Eficiência**: Uso otimizado de recursos
5. **Escalabilidade**: Performance mantida com crescimento

## Métricas de Performance

### Core Web Vitals

```typescript
// ✅ Correto
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
    optimizeFonts: true
  }
};

// ❌ Evitar
// Sem otimizações
```

### Lighthouse

```typescript
// ✅ Correto
// package.json
{
  "scripts": {
    "lighthouse": "lighthouse http://localhost:3000 --view",
    "lighthouse:ci": "lighthouse http://localhost:3000 --output json --output html"
  }
}

// ❌ Evitar
// Sem métricas de performance
```

## Otimizações

### Code Splitting

```typescript
// ✅ Correto
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}

// ❌ Evitar
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
```

### Lazy Loading

```typescript
// ✅ Correto
import { lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}

// ❌ Evitar
import HeavyComponent from './HeavyComponent';
```

### Memoização

```typescript
// ✅ Correto
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div onClick={handleClick}>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

// ❌ Evitar
function ExpensiveComponent({ data }) {
  const processedData = data.map(item => ({
    ...item,
    processed: true
  }));

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Imagens

```typescript
// ✅ Correto
import Image from 'next/image';

function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      placeholder="blur"
      quality={75}
    />
  );
}

// ❌ Evitar
<img src={src} alt={alt} />
```

### Fontes

```typescript
// ✅ Correto
// next.config.js
module.exports = {
  optimizeFonts: true
};

// _document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preload"
          href="/fonts/custom-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// ❌ Evitar
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/custom-font.woff2');
}
```

### Caching

```typescript
// ✅ Correto
import { useQuery } from 'react-query';

function ProductList() {
  const { data } = useQuery('products', fetchProducts, {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  });

  return (
    <div>
      {data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ❌ Evitar
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Bundle Size

```typescript
// ✅ Correto
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 244000,
      minSize: 20000
    }
  }
};

// ❌ Evitar
// Sem otimização de bundle
```

## Monitoramento

### Performance Monitoring

```typescript
// ✅ Correto
import { performance } from 'perf_hooks';

function measurePerformance(componentName: string) {
  const start = performance.now();
  
  return {
    end: () => {
      const end = performance.now();
      const duration = end - start;
      
      // Envia métrica para serviço de monitoramento
      sendMetric({
        name: `${componentName}_render_time`,
        value: duration,
        tags: {
          component: componentName
        }
      });
    }
  };
}

// ❌ Evitar
// Sem monitoramento de performance
```

### Error Tracking

```typescript
// ✅ Correto
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

// ❌ Evitar
// Sem tracking de erros
```

## Checklist de Performance

### Carregamento

- [ ] Code splitting
- [ ] Lazy loading
- [ ] Otimização de imagens
- [ ] Otimização de fontes
- [ ] Minificação de assets

### Runtime

- [ ] Memoização
- [ ] Virtualização de listas
- [ ] Debounce/Throttle
- [ ] Web Workers
- [ ] Service Workers

### Caching

- [ ] Browser cache
- [ ] Service Worker cache
- [ ] API cache
- [ ] Static generation
- [ ] CDN

### Monitoramento

- [ ] Core Web Vitals
- [ ] Lighthouse
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User metrics

### Build

- [ ] Bundle size
- [ ] Tree shaking
- [ ] Minificação
- [ ] Compression
- [ ] Source maps
