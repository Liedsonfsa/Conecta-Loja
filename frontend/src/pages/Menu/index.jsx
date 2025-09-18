import React from 'react';
import { Helmet } from 'react-helmet';
import MenuGrid from './MenuGrid';

/**
 * Menu - Página completa do cardápio da aplicação
 *
 * Página dedicada à apresentação completa do cardápio com
 * todos os itens organizados em grid, incluindo controles
 * de quantidade e seleção de produtos. Otimizada para SEO
 * com metadados específicos para motores de busca.
 *
 * @returns {JSX.Element} Página completa do menu com grid de produtos
 *
 * @example
 * // Acessada via rota /menu
 * <Route path="/menu" element={<Menu />} />
 */

const Menu = () => {
  return (
    <>
      <Helmet>
        <title>Food Menu - Pizzas, Burgers, Beverages & Desserts | Conecta Loja</title>
        <meta name="description" content="Browse our delicious food menu featuring fresh pizzas, gourmet burgers, refreshing beverages and sweet desserts. Order online with easy quantity selection and fast delivery." />
        <meta property="og:title" content="Food Menu - Pizzas, Burgers, Beverages & Desserts | Conecta Loja" />
        <meta property="og:description" content="Browse our delicious food menu featuring fresh pizzas, gourmet burgers, refreshing beverages and sweet desserts. Order online with easy quantity selection and fast delivery." />
      </Helmet>
      
      <main className="w-full bg-background-overlay-gray">
        <MenuGrid />
      </main>
    </>
  );
};

export default Menu;