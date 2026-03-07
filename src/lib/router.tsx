import { Suspense, lazy, type ReactNode } from 'react';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';

const Home = lazy(() => import('@/pages/Home'));
const Services = lazy(() => import('@/pages/Services'));
const ITServices = lazy(() => import('@/pages/ITServices'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const QuoteRequest = lazy(() => import('@/pages/QuoteRequest'));

function RouteLoader() {
  return (
    <Center minH="40vh" role="status" aria-live="polite" aria-label="Carregando página">
      <Spinner size="lg" thickness="4px" color="brand.500" />
    </Center>
  );
}

function withSuspense(page: ReactNode) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Box>{page}</Box>
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(<Home />),
      },
      {
        path: 'servicos',
        element: withSuspense(<Services />),
      },
      {
        path: 'servicos-ti',
        element: withSuspense(<ITServices />),
      },
      {
        path: 'sobre',
        element: withSuspense(<About />),
      },
      {
        path: 'contato',
        element: withSuspense(<Contact />),
      },
      {
        path: 'orcamento',
        element: withSuspense(<QuoteRequest />),
      },
    ],
  },
]); 