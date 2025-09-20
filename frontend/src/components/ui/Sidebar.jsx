import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

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

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

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

  const renderNavigationItem = (item, isChild = false) => {
  const isActive = isActivePath(item?.path);
  const notificationCount = getNotificationCount(item?.path);

  return (
    <div key={item?.path} className={isChild && !isCollapsed ? 'ml-6' : ''}>
      <Button
        variant={isActive ? "default" : "ghost"}
        onClick={() => handleNavigation(item?.path)}
        aria-current={isActive ? "page" : undefined}
        aria-label={item?.label}
        className={`w-full flex items-center transition-all duration-200 ease-in-out
          ${isCollapsed ? 'justify-center h-14 px-0' : 'justify-start h-14 px-4'} 
          mb-2 rounded-lg 
          ${isActive ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-muted'}`}
        title={isCollapsed ? `${item?.label} - ${item?.description}` : ''}
      >
        <div className="relative flex items-center">
          <Icon
            name={item?.icon}
            size={24}
            className={`transition-colors duration-200 
              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary-foreground'}`}
          />

          {/* Badge quando colapsado */}
          {isCollapsed && notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>

        {/* Conteúdo expandido */}
        {!isCollapsed && (
          <div className="flex-1 flex justify-between items-center ml-3">
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">{item?.label}</span>
              <span className="text-xs text-muted-foreground truncate">{item?.description}</span>
            </div>
            {notificationCount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center animate-pulse">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </div>
        )}
      </Button>
    </div>
  );
};

  const renderNavigationGroup = (group) => (
    <div key={group?.label} className="mb-4">
      {!isCollapsed && (
        <div className="px-4 mb-2">
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


  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-1010 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Floating toggle button (mobile only) */}
      <button
        onClick={onToggle}
        className="
          fixed top-1/2 left-2 -translate-y-1/2 
          bg-primary text-primary-foreground 
          rounded-full p-3 shadow-lg z-[1050] 
          lg:hidden
        "
      >
        <Icon name="Menu" size={20} />
      </button>
      {/* Sidebar */}
        <aside 
          className={`
            fixed top-0 left-0 h-full bg-card border-r border-border z-1020
            transition-transform duration-300 ease-in-out
            ${isCollapsed ? '-translate-x-full lg:w-16 lg:translate-x-0' : 'translate-x-0 lg:w-60'}
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
          
          {/* Toggle button only visible on desktop */}
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
          <div className="space-y-4">
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