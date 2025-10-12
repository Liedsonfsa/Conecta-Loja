import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável pelas operações de banco de dados relacionadas ao carrinho
 */
export class CartRepository {
  /**
   * Cria ou retorna o carrinho ativo de um usuário
   *
   * @param usuarioId - ID do usuário
   * @returns Promise com o carrinho encontrado/criado
   */
  static async getOrCreateCartByUserId(usuarioId: number) {
    // Tenta encontrar carrinho existente
    let cart = await prisma.carrinho.findUnique({
      where: { usuarioId },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });

    // Se não existe, cria um novo
    if (!cart) {
      cart = await prisma.carrinho.create({
        data: {
          usuarioId
        },
        include: {
          itens: {
            include: {
              produto: true
            }
          }
        }
      });
    }

    return cart;
  }

  /**
   * Busca o carrinho de um usuário por ID
   *
   * @param usuarioId - ID do usuário
   * @returns Promise com o carrinho ou null
   */
  static async findCartByUserId(usuarioId: number) {
    return await prisma.carrinho.findUnique({
      where: { usuarioId },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  /**
   * Adiciona ou atualiza um item no carrinho
   *
   * @param carrinhoId - ID do carrinho
   * @param produtoId - ID do produto
   * @param quantidade - Quantidade a adicionar
   * @returns Promise com o item do carrinho
   */
  static async addOrUpdateCartItem(carrinhoId: number, produtoId: number, quantidade: number) {
    return await prisma.carrinho_produto.upsert({
      where: {
        carrinhoId_produtoId: {
          carrinhoId,
          produtoId
        }
      },
      update: {
        quantidade: {
          increment: quantidade
        }
      },
      create: {
        carrinhoId,
        produtoId,
        quantidade
      },
      include: {
        produto: true
      }
    });
  }

  /**
   * Atualiza a quantidade de um item no carrinho
   *
   * @param carrinhoId - ID do carrinho
   * @param produtoId - ID do produto
   * @param quantidade - Nova quantidade
   * @returns Promise com o item atualizado
   */
  static async updateCartItemQuantity(carrinhoId: number, produtoId: number, quantidade: number) {
    if (quantidade <= 0) {
      // Remove o item se quantidade for 0 ou negativa
      return await this.removeCartItem(carrinhoId, produtoId);
    }

    return await prisma.carrinho_produto.update({
      where: {
        carrinhoId_produtoId: {
          carrinhoId,
          produtoId
        }
      },
      data: {
        quantidade
      },
      include: {
        produto: true
      }
    });
  }

  /**
   * Remove um item do carrinho
   *
   * @param carrinhoId - ID do carrinho
   * @param produtoId - ID do produto
   * @returns Promise com o item removido
   */
  static async removeCartItem(carrinhoId: number, produtoId: number) {
    return await prisma.carrinho_produto.delete({
      where: {
        carrinhoId_produtoId: {
          carrinhoId,
          produtoId
        }
      },
      include: {
        produto: true
      }
    });
  }

  /**
   * Limpa todos os itens do carrinho
   *
   * @param carrinhoId - ID do carrinho
   * @returns Promise com o resultado da operação
   */
  static async clearCart(carrinhoId: number) {
    return await prisma.carrinho_produto.deleteMany({
      where: {
        carrinhoId
      }
    });
  }

  /**
   * Remove o carrinho de um usuário
   *
   * @param usuarioId - ID do usuário
   * @returns Promise com o carrinho removido
   */
  static async deleteCartByUserId(usuarioId: number) {
    return await prisma.carrinho.delete({
      where: { usuarioId }
    });
  }

  /**
   * Calcula o total do carrinho
   *
   * @param carrinhoId - ID do carrinho
   * @returns Promise com o total calculado
   */
  static async calculateCartTotal(carrinhoId: number) {
    const items = await prisma.carrinho_produto.findMany({
      where: { carrinhoId },
      include: {
        produto: true
      }
    });

    let total = 0;
    for (const item of items) {
      const basePrice = Number(item.produto.price);
      const discountValue = item.produto.discount ? Number(item.produto.discount) : 0;

      const price = item.produto.discount
        ? item.produto.discountType === 'PERCENTAGE'
          ? basePrice * (1 - discountValue / 100)
          : basePrice - discountValue
        : basePrice;

      total += price * item.quantidade;
    }

    return total;
  }
}
