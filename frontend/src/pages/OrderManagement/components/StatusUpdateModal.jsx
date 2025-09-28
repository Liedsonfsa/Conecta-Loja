import React, { useState } from 'react';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import {Input} from 'src/components/ui/input';
import Icon from '../../../components/AppIcon';
import OrderStatusBadge from './OrderStatusBadge';

const StatusUpdateModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState(order?.status || '');
    const [note, setNote] = useState('');
    const [notifyCustomer, setNotifyCustomer] = useState(true);
    const [loading, setLoading] = useState(false);

    if (!isOpen || !order) return null;

    const statusOptions = [
        { value: 'pending', label: 'Pendente' },
        { value: 'preparing', label: 'Preparando' },
        { value: 'ready', label: 'Pronto' },
        { value: 'en_route', label: 'A Caminho' },
        { value: 'delivered', label: 'Entregue' },
        { value: 'cancelled', label: 'Cancelado' }
    ];

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setLoading(true);

        try {
            await onUpdateStatus(order?.id, {
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

    const getStatusMessage = (status) => {
        const messages = {
            pending: 'Pedido recebido e aguardando confirmação',
            preparing: 'Seu pedido está sendo preparado com carinho',
            ready: 'Pedido pronto para retirada/entrega',
            en_route: 'Pedido saiu para entrega',
            delivered: 'Pedido entregue com sucesso',
            cancelled: 'Pedido cancelado'
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