import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/common/Header';
import HeroSection from './HeroSection';
import MenuSection from './MenuSection';
import Footer from '../../components/ui/Footer';
import FloatingWhatsAppButton from '../../components/ui/FloatingWhatsAppButton';
import { Toaster } from '../../components/ui/toaster';

/**
 * Home - Página inicial da aplicação Conecta-Loja
 *
 * Página principal que apresenta a landing page da aplicação,
 * contendo todas as seções principais para atrair e engajar os usuários.
 * Inclui metadados SEO para otimização de motores de busca.
 *
 * @returns {JSX.Element} Página inicial completa com todas as seções
 *
 * @example
 * // Renderizada automaticamente pelo sistema de roteamento
 * <Route path="/" element={<Home />} />
 */

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Conecta Loja</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Conecta Loja " />
        <meta property="og:description" content="" />
      </Helmet>

      <div className="w-full bg-white overflow-x-hidden">
        <Header />
        <main>
          <HeroSection />
          <MenuSection />
        </main>
        <Footer />
        <FloatingWhatsAppButton />
        <Toaster />
      </div>
    </>
  );
};

export default Home;