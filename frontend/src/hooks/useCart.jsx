import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { cartService, orderService } from '@/api';
import { useAuth } from './use-auth.js';
import { useToast } from './use-toast.js';

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

/**
 * Reducer para gerenciar o estado do carrinho de compras
 *
 * @param {Object} state - Estado atual do carrinho
 * @param {Object} action - Ação a ser executada
 * @param {string} action.type - Tipo da ação
 * @param {*} action.payload - Dados da ação
 * @returns {Object} Novo estado do carrinho
 *
 * @example
 * // Adicionar item
 * cartReducer(state, { type: 'ADD_ITEM', payload: { product, quantity: 1 } });
 *
 * // Atualizar quantidade
 * cartReducer(state, { type: 'UPDATE_QUANTITY', payload: { productId: 1, quantity: 3 } });
 */
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
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Ref para controlar timeouts de debounce por produto
  const serverUpdateTimeoutsRef = useRef(new Map()); // Timeouts por productId

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
   * Adiciona um item ao carrinho (versão síncrona local)
   *
   * @param {Object} product - Produto a ser adicionado
   * @param {Object} product.id - ID único do produto
   * @param {string} product.name - Nome do produto
   * @param {number} product.price - Preço do produto
   * @param {string} product.image - URL da imagem do produto
   * @param {string} product.description - Descrição do produto
   * @param {number} [quantity=1] - Quantidade a adicionar (padrão: 1)
   * @returns {void}
   *
   * @example
   * const product = { id: 1, name: "Produto A", price: 10.99 };
   * addItem(product, 2); // Adiciona 2 unidades
   */
  const addItem = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  };

  /**
   * Remove um item específico do carrinho (versão síncrona local)
   *
   * @param {string|number} productId - ID único do produto a ser removido
   * @returns {void}
   *
   * @example
   * removeItem(1); // Remove o produto com ID 1
   * removeItem("abc-123"); // Remove o produto com ID string
   */
  const removeItem = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId }
    });
  };

  /**
   * Atualiza a quantidade de um item no carrinho (versão síncrona local)
   *
   * @param {string|number} productId - ID único do produto
   * @param {number} quantity - Nova quantidade desejada
   * @returns {void}
   *
   * @example
   * updateQuantity(1, 5); // Define quantidade do produto 1 para 5
   * updateQuantity("abc-123", 0); // Remove o produto (quantidade 0)
   */
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  };

  /**
   * Limpa todos os itens do carrinho (versão síncrona local)
   *
   * @returns {void}
   *
   * @example
   * clearCart(); // Remove todos os itens do carrinho
   */
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  /**
   * Abre o sidebar/modal do carrinho
   *
   * @returns {void}
   *
   * @example
   * openCart(); // Exibe o carrinho lateral/dropdown
   */
  const openCart = () => {
    setIsCartOpen(true);
  };

  /**
   * Fecha o sidebar/modal do carrinho
   *
   * @returns {void}
   *
   * @example
   * closeCart(); // Oculta o carrinho lateral/dropdown
   */
  const closeCart = () => {
    setIsCartOpen(false);
  };

  /**
   * Sincroniza carrinho local com servidor quando usuário faz login
   *
   * Estratégia:
   * 1. Se há itens no localStorage → sincroniza com servidor (merge)
   * 2. Se não há itens locais → carrega carrinho do servidor
   * 3. Em caso de erro → mantém estado local
   *
   * @returns {Promise<void>}
   *
   * @example
   * await syncCartWithServer(); // Sincroniza automaticamente baseado no contexto
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
   * Manipula o login do usuário no contexto do carrinho
   *
   * Define o estado como logado e inicia a sincronização automática
   * do carrinho local com o servidor.
   *
   * @returns {void}
   *
   * @example
   * handleUserLogin(); // Chamado automaticamente quando usuário faz login
   */
  const handleUserLogin = useCallback(() => {
    // Define usuário como logado e inicia sincronização
    syncCartWithServer();
  }, [syncCartWithServer]);

  /**
   * Manipula o logout do usuário no contexto do carrinho
   *
   * Limpa o estado do carrinho da interface e remove dados locais,
   * mantendo os dados salvos no servidor para o próximo login.
   *
   * @returns {void}
   *
   * @example
   * handleUserLogout(); // Chamado automaticamente quando usuário faz logout
   */
  const handleUserLogout = useCallback(() => {
    dispatch({ type: CART_ACTIONS.SET_USER_LOGGED_OUT });

    // Limpa localStorage
    localStorage.removeItem('conecta-loja-cart');
  }, []);

  /**
   * Adiciona um item ao carrinho (com sincronização automática)
   *
   * Estratégia híbrida:
   * - Usuário logado: Usa API do servidor diretamente
   * - Usuário não logado: Usa localStorage
   * - Fallback: Em caso de erro na API, usa localStorage
   *
   * @param {Object} product - Produto a ser adicionado
   * @param {Object} product.id - ID único do produto
   * @param {string} product.name - Nome do produto
   * @param {number} product.price - Preço do produto
   * @param {string} product.image - URL da imagem do produto
   * @param {string} product.description - Descrição do produto
   * @param {number} [quantity=1] - Quantidade a adicionar (padrão: 1)
   * @returns {Promise<void>}
   *
   * @example
   * const product = { id: 1, name: "Produto A", price: 10.99 };
   * await addItemToCart(product, 2); // Adiciona 2 unidades
   */
  const addItemToCart = useCallback(async (product, quantity = 1) => {
    if (state.isLoggedIn) {
      // Se usuário está logado, SEMPRE usa API (mesmo se carrinho ainda não foi carregado)
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
      // Se não está logado, usa localStorage
      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: { product, quantity }
      });
    }
  }, [state.isLoggedIn]);

  /**
   * Remove um item específico do carrinho (com sincronização automática)
   *
   * Estratégia híbrida:
   * - Usuário logado: Usa API do servidor diretamente
   * - Usuário não logado: Usa localStorage
   * - Fallback: Em caso de erro na API, usa localStorage
   *
   * @param {string|number} productId - ID único do produto a ser removido
   * @returns {Promise<void>}
   *
   * @example
   * await removeItemFromCart(1); // Remove o produto com ID 1
   * await removeItemFromCart("abc-123"); // Remove o produto com ID string
   */
  const removeItemFromCart = useCallback(async (productId) => {
    if (state.isLoggedIn) {
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
  }, [state.isLoggedIn]);

  /**
   * Atualiza a quantidade de um item no carrinho (com debounce e sincronização)
   *
   * Estratégia híbrida com otimização:
   * - Update otimista: Interface responde instantaneamente
   * - Debounce por produto: Evita requisições excessivas (300ms)
   * - Sincronização background: Atualiza servidor após pausa
   * - Fallback: Em caso de erro na API, mantém estado local
   *
   * @param {string|number} productId - ID único do produto
   * @param {number} quantity - Nova quantidade desejada
   * @returns {void}
   *
   * @example
   * updateItemQuantity(1, 5); // Atualiza produto 1 para quantidade 5
   * updateItemQuantity("abc-123", 0); // Remove produto (quantidade 0)
   */
  const updateItemQuantity = useCallback((productId, quantity) => {
    // Atualiza localmente primeiro (update otimista)
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });

    // Se estiver logado, sincroniza com servidor em background com debounce por produto
    if (state.isLoggedIn) {
      // Cancela timeout anterior para este produto específico
      const existingTimeout = serverUpdateTimeoutsRef.current.get(productId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Cria novo timeout específico para este produto
      const newTimeout = setTimeout(async () => {
        try {
          // Remove este timeout da lista
          serverUpdateTimeoutsRef.current.delete(productId);

          // Processa apenas este produto específico
          const result = await cartService.updateCartItem(productId, quantity);
          if (result.success && result.cart) {
            const transformedItems = transformBackendCartItems(result.cart.itens || result.cart.items || []);
            dispatch({
              type: CART_ACTIONS.SYNC_WITH_SERVER,
              payload: { items: transformedItems }
            });
          }
        } catch (error) {
          console.error(`Erro ao atualizar quantidade do produto ${productId} no carrinho do servidor:`, error);
          // Em caso de erro, o estado local já foi atualizado, então não precisa fazer rollback
        }
      }, 300); // 300ms de debounce por produto

      // Armazena o timeout para este produto
      serverUpdateTimeoutsRef.current.set(productId, newTimeout);
    }
  }, [state.isLoggedIn]);

  /**
   * Limpa todos os itens do carrinho (com sincronização automática)
   *
   * Estratégia híbrida:
   * - Usuário logado: Usa API do servidor diretamente
   * - Usuário não logado: Usa localStorage
   * - Fallback: Em caso de erro na API, usa localStorage
   *
   * @returns {Promise<void>}
   *
   * @example
   * await clearCartItems(); // Remove todos os itens do carrinho
   */
  const clearCartItems = useCallback(async () => {
    if (state.isLoggedIn) {
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
  }, [state.isLoggedIn]);

  /**
   * Gera mensagem formatada para WhatsApp com todos os itens do carrinho
   *
   * Formato da mensagem:
   * - Cabeçalho com nome da loja
   * - Lista numerada de produtos (nome, quantidade, preço unitário, subtotal)
   * - Total final
   * - Mensagem de finalização
   *
   * @returns {string} Mensagem completa formatada para WhatsApp
   *
   * @example
   * const message = generateWhatsAppMessage();
   * // "*🛒 Pedido - Conecta Loja*\n\n*1.* Produto A\n   Qtd: 2x\n   Valor: R$ 10,99\n   Subtotal: R$ 21,98\n\n*💰 Total: R$ 21,98*\n\nGostaria de finalizar este pedido! 😊"
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
   * Formata preço numérico para moeda brasileira (BRL)
   *
   * Converte qualquer formato de preço para a formatação padrão brasileira
   * com símbolo de moeda e separadores corretos.
   *
   * @param {number|string} price - Preço a ser formatado
   * @returns {string} Preço formatado em reais (ex: "R$ 1.299,99")
   *
   * @example
   * formatPrice(1299.99); // "R$ 1.299,99"
   * formatPrice("1299.99"); // "R$ 1.299,99"
   * formatPrice(100); // "R$ 100,00"
   */
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'number' ? price : parseFloat(price.toString().replace(/[^\d,.-]/g, '').replace(',', '.'));
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericPrice);
  };

  /**
   * Finaliza o pedido criando uma ordem no backend
   *
   * Cria um novo pedido no sistema com todos os itens do carrinho.
   * O usuário deve estar logado para realizar esta operação.
   *
   * @returns {Promise<void>}
   *
   * @example
   * await checkout(); // Cria pedido no backend
   */
  const checkout = useCallback(async () => {
    if (!user || !user.id) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para finalizar o pedido!',
        variant: 'destructive'
      });
      return;
    }

    if (state.items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar o pedido!',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Formatar os produtos do carrinho para o formato esperado pela API
      const produtos = state.items.map(item => ({
        produtoId: item.product.id,
        quantidade: item.quantity,
        precoUnitario: item.product.price
      }));

      // Calcular o preço total
      const precoTotal = state.items.reduce((total, item) =>
        total + (item.product.price * item.quantity), 0
      );

      // Criar o pedido
      const orderData = {
        usuarioId: user.id,
        produtos: produtos,
        precoTotal: precoTotal,
        status: 'RECEBIDO'
      };

      const result = await orderService.createOrder(orderData);

      if (result.success) {
        // Limpar o carrinho após pedido criado com sucesso
        dispatch({ type: CART_ACTIONS.CLEAR_CART });

        // Fechar o carrinho
        closeCart();

        toast({
          title: 'Pedido realizado!',
          description: 'Seu pedido foi criado com sucesso. Em breve entraremos em contato.',
          variant: 'default'
        });
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
    }
  }, [user, state.items, closeCart, toast]);

  // Calcula totais
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Cleanup dos timeouts quando componente desmonta
  useEffect(() => {
    return () => {
      // Limpa todos os timeouts ativos
      for (const timeout of serverUpdateTimeoutsRef.current.values()) {
        clearTimeout(timeout);
      }
      serverUpdateTimeoutsRef.current.clear();
    };
  }, []);

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
 * Hook personalizado para acessar o contexto do carrinho de compras
 *
 * Fornece acesso completo ao estado e ações do carrinho, incluindo:
 * - Estado atual (itens, totais, status de autenticação)
 * - Ações principais (adicionar, remover, atualizar, limpar)
 * - Utilitários (formatação de preço, checkout)
 * - Callbacks de autenticação (para integração com sistema de login)
 *
 * @returns {Object} Contexto completo do carrinho
 * @returns {Array} returns.items - Itens atuais do carrinho
 * @returns {number} returns.totalItems - Total de itens no carrinho
 * @returns {number} returns.totalPrice - Preço total do carrinho
 * @returns {boolean} returns.isCartOpen - Se o carrinho está aberto
 * @returns {boolean} returns.isLoggedIn - Se usuário está autenticado
 * @returns {boolean} returns.isServerCartLoaded - Se carrinho do servidor foi carregado
 * @returns {boolean} returns.isSyncing - Se está sincronizando com servidor
 * @returns {Function} returns.addItem - Adiciona item ao carrinho
 * @returns {Function} returns.removeItem - Remove item do carrinho
 * @returns {Function} returns.updateQuantity - Atualiza quantidade
 * @returns {Function} returns.clearCart - Limpa carrinho
 * @returns {Function} returns.openCart - Abre carrinho
 * @returns {Function} returns.closeCart - Fecha carrinho
 * @returns {Function} returns.checkout - Finaliza pedido
 * @returns {Function} returns.handleUserLogin - Callback de login
 * @returns {Function} returns.handleUserLogout - Callback de logout
 * @returns {Function} returns.formatPrice - Formata preços
 *
 * @throws {Error} Quando usado fora de um CartProvider
 *
 * @example
 * const {
 *   items,
 *   totalItems,
 *   totalPrice,
 *   addItem,
 *   removeItem,
 *   updateQuantity,
 *   clearCart
 * } = useCart();
 *
 * // Adicionar produto
 * addItem(product, 2);
 *
 * // Atualizar quantidade
 * updateQuantity(1, 5);
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export default CartContext;