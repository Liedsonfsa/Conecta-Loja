import { useState, useEffect } from "react";

/**
 * Hook personalizado para gerenciar estado de autenticação
 *
 * @returns {Object} Estado de autenticação
 * @returns {string|null} userType - Tipo de usuário ('cliente', 'funcionario', 'admin')
 * @returns {boolean} isLoading - Se está carregando dados de autenticação
 * @returns {Object|null} user - Dados do usuário autenticado
 *
 * @example
 * const { userType, isLoading, user } = useAuth();
 */
export const useAuth = () => {
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Tentar decodificar o token JWT para obter userType
        // Nota: Em produção, seria melhor fazer uma chamada para verificar o token
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userData = payload;

        setUserType(userData.userType || null);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setUserType(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { userType, user, isLoading };
};
