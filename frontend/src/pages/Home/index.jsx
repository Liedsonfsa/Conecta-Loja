import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/common/Header';
import HeroSection from './HeroSection';
import MenuSection from './MenuSection';

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
      </div>
    </>
  );
};

export default Home;