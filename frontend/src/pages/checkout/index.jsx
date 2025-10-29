import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/use-auth.js';
import { addressService, orderService } from '../../api';
import { useToast } from '../../hooks/use-toast';
import { openWhatsAppOrder } from '../../utils';
import Button from '../../components/ui/ButtonDash';
import OrderConfirmation from '../../components/ui/OrderConfirmation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Checkout - Página de finalização de pedido
 *
 * Fluxo de checkout completo:
 * 1. Verifica se usuário tem endereços cadastrados
 * 2. Se não tiver, redireciona para cadastro de endereço
 * 3. Permite selecionar endereço de entrega
 * 4. Mostra resumo do pedido
 * 5. Permite finalizar pedido
 *
 * Estados gerenciados:
 * - Lista de endereços do usuário
 * - Endereço selecionado
 * - Loading states
 * - Estados de confirmação
 *
 * Integrações:
 * - useCart: Para acessar itens do carrinho
 * - useAuth: Para dados do usuário
 * - addressService: Para gerenciar endereços
 * - orderService: Para criar pedidos
 */
const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Estados para confirmação do pedido
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState(null);

  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { items, totalPrice, totalItems, clearCart, closeCart } = useCart();
  const { toast } = useToast();


  /**
   * Carrega endereços do usuário
   */
  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressService.getUserAddresses();
      if (response.success) {
        setAddresses(response.addresses || []);
        // Seleciona automaticamente o primeiro endereço se existir
        if (response.addresses && response.addresses.length > 0) {
          setSelectedAddressId(response.addresses[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar endereços",
        description: "Não foi possível carregar seus endereços. Tente novamente."
      });
    } finally {
      setLoadingAddresses(false);
    }
  };

  /**
   * Verifica se o usuário pode prosseguir com o checkout
   */
  const checkCheckoutPrerequisites = () => {
    // Verifica se usuário está logado
    if (!user || !user.id) {
      toast({
        variant: "destructive",
        title: "Login necessário",
        description: "Você precisa estar logado para finalizar pedidos."
      });
      navigate('/');
      return false;
    }

    // Verifica se há itens no carrinho
    if (!items || items.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar."
      });
      navigate('/');
      return false;
    }

    return true;
  };

  /**
   * Formata endereço para exibição
   */
  const formatAddress = (address) => {
    return `${address.logradouro}, ${address.numero}${address.complemento ? `, ${address.complemento}` : ''} - ${address.bairro}, ${address.cidade} - ${address.estado}, CEP: ${address.cep}`;
  };

  /**
   * Manipula seleção de endereço
   */
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  /**
   * Mostra/esconde o formulário de adicionar endereço
   */
  const handleAddAddress = () => {
    setShowAddAddress(!showAddAddress);
  };

  /**
   * Salva um novo endereço
   */
  const handleSaveAddress = async (addressData) => {
    try {
      const response = await addressService.createAddress(addressData);
      if (response.success) {
        toast({
          title: "Endereço adicionado!",
          description: "Endereço cadastrado com sucesso.",
          variant: "default"
        });
        // Recarrega endereços e seleciona o novo
        await loadAddresses();
        setShowAddAddress(false);
      }
    } catch (error) {
      toast({
        title: "Erro ao adicionar endereço",
        description: error.message || "Não foi possível adicionar o endereço.",
        variant: "destructive"
      });
    }
  };


  /**
   * Finaliza o pedido
   */
  const handleConfirmOrder = async () => {
    try {
      setCreatingOrder(true);

      // Formatar os produtos do carrinho para o formato esperado pela API
      const produtos = items.map(item => ({
        produtoId: item.product.id,
        quantidade: item.quantity,
        precoUnitario: item.product.price
      }));

      // Criar o pedido
      const orderData = {
        usuarioId: user.id,
        enderecoId: selectedAddressId, // Adiciona o endereço selecionado
        produtos: produtos,
        precoTotal: totalPrice,
        status: 'RECEBIDO'
      };

      const result = await orderService.createOrder(orderData);

      if (result.success) {
        // Preparar dados para WhatsApp
        const orderData = {
          id: result.pedido?.id,
          numeroPedido: result.pedido?.numeroPedido
        };

        // Garantir que o nome seja tratado corretamente (problema de encoding)
        const cleanName = (user.name || 'Cliente').replace(/Ã©/g, 'é').replace(/Ã¡/g, 'á').replace(/Ã£/g, 'ã').replace(/Ãµ/g, 'õ').replace(/Ã§/g, 'ç').replace(/Ã‰/g, 'É').replace(/Ã/g, 'Á');

        const customerData = {
          name: cleanName,
          phone: user.contact || user.phone || null // Tentar contact ou phone
        };

        // Formatar itens do carrinho para WhatsApp
        const whatsappItems = items.map(item => {
          const price = parseFloat(item.product?.price) || 0;
          return {
            name: item.product?.name || 'Produto sem nome',
            quantity: item.quantity || 1,
            price: price
          };
        });

        // Salvar dados para a confirmação animada
        setConfirmedOrderData({
          orderData,
          customerData,
          whatsappItems
        });

        // Mostrar confirmação animada
        setShowOrderSuccessModal(true);
      } else {
        toast({
          title: 'Erro ao criar pedido',
          description: 'Ocorreu um erro ao processar seu pedido. Tente novamente.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao finalizar seu pedido. Verifique sua conexão e tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setCreatingOrder(false);
    }
  };

  /**
   * Manipula a conclusão da animação de confirmação do pedido
   */
  const handleOrderConfirmationComplete = () => {
    if (confirmedOrderData) {
      const { orderData, customerData, whatsappItems } = confirmedOrderData;

      // Abrir WhatsApp
      openWhatsAppOrder(orderData, customerData, whatsappItems);

      // Limpar carrinho e fechar após redirecionamento
      setTimeout(() => {
        clearCart();
        closeCart();
        navigate('/history');
      }, 500);
    }
  };

  /**
   * Volta para o carrinho
   */
  const handleBackToCart = () => {
    navigate(-1); // Volta para a página anterior
  };

  // Carrega dados na inicialização
  useEffect(() => {
    // Só executa quando a autenticação terminou de carregar
    if (authLoading) return;

    if (!checkCheckoutPrerequisites()) return;

    loadAddresses();
    setLoading(false);
  }, [authLoading]);

  // Seleciona automaticamente o primeiro endereço quando carregados
  useEffect(() => {
    if (!loadingAddresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [loadingAddresses, addresses, selectedAddressId]);


  // Renderiza loading
  if (authLoading || loading || loadingAddresses) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <button
              onClick={handleBackToCart}
              className="hover:text-foreground transition-colors"
            >
              ← Voltar ao Carrinho
            </button>
            <span>/</span>
            <span className="text-foreground font-medium">Checkout</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Finalizar Pedido</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confirme os detalhes do seu pedido e selecione o endereço de entrega
          </p>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Itens do Pedido */}
            <div className="xl:col-span-2 space-y-6">
              {/* Resumo do Pedido */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Resumo do Pedido</h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.image || '/images/placeholder.png'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.description}</p>
                        <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border mt-6 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seleção de Endereço */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Endereço de Entrega</h2>
                  {!showAddAddress && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddAddress}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Adicionar Endereço
                    </Button>
                  )}
                </div>

                {/* Formulário de adicionar endereço */}
                {showAddAddress && (
                  <div className="border border-border rounded-lg p-4 mb-4 bg-background/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-foreground">Novo Endereço</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddAddress(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </Button>
                    </div>

                    <AddressForm onSave={handleSaveAddress} onCancel={() => setShowAddAddress(false)} />
                  </div>
                )}

                {/* Lista de endereços ou mensagem quando vazio */}
                {addresses.length === 0 && !showAddAddress ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📍</span>
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Nenhum endereço cadastrado
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Você precisa cadastrar um endereço para finalizar seu pedido.
                      </p>
                    </div>
                    <Button onClick={handleAddAddress} className="w-full">
                      Cadastrar Primeiro Endereço
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleAddressSelect(address.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            checked={selectedAddressId === address.id}
                            onChange={() => handleAddressSelect(address.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {formatAddress(address)}
                            </p>
                            {address.informacoes_adicionais && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {address.informacoes_adicionais}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resumo Lateral */}
            <div className="space-y-6">
              {/* Resumo do Pedido */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Resumo</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Itens ({totalItems}):</span>
                    <span className="text-foreground">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega:</span>
                    <span className="text-foreground">A calcular</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-foreground">Total:</span>
                      <span className="text-lg font-bold text-primary">
                        R$ {totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={!selectedAddressId || creatingOrder || addresses.length === 0}
                    loading={creatingOrder}
                    className="w-full"
                  >
                    {creatingOrder ? 'Finalizando Pedido...' : 'Confirmar Pedido'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleBackToCart}
                    className="w-full"
                  >
                    Voltar ao Carrinho
                  </Button>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmation
        isVisible={showOrderSuccessModal}
        orderNumber={confirmedOrderData?.orderData?.numeroPedido || confirmedOrderData?.orderData?.id}
        onComplete={handleOrderConfirmationComplete}
      />
    </div>
  );
};

/**
 * AddressForm - Formulário para adicionar endereço diretamente no checkout
 */
const AddressForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    informacoes_adicionais: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
      // Reset form
      setFormData({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        informacoes_adicionais: '',
        bairro: '',
        cidade: '',
        estado: ''
      });
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CEP */}
        <div className="space-y-2">
          <Label htmlFor="cep">CEP *</Label>
          <Input
            id="cep"
            name="cep"
            type="text"
            placeholder="00000-000"
            value={formData.cep}
            onChange={handleChange}
            required
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            required
          >
            <option value="">Selecione...</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>
      </div>

      {/* Logradouro */}
      <div className="space-y-2">
        <Label htmlFor="logradouro">Logradouro *</Label>
        <Input
          id="logradouro"
          name="logradouro"
          type="text"
          placeholder="Rua, Avenida, etc."
          value={formData.logradouro}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Número */}
        <div className="space-y-2">
          <Label htmlFor="numero">Número *</Label>
          <Input
            id="numero"
            name="numero"
            type="text"
            placeholder="123"
            value={formData.numero}
            onChange={handleChange}
            required
          />
        </div>

        {/* Complemento */}
        <div className="space-y-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            name="complemento"
            type="text"
            placeholder="Apto, Bloco, etc."
            value={formData.complemento}
            onChange={handleChange}
          />
        </div>

        {/* Bairro */}
        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro *</Label>
          <Input
            id="bairro"
            name="bairro"
            type="text"
            placeholder="Centro"
            value={formData.bairro}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Cidade */}
      <div className="space-y-2">
        <Label htmlFor="cidade">Cidade *</Label>
        <Input
          id="cidade"
          name="cidade"
          type="text"
          placeholder="São Paulo"
          value={formData.cidade}
          onChange={handleChange}
          required
        />
      </div>

      {/* Informações adicionais */}
      <div className="space-y-2">
        <Label htmlFor="informacoes_adicionais">Informações adicionais</Label>
        <Input
          id="informacoes_adicionais"
          name="informacoes_adicionais"
          type="text"
          placeholder="Ponto de referência, etc."
          value={formData.informacoes_adicionais}
          onChange={handleChange}
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Salvando...' : 'Salvar Endereço'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default Checkout;
