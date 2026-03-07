import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, Button, Center, Text, VStack } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import { router } from '@/lib/router'
import { QueryProvider } from '@/lib/query'
import { AnalyticsProvider } from '@/lib/analytics'
import { initSentry } from '@/lib/sentry'
import theme from './theme'

initSentry()

function AppErrorFallback() {
  return (
    <Center minH="100vh" px={6}>
      <VStack spacing={4} textAlign="center" maxW="lg">
        <Text as="h1" fontSize="2xl" fontWeight="bold">
          Ocorreu um erro inesperado
        </Text>
        <Text color="gray.500">Atualize a pagina para tentar novamente.</Text>
        <Button as="a" href="/" colorScheme="brand">
          Ir para inicio
        </Button>
      </VStack>
    </Center>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AnalyticsProvider>
        <QueryProvider>
          <ChakraProvider theme={theme}>
            <Sentry.ErrorBoundary fallback={<AppErrorFallback />}>
              <RouterProvider router={router} />
            </Sentry.ErrorBoundary>
          </ChakraProvider>
        </QueryProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
