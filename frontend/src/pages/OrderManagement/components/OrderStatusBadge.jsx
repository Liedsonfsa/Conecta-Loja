import React from 'react';

const OrderStatusBadge = ({ status, className = '' }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Pendente',
                    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
                };
            case 'preparing':
                return {
                    label: 'Preparando',
                    className: 'bg-blue-100 text-blue-800 border-blue-200'
                };
            case 'ready':
                return {
                    label: 'Pronto',
                    className: 'bg-purple-100 text-purple-800 border-purple-200'
                };
            case 'en_route':
                return {
                    label: 'A Caminho',
                    className: 'bg-orange-100 text-orange-800 border-orange-200'
                };
            case 'delivered':
                return {
                    label: 'Entregue',
                    className: 'bg-green-100 text-green-800 border-green-200'
                };
            case 'cancelled':
                return {
                    label: 'Cancelado',
                    className: 'bg-red-100 text-red-800 border-red-200'
                };
            default:
                return {
                    label: 'Desconhecido',
                    className: 'bg-gray-100 text-gray-800 border-gray-200'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config?.className} ${className}`}>
      {config?.label}
    </span>
    );
};

export default OrderStatusBadge;