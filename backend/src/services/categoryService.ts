import { CategoryRepository } from '../repositories/categoryRepository';

/**
 * Serviço responsável pelas regras de negócio relacionadas a categorias
 */
export class CategoryService {
  /**
   * Cria uma nova categoria no banco de dados
   *
   * @param data - Dados da categoria a ser criada
   * @param data.name - Nome da categoria
   * @returns Promise com a categoria criada
   */
  static async createCategory(data: {
    name: string;
  }) {
    try {
      // Validações básicas
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Nome da categoria é obrigatório');
      }

      // Verificar se já existe uma categoria com este nome
      const existingCategory = await CategoryRepository.findCategoryByName(data.name.trim());
      if (existingCategory) {
        throw new Error('Já existe uma categoria com este nome');
      }

      // Criar categoria
      const category = await CategoryRepository.createCategory({
        name: data.name.trim(),
      });

      return category;
    } catch (error) {
      // Re-throw para manter o tipo de erro
      throw error;
    }
  }

  /**
   * Busca uma categoria pelo ID
   *
   * @param id - ID da categoria
   * @returns Promise com a categoria encontrada
   */
  static async getCategoryById(id: number) {
    try {
      const category = await CategoryRepository.findCategoryById(id);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca uma categoria pelo nome
   *
   * @param name - Nome da categoria
   * @returns Promise com a categoria encontrada
   */
  static async getCategoryByName(name: string) {
    try {
      const category = await CategoryRepository.findCategoryByName(name);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca todas as categorias com paginação e filtros
   *
   * @param options - Opções de busca
   * @returns Promise com categorias e metadados de paginação
   */
  static async getAllCategories(options?: {
    page?: number;
    limit?: number;
    search?: string;
    includeProducts?: boolean;
  }) {
    try {
      const { page = 1, limit = 10, search, includeProducts = false } = options || {};

      // Construir filtros
      const where: any = {};

      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }

      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        CategoryRepository.findAllCategories({ skip, take: limit, where, includeProducts }),
        CategoryRepository.countCategories(where),
      ]);

      return {
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
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
    try {
      // Verificar se a categoria existe
      const existingCategory = await CategoryRepository.findCategoryById(id);
      if (!existingCategory) {
        throw new Error('Categoria não encontrada');
      }

      // Validações se o nome for fornecido
      if (data.name !== undefined) {
        if (!data.name || data.name.trim().length === 0) {
          throw new Error('Nome da categoria não pode ser vazio');
        }

        // Verificar se já existe outra categoria com este nome
        const categoryWithSameName = await CategoryRepository.findCategoryByName(data.name.trim());
        if (categoryWithSameName && categoryWithSameName.id !== id) {
          throw new Error('Já existe outra categoria com este nome');
        }
      }

      // Atualizar categoria
      const updatedCategory = await CategoryRepository.updateCategory(id, {
        name: data.name?.trim(),
      });

      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove uma categoria do banco de dados
   *
   * @param id - ID da categoria a ser removida
   * @returns Promise com confirmação de remoção
   */
  static async deleteCategory(id: number) {
    try {
      // Verificar se a categoria existe
      const category = await CategoryRepository.findCategoryById(id);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      // Verificar se a categoria tem produtos associados
      if (category.products && category.products.length > 0) {
        throw new Error('Não é possível excluir uma categoria que possui produtos associados');
      }

      // Remover categoria
      await CategoryRepository.deleteCategory(id);

      return { message: 'Categoria removida com sucesso' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza os contadores de produtos de uma categoria
   *
   * @param categoryId - ID da categoria
   * @returns Promise com a categoria atualizada
   */
  static async updateCategoryCounters(categoryId: number) {
    try {
      return await CategoryRepository.updateCategoryCounters(categoryId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca estatísticas das categorias
   *
   * @returns Promise com estatísticas das categorias
   */
  static async getCategoryStats() {
    try {
      const categories = await CategoryRepository.findAllCategories({
        includeProducts: true
      });

      const stats = {
        totalCategories: categories.length,
        totalActiveProducts: categories.reduce((sum, cat) => sum + cat.activeProducts, 0),
        totalValue: categories.reduce((sum, cat) => sum + Number(cat.totalValue), 0),
        categoriesWithProducts: categories.filter(cat => cat.activeProducts > 0).length,
        categoriesWithoutProducts: categories.filter(cat => cat.activeProducts === 0).length,
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }
}
