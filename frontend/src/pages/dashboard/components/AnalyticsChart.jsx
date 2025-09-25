/**
 * AnalyticsChart - Componente de gráficos analíticos interativos
 *
 * Exibe diferentes tipos de gráficos para análise de dados do negócio,
 * incluindo vendas, pedidos e distribuição por categoria. Permite alternar
 * entre tipos de gráfico e períodos de tempo com dados simulados.
 *
 * Tipos de gráfico suportados:
 * - Barras: Comparação de vendas e pedidos
 * - Linhas: Tendências ao longo do tempo
 * - Pizza: Distribuição por categoria de produtos
 *
 * @returns {JSX.Element} Container com gráficos interativos renderizado
 *
 * @example
 * // Uso no dashboard
 * <AnalyticsChart />
 */
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import Button from '../../../components/ui/ButtonDash';

const AnalyticsChart = () => {
  const [activeChart, setActiveChart] = useState('sales');
  const [timePeriod, setTimePeriod] = useState('daily');

  // Mock data for different chart types
  const salesData = {
    daily: [
      { name: 'Seg', vendas: 0, pedidos: 0 },
      { name: 'Ter', vendas: 0, pedidos: 0 },
      { name: 'Qua', vendas: 0, pedidos: 0 },
      { name: 'Qui', vendas: 0, pedidos: 0 },
      { name: 'Sex', vendas: 0, pedidos: 0 },
      { name: 'Sáb', vendas: 0, pedidos: 0 },
      { name: 'Dom', vendas: 0, pedidos: 0 }
    ],
    weekly: [
      { name: 'Sem 1', vendas: 0, pedidos: 0 },
      { name: 'Sem 2', vendas: 0, pedidos: 0 },
      { name: 'Sem 3', vendas: 0, pedidos: 0 },
      { name: 'Sem 4', vendas: 0, pedidos: 0 }
    ],
    monthly: [
      { name: 'Jan', vendas: 0, pedidos: 0 },
      { name: 'Fev', vendas: 0, pedidos: 0 },
      { name: 'Mar', vendas: 0, pedidos: 0 },
      { name: 'Abr', vendas: 0, pedidos: 0 },
      { name: 'Mai', vendas: 0, pedidos: 0 },
      { name: 'Jun', vendas: 0, pedidos: 0 }
    ]
  };

  const productData = [
    { name: 'Pizza Margherita', value: 35, color: '#2563EB' },
    { name: 'Hambúrguer Artesanal', value: 25, color: '#059669' },
    { name: 'Salada Caesar', value: 20, color: '#F59E0B' },
    { name: 'Lasanha Bolonhesa', value: 12, color: '#DC2626' },
    { name: 'Outros', value: 8, color: '#6B7280' }
  ];

  const revenueData = [
    { name: 'Jan', receita: 0, despesas: 0 },
    { name: 'Fev', receita: 0, despesas: 0 },
    { name: 'Mar', receita: 0, despesas: 0 },
    { name: 'Abr', receita: 0, despesas: 0 },
    { name: 'Mai', receita: 0, despesas: 0 },
    { name: 'Jun', receita: 0, despesas: 0 }
  ];

  const chartTypes = [
    { id: 'sales', label: 'Vendas', icon: 'TrendingUp' },
    { id: 'products', label: 'Produtos', icon: 'PieChart' },
    { id: 'revenue', label: 'Receita', icon: 'DollarSign' }
  ];

  const timePeriods = [
    { id: 'daily', label: 'Diário' },
    { id: 'weekly', label: 'Semanal' },
    { id: 'monthly', label: 'Mensal' }
  ];

  /**
   * Formata um valor numérico como moeda brasileira
   * @param {number} value - Valor a ser formatado
   * @returns {string} Valor formatado como moeda
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  /**
   * Componente personalizado para tooltip dos gráficos
   * @param {boolean} active - Se o tooltip está ativo
   * @param {Array} payload - Dados do tooltip
   * @param {string} label - Rótulo do tooltip
   * @returns {JSX.Element|null} Elemento tooltip renderizado ou null
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.name?.includes('vendas') || entry?.name?.includes('receita') || entry?.name?.includes('despesas') 
                ? formatCurrency(entry?.value) 
                : entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  /**
   * Renderiza o gráfico apropriado baseado no tipo selecionado
   * @returns {JSX.Element} Elemento do gráfico renderizado
   */
  const renderChart = () => {
    switch (activeChart) {
      case 'sales':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData?.[timePeriod]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="vendas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'products':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {productData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="receita" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="despesas" 
                stroke="var(--color-error)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Analytics</h2>
            <p className="text-sm text-muted-foreground">Visualize o desempenho do seu negócio</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Chart Type Selector */}
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              {chartTypes?.map((type) => (
                <Button
                  key={type?.id}
                  variant={activeChart === type?.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveChart(type?.id)}
                  iconName={type?.icon}
                  iconPosition="left"
                  className="text-xs"
                >
                  {type?.label}
                </Button>
              ))}
            </div>

            {/* Time Period Selector (only for sales chart) */}
            {activeChart === 'sales' && (
              <div className="flex space-x-1 bg-muted rounded-lg p-1">
                {timePeriods?.map((period) => (
                  <Button
                    key={period?.id}
                    variant={timePeriod === period?.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimePeriod(period?.id)}
                    className="text-xs"
                  >
                    {period?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="w-full h-80" aria-label={`${chartTypes?.find(t => t?.id === activeChart)?.label} Chart`}>
          {renderChart()}
        </div>
      </div>
      {/* Chart Legend/Summary */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activeChart === 'sales' && (
            <>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(salesData?.[timePeriod]?.reduce((sum, item) => sum + item?.vendas, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {salesData?.[timePeriod]?.reduce((sum, item) => sum + item?.pedidos, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              </div>
            </>
          )}
          
          {activeChart === 'products' && (
            <>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Produtos Ativos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">35%</p>
                <p className="text-sm text-muted-foreground">Mais Vendido</p>
              </div>
            </>
          )}
          
          {activeChart === 'revenue' && (
            <>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(revenueData?.reduce((sum, item) => sum + item?.receita, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Receita Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-error">
                  {formatCurrency(revenueData?.reduce((sum, item) => sum + item?.despesas, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Despesas Totais</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;