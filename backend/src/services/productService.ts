import { ProductRepository } from '../repositories/productRepository';
import { CategoryRepository } from '../repositories/categoryRepository';

/**
 * Serviço responsável pelas regras de negócio relacionadas a produtos
 */
export class ProductService {
  /**
   * Cria um novo produto no banco de dados
   *
   * @param data - Dados do produto a ser criado
   * @param data.name - Nome do produto
   * @param data.description - Descrição do produto
   * @param data.price - Preço do produto
   * @param data.categoryId - ID da categoria do produto
   * @param data.available - Disponibilidade do produto (opcional, padrão: true)
   * @param data.estoque - Quantidade em estoque (opcional, padrão: 0)
   * @param data.image - URL da imagem do produto (opcional)
   * @param data.discount - Valor do desconto (opcional)
   * @param data.discountType - Tipo do desconto (opcional)
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
    try {
      // Validações básicas
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Nome do produto é obrigatório');
      }

      if (!data.description || data.description.trim().length === 0) {
        throw new Error('Descrição do produto é obrigatória');
      }

      if (data.price === undefined || data.price < 0) {
        throw new Error('Preço do produto deve ser um valor positivo');
      }

      if (data.estoque !== undefined && data.estoque < 0) {
        throw new Error('Estoque do produto não pode ser negativo');
      }

      // Verificar se a categoria existe
      const category = await CategoryRepository.findCategoryById(data.categoryId);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      // Validações de desconto
      if (data.discount !== undefined) {
        if (data.discount < 0) {
          throw new Error('Valor do desconto não pode ser negativo');
        }

        if (!data.discountType) {
          throw new Error('Tipo do desconto é obrigatório quando desconto é fornecido');
        }

        if (data.discountType === 'PERCENTAGE' && data.discount > 100) {
          throw new Error('Desconto percentual não pode exceder 100%');
        }

        if (data.discountType === 'FIXED_VALUE' && data.discount > data.price) {
          throw new Error('Desconto fixo não pode ser maior que o preço do produto');
        }
      }

      // Criar produto
      const product = await ProductRepository.createProduct(data);

      // Atualizar contadores da categoria
      await CategoryRepository.updateCategoryCounters(data.categoryId);

      return product;
    } catch (error) {
      // Re-throw para manter o tipo de erro
      throw error;
    }
  }

  /**
   * Busca um produto pelo ID
   *
   * @param id - ID do produto
   * @returns Promise com o produto encontrado
   */
  static async getProductById(id: number) {
    try {
      const product = await ProductRepository.findProductById(id);
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca todos os produtos com paginação e filtros
   *
   * @param options - Opções de busca
   * @returns Promise com produtos e metadados de paginação
   */
  static async getAllProducts(options?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    available?: boolean;
    search?: string;
  }) {
    try {
      const { page = 1, limit = 10, categoryId, available, search } = options || {};

      // Construir filtros
      const where: any = {};

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (available !== undefined) {
        where.available = available;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        ProductRepository.findAllProducts({ skip, take: limit, where }),
        ProductRepository.countProducts(where),
      ]);

      return {
        products,
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
   * Busca produtos disponíveis
   *
   * @returns Promise com produtos disponíveis
   */
  static async getAvailableProducts() {
    try {
      return await ProductRepository.findAvailableProducts();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza um produto existente
   *
   * @param id - ID do produto a ser atualizado
   * @param data - Dados a serem atualizados
   * @param data.estoque - Quantidade em estoque (opcional)
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
    try {
      // Verificar se o produto existe
      const existingProduct = await ProductRepository.findProductById(id);
      if (!existingProduct) {
        throw new Error('Produto não encontrado');
      }

      // Validações básicas se campos obrigatórios forem fornecidos
      if (data.name !== undefined && (!data.name || data.name.trim().length === 0)) {
        throw new Error('Nome do produto não pode ser vazio');
      }

      if (data.description !== undefined && (!data.description || data.description.trim().length === 0)) {
        throw new Error('Descrição do produto não pode ser vazia');
      }

      if (data.price !== undefined && data.price < 0) {
        throw new Error('Preço do produto deve ser um valor positivo');
      }

      if (data.estoque !== undefined && data.estoque < 0) {
        throw new Error('Estoque do produto não pode ser negativo');
      }

      // Verificar se a categoria existe se categoryId for fornecido
      if (data.categoryId !== undefined) {
        const category = await CategoryRepository.findCategoryById(data.categoryId);
        if (!category) {
          throw new Error('Categoria não encontrada');
        }
      }

      // Validações de desconto
      if (data.discount !== undefined) {
        const priceToCheck = data.price !== undefined ? data.price : existingProduct.price;

        if (data.discount < 0) {
          throw new Error('Valor do desconto não pode ser negativo');
        }

        if (!data.discountType && !existingProduct.discountType) {
          throw new Error('Tipo do desconto é obrigatório quando desconto é fornecido');
        }

        const discountType = data.discountType || existingProduct.discountType;
        if (discountType === 'PERCENTAGE' && data.discount > 100) {
          throw new Error('Desconto percentual não pode exceder 100%');
        }

        if (discountType === 'FIXED_VALUE' && data.discount > Number(priceToCheck)) {
          throw new Error('Desconto fixo não pode ser maior que o preço do produto');
        }
      }

      // Atualizar produto
      const updatedProduct = await ProductRepository.updateProduct(id, data);

      // Atualizar contadores da categoria se categoryId mudou
      const categoryIdToUpdate = data.categoryId || existingProduct.categoryId;
      await CategoryRepository.updateCategoryCounters(categoryIdToUpdate);

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove um produto do banco de dados
   *
   * @param id - ID do produto a ser removido
   * @returns Promise com confirmação de remoção
   */
  static async deleteProduct(id: number) {
    try {
      // Verificar se o produto existe
      const product = await ProductRepository.findProductById(id);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      // Verificar se o produto está sendo usado em pedidos
      // Nota: Esta verificação pode ser removida se quisermos permitir exclusão
      // mesmo com pedidos existentes (cascade delete)

      // Remover produto
      await ProductRepository.deleteProduct(id);

      // Atualizar contadores da categoria
      await CategoryRepository.updateCategoryCounters(product.categoryId);

      return { message: 'Produto removido com sucesso' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Calcula o preço final de um produto considerando desconto
   *
   * @param product - Produto com dados de preço e desconto
   * @returns Preço final calculado
   */
  static calculateFinalPrice(product: {
    price: number;
    discount?: number | null;
    discountType?: 'PERCENTAGE' | 'FIXED_VALUE' | null;
  }): number {
    const { price, discount, discountType } = product;

    if (!discount || !discountType) {
      return Number(price);
    }

    if (discountType === 'PERCENTAGE') {
      return Number(price) * (1 - discount / 100);
    } else if (discountType === 'FIXED_VALUE') {
      return Math.max(0, Number(price) - discount);
    }

    return Number(price);
  }
}
