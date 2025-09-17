import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import CustomerStorefront from './pages/customer-storefront';

/**
 * Routes - Componente principal de configuração de roteamento da aplicação
 *
 * Configura o roteamento da aplicação usando React Router, incluindo:
 * - BrowserRouter para navegação baseada em histórico
 * - ErrorBoundary para tratamento de erros
 * - ScrollToTop para rolagem automática ao mudar de rota
 * - Definição das rotas principais da aplicação
 *
 * @returns {JSX.Element} Estrutura completa de roteamento da aplicação
 *
 * @example
 * // Renderizado no App.jsx
 * <Routes />
 */
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CustomerStorefront />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;