import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from 'src/utils';

const OrderStats = ({ stats }) => {
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