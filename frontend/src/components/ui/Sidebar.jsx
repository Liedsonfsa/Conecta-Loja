/**
 * Sidebar - Barra lateral de navegação do dashboard
 *
 * Componente de navegação lateral responsivo com itens organizados
 * em grupos, indicadores de notificações e suporte a colapso/expansão.
 * Inclui navegação programática e destaque do item ativo.
 *
 * @param {Object} props - Propriedades do componente
 * @param {boolean} [props.isCollapsed=false] - Se a sidebar está recolhida
 * @param {Function} props.onToggle - Função chamada ao alternar estado
 * @param {string} [props.className=''] - Classes CSS adicionais
 *
 * @returns {JSX.Element} Sidebar de navegação renderizada
 *
 * @example
 * <Sidebar
 *   isCollapsed={sidebarCollapsed}
 *   onToggle={handleSidebarToggle}
 *   className="lg:block"
 * />
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './ButtonDash';

const Sidebar = ({ isCollapsed = false, onToggle, className = '' }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState({
    '/dashboard': 0,
    '/order-management': 5,
    '/product-management': 2,
  });

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Visão geral do negócio'
    },
    {
      label: 'Operações',
      type: 'group',
      children: [
        {
          label: 'Gestão de Produtos',
          path: '/product-management',
          icon: 'Package',
          description: 'Catálogo e estoque'
        },
        {
          label: 'Gestão de Pedidos',
          path: '/order-management',
          icon: 'ShoppingCart',
          description: 'Pedidos e WhatsApp'
        }
      ]
    },
    {
      label: 'Loja do Cliente',
      path: '/customer-storefront',
      icon: 'Store',
      description: 'Vitrine online'
    },
    {
      label: 'Analytics',
      path: '/sales-analytics',
      icon: 'BarChart3',
      description: 'Relatórios de vendas'
    },
    {
      label: 'Configurações',
      path: '/store-settings',
      icon: 'Settings',
      description: 'Configurações da loja'
    }
  ];

  /**
   * Verifica se o caminho fornecido está ativo na navegação atual
   * @param {string} path - Caminho a ser verificado
   * @returns {boolean} Verdadeiro se o caminho está ativo
   */
  const isActivePath = (path) => location?.pathname === path;

  /**
   * Manipula a navegação para um caminho específico
   * @param {string} path - Caminho para navegar
   */
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  /**
   * Obtém a contagem de notificações para um caminho específico
   * @param {string} path - Caminho para verificar notificações
   * @returns {number} Número de notificações para o caminho
   */
  const getNotificationCount = (path) => {
    return notifications?.[path] || 0;
  };

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      setNotifications(prev => ({
        ...prev,
        '/order-management': Math.floor(Math.random() * 10),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Renderiza um item individual de navegação
   * @param {Object} item - Item de navegação a ser renderizado
   * @param {string} item.label - Rótulo do item
   * @param {string} item.path - Caminho do item
   * @param {string} item.icon - Ícone do item
   * @param {string} item.description - Descrição do item
   * @param {boolean} [isChild=false] - Se é um item filho (indentado)
   * @returns {JSX.Element} Elemento do item de navegação renderizado
   */
  const renderNavigationItem = (item, isChild = false) => {
    const isActive = isActivePath(item?.path);
    const notificationCount = getNotificationCount(item?.path);

    return (
      <div key={item?.path} className={isChild ? 'ml-4' : ''}>
        <Button
          variant={isActive ? "default" : "ghost"}
          onClick={() => handleNavigation(item?.path)}
          className={`w-full justify-start h-12 px-3 mb-1 relative group ${
            isCollapsed ? 'px-2' : ''
          }`}
          title={isCollapsed ? `${item?.label} - ${item?.description}` : ''}
        >
          <div className="flex items-center space-x-3 w-full">
            <Icon 
              name={item?.icon} 
              size={20} 
              className={`flex-shrink-0 ${isActive ? 'text-primary-foreground' : ''}`}
            />
            
            {!isCollapsed && (
              <>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item?.label}</div>
                  <div className="text-xs opacity-70 truncate">
                    {item?.description}
                  </div>
                </div>
                
                {notificationCount > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center z-1001">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </>
            )}
            
            {isCollapsed && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center z-1001">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </div>
        </Button>
      </div>
    );
  };

  /**
   * Renderiza um grupo de navegação com seus itens filhos
   * @param {Object} group - Grupo de navegação a ser renderizado
   * @param {string} group.label - Rótulo do grupo
   * @param {Array} group.children - Itens filhos do grupo
   * @returns {JSX.Element} Elemento do grupo de navegação renderizado
   */
  const renderNavigationGroup = (group) => {
    return (
      <div key={group?.label} className="mb-4">
        {!isCollapsed && (
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group?.label}
            </h3>
          </div>
        )}
        <div className="space-y-1">
          {group?.children?.map(item => renderNavigationItem(item, true))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-1010 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full bg-card border-r border-border z-1020
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-foreground">
                Conecta Loja
              </span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems?.map(item => {
              if (item?.type === 'group') {
                return renderNavigationGroup(item);
              }
              return renderNavigationItem(item);
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-muted-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  Administrador
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  admin@conectaloja.com
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;