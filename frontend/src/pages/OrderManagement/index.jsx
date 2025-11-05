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
import Pagination from '../../components/ui/Pagination';
import { formatCurrency, debounce, exportToCSV } from 'src/utils';
import { orderService } from '../../api/orders';

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
 * - API de pedidos (através do orderService)
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
     * Estado de paginação
     * @type {[number, function]} currentPage - Página atual (baseado em 1)
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * Estado de itens por página
     * @type {[number, function]} itemsPerPage - Quantidade de itens por página
     */
    const [itemsPerPage, setItemsPerPage] = useState(20);

    /**
     * Lista de pedidos com dados completos da API
     * Cada pedido contém informações do cliente, itens, timeline e status
     * @type {[Array, function]} orders
     */
    const [orders, setOrders] = useState([]);

    /**
     * Busca todos os pedidos da loja através da API
     */
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAllOrders();
            if (response.success) {
                // Transforma os dados da API para o formato esperado pelo componente
                const transformedOrders = response.orders.map(order => {
                    // Mapeia os status do enum para os valores esperados pelo frontend
                    const statusMapping = {
                        'RECEBIDO': 'received',
                        'AGUARDANDO_PAGAMENTO': 'pending',
                        'PAGAMENTO_APROVADO': 'payment_approved',
                        'PREPARO': 'preparing',
                        'ENVIADO_PARA_ENTREGA': 'en_route',
                        'ENTREGUE': 'delivered',
                        'CANCELADO': 'cancelled',
                        'TENTATIVA_ENTREGA_FALHADA': 'delivery_failed'
                    };

                    // Calcula o total dos produtos
                    const itemsTotal = order.produtos?.reduce((sum, p) =>
                        sum + (Number(p.precoUnitario || 0) * Number(p.quantidade || 1)), 0
                    ) || 0;

                    const mappedStatus = statusMapping[order.status] || 'received';

                    return {
                        id: order.numeroPedido || order.id,
                        customerName: order.usuario?.name || 'Cliente',
                        customerPhone: order.usuario?.contact || '',
                        customerAddress: order.endereco ? `${order.endereco.logradouro}, ${order.endereco.numero} - ${order.endereco.bairro}, ${order.endereco.cidade} - ${order.endereco.estado}` : '',
                        items: order.produtos?.map(p => ({
                            name: p.produto?.name || 'Produto',
                            description: p.produto?.description || '',
                            price: Number(p.precoUnitario || 0),
                            quantity: Number(p.quantidade || 1),
                            image: p.produto?.image || '',
                            customizations: []
                        })) || [],
                        subtotal: itemsTotal,
                        discount: 0,
                        total: Number(order.precoTotal || itemsTotal),
                        status: mappedStatus,
                        createdAt: order.createdAt,
                        specialInstructions: order.observacoes || '',
                        paymentMethod: 'Cartão', // Valor padrão, pode vir da API
                        isNew: order.status === 'RECEBIDO',
                        itemCount: order.produtos?.length || 0,
                        timeline: order.statusHistorico?.map(h => ({
                            status: h.status,
                            timestamp: h.createdAt,
                            note: h.observacao || ''
                        })) || []
                    };
                });
                setOrders(transformedOrders);
            } else {
                showNotification('Erro ao buscar pedidos', 'error');
            }
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            showNotification('Erro ao carregar pedidos', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Busca pedidos ao montar o componente
    useEffect(() => {
        fetchOrders();
    }, []);

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
     * Lista de pedidos paginada baseada nos filtros aplicados
     * Utiliza useMemo para otimizar performance evitando recálculos desnecessários
     * @type {Array} paginatedOrders - Array de pedidos da página atual
     */
    const paginatedOrders = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage, itemsPerPage]);

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
        // Reset to first page when filters change (except search which is debounced)
        if (key !== 'search') {
            setCurrentPage(1);
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
        setCurrentPage(1); // Reset to first page when clearing filters
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
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(value) => {
                            setItemsPerPage(value);
                            setCurrentPage(1); // Reset to first page when changing items per page
                        }}
                    />

                    {/* Orders Table */}
                    <OrderTable
                        orders={paginatedOrders}
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={handleViewDetails}
                        onContactCustomer={handleContactCustomer}
                        loading={loading}
                    />

                    {/* Pagination */}
                    {filteredOrders?.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredOrders.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
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
