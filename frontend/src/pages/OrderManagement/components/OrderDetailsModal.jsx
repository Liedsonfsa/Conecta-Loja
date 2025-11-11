import React from 'react';
import Button from '../../../components/ui/ButtonDash';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency, formatDateTime } from '@/utils';

/**
 * OrderDetailsModal - Modal de detalhes completos do pedido
 *
 * Modal responsivo que exibe informações completas de um pedido,
 * incluindo dados do cliente, itens detalhados, resumo financeiro,
 * timeline de status e ações rápidas para contato e atualização.
 *
 * Funcionalidades principais:
 * - Visualização completa dos dados do cliente (nome, telefone, endereço)
 * - Lista detalhada de itens com imagens, quantidades e personalizações
 * - Resumo financeiro com subtotal, desconto, taxa de entrega e total
 * - Timeline cronológica do histórico de status do pedido
 * - Botões de ação para contato via WhatsApp e atualização de status
 * - Indicadores visuais para pedidos novos
 * - Layout responsivo com scroll interno
 * - Overlay com backdrop para fechar modal
 *
 * Seções do modal:
 * - Header: ID do pedido, status e badge de novo
 * - Informações do Cliente: Dados pessoais e endereço
 * - Itens do Pedido: Lista com imagens e detalhes
 * - Resumo do Pedido: Quebramento financeiro
 * - Histórico: Timeline de status
 * - Footer: Data de criação e botões de ação
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.order - Dados completos do pedido
 * @param {boolean} props.isOpen - Controle de visibilidade do modal
 * @param {Function} props.onClose - Callback para fechar o modal
 * @param {Function} props.onStatusUpdate - Callback para atualização de status
 * @param {Function} props.onContactCustomer - Callback para contato com cliente
 *
 * @example
 * const order = {
 *   id: "0001",
 *   customerName: "João Silva",
 *   customerPhone: "(11) 99999-1234",
 *   customerAddress: "Rua das Flores, 123",
 *   status: "preparing",
 *   isNew: true,
 *   items: [...],
 *   total: 49.40,
 *   timeline: [...]
 * };
 *
 * <OrderDetailsModal
 *   order={order}
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   onStatusUpdate={handleStatusUpdate}
 *   onContactCustomer={handleContact}
 * />
 */
const OrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate, onContactCustomer }) => {
    if (!isOpen || !order) return null;

    /**
     * Manipula o contato via WhatsApp do cliente
     * Abre uma nova aba com mensagem pré-formatada e notifica o callback
     */
    const handleWhatsAppContact = () => {
        const message = `Olá ${order?.customerName}! Sobre seu pedido #${order?.id}...`;
        const whatsappUrl = `https://wa.me/55${order?.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        onContactCustomer(order);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-1040"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed inset-0 z-1050 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Pedido #{order?.id}
                                </h2>
                                <OrderStatusBadge status={order?.status} />
                                {order?.isNew && (
                                    <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                    Novo
                  </span>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <Icon name="X" size={20} />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="p-6 space-y-6">
                                {/* Customer Information */}
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <h3 className="font-medium text-foreground mb-3">Informações do Cliente</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Nome</label>
                                            <p className="text-foreground">{order?.customerName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                                            <p className="text-foreground">{order?.customerPhone}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                                            <p className="text-foreground">{order?.customerAddress}</p>
                                        </div>
                                        {order?.specialInstructions && (
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-muted-foreground">Observações</label>
                                                <p className="text-foreground">{order?.specialInstructions}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="font-medium text-foreground mb-3">Itens do Pedido</h3>
                                    <div className="space-y-3">
                                        {order?.items?.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-3 bg-muted/20 rounded-lg">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                    <Image
                                                        src={item?.image}
                                                        alt={item?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-foreground truncate">{item?.name}</h4>
                                                    {item?.description && (
                                                        <p className="text-sm text-muted-foreground truncate">{item?.description}</p>
                                                    )}
                                                    {item?.customizations && item?.customizations?.length > 0 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Personalizações: {item?.customizations?.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-foreground">
                                                        {item?.quantity}x {formatCurrency(item?.price)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatCurrency(item?.quantity * item?.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <h3 className="font-medium text-foreground mb-3">Resumo do Pedido</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="text-foreground">{formatCurrency(order?.subtotal)}</span>
                                        </div>
                                        {order?.discount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Desconto</span>
                                                <span className="text-green-600">-{formatCurrency(order?.discount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-border pt-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-foreground">Total</span>
                                                <span className="font-bold text-foreground text-lg">{formatCurrency(order?.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Timeline */}
                                <div>
                                    <h3 className="font-medium text-foreground mb-3">Histórico do Pedido</h3>
                                    <div className="space-y-3">
                                        {order?.timeline?.map((event, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground">{event?.status}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDateTime(event?.timestamp)}</p>
                                                    {event?.note && (
                                                        <p className="text-xs text-muted-foreground mt-1">{event?.note}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
                            <div className="text-sm text-muted-foreground">
                                Pedido realizado em {formatDateTime(order?.createdAt)}
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={handleWhatsAppContact}
                                    iconName="MessageCircle"
                                    iconPosition="left"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                    WhatsApp
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => onStatusUpdate(order)}
                                    iconName="Edit"
                                    iconPosition="left"
                                >
                                    Atualizar Status
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsModal;