import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '@/utils';

/**
 * OrderStats - Componente de exibição de estatísticas dos pedidos
 *
 * Exibe cards com métricas importantes sobre os pedidos em tempo real,
 * incluindo número de pedidos do dia, pedidos pendentes, em preparação
 * e faturamento. Suporta indicadores visuais de urgência e variações.
 *
 * Funcionalidades principais:
 * - Cards responsivos com métricas de pedidos
 * - Indicadores de variação percentual (positivo/negativo)
 * - Badge de urgência para pedidos pendentes elevados
 * - Ícones coloridos para identificação rápida das métricas
 * - Layout responsivo (1 coluna mobile, 4 colunas desktop)
 *
 * Métricas exibidas:
 * - Pedidos Hoje: Total de pedidos do dia com variação vs ontem
 * - Pendentes: Pedidos aguardando processamento (com indicador urgente)
 * - Em Preparo: Pedidos sendo preparados na cozinha
 * - Faturamento Hoje: Receita total do dia com variação vs ontem
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.stats - Dados das estatísticas
 * @param {number} props.stats.todayOrders - Número de pedidos hoje
 * @param {number} props.stats.todayOrdersChange - Variação percentual nos pedidos
 * @param {number} props.stats.pendingOrders - Número de pedidos pendentes
 * @param {number} props.stats.preparingOrders - Número de pedidos em preparação
 * @param {number} props.stats.todayRevenue - Receita total do dia
 * @param {number} props.stats.todayRevenueChange - Variação percentual na receita
 *
 * @example
 * const stats = {
 *   todayOrders: 12,
 *   todayOrdersChange: 15,
 *   pendingOrders: 2,
 *   preparingOrders: 1,
 *   todayRevenue: 485.60,
 *   todayRevenueChange: 8
 * };
 *
 * <OrderStats stats={stats} />
 */
const OrderStats = ({ stats }) => {
    /**
     * Configuração dos cards de estatísticas exibidos
     * Cada card contém título, valor, ícone, cores e indicadores especiais
     * @type {Array<Object>} statCards
     */
    const statCards = [
        {
            title: 'Pedidos Hoje',
            value: stats?.todayOrders,
            icon: 'ShoppingCart',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            change: stats?.todayOrdersChange,
            changeType: stats?.todayOrdersChange >= 0 ? 'positive' : 'negative'
        },
        {
            title: 'Pendentes',
            value: stats?.pendingOrders,
            icon: 'Clock',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            urgent: stats?.pendingOrders > 5
        },
        {
            title: 'Em Preparo',
            value: stats?.preparingOrders,
            icon: 'ChefHat',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        },
        {
            title: 'Faturamento Hoje',
            value: formatCurrency(stats?.todayRevenue),
            icon: 'DollarSign',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            change: stats?.todayRevenueChange,
            changeType: stats?.todayRevenueChange >= 0 ? 'positive' : 'negative'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCards?.map((stat, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                {stat?.title}
                            </p>
                            <div className="flex items-center space-x-2">
                                <p className="text-2xl font-bold text-foreground">
                                    {stat?.value}
                                </p>
                                {stat?.urgent && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full animate-pulse">
                    Urgente
                  </span>
                                )}
                            </div>
                            {stat?.change !== undefined && (
                                <div className="flex items-center mt-2">
                                    <Icon
                                        name={stat?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'}
                                        size={16}
                                        className={stat?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}
                                    />
                                    <span className={`text-sm ml-1 ${
                                        stat?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                    {Math.abs(stat?.change)}% vs ontem
                  </span>
                                </div>
                            )}
                        </div>
                        <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
                            <Icon name={stat?.icon} size={24} className={stat?.color} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderStats;