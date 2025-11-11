import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Clients from '@/pages/Clients';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import QuoteRequest from '@/pages/QuoteRequest';

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
        element: <Services />,
      },
      {
        path: 'clientes',
        element: <Clients />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'contato',
        element: <Contact />,
      },
      {
        path: 'orcamento',
        element: <QuoteRequest />,
      },
    ],
  },
]); 