import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORTADO
import Icon from '../AppIcon';
import Button from './ButtonDash';

const Header = ({ onMenuToggle, isSidebarCollapsed = false }) => {
  // 1. Adiciona estado para controlar o dropdown do perfil
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 2. Adiciona uma referência para o menu para detectar cliques fora
  const profileMenuRef = useRef(null);
  
  // 3. INICIALIZA O HOOK DE NAVEGAÇÃO
  const navigate = useNavigate(); // <-- ADICIONADO

  // 4. FUNÇÃO PARA LIDAR COM O LOGOUT/SAIR
  const handleLogout = () => {
    // Se precisar, adicione sua lógica de limpeza de login aqui
    // ex: localStorage.removeItem('seu-token');
    
    // Navega para a página home
    navigate('/');
  };

  // 5. Adiciona um Effect para fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o menu estiver aberto e o clique NÃO for dentro do menu
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    // Adiciona o listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Limpa o listener ao desmontar o componente
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]); // A dependência é a própria referência

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Mobile Menu (Sem alterações) */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              {/* Seu SVG de Logo */}
              <svg width="20" height="20" /* ...props */ >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" /* ...props */ />
                <path d="M2 17L12 22L22 17" stroke="currentColor" /* ...props */ />
                <path d="M2 12L12 17L22 12" stroke="currentColor" /* ...props */ />
              </svg>
            </div>
            <span className="text-xl font-semibold text-foreground">
              Conecta Loja
            </span>
          </div>
        </div>

        {/* Right Section - Actions (Modificado) */}
        {/* Adiciona 'relative' aqui e a referência do hook */}
        <div className="relative" ref={profileMenuRef}>
          {/* Botão de usuário agora abre/fecha o dropdown */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsProfileOpen(!isProfileOpen)} // Toggle
          >
            <Icon name="User" size={18} />
          </Button>

          {/* O Dropdown em si, renderizado condicionalmente */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-20">
              {/* Um cabeçalho opcional para o dropdown */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">
                  Olá, Usuário!
                </p>
              </div>

              {/* Lista de itens do menu */}
              <ul className="py-1">
                {/* Item de Notificação (movido para cá) */}
                <li>
                  <a
                    href="#" // Mude para seu link de notificações
                    className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="Bell" size={16} />
                      <span>Notificações</span>
                    </div>
                  </a>
                </li>
                
                {/* Separador */}
                <div className="my-1 h-px bg-border" />

                {/* 8. Item de Sair (Logout) */}
                <li>
                  <button
                    onClick={handleLogout} 
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-destructive w-full text-left hover:bg-muted"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Voltar</span> 
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;