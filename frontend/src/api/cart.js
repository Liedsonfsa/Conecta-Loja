/**
 * Serviço de API para operações de carrinho de compras
 *
 * Este arquivo contém todas as funções necessárias para interagir com
 * a API de carrinho no backend, incluindo operações CRUD completas.
 *
 * Todas as funções requerem autenticação (JWT token)
 */

import api from "./config";

/**
 * Serviço de carrinho de compras
 */
export const cartService = {
  /**
   * Busca o carrinho do usuário autenticado
   *
   * @returns {Promise} Resposta da API com dados do carrinho
   * @throws {Error} Erro de autenticação ou servidor
   */
  async getCart() {
    try {
      const response = await api.get("/cart");

      if (response.data.success) {
        return {
          success: true,
          cart: response.data.cart,
        };
      } else {
        throw new Error(response.data.error || "Erro ao buscar carrinho");
      }
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);

      // Se erro de autenticação, limpa token e retorna erro específico
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      throw error;
    }
  },

  /**
   * Adiciona um produto ao carrinho
   *
   * @param {number} produtoId - ID do produto a ser adicionado
   * @param {number} quantidade - Quantidade do produto (padrão: 1)
   * @returns {Promise} Resposta da API com carrinho atualizado
   * @throws {Error} Erro de validação ou servidor
   */
  async addToCart(produtoId, quantidade = 1) {
    try {
      const response = await api.post("/cart/items", {
        produtoId,
        quantidade,
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          cart: response.data.cart,
        };
      } else {
        throw new Error(
          response.data.error || "Erro ao adicionar produto ao carrinho"
        );
      }
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      throw error;
    }
  },

  /**
   * Atualiza a quantidade de um item no carrinho
   *
   * @param {number} produtoId - ID do produto
   * @param {number} quantidade - Nova quantidade (0 para remover)
   * @returns {Promise} Resposta da API com carrinho atualizado
   * @throws {Error} Erro de validação ou servidor
   */
  async updateCartItem(produtoId, quantidade) {
    try {
      const response = await api.put("/cart/items", {
        produtoId,
        quantidade,
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          cart: response.data.cart,
        };
      } else {
        throw new Error(
          response.data.error || "Erro ao atualizar item do carrinho"
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar item do carrinho:", error);
      throw error;
    }
  },

  /**
   * Remove um item específico do carrinho
   *
   * @param {number} produtoId - ID do produto a ser removido
   * @returns {Promise} Resposta da API com carrinho atualizado
   * @throws {Error} Erro de validação ou servidor
   */
  async removeFromCart(produtoId) {
    try {
      const response = await api.delete(`/cart/items/${produtoId}`);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          cart: response.data.cart,
        };
      } else {
        throw new Error(
          response.data.error || "Erro ao remover item do carrinho"
        );
      }
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      throw error;
    }
  },

  /**
   * Limpa todos os itens do carrinho
   *
   * @returns {Promise} Resposta da API confirmando limpeza
   * @throws {Error} Erro de autenticação ou servidor
   */
  async clearCart() {
    try {
      const response = await api.delete("/cart");

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          ...response.data,
        };
      } else {
        throw new Error(response.data.error || "Erro ao limpar carrinho");
      }
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      throw error;
    }
  },

  /**
   * Sincroniza carrinho local com o servidor (merge)
   *
   * Esta função é usada quando um usuário faz login e possui
   * itens no carrinho local (localStorage) que precisam ser
   * sincronizados com o carrinho do servidor.
   *
   * @param {Array} localCartItems - Itens do carrinho local
   * @returns {Promise} Resposta da API com carrinho sincronizado
   * @throws {Error} Erro de autenticação ou servidor
   */
  async syncLocalCart(localCartItems) {
    try {
      // Para cada item do carrinho local, adiciona ao servidor
      // O backend já faz o merge (soma quantidades se item já existe)
      for (const item of localCartItems) {
        try {
          await this.addToCart(item.product.id, item.quantity);
        } catch (syncError) {
          console.warn(
            `Erro ao sincronizar item ${item.product.id}:`,
            syncError.message
          );
          // Continua tentando sincronizar outros itens mesmo se um falhar
        }
      }

      // Retorna o carrinho atualizado após sincronização
      return await this.getCart();
    } catch (error) {
      console.error("Erro geral na sincronização:", error);
      throw error;
    }
  },
};

export default cartService;
