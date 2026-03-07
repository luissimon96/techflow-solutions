import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from '@/lib/router'
import { QueryProvider } from '@/lib/query'
import { AnalyticsProvider } from '@/lib/analytics'
import { initSentry } from '@/lib/sentry'
import theme from './theme'

initSentry()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AnalyticsProvider>
        <QueryProvider>
          <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
          </ChakraProvider>
        </QueryProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
