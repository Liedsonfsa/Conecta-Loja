import { CartRepository } from '../repositories/cartRepository';
import { ProductRepository } from '../repositories/productRepository';

/**
 * Serviço responsável pelas regras de negócio relacionadas ao carrinho
 */
export class CartService {
  /**
   * Busca ou cria o carrinho de um usuário
   *
   * @param usuarioId - ID do usuário
   * @returns Promise com o carrinho
   */
  static async getOrCreateCart(usuarioId: number) {
    try {
      if (!usuarioId || usuarioId <= 0) {
        throw new Error('ID do usuário é obrigatório e deve ser um número positivo');
      }

      const cart = await CartRepository.getOrCreateCartByUserId(usuarioId);
      const total = await CartRepository.calculateCartTotal(cart.id);

      return {
        ...cart,
        total
      };
    } catch (error) {
      console.error('Erro ao buscar/criar carrinho:', error);
      throw error;
    }
  }

  /**
   * Busca o carrinho de um usuário
   *
   * @param usuarioId - ID do usuário
   * @returns Promise com o carrinho ou null
   */
  static async getCartByUserId(usuarioId: number) {
    try {
      if (!usuarioId || usuarioId <= 0) {
        throw new Error('ID do usuário é obrigatório e deve ser um número positivo');
      }

      const cart = await CartRepository.findCartByUserId(usuarioId);

      if (!cart) {
        return null;
      }

      const total = await CartRepository.calculateCartTotal(cart.id);

      return {
        ...cart,
        total
      };
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      throw error;
    }
  }

  /**
   * Adiciona um produto ao carrinho
   *
   * @param usuarioId - ID do usuário
   * @param produtoId - ID do produto
   * @param quantidade - Quantidade a adicionar (padrão: 1)
   * @returns Promise com o carrinho atualizado
   */
  static async addToCart(usuarioId: number, produtoId: number, quantidade: number = 1) {
    try {
      if (!usuarioId || usuarioId <= 0) {
        throw new Error('ID do usuário é obrigatório e deve ser um número positivo');
      }

      if (!produtoId || produtoId <= 0) {
        throw new Error('ID do produto é obrigatório e deve ser um número positivo');
      }

      if (quantidade <= 0) {
        throw new Error('Quantidade deve ser um número positivo');
      }

      // Verifica se o produto existe e está disponível
      const product = await ProductRepository.findProductById(produtoId);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      if (!product.available) {
        throw new Error('Produto não está disponível para compra');
      }

      // Verifica estoque se aplicável
      if (product.estoque !== undefined && product.estoque < quantidade) {
        throw new Error(`Estoque insuficiente. Disponível: ${product.estoque}`);
      }

      // Busca ou cria o carrinho
      const cart = await CartRepository.getOrCreateCartByUserId(usuarioId);

      // Adiciona ou atualiza o item
      await CartRepository.addOrUpdateCartItem(cart.id, produtoId, quantidade);

      // Retorna o carrinho atualizado
      return await this.getOrCreateCart(usuarioId);
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      throw error;
    }
  }

  /**
   * Atualiza a quantidade de um item no carrinho
   *
   * @param usuarioId - ID do usuário
   * @param produtoId - ID do produto
   * @param quantidade - Nova quantidade
   * @returns Promise com o carrinho atualizado
   */
  static async updateCartItem(usuarioId: number, produtoId: number, quantidade: number) {
    try {
      if (!usuarioId || usuarioId <= 0) {
        throw new Error('ID do usuário é obrigatório e deve ser um número positivo');
      }

      if (!produtoId || produtoId <= 0) {
        throw new Error('ID do produto é obrigatório e deve ser um número positivo');
      }

      if (quantidade < 0) {
        throw new Error('Quantidade não pode ser negativa');
      }

      // Verifica se o carrinho existe
      const cart = await CartRepository.findCartByUserId(usuarioId);
      if (!cart) {
        throw new Error('Carrinho não encontrado');
      }

      // Se quantidade for 0, remove o item
      if (quantidade === 0) {
        await CartRepository.removeCartItem(cart.id, produtoId);
      } else {
        // Verifica se o produto existe e tem estoque
        const product = await ProductRepository.findProductById(produtoId);
        if (!product) {
          throw new Error('Produto não encontrado');
        }

        if (!product.available) {
          throw new Error('Produto não está disponível');
        }

        if (product.estoque !== undefined && product.estoque < quantidade) {
          throw new Error(`Estoque insuficiente. Disponível: ${product.estoque}`);
        }

        await CartRepository.updateCartItemQuantity(cart.id, produtoId, quantidade);
      }

      return await this.getCartByUserId(usuarioId);
    } catch (error) {
      console.error('Erro ao atualizar item do carrinho:', error);
      throw error;
    }
  }

  /**
   * Remove um item do carrinho
   *
   * @param usuarioId - ID do usuário
   * @param produtoId - ID do produto
   * @returns Promise com o carrinho atualizado
   */
  static async removeFromCart(usuarioId: number, produtoId: number) {
    try {
      if (!usuarioId || usuarioId <= 0) {
        throw new Error('ID do usuário é obrigatório e deve ser um número positivo');
      }

      if (!produtoId || produtoId <= 0) {
        throw new Error('ID do produto é obrigatório e deve ser um número positivo');
      }

      const cart = await CartRepository.findCartByUserId(usuarioId);
      if (!cart) {
        throw new Error('Carrinho não encontrado');
      }

      await CartRepository.removeCartItem(cart.id, produtoId);

      return await this.getCartByUserId(usuarioId);
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw error;
    }
  }

  /**
   * Limpa todos os itens do carrinho
   *
   * @param usuarioId - ID do usuário
   * @returns Promise com confirmação
   */
  static async clearCart(usuarioId: number) {
    try {
      if (!usuarioId || usuarioId <= 0) {
        throw new Error('ID do usuário é obrigatório e deve ser um número positivo');
      }

      const cart = await CartRepository.findCartByUserId(usuarioId);
      if (!cart) {
        throw new Error('Carrinho não encontrado');
      }

      await CartRepository.clearCart(cart.id);

      return { success: true, message: 'Carrinho limpo com sucesso' };
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  }

  /**
   * Remove o carrinho de um usuário
   *
   * @param usuarioId - ID do usuário
   * @returns Promise com confirmação
   */
  static async deleteCart(usuarioId: number) {
    try {
      if (!usuarioId || usuarioId <= 0) {
        throw new Error('ID do usuário é obrigatório e deve ser um número positivo');
      }

      await CartRepository.deleteCartByUserId(usuarioId);

      return { success: true, message: 'Carrinho removido com sucesso' };
    } catch (error) {
      console.error('Erro ao remover carrinho:', error);
      throw error;
    }
  }
}
