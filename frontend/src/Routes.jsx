import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import page components
import HomePage from "./pages/Home";
import MenuPage from "./pages/Menu";

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
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
