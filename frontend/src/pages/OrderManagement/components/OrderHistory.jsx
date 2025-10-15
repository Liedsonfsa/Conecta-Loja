import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Search, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data - histórico de pedidos expandido
  const orders = [
    {
      id: "PED-2024-001",
      date: "2025-07-15",
      time: "14:30",
      status: "delivered",
      total: 45.90,
      items: [
        { name: "Pizza Margherita", quantity: 1, price: 35.90 },
        { name: "Refrigerante Cola", quantity: 1, price: 10.00 }
      ],
      paymentMethod: "Cartão de Crédito",
      deliveryAddress: "Rua das Flores, 123 - São Paulo, SP"
    },
    {
      id: "PED-2024-002", 
      date: "2024-01-12",
      time: "19:15",
      status: "preparing",
      total: 52.80,
      items: [
        { name: "Hambúrguer Artesanal", quantity: 2, price: 18.90 },
        { name: "Batata Frita Grande", quantity: 1, price: 15.00 }
      ],
      paymentMethod: "PIX",
      deliveryAddress: "Av. Paulista, 1000 - São Paulo, SP"
    },
    {
      id: "PED-2024-003",
      date: "2024-01-10",
      time: "12:45",
      status: "delivered",
      total: 38.50,
      items: [
        { name: "Salada Caesar", quantity: 1, price: 28.50 },
        { name: "Suco Natural", quantity: 1, price: 10.00 }
      ],
      paymentMethod: "Dinheiro",
      deliveryAddress: "Rua Augusta, 500 - São Paulo, SP"
    },
    {
      id: "PED-2024-004",
      date: "2024-01-08",
      time: "20:30",
      status: "cancelled",
      total: 28.00,
      items: [
        { name: "Pizza Calabresa", quantity: 1, price: 28.00 }
      ],
      paymentMethod: "Cartão de Débito",
      deliveryAddress: "Rua Oscar Freire, 200 - São Paulo, SP"
    },
    {
      id: "PED-2024-005",
      date: "2024-01-05",
      time: "18:20",
      status: "delivered",
      total: 67.40,
      items: [
        { name: "Combo Família", quantity: 1, price: 55.00 },
        { name: "Sobremesa Especial", quantity: 2, price: 6.20 }
      ],
      paymentMethod: "PIX",
      deliveryAddress: "Alameda Santos, 800 - São Paulo, SP"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "preparing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "preparing": return <Clock className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered": return "Entregue";
      case "preparing": return "Preparando";
      case "cancelled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
              {orders.length} pedidos encontrados
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
                  variant={selectedFilter === "delivered" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("delivered")}
                  size="sm"
                >
                  Entregues
                </Button>
                <Button
                  variant={selectedFilter === "preparing" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("preparing")}
                  size="sm"
                >
                  Preparando
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
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
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pagamento:</span>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Endereço:</span>
                      <p className="font-medium">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-bold text-primary">
                      Total: {formatPrice(order.total)}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
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
                  {searchTerm ? "Tente buscar por outros termos" : "Você ainda não fez nenhum pedido"}
                </p>
                <Button onClick={() => navigate('/')}>
                  Fazer Primeiro Pedido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;