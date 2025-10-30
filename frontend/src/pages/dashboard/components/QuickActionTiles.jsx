import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/ButtonDash';

const QuickActionTiles = ({ userType }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'products',
      title: 'Gerenciar Produtos',
      description: 'Adicionar, editar e controlar estoque',
      icon: 'Package',
      color: 'bg-primary text-primary-foreground',
      route: '/produtos', 
      stats: '0 produtos ativos'
    },
    {
      id: 'orders',
      title: 'Gerenciar Pedidos',
      description: 'Visualizar e gerenciar pedidos',
      icon: 'ShoppingCart',
      color: 'bg-secondary text-secondary-foreground',
      route: '/pedidos',
      stats: '0 pedidos este mês'
    },
    {
      id: 'analytics',
      title: 'Relatórios de Vendas',
      description: 'Análises detalhadas de performance',
      icon: 'BarChart3',
      color: 'bg-success text-success-foreground',
      route: '/relatorios',
      stats: 'R$ 0 este mês'
    },
    {
      id: 'employees',
      title: 'Gerenciar Funcionários',
      description: 'Controle de acesso e permissões',
      icon: 'Users',
      color: 'bg-purple-600 text-white',
      route: '/store-settings',
      stats: '0 funcionários ativos'
    },
    {
      id: 'settings',
      title: 'Configurações da Loja',
      description: 'Personalizar aparência e dados',
      icon: 'Settings',
      color: 'bg-gray-600 text-white',
      route: '/store-settings',
      stats: 'Última atualização: hoje'
    }
  ];

  // Filtrar ações baseado no tipo de usuário (apenas admin pode ver employees e settings)
  const filteredActions = userType === 'admin'
    ? quickActions
    : quickActions.filter(action => action.id !== 'employees' && action.id !== 'settings');

  /**
   * Manipula o clique em um cartão de ação rápida
   * @param {string} route - Rota para navegar
   */
  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredActions?.map((action) => (
        <div
          key={action?.id}
          className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-layout cursor-pointer group"
          onClick={() => handleActionClick(action?.route)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action?.color} group-hover:scale-110 transition-micro`}>
              <Icon name={action?.icon} size={24} />
            </div>
            <Icon name="ArrowUpRight" size={20} className="text-muted-foreground group-hover:text-foreground transition-micro" />
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-micro">
              {action?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {action?.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {action?.stats}
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="ChevronRight"
              iconPosition="right"
              className="opacity-0 group-hover:opacity-100 transition-micro"
            >
              Acessar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActionTiles;