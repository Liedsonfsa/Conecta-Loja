import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/auth';

/**
 * AdminRoute - Componente de proteção de rota para administradores
 *
 * Verifica se o usuário tem permissões de administrador antes de renderizar
 * o componente filho. Caso contrário, redireciona para o dashboard ou página inicial.
 *
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autorizado
 * @returns {JSX.Element} Componente protegido ou redirecionamento
 *
 * @example
 * // Uso em rotas protegidas
 * <Route path="/admin/*" element={
 *   <AdminRoute>
 *     <AdminPanel />
 *   </AdminRoute>
 * } />
 */
const AdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.log('🔒 Nenhum token encontrado - redirecionando');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        console.log('🔍 Verificando permissões de administrador...');
        const response = await authService.verifyToken();

        if (response.user && response.user.userType === 'admin') {
          console.log('✅ Acesso autorizado para administrador');
          setIsAuthorized(true);
        } else {
          console.log('❌ Usuário não é administrador - redirecionando');
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar permissões:', error.message);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Unauthorized - redirect to dashboard
  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized - render children
  return children;
};

export default AdminRoute;
