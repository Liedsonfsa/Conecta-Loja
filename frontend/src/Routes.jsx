import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/hooks/useCart.jsx";

// Import components
import AdminRoute from "@/components/AdminRoute";
import EmployeeRoute from "@/components/EmployeeRoute";
import ClientRoute from "@/components/ClientRoute";

// Import page components
import HomePage from "./pages/Home";
import Dashboard from "./pages/dashboard";
import Reports from "./pages/dashboard/Reports";
import NotFoundPage from "./pages/NotFound";
import OrderManagement from "./pages/OrderManagement";
import ProductManagement from "./pages/product-management";
import UserProfile from "./pages/User/UserProfile";
import AddressManagement from "./pages/User/AddressManagement";
import AddressForm from "./pages/User/AddressForm";
import StoreSettings from "./pages/store-settings";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import Checkout from "./pages/checkout";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
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
        <CartProvider>
          <RouterRoutes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <EmployeeRoute>
                <Dashboard />
              </EmployeeRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <EmployeeRoute>
                <Reports />
              </EmployeeRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <EmployeeRoute>
                <OrderManagement />
              </EmployeeRoute>
            }
          />
          <Route
            path="/produtos"
            element={
              <EmployeeRoute>
                <ProductManagement />
              </EmployeeRoute>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/addresses" element={<AddressManagement />} />
          <Route path="/profile/address/new" element={<AddressForm />} />
          <Route path="/profile/address/:id/edit" element={<AddressForm />} />
          <Route
            path="/store-settings"
            element={
              <AdminRoute>
                <StoreSettings />
              </AdminRoute>
            }
          />
          <Route path="/history" element={<OrderHistory />} />
          <Route
            path="/checkout"
            element={
              <ClientRoute>
                <Checkout />
              </ClientRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFoundPage />} />
          </RouterRoutes>
          <Toaster />
        </CartProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;
