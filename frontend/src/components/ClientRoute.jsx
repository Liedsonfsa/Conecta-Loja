import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/auth';

/**
 * ClientRoute - Componente de proteção de rota para clientes autenticados
 *
 * Verifica se o usuário está autenticado (cliente, funcionário ou admin).
 * Se não estiver logado, redireciona para a página inicial.
 *
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autorizado
 * @returns {JSX.Element} Componente protegido ou redirecionamento
 */
const ClientRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkClientAccess = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.log('🔒 Nenhum token encontrado - redirecionando para home');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        console.log('🔍 Verificando autenticação do usuário...');
        const response = await authService.verifyToken();

        if (response.user) {
          console.log('✅ Usuário autenticado - acesso permitido');
          setIsAuthorized(true);
        } else {
          console.log('❌ Token inválido - redirecionando para home');
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error.message);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkClientAccess();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verificando acesso...</p>
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

export default ClientRoute;
