import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/auth';

/**
 * EmployeeRoute - Componente de proteção de rota para funcionários e administradores
 *
 * Verifica se o usuário tem permissões de funcionário ou administrador antes de renderizar
 * o componente filho. Caso contrário, redireciona para a página inicial.
 *
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autorizado
 * @returns {JSX.Element} Componente protegido ou redirecionamento
 *
 * @example
 * // Uso em rotas protegidas para funcionários/admins
 * <Route path="/dashboard" element={
 *   <EmployeeRoute>
 *     <Dashboard />
 *   </EmployeeRoute>
 * } />
 */
const EmployeeRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkEmployeeAccess = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.log('🔒 Nenhum token encontrado - redirecionando para login');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        console.log('🔍 Verificando permissões de funcionário/admin...');
        const response = await authService.verifyToken();

        if (response.user && (response.user.userType === 'funcionario' || response.user.userType === 'admin')) {
          console.log('✅ Acesso autorizado para funcionário/admin');
          setIsAuthorized(true);
        } else {
          console.log('❌ Usuário não é funcionário/admin - redirecionando');
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar permissões:', error.message);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEmployeeAccess();
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

  // Unauthorized - redirect to home
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  // Authorized - render children
  return children;
};

export default EmployeeRoute;
