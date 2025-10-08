import React, { createContext, useContext, useReducer, useEffect } from 'react';

/**
 * CartContext - Contexto para gerenciar o estado do carrinho de compras
 * 
 * Fornece funcionalidades para:
 * - Adicionar itens ao carrinho
 * - Remover itens do carrinho
 * - Atualizar quantidades
 * - Limpar carrinho
 * - Persistir dados no localStorage
 */

// Tipos de ações do reducer
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Estado inicial do carrinho
const initialState = {
  items: [],
  isOpen: false
};

// Reducer para gerenciar as ações do carrinho
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        // Se é um novo item, adiciona ao carrinho
        return {
          ...state,
          items: [...state.items, { product, quantity }]
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload.productId)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Se quantidade é 0 ou negativa, remove o item
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== productId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }

    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      };
    }

    default:
      return state;
  }
};

// Criação do contexto
const CartContext = createContext();

/**
 * CartProvider - Provedor do contexto do carrinho
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes filhos
 */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Carrega o carrinho do localStorage quando o componente monta
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('conecta-loja-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: { items: cartData.items || [] }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
    }
  }, []);

  // Salva o carrinho no localStorage sempre que o estado mudar
  useEffect(() => {
    try {
      localStorage.setItem('conecta-loja-cart', JSON.stringify({
        items: state.items,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [state.items]);

  /**
   * Adiciona um item ao carrinho
   * @param {Object} product - Produto a ser adicionado
   * @param {number} quantity - Quantidade (padrão: 1)
   */
  const addItem = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  };

  /**
   * Remove um item do carrinho
   * @param {string|number} productId - ID do produto a ser removido
   */
  const removeItem = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId }
    });
  };

  /**
   * Atualiza a quantidade de um item no carrinho
   * @param {string|number} productId - ID do produto
   * @param {number} quantity - Nova quantidade
   */
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  };

  /**
   * Limpa todos os itens do carrinho
   */
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  /**
   * Abre o sidebar do carrinho
   */
  const openCart = () => {
    setIsCartOpen(true);
  };

  /**
   * Fecha o sidebar do carrinho
   */
  const closeCart = () => {
    setIsCartOpen(false);
  };

  /**
   * Gera mensagem para WhatsApp com os itens do carrinho
   */
  const generateWhatsAppMessage = () => {
    if (state.items.length === 0) return '';

    const storeInfo = {
      name: 'Conecta Loja',
      phone: '89999999999'
    };

    let message = `*🛒 Pedido - ${storeInfo.name}*\n\n`;
    
    let total = 0;
    state.items.forEach((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      total += itemTotal;
      
      message += `*${index + 1}.* ${item.product.name}\n`;
      message += `   Qtd: ${item.quantity}x\n`;
      message += `   Valor: ${formatPrice(item.product.price)}\n`;
      message += `   Subtotal: ${formatPrice(itemTotal)}\n\n`;
    });

    message += `*💰 Total: ${formatPrice(total)}*\n\n`;
    message += `Gostaria de finalizar este pedido! 😊`;

    return encodeURIComponent(message);
  };

  /**
   * Formata preço para exibição
   * @param {number} price - Preço a ser formatado
   */
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'number' ? price : parseFloat(price.toString().replace(/[^\d,.-]/g, '').replace(',', '.'));
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericPrice);
  };

  /**
   * Finaliza pedido via WhatsApp
   */
  const checkout = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5589999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Calcula totais
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const value = {
    // Estado
    items: state.items,
    totalItems,
    totalPrice,
    isCartOpen,
    
    // Ações
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    checkout,
    
    // Utilitários
    formatPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook para usar o contexto do carrinho
 * @returns {Object} Contexto do carrinho com estado e ações
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export default CartContext;