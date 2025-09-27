import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

/**
 * Controller para operações CRUD de categorias
 */

/**
 * Cria uma nova categoria
 *
 * Recebe os dados da categoria via body da requisição,
 * valida os dados, chama o serviço para criar a categoria
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados da categoria no body
 * @param res - Resposta Express
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Categoria criada com sucesso',
      category: category
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);

    // Tratamento específico de erros
    const errorMessage = (error as Error).message;
    if (errorMessage === 'Nome da categoria é obrigatório' ||
        errorMessage === 'Já existe uma categoria com este nome') {
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
 * Busca uma categoria pelo ID
 *
 * @param req - Requisição Express com ID da categoria nos parâmetros
 * @param res - Resposta Express
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'ID da categoria deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const category = await CategoryService.getCategoryById(categoryId);
    res.status(200).json({
      success: true,
      category: category
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);

    if ((error as Error).message === 'Categoria não encontrada') {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
        code: 'CATEGORY_NOT_FOUND'
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
 * Busca todas as categorias com paginação e filtros
 *
 * @param req - Requisição Express com query parameters opcionais
 * @param res - Resposta Express
 */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, includeProducts } = req.query;

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

    if (search) {
      options.search = search as string;
    }

    if (includeProducts !== undefined) {
      options.includeProducts = includeProducts === 'true';
    }

    const result = await CategoryService.getAllCategories(options);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Atualiza uma categoria existente
 *
 * @param req - Requisição Express com ID da categoria nos parâmetros e dados no body
 * @param res - Resposta Express
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'ID da categoria deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const category = await CategoryService.updateCategory(categoryId, req.body);
    res.status(200).json({
      success: true,
      message: 'Categoria atualizada com sucesso',
      category: category
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Categoria não encontrada') {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    if (errorMessage === 'Nome da categoria não pode ser vazio' ||
        errorMessage === 'Já existe outra categoria com este nome') {
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
 * Remove uma categoria
 *
 * @param req - Requisição Express com ID da categoria nos parâmetros
 * @param res - Resposta Express
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'ID da categoria deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const result = await CategoryService.deleteCategory(categoryId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erro ao remover categoria:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Categoria não encontrada') {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    if (errorMessage === 'Não é possível excluir uma categoria que possui produtos associados') {
      return res.status(409).json({
        success: false,
        error: errorMessage,
        code: 'CATEGORY_HAS_PRODUCTS'
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
 * Busca estatísticas das categorias
 *
 * @param req - Requisição Express
 * @param res - Resposta Express
 */
export const getCategoryStats = async (req: Request, res: Response) => {
  try {
    const stats = await CategoryService.getCategoryStats();
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas das categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};
