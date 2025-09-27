import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável pelas operações de banco de dados relacionadas a produtos
 */
export class ProductRepository {
  /**
   * Cria um novo produto no banco de dados
   *
   * @param data - Dados do produto a ser criado
   * @returns Promise com o produto criado
   */
  static async createProduct(data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    available?: boolean;
    estoque?: number;
    image?: string;
    discount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED_VALUE';
  }) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        available: data.available ?? true,
        estoque: data.estoque ?? 0,
        image: data.image,
        discount: data.discount,
        discountType: data.discountType,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Busca um produto pelo ID
   *
   * @param id - ID do produto
   * @returns Promise com o produto encontrado ou null
   */
  static async findProductById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  /**
   * Busca todos os produtos
   *
   * @param options - Opções de busca (paginação, filtros)
   * @returns Promise com array de produtos
   */
  static async findAllProducts(options?: {
    skip?: number;
    take?: number;
    where?: any;
    includeCategory?: boolean;
  }) {
    const { skip, take, where, includeCategory = true } = options || {};

    return await prisma.product.findMany({
      skip,
      take,
      where,
      include: includeCategory ? { category: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca produtos por categoria
   *
   * @param categoryId - ID da categoria
   * @returns Promise com array de produtos da categoria
   */
  static async findProductsByCategory(categoryId: number) {
    return await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Atualiza um produto existente
   *
   * @param id - ID do produto a ser atualizado
   * @param data - Dados a serem atualizados
   * @returns Promise com o produto atualizado
   */
  static async updateProduct(id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    available?: boolean;
    estoque?: number;
    image?: string;
    discount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED_VALUE';
  }) {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  /**
   * Remove um produto do banco de dados
   *
   * @param id - ID do produto a ser removido
   * @returns Promise com o produto removido
   */
  static async deleteProduct(id: number) {
    return await prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Conta o número total de produtos
   *
   * @param where - Filtros opcionais
   * @returns Promise com o número de produtos
   */
  static async countProducts(where?: any) {
    return await prisma.product.count({ where });
  }

  /**
   * Busca produtos disponíveis (available = true)
   *
   * @returns Promise com array de produtos disponíveis
   */
  static async findAvailableProducts() {
    return await prisma.product.findMany({
      where: { available: true },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
