import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spinner, Center } from '@chakra-ui/react';
import Layout from '@/components/Layout';

// 🚀 Lazy Loading Implementation - Performance Optimization
// ✅ Code splitting for better bundle size
// ✅ Suspense boundaries for loading states
// ✅ Critical route (Home) loaded immediately

// Critical route - load immediately
import Home from '@/pages/Home';

// Non-critical routes - lazy load
const Services = lazy(() => import('@/pages/Services'));
const Clients = lazy(() => import('@/pages/Clients'));
const Blog = lazy(() => import('@/pages/Blog'));
const Contact = lazy(() => import('@/pages/Contact'));
const QuoteRequest = lazy(() => import('@/pages/QuoteRequest'));
const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));

// Reusable loading component with better UX
const PageLoader = () => (
  <Center h="300px">
    <Spinner size="xl" color="brand.500" thickness="3px" speed="0.65s" />
  </Center>
);

// Higher-order component for Suspense wrapping
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'servicos',
        element: withSuspense(Services),
      },
      {
        path: 'clientes',
        element: withSuspense(Clients),
      },
      {
        path: 'blog',
        element: withSuspense(Blog),
      },
      {
        path: 'contato',
        element: withSuspense(Contact),
      },
      {
        path: 'orcamento',
        element: withSuspense(QuoteRequest),
      },
    ],
  },
  // Rotas Admin (sem layout principal)
  {
    path: '/admin/login',
    element: withSuspense(AdminLogin),
  },
  {
    path: '/admin/dashboard',
    element: withSuspense(AdminDashboard),
  },
]); 