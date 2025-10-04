import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import BusinessInfoSection from './components/BusinessInfoSection';
import BrandingSection from './components/BrandingSection';
import EmployeeManagementSection from './components/EmployeeManagementSection';
import SystemConfigSection from './components/SystemConfigSection';
import PaymentCurrencySection from './components/PaymentCurrencySection';
import ImportExportSection from './components/ImportExportSection';
import AdvancedOptionsSection from './components/AdvancedOptionsSection';

const StoreSettings = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');

  const tabs = [
    // {
    //   id: 'business',
    //   label: 'Informações do Negócio',
    //   icon: 'Building2',
    //   description: 'Dados básicos e horário de funcionamento'
    // },
    // {
    //   id: 'branding',
    //   label: 'Marca e Visual',
    //   icon: 'Palette',
    //   description: 'Logo, cores e personalização'
    // },
    {
      id: 'employees',
      label: 'Funcionários',
      icon: 'Users',
      description: 'Gerenciamento de equipe e permissões'
    }
    // ,
    // {
    //   id: 'system',
    //   label: 'Sistema',
    //   icon: 'Settings',
    //   description: 'Backup, segurança e performance'
    // },
    // {
    //   id: 'payment',
    //   label: 'Pagamento e Moeda',
    //   icon: 'DollarSign',
    //   description: 'Configurações financeiras e certificações'
    // },
    // {
    //   id: 'import-export',
    //   label: 'Importar/Exportar',
    //   icon: 'Database',
    //   description: 'Backup e migração de dados'
    // },
    // {
    //   id: 'advanced',
    //   label: 'Opções Avançadas',
    //   icon: 'Code',
    //   description: 'SEO, analytics e integrações'
    // }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      // case 'business':
      //   return <BusinessInfoSection />;
      // case 'branding':
      //   return <BrandingSection />;
      case 'employees':
        return <EmployeeManagementSection />;
      // case 'system':
      //   return <SystemConfigSection />;
      // case 'payment':
      //   return <PaymentCurrencySection />;
      // case 'import-export':
      //   return <ImportExportSection />;
      // case 'advanced':
      //   return <AdvancedOptionsSection />;
      default:
        return <EmployeeManagementSection />;
    }
  };

  const getActiveTabInfo = () => {
    return tabs?.find(tab => tab?.id === activeTab) || tabs?.[0];
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
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Settings" size={32} className="text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Funcionários</h1>
                <p className="text-muted-foreground">
                  Gerencie os funcionários da sua loja, atribua funções e defina permissões de acesso.
                </p>
              </div>
            </div>
          </div>

          {/* Settings Container */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-border">
              {/* Desktop Tabs */}
              <div className="hidden lg:flex overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <div className="text-left">
                      <div>{tab?.label}</div>
                      <div className="text-xs opacity-70">{tab?.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Mobile Tab Selector */}
              <div className="lg:hidden p-4">
                <div className="relative">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e?.target?.value)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  >
                    {tabs?.map((tab) => (
                      <option key={tab?.id} value={tab?.id}>
                        {tab?.label} - {tab?.description}
                      </option>
                    ))}
                  </select>
                  <Icon 
                    name="ChevronDown" 
                    size={20} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 lg:p-8">
              {/* Active Tab Header */}
              <div className="mb-6 lg:hidden">
                <div className="flex items-center space-x-3">
                  <Icon name={getActiveTabInfo()?.icon} size={24} className="text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {getActiveTabInfo()?.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {getActiveTabInfo()?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Section Content */}
              {renderActiveSection()}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Icon name="Lightbulb" size={24} className="text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">Precisa de Ajuda?</h3>
                  <p className="text-sm text-muted-foreground">
                    Consulte nossa documentação ou entre em contato com o suporte
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => window.open('https://docs.conectaloja.com.br', '_blank')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Icon name="BookOpen" size={16} />
                  <span>Documentação</span>
                </button>
                
                <button
                  onClick={() => window.open('https://suporte.conectaloja.com.br', '_blank')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Icon name="MessageCircle" size={16} />
                  <span>Suporte</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreSettings;