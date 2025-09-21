import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import AnalyticsChart from './components/AnalyticsChart';
import QuickActionTiles from './components/QuickActionTiles';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock metrics data
  const metricsData = [
    {
      title: "Vendas Hoje",
      value: "R$ 2.847,50",
      change: "+12,5%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "success"
    },
    {
      title: "Pedidos Pendentes",
      value: "8",
      change: "+3",
      changeType: "positive",
      icon: "Clock",
      color: "warning"
    },
    {
      title: "Produtos Populares",
      value: "Pizza Margherita",
      change: "35% das vendas",
      changeType: "neutral",
      icon: "Star",
      color: "primary"
    },
    {
      title: "Fluxo de Caixa",
      value: "R$ 12.450,00",
      change: "+8,2%",
      changeType: "positive",
      icon: "DollarSign",
      color: "success"
    }
  ];

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onMenuToggle={handleSidebarToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        className="lg:block"
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo ao Dashboard
              </h1>
              <p className="text-muted-foreground">
                {formatDateTime(currentTime)}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Exportar Relatório
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
              >
                Novo Produto
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="BarChart3" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Métricas Principais</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  color={metric?.color}
                />
              ))}
            </div>
          </section>

          {/* Real-time Orders and Notifications */}
          {/* <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="Bell" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Pedidos em Tempo Real</h2>
              </div>
              <RealtimeOrdersPanel />
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Icon name="MessageSquare" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Central de Notificações</h2>
              </div>
              <NotificationSystem />
            </div>
          </section> */}

          {/* Analytics Chart */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="PieChart" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Análise de Performance</h2>
            </div>
            <AnalyticsChart />
          </section>

          {/* Quick Actions */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Icon name="Zap" size={24} className="text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Ações Rápidas</h2>
            </div>
            <QuickActionTiles />
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 mt-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
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
                <div>
                  <p className="text-sm font-medium text-foreground">Conecta Loja</p>
                  <p className="text-xs text-muted-foreground">Sua solução completa para vendas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>Versão 1.0.0</span>
                <span>•</span>
                <span>Última atualização: {new Date()?.toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>© {new Date()?.getFullYear()} Conecta Loja</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;