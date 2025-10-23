import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/ButtonDash';
import Icon from '../../components/AppIcon';
import OrderStats from './components/OrderStats';
import OrderFilters from './components/OrderFilters';
import OrderTable from './components/OrderTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import { formatCurrency, debounce, exportToCSV } from 'src/utils';

/**
 * OrderManagement - Página principal de gestão de pedidos da aplicação Conecta-Loja
 *
 * Esta página fornece uma interface completa para gerenciar pedidos em tempo real,
 * incluindo acompanhamento de status, filtros avançados, visualização de detalhes,
 * atualização de status, contato com clientes e exportação de relatórios.
 * Suporta tanto visualização desktop quanto mobile responsiva.
 *
 * Funcionalidades principais:
 * - Visualização em tempo real de todos os pedidos
 * - Filtros avançados (busca, status, período, ordenação)
 * - Modal de detalhes do pedido com timeline completo
 * - Atualização de status com notificações automáticas
 * - Contato direto com clientes via WhatsApp
 * - Estatísticas de pedidos e receita
 * - Exportação de relatórios em CSV
 * - Notificações em tempo real de novos pedidos
 *
 * Estados gerenciados:
 * - Lista de pedidos com dados completos (itens, cliente, timeline)
 * - Estados de modais (detalhes, atualização de status)
 * - Estados de loading e operações assíncronas
 * - Filtros aplicados à listagem de pedidos
 * - Sistema de notificações toast
 * - Dados de estatísticas (pedidos do dia, receita, etc.)
 *
 * Integrações:
 * - API de pedidos (simulada com dados mock)
 * - Sistema de notificações (toast notifications)
 * - WhatsApp para contato com clientes
 * - Utilitários de formatação (formatCurrency, exportToCSV)
 * - Sistema de debounce para filtros de busca
 *
 * Tratamento de erros:
 * - Mensagens específicas baseadas no tipo de operação
 * - Tratamento de problemas de conectividade
 * - Validações de permissões e dados
 * - Fallback para estados de erro
 *
 * @component
 * @example
 * // Rota configurada em Routes.jsx
 * <Route path="/orders" element={<OrderManagement />} />
 *
 * @example
 * // Acesso através do menu lateral do dashboard
 * <SidebarMenuItem to="/orders" icon="Package" label="Pedidos" />
 */
const OrderManagement = () => {
    /**
     * Estado do sidebar (recolhido/expandido)
     * @type {[boolean, function]} isSidebarCollapsed
     */
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    /**
     * Pedido atualmente selecionado para visualização/detalhes
     * @type {[Object|null, function]} selectedOrder
     */
    const [selectedOrder, setSelectedOrder] = useState(null);

    /**
     * Controle de visibilidade do modal de detalhes do pedido
     * @type {[boolean, function]} isDetailsModalOpen
     */
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    /**
     * Controle de visibilidade do modal de atualização de status
     * @type {[boolean, function]} isStatusModalOpen
     */
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    /**
     * Estado de loading para operações assíncronas
     * @type {[boolean, function]} loading
     */
    const [loading, setLoading] = useState(false);

    /**
     * Estado das notificações toast
     * @type {[Object|null, function]} notification - { message: string, type: 'success'|'error'|'info' }
     */
    const [notification, setNotification] = useState(null);

    /**
     * Lista de pedidos com dados completos para simulação
     * Cada pedido contém informações do cliente, itens, timeline e status
     * @type {[Array, function]} orders
     */
    const [orders, setOrders] = useState([
        {
            id: "0001",
            customerName: "Maria Silva",
            customerPhone: "(11) 99999-1234",
            customerAddress: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
            items: [
                {
                    name: "Pizza Margherita",
                    description: "Molho de tomate, mussarela, manjericão",
                    price: 35.90,
                    quantity: 1,
                    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
                    customizations: ["Borda recheada", "Sem cebola"]
                },
                {
                    name: "Refrigerante 2L",
                    description: "Coca-Cola 2 litros",
                    price: 8.50,
                    quantity: 1,
                    image: "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg"
                }
            ],
            subtotal: 44.40,
            deliveryFee: 5.00,
            discount: 0,
            total: 49.40,
            status: "preparing",
            createdAt: "2025-01-09T20:30:00.000Z",
            specialInstructions: "Entregar no portão principal",
            paymentMethod: "Dinheiro",
            isNew: true,
            itemCount: 2,
            timeline: [
                {
                    status: "Pedido recebido",
                    timestamp: "2025-01-09T20:30:00.000Z",
                    note: "Pedido confirmado automaticamente"
                },
                {
                    status: "Preparando",
                    timestamp: "2025-01-09T20:35:00.000Z",
                    note: "Iniciado preparo na cozinha"
                }
            ]
        },
        {
            id: "0002",
            customerName: "João Santos",
            customerPhone: "(11) 98888-5678",
            customerAddress: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
            items: [
                {
                    name: "Hambúrguer Artesanal",
                    description: "Pão brioche, carne 180g, queijo cheddar",
                    price: 28.90,
                    quantity: 2,
                    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
                }
            ],
            subtotal: 57.80,
            deliveryFee: 4.00,
            discount: 5.00,
            total: 56.80,
            status: "en_route",
            createdAt: "2025-01-09T19:45:00.000Z",
            specialInstructions: "",
            paymentMethod: "Cartão",
            isNew: false,
            itemCount: 2,
            timeline: [
                {
                    status: "Pedido recebido",
                    timestamp: "2025-01-09T19:45:00.000Z"
                },
                {
                    status: "Preparando",
                    timestamp: "2025-01-09T19:50:00.000Z"
                },
                {
                    status: "Pronto",
                    timestamp: "2025-01-09T20:15:00.000Z"
                },
                {
                    status: "A caminho",
                    timestamp: "2025-01-09T20:20:00.000Z",
                    note: "Entregador: Carlos - Moto ABC-1234"
                }
            ]
        },
        {
            id: "0003",
            customerName: "Ana Costa",
            customerPhone: "(11) 97777-9012",
            customerAddress: "Rua Augusta, 500 - Consolação, São Paulo - SP",
            items: [
                {
                    name: "Salada Caesar",
                    description: "Alface americana, croutons, parmesão",
                    price: 22.50,
                    quantity: 1,
                    image: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg"
                },
                {
                    name: "Suco Natural",
                    description: "Laranja 500ml",
                    price: 7.00,
                    quantity: 1,
                    image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg"
                }
            ],
            subtotal: 29.50,
            deliveryFee: 3.50,
            discount: 0,
            total: 33.00,
            status: "delivered",
            createdAt: "2025-01-09T18:20:00.000Z",
            specialInstructions: "Apartamento 45B",
            paymentMethod: "PIX",
            isNew: false,
            itemCount: 2,
            timeline: [
                {
                    status: "Pedido recebido",
                    timestamp: "2025-01-09T18:20:00.000Z"
                },
                {
                    status: "Preparando",
                    timestamp: "2025-01-09T18:25:00.000Z"
                },
                {
                    status: "Pronto",
                    timestamp: "2025-01-09T18:40:00.000Z"
                },
                {
                    status: "A caminho",
                    timestamp: "2025-01-09T18:45:00.000Z"
                },
                {
                    status: "Entregue",
                    timestamp: "2025-01-09T19:05:00.000Z",
                    note: "Entregue com sucesso"
                }
            ]
        },
        {
            id: "0004",
            customerName: "Pedro Lima",
            customerPhone: "(11) 96666-3456",
            customerAddress: "Rua Oscar Freire, 200 - Jardins, São Paulo - SP",
            items: [
                {
                    name: "Açaí 500ml",
                    description: "Açaí puro com granola e banana",
                    price: 15.90,
                    quantity: 1,
                    image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg"
                }
            ],
            subtotal: 15.90,
            deliveryFee: 6.00,
            discount: 0,
            total: 21.90,
            status: "pending",
            createdAt: "2025-01-09T22:10:00.000Z",
            specialInstructions: "",
            paymentMethod: "Dinheiro",
            isNew: true,
            itemCount: 1,
            timeline: [
                {
                    status: "Pedido recebido",
                    timestamp: "2025-01-09T22:10:00.000Z",
                    note: "Aguardando confirmação"
                }
            ]
        },
        {
            id: "0005",
            customerName: "Carla Oliveira",
            customerPhone: "(11) 95555-7890",
            customerAddress: "Rua da Consolação, 800 - Centro, São Paulo - SP",
            items: [
                {
                    name: "Pastel de Queijo",
                    description: "Pastel frito com queijo mussarela",
                    price: 8.50,
                    quantity: 3,
                    image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg"
                },
                {
                    name: "Caldo de Cana",
                    description: "Caldo de cana natural 300ml",
                    price: 5.00,
                    quantity: 1,
                    image: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg"
                }
            ],
            subtotal: 30.50,
            deliveryFee: 4.50,
            discount: 2.00,
            total: 33.00,
            status: "ready",
            createdAt: "2025-01-09T21:30:00.000Z",
            specialInstructions: "Sem cebola nos pastéis",
            paymentMethod: "Cartão",
            isNew: false,
            itemCount: 4,
            timeline: [
                {
                    status: "Pedido recebido",
                    timestamp: "2025-01-09T21:30:00.000Z"
                },
                {
                    status: "Preparando",
                    timestamp: "2025-01-09T21:35:00.000Z"
                },
                {
                    status: "Pronto",
                    timestamp: "2025-01-09T21:50:00.000Z",
                    note: "Aguardando entregador"
                }
            ]
        }
    ]);

    /**
     * Estado dos filtros aplicados à listagem de pedidos
     * @type {[Object, function]} filters
     * @property {string} search - Termo de busca por ID, nome ou telefone
     * @property {string} status - Filtro por status do pedido
     * @property {string} dateFrom - Data inicial do filtro
     * @property {string} dateTo - Data final do filtro
     * @property {string} sort - Ordenação ('newest', 'oldest', 'highest_value', 'lowest_value')
     */
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        dateFrom: '',
        dateTo: '',
        sort: 'newest'
    });

    /**
     * Dados de estatísticas dos pedidos para exibição nos cards
     * @type {Object} stats
     * @property {number} todayOrders - Número de pedidos hoje
     * @property {number} todayOrdersChange - Variação percentual nos pedidos
     * @property {number} pendingOrders - Pedidos pendentes
     * @property {number} preparingOrders - Pedidos em preparação
     * @property {number} todayRevenue - Receita total do dia
     * @property {number} todayRevenueChange - Variação percentual na receita
     */
    const stats = {
        todayOrders: 12,
        todayOrdersChange: 15,
        pendingOrders: 2,
        preparingOrders: 1,
        todayRevenue: 485.60,
        todayRevenueChange: 8
    };

    /**
     * Lista de pedidos filtrada e ordenada baseada nos filtros aplicados
     * Utiliza useMemo para otimizar performance evitando recálculos desnecessários
     * @type {Array} filteredOrders - Array de pedidos filtrados
     */
    const filteredOrders = React.useMemo(() => {
        let filtered = [...orders];

        // Search filter
        if (filters?.search) {
            const searchTerm = filters?.search?.toLowerCase();
            filtered = filtered?.filter(order =>
                order?.id?.toLowerCase()?.includes(searchTerm) ||
                order?.customerName?.toLowerCase()?.includes(searchTerm) ||
                order?.customerPhone?.includes(searchTerm)
            );
        }

        // Status filter
        if (filters?.status) {
            filtered = filtered?.filter(order => order?.status === filters?.status);
        }

        // Date filters
        if (filters?.dateFrom) {
            filtered = filtered?.filter(order =>
                new Date(order.createdAt) >= new Date(filters.dateFrom)
            );
        }
        if (filters?.dateTo) {
            filtered = filtered?.filter(order =>
                new Date(order.createdAt) <= new Date(filters.dateTo + 'T23:59:59')
            );
        }

        // Sort
        filtered?.sort((a, b) => {
            switch (filters?.sort) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'highest_value':
                    return b?.total - a?.total;
                case 'lowest_value':
                    return a?.total - b?.total;
                default: // newest
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    }, [orders, filters]);

    /**
     * Função debounced para mudanças no filtro de busca
     * Aplica debounce de 300ms para evitar múltiplas execuções durante digitação
     * @type {Function} debouncedFilterChange
     */
    const debouncedFilterChange = useCallback(
        debounce((key, value) => {
            setFilters(prev => ({ ...prev, [key]: value }));
        }, 300),
        []
    );

    /**
     * Manipula mudanças nos filtros aplicados à listagem
     * Para busca utiliza debounce, outros filtros são aplicados imediatamente
     * @param {string} key - Chave do filtro ('search', 'status', 'dateFrom', 'dateTo', 'sort')
     * @param {string} value - Valor do filtro
     */
    const handleFilterChange = (key, value) => {
        if (key === 'search') {
            debouncedFilterChange(key, value);
        } else {
            setFilters(prev => ({ ...prev, [key]: value }));
        }
    };

    /**
     * Limpa todos os filtros aplicados, retornando à visualização padrão
     */
    const handleClearFilters = () => {
        setFilters({
            search: '',
            status: '',
            dateFrom: '',
            dateTo: '',
            sort: 'newest'
        });
    };

    /**
     * Exporta os pedidos filtrados para um arquivo CSV
     * Converte os dados para formato adequado e utiliza exportToCSV utility
     */
    const handleExport = () => {
        const exportData = filteredOrders?.map(order => ({
            ID: order?.id,
            Cliente: order?.customerName,
            Telefone: order?.customerPhone,
            Total: formatCurrency(order?.total),
            Status: order?.status,
            Data: new Date(order.createdAt)?.toLocaleDateString('pt-BR')
        }));

        exportToCSV(exportData, `pedidos_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
        showNotification('Relatório exportado com sucesso!', 'success');
    };

    /**
     * Abre o modal de detalhes do pedido selecionado
     * @param {Object} order - Pedido a ser visualizado em detalhes
     */
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    /**
     * Abre o modal de atualização de status do pedido selecionado
     * @param {Object} order - Pedido para o qual o status será atualizado
     */
    const handleStatusUpdate = (order) => {
        setSelectedOrder(order);
        setIsStatusModalOpen(true);
    };

    /**
     * Inicia contato com o cliente via WhatsApp
     * Abre uma nova aba com mensagem pré-preenchida
     * @param {Object} order - Pedido do cliente a ser contactado
     */
    const handleContactCustomer = (order) => {
        const message = `Olá ${order?.customerName}! Sobre seu pedido #${order?.id}...`;
        const whatsappUrl = `https://wa.me/55${order?.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        showNotification(`Contato iniciado com ${order?.customerName}`, 'success');
    };

    /**
     * Atualiza o status de um pedido específico
     * Simula chamada de API e atualiza o estado local
     * @async
     * @param {string} orderId - ID do pedido a ser atualizado
     * @param {Object} updateData - Dados da atualização
     * @param {string} updateData.status - Novo status do pedido
     * @param {string} updateData.timestamp - Timestamp da atualização
     * @param {string} [updateData.note] - Nota opcional da atualização
     * @param {boolean} [updateData.notifyCustomer] - Se deve notificar o cliente
     */
    const handleUpdateOrderStatus = async (orderId, updateData) => {
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setOrders(prev => prev?.map(order => {
                if (order?.id === orderId) {
                    const updatedOrder = {
                        ...order,
                        status: updateData?.status,
                        timeline: [
                            ...order?.timeline,
                            {
                                status: getStatusLabel(updateData?.status),
                                timestamp: updateData?.timestamp,
                                note: updateData?.note
                            }
                        ]
                    };

                    // Mark as not new after status update
                    if (updatedOrder?.isNew) {
                        updatedOrder.isNew = false;
                    }

                    return updatedOrder;
                }
                return order;
            }));

            showNotification('Status atualizado com sucesso!', 'success');

            // Simulate WhatsApp notification if enabled
            if (updateData?.notifyCustomer) {
                const order = orders?.find(o => o?.id === orderId);
                if (order) {
                    setTimeout(() => {
                        showNotification(`Cliente ${order?.customerName} notificado via WhatsApp`, 'info');
                    }, 1500);
                }
            }
        } catch (error) {
            showNotification('Erro ao atualizar status', 'error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Converte status técnico para label legível em português
     * @param {string} status - Status técnico do pedido
     * @returns {string} Label legível do status
     */
    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pendente',
            preparing: 'Preparando',
            ready: 'Pronto',
            en_route: 'A caminho',
            delivered: 'Entregue',
            cancelled: 'Cancelado'
        };
        return labels?.[status] || status;
    };

    /**
     * Exibe uma notificação toast temporária
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo da notificação ('success', 'error', 'info')
     */
    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    /**
     * Simula notificações de novos pedidos em tempo real
     * Executa a cada 30 segundos com 10% de chance de notificar
     */
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate new order notification
            if (Math.random() < 0.1) { // 10% chance every 30 seconds
                showNotification('Novo pedido recebido!', 'info');
                // Play notification sound (in real app)
                // new Audio('/notification.mp3').play().catch(() => {});
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Header
                onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isSidebarCollapsed={isSidebarCollapsed}
            />
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className={`transition-all duration-300 ${
                isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
            } pt-16`}>
                <div className="p-6">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                Gestão de Pedidos
                            </h1>
                            <p className="text-muted-foreground">
                                Acompanhe e gerencie todos os pedidos em tempo real
                            </p>
                        </div>
                        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                            <Button
                                variant="outline"
                                iconName="RefreshCw"
                                iconPosition="left"
                                onClick={() => window.location?.reload()}
                            >
                                Atualizar
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <OrderStats stats={stats} />

                    {/* Filters */}
                    <OrderFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onExport={handleExport}
                    />

                    {/* Orders Table */}
                    <OrderTable
                        orders={filteredOrders}
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={handleViewDetails}
                        onContactCustomer={handleContactCustomer}
                        loading={loading}
                    />

                    {/* Results Summary */}
                    {filteredOrders?.length > 0 && (
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Mostrando {filteredOrders?.length} de {orders?.length} pedidos
                        </div>
                    )}
                </div>
            </main>
            {/* Modals */}
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                onStatusUpdate={handleStatusUpdate}
                onContactCustomer={handleContactCustomer}
            />
            <StatusUpdateModal
                order={selectedOrder}
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onUpdateStatus={handleUpdateOrderStatus}
            />
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-20 right-6 z-1060 max-w-sm w-full bg-card border border-border rounded-lg shadow-elevation-3 p-4 transition-all duration-300 ${
                    notification?.type === 'success' ? 'border-green-200 bg-green-50' :
                        notification?.type === 'error'? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
                }`}>
                    <div className="flex items-center">
                        <Icon
                            name={
                                notification?.type === 'success' ? 'CheckCircle' :
                                    notification?.type === 'error'? 'XCircle' : 'Info'
                            }
                            size={20}
                            className={
                                notification?.type === 'success' ? 'text-green-600' :
                                    notification?.type === 'error'? 'text-red-600' : 'text-blue-600'
                            }
                        />
                        <span className="ml-3 text-sm font-medium text-foreground">
              {notification?.message}
            </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setNotification(null)}
                            className="ml-auto -mr-2"
                        >
                            <Icon name="X" size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;