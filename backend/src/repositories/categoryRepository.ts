import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável pelas operações de banco de dados relacionadas a categorias
 */
export class CategoryRepository {
  /**
   * Cria uma nova categoria no banco de dados
   *
   * @param data - Dados da categoria a ser criada
   * @returns Promise com a categoria criada
   */
  static async createCategory(data: {
    name: string;
  }) {
    return await prisma.category.create({
      data: {
        name: data.name,
      },
      include: {
        products: true,
      },
    });
  }

  /**
   * Busca uma categoria pelo ID
   *
   * @param id - ID da categoria
   * @returns Promise com a categoria encontrada ou null
   */
  static async findCategoryById(id: number) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { available: true },
        },
      },
    });
  }

  /**
   * Busca uma categoria pelo nome
   *
   * @param name - Nome da categoria
   * @returns Promise com a categoria encontrada ou null
   */
  static async findCategoryByName(name: string) {
    return await prisma.category.findUnique({
      where: { name },
      include: {
        products: {
          where: { available: true },
        },
      },
    });
  }

  /**
   * Busca todas as categorias
   *
   * @param options - Opções de busca (paginação, filtros)
   * @returns Promise com array de categorias
   */
  static async findAllCategories(options?: {
    skip?: number;
    take?: number;
    where?: any;
    includeProducts?: boolean;
  }) {
    const { skip, take, where, includeProducts = false } = options || {};

    return await prisma.category.findMany({
      skip,
      take,
      where,
      include: includeProducts ? {
        products: {
          where: { available: true },
        },
      } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Atualiza uma categoria existente
   *
   * @param id - ID da categoria a ser atualizada
   * @param data - Dados a serem atualizados
   * @returns Promise com a categoria atualizada
   */
  static async updateCategory(id: number, data: {
    name?: string;
  }) {
    return await prisma.category.update({
      where: { id },
      data,
      include: {
        products: {
          where: { available: true },
        },
      },
    });
  }

  /**
   * Remove uma categoria do banco de dados
   *
   * @param id - ID da categoria a ser removida
   * @returns Promise com a categoria removida
   */
  static async deleteCategory(id: number) {
    return await prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Conta o número total de categorias
   *
   * @param where - Filtros opcionais
   * @returns Promise com o número de categorias
   */
  static async countCategories(where?: any) {
    return await prisma.category.count({ where });
  }

  /**
   * Atualiza os contadores de produtos ativos e valor total de uma categoria
   *
   * @param categoryId - ID da categoria
   * @returns Promise com a categoria atualizada
   */
  static async updateCategoryCounters(categoryId: number) {
    // Conta produtos ativos
    const activeProductsCount = await prisma.product.count({
      where: {
        categoryId,
        available: true,
      },
    });

    // Soma o valor total dos produtos ativos
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        available: true,
      },
      select: { price: true },
    });

    const totalValue = products.reduce((sum, product) => sum + Number(product.price), 0);

    return await prisma.category.update({
      where: { id: categoryId },
      data: {
        activeProducts: activeProductsCount,
        totalValue,
      },
    });
  }
}
