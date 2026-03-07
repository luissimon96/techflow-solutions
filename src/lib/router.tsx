import { Suspense, lazy, type ReactNode } from 'react';
import { Box, Center, Spinner, Text, VStack, Button } from '@chakra-ui/react';
import { createBrowserRouter, isRouteErrorResponse, useRouteError } from 'react-router-dom';
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

function RouteErrorFallback() {
  const error = useRouteError();

  let title = 'Nao foi possivel carregar esta pagina';
  let description = 'Tente novamente em instantes.';

  if (isRouteErrorResponse(error)) {
    title = `Erro ${error.status}`;
    description = typeof error.data === 'string' ? error.data : description;
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <Center minH="50vh" px={6}>
      <VStack spacing={4} textAlign="center" maxW="lg">
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          {title}
        </Text>
        <Text color="gray.500">{description}</Text>
        <Button as="a" href="/" colorScheme="brand">
          Voltar para inicio
        </Button>
      </VStack>
    </Center>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorFallback />,
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