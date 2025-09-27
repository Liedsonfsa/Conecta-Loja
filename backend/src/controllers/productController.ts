import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { getImagePath, imageExists } from '../middlewares/uploadMiddleware';
import fs from 'fs';
import path from 'path';

/**
 * Controller para operações CRUD de produtos
 */

/**
 * Cria um novo produto
 *
 * Recebe os dados do produto via body da requisição,
 * valida os dados, chama o serviço para criar o produto
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do produto no body
 * @param res - Resposta Express
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      product: product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);

    // Tratamento específico de erros
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('Nome do produto é obrigatório') ||
        errorMessage.includes('Descrição do produto é obrigatória') ||
        errorMessage.includes('Preço do produto deve ser um valor positivo') ||
        errorMessage.includes('Categoria não encontrada') ||
        errorMessage.includes('Valor do desconto não pode ser negativo') ||
        errorMessage.includes('Tipo do desconto é obrigatório') ||
        errorMessage.includes('Desconto percentual não pode exceder 100%') ||
        errorMessage.includes('Desconto fixo não pode ser maior que o preço')) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    // Erro genérico
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Busca um produto pelo ID
 *
 * @param req - Requisição Express com ID do produto nos parâmetros
 * @param res - Resposta Express
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const product = await ProductService.getProductById(productId);
    res.status(200).json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);

    if ((error as Error).message === 'Produto não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Busca todos os produtos com paginação e filtros
 *
 * @param req - Requisição Express com query parameters opcionais
 * @param res - Resposta Express
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page, limit, categoryId, available, search } = req.query;

    const options: any = {};

    if (page) {
      const pageNum = parseInt(page as string, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        options.page = pageNum;
      }
    }

    if (limit) {
      const limitNum = parseInt(limit as string, 10);
      if (!isNaN(limitNum) && limitNum > 0 && limitNum <= 100) {
        options.limit = limitNum;
      }
    }

    if (categoryId) {
      const catId = parseInt(categoryId as string, 10);
      if (!isNaN(catId)) {
        options.categoryId = catId;
      }
    }

    if (available !== undefined) {
      options.available = available === 'true';
    }

    if (search) {
      options.search = search as string;
    }

    const result = await ProductService.getAllProducts(options);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Busca apenas produtos disponíveis
 *
 * @param req - Requisição Express
 * @param res - Resposta Express
 */
export const getAvailableProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getAvailableProducts();
    res.status(200).json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Erro ao buscar produtos disponíveis:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Atualiza um produto existente
 *
 * @param req - Requisição Express com ID do produto nos parâmetros e dados no body
 * @param res - Resposta Express
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const product = await ProductService.updateProduct(productId, req.body);
    res.status(200).json({
      success: true,
      message: 'Produto atualizado com sucesso',
      product: product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Produto não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    if (errorMessage.includes('Nome do produto não pode ser vazio') ||
        errorMessage.includes('Descrição do produto não pode ser vazia') ||
        errorMessage.includes('Preço do produto deve ser um valor positivo') ||
        errorMessage.includes('Categoria não encontrada') ||
        errorMessage.includes('Valor do desconto não pode ser negativo') ||
        errorMessage.includes('Tipo do desconto é obrigatório') ||
        errorMessage.includes('Desconto percentual não pode exceder 100%') ||
        errorMessage.includes('Desconto fixo não pode ser maior que o preço')) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Remove um produto
 *
 * @param req - Requisição Express com ID do produto nos parâmetros
 * @param res - Resposta Express
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const result = await ProductService.deleteProduct(productId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erro ao remover produto:', error);

    if ((error as Error).message === 'Produto não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Faz upload de imagem para um produto
 *
 * @param req - Requisição Express com arquivo e ID do produto
 * @param res - Resposta Express
 */
export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    // Verificar se o produto existe
    const existingProduct = await ProductService.getProductById(productId);

    // Verificar se há arquivo na requisição
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhuma imagem foi enviada',
        code: 'NO_FILE_UPLOADED'
      });
    }

    const imagePath = getImagePath(req.file.filename);

    // Se o produto já tinha uma imagem, tentar removê-la
    if (existingProduct.image) {
      try {
        // Extrair apenas o nome do arquivo da URL/path antigo
        const oldImageName = path.basename(existingProduct.image);
        if (oldImageName && imageExists(oldImageName)) {
          const oldImagePath = path.join('uploads/products/', oldImageName);
          fs.unlinkSync(oldImagePath);
        }
      } catch (error) {
        console.warn('Erro ao remover imagem antiga:', error);
        // Não falha a operação se não conseguir remover a imagem antiga
      }
    }

    // Atualizar o produto com o novo caminho da imagem
    const updatedProduct = await ProductService.updateProduct(productId, {
      image: imagePath
    });

    res.status(200).json({
      success: true,
      message: 'Imagem do produto atualizada com sucesso',
      product: updatedProduct,
      imageUrl: `${req.protocol}://${req.get('host')}${imagePath}`
    });

  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);

    // Se houve erro, tentar remover o arquivo que foi feito upload
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('Erro ao limpar arquivo após falha:', cleanupError);
      }
    }

    if ((error as Error).message === 'Produto não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Erro de validação do multer
    if ((error as Error).message.includes('Apenas imagens são permitidas')) {
      return res.status(400).json({
        success: false,
        error: (error as Error).message,
        code: 'INVALID_FILE_TYPE'
      });
    }

    if ((error as Error).message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        error: 'Arquivo muito grande. Tamanho máximo: 5MB',
        code: 'FILE_TOO_LARGE'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};
