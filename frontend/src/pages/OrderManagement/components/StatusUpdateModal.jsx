import React, { useState } from 'react';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import {Input} from '@/components/ui/input';
import Icon from '../../../components/AppIcon';
import OrderStatusBadge from './OrderStatusBadge';

/**
 * StatusUpdateModal - Modal para atualização de status do pedido
 *
 * Modal compacto para atualização rápida do status de pedidos,
 * com formulário para seleção de novo status, observações opcionais
 * e opção de notificação automática do cliente via WhatsApp.
 *
 * Funcionalidades principais:
 * - Seleção de novo status através de dropdown
 * - Campo opcional para observações da atualização
 * - Checkbox para notificação automática via WhatsApp
 * - Validação para prevenir seleção do mesmo status atual
 * - Feedback visual com mensagens explicativas dos status
 * - Estados de loading durante processamento
 * - Reset automático dos campos ao abrir
 *
 * Campos do formulário:
 * - Novo Status: Dropdown obrigatório com todos os status possíveis
 * - Observação: Campo opcional para notas da atualização
 * - Notificar Cliente: Checkbox para envio automático de WhatsApp
 *
 * Validações:
 * - Status deve ser diferente do atual
 * - Status é campo obrigatório
 * - Observação limitada a 200 caracteres
 *
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.order - Dados do pedido atual
 * @param {boolean} props.isOpen - Controle de visibilidade do modal
 * @param {Function} props.onClose - Callback para fechar o modal
 * @param {Function} props.onUpdateStatus - Callback para atualização do status
 *
 * @example
 * const order = {
 *   id: "0001",
 *   customerName: "João Silva",
 *   status: "pending"
 * };
 *
 * <StatusUpdateModal
 *   order={order}
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   onUpdateStatus={handleUpdateStatus}
 * />
 */
const StatusUpdateModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
    /**
     * Estado do status selecionado para atualização
     * @type {[string, function]} selectedStatus
     */
    const [selectedStatus, setSelectedStatus] = useState(order?.status || '');

    /**
     * Estado da observação opcional da atualização
     * @type {[string, function]} note
     */
    const [note, setNote] = useState('');

    /**
     * Estado do checkbox de notificação do cliente
     * @type {[boolean, function]} notifyCustomer
     */
    const [notifyCustomer, setNotifyCustomer] = useState(true);

    /**
     * Estado de loading durante processamento da atualização
     * @type {[boolean, function]} loading
     */
    const [loading, setLoading] = useState(false);

    if (!isOpen || !order) return null;

    /**
     * Opções disponíveis para atualização de status
     * @type {Array<Object>} statusOptions
     */
    const statusOptions = [
        { value: 'received', label: 'Recebido' },
        { value: 'pending', label: 'Aguardando Pagamento' },
        { value: 'payment_approved', label: 'Pagamento Aprovado' },
        { value: 'preparing', label: 'Em Preparo' },
        { value: 'ready', label: 'Pronto' },
        { value: 'en_route', label: 'Enviado para Entrega' },
        { value: 'delivered', label: 'Entregue' },
        { value: 'cancelled', label: 'Cancelado' },
        { value: 'delivery_failed', label: 'Tentativa de Entrega Falhada' }
    ];

    /**
     * Manipula o envio do formulário de atualização de status
     * Valida os dados, chama o callback e fecha o modal em caso de sucesso
     * @async
     * @param {Event} e - Evento do formulário
     */
    const handleSubmit = async (e) => {
        e?.preventDefault();
        setLoading(true);

        try {
            await onUpdateStatus(order, {
                status: selectedStatus,
                note: note?.trim(),
                notifyCustomer,
                timestamp: new Date()?.toISOString()
            });
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Retorna mensagem explicativa para o status selecionado
     * Usada para fornecer feedback ao usuário sobre o significado do status
     * @param {string} status - Status do pedido
     * @returns {string} Mensagem explicativa do status
     */
    const getStatusMessage = (status) => {
        const messages = {
            received: 'Pedido recém recebido na loja',
            pending: 'Pedido aguardando confirmação do pagamento',
            payment_approved: 'Pagamento confirmado, pronto para produção',
            preparing: 'Pedido está sendo preparado com carinho',
            ready: 'Pedido pronto para retirada/entrega',
            en_route: 'Pedido saiu para entrega',
            delivered: 'Pedido entregue com sucesso',
            cancelled: 'Pedido foi cancelado',
            delivery_failed: 'Tentativa de entrega não foi bem-sucedida'
        };
        return messages?.[status] || '';
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
                    <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">
                                Atualizar Status
                            </h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <Icon name="X" size={20} />
                            </Button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Order Info */}
                            <div className="bg-muted/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm font-medium">#{order?.id}</span>
                                    <OrderStatusBadge status={order?.status} />
                                </div>
                                <p className="text-sm text-muted-foreground">{order?.customerName}</p>
                            </div>

                            {/* Status Selection */}
                            <div>
                                <Select
                                    label="Novo Status"
                                    options={statusOptions}
                                    value={selectedStatus}
                                    onChange={setSelectedStatus}
                                    required
                                />
                                {selectedStatus && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {getStatusMessage(selectedStatus)}
                                    </p>
                                )}
                            </div>

                            {/* Note */}
                            <div>
                                <Input
                                    label="Observação (opcional)"
                                    type="text"
                                    placeholder="Adicione uma observação sobre a atualização..."
                                    value={note}
                                    onChange={(e) => setNote(e?.target?.value)}
                                    maxLength={200}
                                />
                            </div>

                            {/* Notify Customer */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="notifyCustomer"
                                    checked={notifyCustomer}
                                    onChange={(e) => setNotifyCustomer(e?.target?.checked)}
                                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                                />
                                <label htmlFor="notifyCustomer" className="text-sm text-foreground">
                                    Notificar cliente via WhatsApp
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    loading={loading}
                                    disabled={!selectedStatus || selectedStatus === order?.status}
                                >
                                    Atualizar Status
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StatusUpdateModal;