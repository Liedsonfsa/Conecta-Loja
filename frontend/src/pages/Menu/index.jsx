import React from 'react';
import { Helmet } from 'react-helmet';
import MenuGrid from './MenuGrid';

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