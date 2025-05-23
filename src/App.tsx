import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Clients } from './pages/Clients';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contato" element={<Contact />} />
      </Routes>
    </Layout>
  );
}
