import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartService } from '@/api';

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

/**
 * Transforma dados do carrinho do backend para o formato esperado pelo frontend
 * @param {Array} backendItems - Itens retornados pelo backend
 * @returns {Array} Itens no formato esperado pelo frontend
 */
const transformBackendCartItems = (backendItems) => {
  if (!backendItems || !Array.isArray(backendItems)) return [];

  return backendItems.map(item => ({
    product: item.produto || item.product,
    quantity: item.quantidade || item.quantity
  }));
};

// Tipos de ações do reducer
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SYNC_WITH_SERVER: 'SYNC_WITH_SERVER',
  SET_USER_LOGGED_IN: 'SET_USER_LOGGED_IN',
  SET_USER_LOGGED_OUT: 'SET_USER_LOGGED_OUT'
};

// Estado inicial do carrinho
const initialState = {
  items: [],
  isOpen: false,
  isLoggedIn: false,
  isServerCartLoaded: false,
  isSyncing: false
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

    case CART_ACTIONS.SYNC_WITH_SERVER: {
      return {
        ...state,
        items: action.payload.items || [],
        isServerCartLoaded: true,
        isSyncing: false
      };
    }

    case CART_ACTIONS.SET_USER_LOGGED_IN: {
      return {
        ...state,
        isLoggedIn: true,
        isSyncing: action.payload.isSyncing || false
      };
    }

    case CART_ACTIONS.SET_USER_LOGGED_OUT: {
      return {
        ...state,
        items: [], // Limpa itens da interface ao fazer logout
        isLoggedIn: false,
        isServerCartLoaded: false,
        isSyncing: false
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

  // Salva o carrinho no localStorage apenas quando não está logado ou sincronizado
  useEffect(() => {
    // Só salva no localStorage se não estiver logado OU se estiver logado mas ainda não sincronizado com servidor
    const shouldSaveLocally = !state.isLoggedIn || !state.isServerCartLoaded;

    if (shouldSaveLocally) {
      try {
        localStorage.setItem('conecta-loja-cart', JSON.stringify({
          items: state.items,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Erro ao salvar carrinho no localStorage:', error);
      }
    }
  }, [state.items, state.isLoggedIn, state.isServerCartLoaded]);

  // Verifica se usuário está logado baseado no token JWT
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const isLoggedIn = !!token;

      if (isLoggedIn && !state.isLoggedIn) {
        // Usuário acabou de fazer login
        handleUserLogin();
      } else if (!isLoggedIn && state.isLoggedIn) {
        // Usuário acabou de fazer logout
        handleUserLogout();
      }
    };

    // Verifica status inicial
    checkAuthStatus();

    // Adiciona listener para mudanças no localStorage (outros tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
   * Sincroniza carrinho local com servidor quando usuário faz login
   */
  const syncCartWithServer = useCallback(async () => {
    try {
      // Define que está sincronizando
      dispatch({
        type: CART_ACTIONS.SET_USER_LOGGED_IN,
        payload: { isSyncing: true }
      });

      const localCartData = localStorage.getItem('conecta-loja-cart');
      const localCart = JSON.parse(localCartData || '{"items":[]}');
      const localItems = localCart.items || [];

      if (localItems.length > 0) {
        // Sincroniza itens locais com servidor
        const result = await cartService.syncLocalCart(localItems);

        if (result.success && result.cart) {
          const transformedItems = transformBackendCartItems(result.cart.itens || result.cart.items || []);
          dispatch({
            type: CART_ACTIONS.SYNC_WITH_SERVER,
            payload: { items: transformedItems }
          });

          // Limpa localStorage após sincronização bem-sucedida
          localStorage.removeItem('conecta-loja-cart');
        }
      } else {
        // Se não há itens locais, carrega carrinho do servidor
        const result = await cartService.getCart();
        if (result.success && result.cart) {
          const transformedItems = transformBackendCartItems(result.cart.itens || result.cart.items || []);
          dispatch({
            type: CART_ACTIONS.SYNC_WITH_SERVER,
            payload: { items: transformedItems }
          });
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);

      // Em caso de erro, continua com carrinho local
      dispatch({
        type: CART_ACTIONS.SET_USER_LOGGED_IN,
        payload: { isSyncing: false }
      });
    }
  }, []);

  /**
   * Função chamada quando usuário faz login
   */
  const handleUserLogin = useCallback(() => {
    // Define usuário como logado e inicia sincronização
    syncCartWithServer();
  }, [syncCartWithServer]);

  /**
   * Função chamada quando usuário faz logout
   */
  const handleUserLogout = useCallback(() => {
    dispatch({ type: CART_ACTIONS.SET_USER_LOGGED_OUT });

    // Limpa localStorage
    localStorage.removeItem('conecta-loja-cart');
  }, []);

  /**
   * Operações do carrinho que funcionam tanto local quanto com servidor
   */
  const addItemToCart = useCallback(async (product, quantity = 1) => {
    if (state.isLoggedIn && state.isServerCartLoaded) {
      // Se usuário está logado e carrinho do servidor carregado, usa API
      try {
        const result = await cartService.addToCart(product.id, quantity);
        if (result.success && result.cart) {
          const transformedItems = transformBackendCartItems(result.cart.itens || result.cart.items || []);
          dispatch({
            type: CART_ACTIONS.SYNC_WITH_SERVER,
            payload: { items: transformedItems }
          });
        }
      } catch (error) {
        console.error('Erro ao adicionar item ao carrinho do servidor:', error);
        // Fallback para localStorage em caso de erro
        dispatch({
          type: CART_ACTIONS.ADD_ITEM,
          payload: { product, quantity }
        });
      }
    } else {
      // Se não está logado ou carrinho do servidor não carregado, usa localStorage
      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: { product, quantity }
      });
    }
  }, [state.isLoggedIn, state.isServerCartLoaded]);

  const removeItemFromCart = useCallback(async (productId) => {
    if (state.isLoggedIn && state.isServerCartLoaded) {
      try {
        const result = await cartService.removeFromCart(productId);
        if (result.success && result.cart) {
          const transformedItems = transformBackendCartItems(result.cart.itens || result.cart.items || []);
          dispatch({
            type: CART_ACTIONS.SYNC_WITH_SERVER,
            payload: { items: transformedItems }
          });
        }
      } catch (error) {
        console.error('Erro ao remover item do carrinho do servidor:', error);
        dispatch({
          type: CART_ACTIONS.REMOVE_ITEM,
          payload: { productId }
        });
      }
    } else {
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM,
        payload: { productId }
      });
    }
  }, [state.isLoggedIn, state.isServerCartLoaded]);

  const updateItemQuantity = useCallback(async (productId, quantity) => {
    if (state.isLoggedIn && state.isServerCartLoaded) {
      try {
        const result = await cartService.updateCartItem(productId, quantity);
        if (result.success && result.cart) {
          const transformedItems = transformBackendCartItems(result.cart.itens || result.cart.items || []);
          dispatch({
            type: CART_ACTIONS.SYNC_WITH_SERVER,
            payload: { items: transformedItems }
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar quantidade no carrinho do servidor:', error);
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY,
          payload: { productId, quantity }
        });
      }
    } else {
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY,
        payload: { productId, quantity }
      });
    }
  }, [state.isLoggedIn, state.isServerCartLoaded]);

  const clearCartItems = useCallback(async () => {
    if (state.isLoggedIn && state.isServerCartLoaded) {
      try {
        const result = await cartService.clearCart();
        if (result.success) {
          dispatch({
            type: CART_ACTIONS.SYNC_WITH_SERVER,
            payload: { items: [] }
          });
        }
      } catch (error) {
        console.error('Erro ao limpar carrinho do servidor:', error);
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
      }
    } else {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [state.isLoggedIn, state.isServerCartLoaded]);

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
    isLoggedIn: state.isLoggedIn,
    isServerCartLoaded: state.isServerCartLoaded,
    isSyncing: state.isSyncing,

    // Ações
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    updateQuantity: updateItemQuantity,
    clearCart: clearCartItems,
    openCart,
    closeCart,
    checkout,

    // Ações de autenticação (para integração com sistema de login)
    handleUserLogin,
    handleUserLogout,

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