import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './ButtonDash';

const Header = ({ onMenuToggle, isSidebarCollapsed = false }) => {
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Produtos', path: '/produtos', icon: 'Package' },
    { label: 'Pedidos', path: '/pedidos', icon: 'ShoppingCart' },
    { label: 'Loja', path: '/customer-storefront', icon: 'Store' },
  ];

  const secondaryNavItems = [
    { label: 'Analytics', path: '/sales-analytics', icon: 'BarChart3' },
    { label: 'Configurações', path: '/store-settings', icon: 'Settings' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Mobile Menu */}
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
            <span className="text-xl font-semibold text-foreground">
              Conecta Loja
            </span>
          </div>
        </div>

        {/* Center Section - Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </Button>
          ))}
        </nav>

        {/* Right Section - More Menu and Actions */}
        <div className="flex items-center space-x-2">
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="flex items-center space-x-2"
            >
              <Icon name="MoreHorizontal" size={18} />
              <span className="hidden sm:inline">Mais</span>
            </Button>

            {isMoreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-1010"
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2 z-1020">
                  <div className="py-1">
                    {secondaryNavItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => {
                          handleNavigation(item?.path);
                          setIsMoreMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-accent transition-micro ${
                          isActivePath(item?.path) ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                        }`}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="Bell" size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="icon">
            <Icon name="User" size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;