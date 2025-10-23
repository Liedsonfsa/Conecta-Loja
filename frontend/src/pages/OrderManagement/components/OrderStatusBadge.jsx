import React from 'react';

/**
 * OrderStatusBadge - Componente de badge para exibir status do pedido
 *
 * Badge colorido e responsivo que representa visualmente o status atual
 * de um pedido através de cores e labels específicos para cada estado.
 *
 * Funcionalidades principais:
 * - Mapeamento automático de status para cores e labels
 * - Design consistente com cores semânticas
 * - Suporte a classes CSS customizadas
 * - Texto em português para melhor usabilidade
 * - Fallback para status desconhecidos
 *
 * Mapeamento de status e cores:
 * - pending (Pendente): Amarelo - Aguardando confirmação
 * - preparing (Preparando): Azul - Em produção
 * - ready (Pronto): Roxo - Pronto para entrega/retirada
 * - en_route (A Caminho): Laranja - Em trânsito
 * - delivered (Entregue): Verde - Concluído com sucesso
 * - cancelled (Cancelado): Vermelho - Cancelado
 * - default (Desconhecido): Cinza - Status não identificado
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {string} props.status - Status do pedido para exibir
 * @param {string} [props.className=''] - Classes CSS adicionais
 *
 * @example
 * // Badge para pedido pendente
 * <OrderStatusBadge status="pending" />
 *
 * // Badge com classe customizada
 * <OrderStatusBadge status="delivered" className="text-sm" />
 *
 * // Badge para status desconhecido
 * <OrderStatusBadge status="unknown" />
 */
const OrderStatusBadge = ({ status, className = '' }) => {
    /**
     * Retorna configuração visual (label e classes CSS) para o status fornecido
     * Cada status tem cores semânticas específicas para identificação rápida
     * @param {string} status - Status do pedido
     * @returns {Object} Configuração com label e className para o badge
     */
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