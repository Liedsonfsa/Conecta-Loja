import React from 'react';
import Button from '../../../components/ui/ButtonDash';
import Icon from '../../../components/AppIcon';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency, formatDateTime } from 'src/utils';
//../../../utils

/**
 * OrderTable - Componente de tabela para exibição de pedidos
 *
 * Exibe pedidos em formato de tabela responsiva com visualização
 * desktop (tabela) e mobile (cards). Inclui informações completas
 * dos pedidos, status visual, ações rápidas e indicadores de novos pedidos.
 *
 * Funcionalidades principais:
 * - Visualização desktop em tabela com colunas organizadas
 * - Visualização mobile em cards empilhados
 * - Indicador visual para pedidos novos (badge vermelho pulsante)
 * - Badge de status colorido para cada pedido
 * - Ações rápidas: ver detalhes, contatar cliente, atualizar status
 * - Estados de loading e lista vazia com mensagens apropriadas
 * - Formatação automática de moeda e datas
 *
 * Informações exibidas:
 * - ID do pedido com indicador de novo
 * - Dados do cliente (nome e telefone)
 * - Contagem e nomes dos itens
 * - Valor total formatado
 * - Status com badge colorido
 * - Data/hora de criação formatada
 * - Botões de ação (3 ações por linha)
 *
 * Estados especiais:
 * - Loading: Spinner de carregamento
 * - Lista vazia: Mensagem explicativa com ícone
 * - Pedidos novos: Badge vermelho pulsante no ID
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.orders - Lista de pedidos a serem exibidos
 * @param {Function} props.onStatusUpdate - Callback para atualização de status
 * @param {Function} props.onViewDetails - Callback para visualização de detalhes
 * @param {Function} props.onContactCustomer - Callback para contato com cliente
 * @param {boolean} [props.loading=false] - Estado de carregamento
 *
 * @example
 * const orders = [
 *   {
 *     id: "0001",
 *     customerName: "João Silva",
 *     customerPhone: "(11) 99999-1234",
 *     itemCount: 2,
 *     total: 49.40,
 *     status: "pending",
 *     createdAt: "2025-01-09T20:30:00.000Z",
 *     isNew: true
 *   }
 * ];
 *
 * <OrderTable
 *   orders={orders}
 *   onStatusUpdate={handleStatusUpdate}
 *   onViewDetails={handleViewDetails}
 *   onContactCustomer={handleContactCustomer}
 *   loading={false}
 * />
 */
const OrderTable = ({
                        orders,
                        onStatusUpdate,
                        onViewDetails,
                        onContactCustomer,
                        loading = false
                    }) => {
    if (loading) {
        return (
            <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-muted-foreground">Carregando pedidos...</span>
                </div>
            </div>
        );
    }

    if (orders?.length === 0) {
        return (
            <div className="bg-card border border-border rounded-lg p-8">
                <div className="text-center">
                    <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-muted-foreground">
                        Não há pedidos que correspondam aos filtros selecionados.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                    <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Cliente</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Itens</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Total</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Data</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders?.map((order) => (
                        <tr key={order?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="py-4 px-4">
                                <div className="flex items-center">
                                    <span className="font-mono text-sm font-medium">#{order?.id}</span>
                                    {order?.isNew && (
                                        <span className="ml-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div>
                                    <div className="font-medium text-foreground">{order?.customerName}</div>
                                    <div className="text-sm text-muted-foreground">{order?.customerPhone}</div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="text-sm">
                                    <div className="font-medium">{order?.itemCount} {order?.itemCount === 1 ? 'item' : 'itens'}</div>
                                    <div className="text-muted-foreground truncate max-w-32">
                                        {order?.items?.map(item => item?.name)?.join(', ')}
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                  <span className="font-medium text-foreground">
                    {formatCurrency(order?.total)}
                  </span>
                            </td>
                            <td className="py-4 px-4">
                                <OrderStatusBadge status={order?.status} />
                            </td>
                            <td className="py-4 px-4">
                                <div className="text-sm text-muted-foreground">
                                    {formatDateTime(order?.createdAt)}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onViewDetails(order)}
                                        title="Ver detalhes"
                                    >
                                        <Icon name="Eye" size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onContactCustomer(order)}
                                        title="Contatar via WhatsApp"
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <Icon name="MessageCircle" size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onStatusUpdate(order)}
                                        title="Atualizar status"
                                    >
                                        <Icon name="Edit" size={16} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile Cards */}
            <div className="lg:hidden">
                {orders?.map((order) => (
                    <div key={order?.id} className="p-4 border-b border-border last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                                <span className="font-mono text-sm font-medium">#{order?.id}</span>
                                {order?.isNew && (
                                    <span className="ml-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                                )}
                            </div>
                            <OrderStatusBadge status={order?.status} />
                        </div>

                        <div className="mb-3">
                            <div className="font-medium text-foreground">{order?.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order?.customerPhone}</div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm">
                                <span className="font-medium">{order?.itemCount} {order?.itemCount === 1 ? 'item' : 'itens'}</span>
                            </div>
                            <div className="font-medium text-foreground">
                                {formatCurrency(order?.total)}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                                {formatDateTime(order?.createdAt)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onViewDetails(order)}
                                >
                                    <Icon name="Eye" size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onContactCustomer(order)}
                                    className="text-green-600"
                                >
                                    <Icon name="MessageCircle" size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onStatusUpdate(order)}
                                >
                                    <Icon name="Edit" size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTable;