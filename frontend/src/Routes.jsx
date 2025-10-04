import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";

// Import components
import AdminRoute from "@/components/AdminRoute";
import EmployeeRoute from "@/components/EmployeeRoute";

// Import page components
import HomePage from "./pages/Home";
import Dashboard from "./pages/dashboard";
import NotFoundPage from "./pages/NotFound";
import OrderManagement from "./pages/OrderManagement";
import ProductManagement from "./pages/product-management";
import UserProfile from "./pages/User/UserProfile";
import StoreSettings from './pages/store-settings';
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
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <EmployeeRoute>
              <Dashboard />
            </EmployeeRoute>
          } />
          <Route path="/pedidos" element={<OrderManagement />} />
          <Route path="/produtos" element={<ProductManagement />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/store-settings" element={
            <AdminRoute>
              <StoreSettings />
            </AdminRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </RouterRoutes>
        <Toaster />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;
