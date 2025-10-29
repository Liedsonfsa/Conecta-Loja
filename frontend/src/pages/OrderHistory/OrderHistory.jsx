import Button from "@/components/ui/ButtonDash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Search, Filter, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/use-auth.js";
import { orderService } from "../../api";
import { useToast } from "../../hooks/use-toast";

/**
 * OrderHistory - Página de histórico de pedidos do cliente
 *
 * Página completa para visualização do histórico de pedidos realizados,
 * com funcionalidades de busca, filtros por status e navegação intuitiva.
 * Permite ao cliente acompanhar seus pedidos anteriores e fazer novos pedidos.
 *
 * Funcionalidades principais:
 * - Lista completa de pedidos realizados com detalhes
 * - Busca por número do pedido ou nome do item
 * - Filtros por status (todos, entregues, preparando)
 * - Visualização detalhada de itens, valores e endereços
 * - Navegação para fazer novos pedidos
 * - Estados vazios com mensagens explicativas
 * - Design responsivo com cards organizados
 *
 * Informações exibidas por pedido:
 * - ID único do pedido
 * - Data e hora do pedido
 * - Status com ícones e cores específicas
 * - Lista completa de itens com quantidades e preços
 * - Método de pagamento
 * - Endereço de entrega
 * - Valor total formatado
 *
 * Estados possíveis dos pedidos:
 * - delivered (Entregue): Verde com ícone de check
 * - preparing (Preparando): Amarelo com ícone de relógio
 * - cancelled (Cancelado): Vermelho com ícone de X
 *
 * @component
 *
 * @example
 * // Rota configurada em Routes.jsx
 * <Route path="/orders/history" element={<OrderHistory />} />
 *
 * @example
 * // Acesso através de link ou navegação programática
 * <Link to="/orders/history">Ver Histórico</Link>
 */
const OrderHistory = () => {
  /**
   * Hook de navegação do React Router
   * @type {Function} navigate
   */
  const navigate = useNavigate();

  /**
   * Hook de autenticação para obter dados do usuário
   */
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  /**
   * Estado dos pedidos carregados do backend
   * @type {[Array, function]} orders
   */
  const [orders, setOrders] = useState([]);

  /**
   * Estado de carregamento dos pedidos
   * @type {[boolean, function]} loading
   */
  const [loading, setLoading] = useState(true);

  /**
   * Estado do termo de busca atual
   * @type {[string, function]} searchTerm
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Estado do filtro selecionado (all, delivered, preparing)
   * @type {[string, function]} selectedFilter
   */
  const [selectedFilter, setSelectedFilter] = useState("all");

  /**
   * Estado do modal de acompanhamento
   * @type {[boolean, function]} isTrackingModalOpen
   */
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  /**
   * Estado do pedido selecionado para acompanhamento
   * @type {[object|null, function]} selectedOrder
   */
  const [selectedOrder, setSelectedOrder] = useState(null);

  /**
   * Estado de carregamento dos detalhes do pedido
   * @type {[boolean, function]} loadingOrderDetails
   */
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  /**
   * Carrega pedidos do usuário logado do backend
   */
  const loadOrders = async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.getUserOrders(user.id);

      if (response.success) {
        // Formatar dados dos pedidos para o frontend
        const formattedOrders = response.orders.map(order => {
          const createdAt = new Date(order.createdAt);

          return {
            id: order.numeroPedido || order.id,
            numeroPedido: order.numeroPedido,
            createdAt: order.createdAt, // Manter o campo original para o modal
            date: !isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('pt-BR') : 'Data indisponível',
            time: !isNaN(createdAt.getTime()) ? createdAt.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Horário indisponível',
            status: mapOrderStatus(order.status),
            total: parseFloat(order.precoTotal),
            items: order.produtos.map(produto => ({
              name: produto.produto.name,
              quantity: produto.quantidade,
              price: parseFloat(produto.precoUnitario)
            })),
            deliveryAddress: order.endereco ? formatAddress(order.endereco) : "Endereço não informado"
          };
        });

        setOrders(formattedOrders);
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar seus pedidos. Tente novamente."
        });
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão."
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mapeia status do backend para valores do frontend
   * @param {string} backendStatus - Status do backend
   * @returns {string} Status mapeado para o frontend
   */
  const mapOrderStatus = (backendStatus) => {
    const statusMap = {
      'RECEBIDO': 'received',
      'AGUARDANDO_PAGAMENTO': 'awaiting_payment',
      'PAGAMENTO_APROVADO': 'payment_approved',
      'PREPARO': 'preparing',
      'ENVIADO_PARA_ENTREGA': 'sent_for_delivery',
      'ENTREGUE': 'delivered',
      'CANCELADO': 'cancelled',
      'TENTATIVA_ENTREGA_FALHADA': 'delivery_failed'
    };
    return statusMap[backendStatus] || 'unknown';
  };

  /**
   * Formata endereço para exibição
   * @param {object} endereco - Dados do endereço
   * @returns {string} Endereço formatado
   */
  const formatAddress = (endereco) => {
    return `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? `, ${endereco.complemento}` : ''} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}, CEP: ${endereco.cep}`;
  };

  /**
   * Retorna classes CSS de cor para o status do pedido
   * Cada status tem cores semânticas específicas
   * @param {string} status - Status do pedido
   * @returns {string} Classes CSS para o badge do status
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "received": return "bg-blue-100 text-blue-800 border-blue-200";
      case "awaiting_payment": return "bg-orange-100 text-orange-800 border-orange-200";
      case "payment_approved": return "bg-green-100 text-green-800 border-green-200";
      case "sent_for_delivery": return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "delivery_failed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  /**
   * Retorna ícone React correspondente ao status do pedido
   * Cada status tem um ícone semântico específico
   * @param {string} status - Status do pedido
   * @returns {React.Component} Componente de ícone do Lucide React
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "preparing": return <Clock className="h-4 w-4" />;
      case "received": return <Package className="h-4 w-4" />;
      case "awaiting_payment": return <Clock className="h-4 w-4" />;
      case "payment_approved": return <CheckCircle className="h-4 w-4" />;
      case "sent_for_delivery": return <Package className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      case "delivery_failed": return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  /**
   * Retorna texto em português para o status do pedido
   * @param {string} status - Status técnico do pedido
   * @returns {string} Texto legível do status em português
   */
  const getStatusText = (status) => {
    switch (status) {
      case "delivered": return "Entregue";
      case "preparing": return "Preparando";
      case "received": return "Recebido";
      case "awaiting_payment": return "Aguardando Pagamento";
      case "payment_approved": return "Pagamento Aprovado";
      case "sent_for_delivery": return "Enviado para Entrega";
      case "cancelled": return "Cancelado";
      case "delivery_failed": return "Entrega Falhada";
      default: return "Desconhecido";
    }
  };

  /**
   * Formata valor numérico para moeda brasileira (R$)
   * @param {number} price - Valor a ser formatado
   * @returns {string} Valor formatado como moeda brasileira
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  /**
   * Lista de pedidos filtrada baseada na busca e filtros selecionados
   * Aplica filtros de busca por ID/item e filtro por status
   * @type {Array} filteredOrders - Array de pedidos filtrados
   */
  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  /**
   * Abre o modal de acompanhamento do pedido
   * @param {object} order - Pedido selecionado
   */
  const openTrackingModal = async (order) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);

    // Carregar detalhes completos do pedido se necessário
    if (!order.produtos || !order.endereco) {
      setLoadingOrderDetails(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/order/${order.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSelectedOrder(data.order);
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes do pedido:', error);
      } finally {
        setLoadingOrderDetails(false);
      }
    }
  };

  /**
   * Fecha o modal de acompanhamento
   */
  const closeTrackingModal = () => {
    setIsTrackingModalOpen(false);
    setSelectedOrder(null);
    setLoadingOrderDetails(false);
  };

  /**
   * Carrega pedidos quando o componente monta
   */
  useEffect(() => {
    if (!authLoading) {
      loadOrders();
    }
  }, [authLoading, user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Histórico de Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Carregando pedidos...' : `${orders.length} pedidos encontrados`}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número do pedido ou item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("all")}
                  size="sm"
                >
                  Todos
                </Button>
                <Button
                  variant={selectedFilter === "received" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("received")}
                  size="sm"
                >
                  Recebidos
                </Button>
                <Button
                  variant={selectedFilter === "preparing" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("preparing")}
                  size="sm"
                >
                  Preparando
                </Button>
                <Button
                  variant={selectedFilter === "delivered" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("delivered")}
                  size="sm"
                >
                  Entregues
                </Button>
                <Button
                  variant={selectedFilter === "cancelled" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("cancelled")}
                  size="sm"
                >
                  Cancelados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando seus pedidos...</p>
              </CardContent>
            </Card>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {order.date} às {order.time}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Endereço de entrega:</span>
                    <p className="font-medium mt-1">{order.deliveryAddress}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-bold text-primary">
                      Total: {formatPrice(order.total)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openTrackingModal(order)}
                      >
                        Acompanhar Pedido
                      </Button>
                      {order.status === "delivered" && (
                        <Button size="sm">
                          Pedir Novamente
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Tente buscar por outros termos ou limpe os filtros" : "Você ainda não fez nenhum pedido"}
                </p>
                <Button onClick={() => navigate('/')}>
                  Fazer Primeiro Pedido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal de Acompanhamento do Pedido */}
        {isTrackingModalOpen && selectedOrder && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={closeTrackingModal}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Acompanhamento do Pedido
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pedido #{selectedOrder.numeroPedido || selectedOrder.id}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={closeTrackingModal}>
                      <span className="text-xl">×</span>
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-6">
                      {/* Status Atual */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(selectedOrder.status)}
                            <div>
                              <p className="font-medium text-foreground">Status Atual</p>
                              <p className="text-sm text-muted-foreground">{getStatusText(selectedOrder.status)}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusText(selectedOrder.status)}
                          </div>
                        </div>
                      </div>

                      {/* Timeline de Status */}
                      <div>
                        <h3 className="font-medium text-foreground mb-4">Histórico do Pedido</h3>
                        <div className="space-y-4">
                          {selectedOrder.statusHistorico && selectedOrder.statusHistorico.length > 0 ? (
                            selectedOrder.statusHistorico.map((historico, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                                  index === selectedOrder.statusHistorico.length - 1
                                    ? 'bg-primary'
                                    : 'bg-green-500'
                                }`}></div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${
                                    index === selectedOrder.statusHistorico.length - 1
                                      ? 'text-foreground'
                                      : 'text-green-700'
                                  }`}>
                                    {getStatusText(historico.status)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(() => {
                                      try {
                                        const date = new Date(historico.createdAt);
                                        if (isNaN(date.getTime())) {
                                          return 'Data indisponível';
                                        }
                                        return date.toLocaleDateString('pt-BR', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        });
                                      } catch (error) {
                                        return 'Data indisponível';
                                      }
                                    })()}
                                    {historico.funcionario && (
                                      <span> • por {historico.funcionario.name}</span>
                                    )}
                                  </p>
                                  {historico.observacao && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                      "{historico.observacao}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            /* Fallback para quando não há histórico */
                            <div className="flex items-start space-x-3">
                              <div className="w-3 h-3 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{getStatusText(selectedOrder.status)}</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedOrder.date || 'Data indisponível'}
                              </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Informações do Pedido */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Informações Gerais</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Data do pedido:</span>
                              <span className="text-foreground">
                                {selectedOrder.date || 'Data indisponível'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Horário:</span>
                              <span className="text-foreground">
                                {selectedOrder.time || 'Horário indisponível'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total:</span>
                              <span className="text-foreground font-medium">{formatPrice(selectedOrder.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Endereço de Entrega</h4>
                          <p className="text-sm text-foreground leading-relaxed">
                            {selectedOrder.deliveryAddress}
                          </p>
                        </div>
                      </div>

                      {/* Itens do Pedido (se disponível) */}
                      {selectedOrder.items && selectedOrder.items.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Itens do Pedido</h4>
                          <div className="space-y-2">
                            {selectedOrder.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-muted/20 p-3 rounded">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="font-medium">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Loading state */}
                      {loadingOrderDetails && (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">Carregando detalhes...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end p-6 border-t border-border bg-muted/20">
                    <Button onClick={closeTrackingModal}>
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;