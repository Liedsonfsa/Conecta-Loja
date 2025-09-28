import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import LoginModal from "../../pages/Home/LoginModal";
import { FiPhone, FiMapPin, FiUser, FiMenu, FiX } from "react-icons/fi";
import { authService } from "../../api/auth";

/**
 * Header - Componente de cabeçalho principal da aplicação
 *
 * Exibe o cabeçalho responsivo da aplicação Conecta-Loja contendo:
 * - Logo da empresa
 * - Informações de contato (telefone e localização)
 * - Botões de ação (entrar e carrinho)
 * - Menu mobile responsivo
 *
 * @returns {JSX.Element} Componente de cabeçalho renderizado
 *
 * @example
 * // Uso em uma página
 * <Header />
 */

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [apiOffline, setApiOffline] = useState(false);

  // Verificar se há token válido quando o componente monta
  useEffect(() => {
    /**
     * Verifica o status de autenticação do usuário
     */
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      console.log('🔍 Verificando token no localStorage:', token ? 'Token encontrado' : 'Nenhum token');

      if (token) {
        try {
          console.log('📡 Verificando validade do token na API...');
          setApiOffline(false); // Reset offline status
          const response = await authService.verifyToken();
          console.log('✅ Resposta da verificação:', response);

          if (response.user) {
            console.log('👤 Usuário válido, definindo estado:', response.user);
            setUser(response.user);
          } else {
            console.log('⚠️ Token válido mas sem dados do usuário');
          }
        } catch (error) {
          console.log('❌ Erro na verificação do token:', error.message);

          // Só remover token se for erro de autenticação (401), não erro de conexão
          if (error.message.includes('Sessão expirada') || error.message.includes('Token inválido')) {
            console.log('🗑️ Token inválido/expirado, removendo do localStorage');
            localStorage.removeItem('authToken');
            setApiOffline(false);
          } else if (error.message.includes('Erro de conexão') || error.message.includes('Verifique sua internet')) {
            console.log('🔄 API offline - mantendo token para tentar novamente quando API estiver disponível');
            console.log('⚠️ Modo offline ativado - usuário pode fazer login quando API voltar');
            setApiOffline(true);
            // Mantém o token salvo mas usuário fica null
          } else {
            console.log('❓ Erro desconhecido, removendo token por segurança');
            localStorage.removeItem('authToken');
            setApiOffline(false);
          }
        }
      } else {
        console.log('ℹ️ Nenhum token encontrado, usuário permanece deslogado');
        setApiOffline(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Manipula o login do usuário
   * @param {Object} userData - Dados do usuário logado
   */
  const handleLogin = (userData) => {
    setUser(userData);
  };

  /**
   * Manipula o logout do usuário
   */
  const handleLogout = () => {
    setUser(null);
    setApiOffline(false);
    localStorage.removeItem('authToken');
  };

  // Função para tentar reconectar quando API volta
  /**
   * Tenta reconectar verificando se há token válido
   */
  const tryReconnect = async () => {
    const token = localStorage.getItem('authToken');
    if (token && apiOffline) {
      try {
        console.log('🔄 Tentando reconectar...');
        const response = await authService.verifyToken();
        if (response.user) {
          console.log('✅ Reconexão bem-sucedida!');
          setUser(response.user);
          setApiOffline(false);
        }
      } catch (error) {
        console.log('❌ Reconexão falhou:', error.message);
      }
    }
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand Section */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-orange-500">Conecta Loja</h1>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">

            {/* Contact Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FiPhone className="w-4 h-4" />
                <span>(89) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiMapPin className="w-4 h-4" />
                <span>Picos, PI</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Olá, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : apiOffline ? (
                <button
                  onClick={tryReconnect}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Clique para tentar reconectar"
                >
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Conectando...</span>
                </button>
              ) : (
                <LoginModal onLogin={handleLogin}>
                  <button className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors">
                    <FiUser className="w-4 h-4" />
                    <span>Entrar</span>
                  </button>
                </LoginModal>
              )}

              <Button
                text="Carrinho"
                text_font_size="14"
                text_font_family="Inter"
                text_font_weight="500"
                text_color="#ffffff"
                fill_background_color="#ff531a"
                border_border_radius="8px"
                padding="8px 16px"
                variant="primary"
                size="medium"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => {}}
              />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">

              {/* Contact Info */}
              <div className="flex flex-col space-y-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <FiPhone className="w-4 h-4" />
                  <span>(85) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="w-4 h-4" />
                  <span>Picos, PI</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-700">Olá, {user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                ) : apiOffline ? (
                  <button
                    onClick={tryReconnect}
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg transition-colors px-2 py-1"
                    title="Clique para tentar reconectar"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">Conectando...</span>
                  </button>
                ) : (
                  <LoginModal onLogin={handleLogin}>
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                      <FiUser className="w-4 h-4" />
                      <span>Entrar</span>
                    </button>
                  </LoginModal>
                )}

                <Button
                  text="Carrinho"
                  text_font_size="14"
                  text_font_family="Inter"
                  text_font_weight="500"
                  text_color="#ffffff"
                  fill_background_color="#ff531a"
                  border_border_radius="8px"
                  padding="8px 16px"
                  variant="primary"
                  size="medium"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors w-fit"
                  onClick={() => {}}
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
