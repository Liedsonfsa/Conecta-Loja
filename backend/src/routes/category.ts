/**
 * Definição das rotas relacionadas a categorias
 *
 * Este arquivo configura as rotas específicas para operações
 * com categorias, como CRUD completo de categorias.
 *
 * Rotas disponíveis:
 * - GET /api/category - Buscar todas as categorias (com paginação e filtros)
 * - GET /api/category/stats - Buscar estatísticas das categorias
 * - GET /api/category/:id - Buscar categoria por ID
 * - POST /api/category - Criar nova categoria
 * - PUT /api/category/:id - Atualizar categoria
 * - DELETE /api/category/:id - Remover categoria
 */
import { Router } from 'express';
import {
  createCategory,
  getCategoryById,
  getAllCategories,
  getCategoryStats,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = Router();

/**
 * @route GET /api/category
 * @desc Buscar todas as categorias com paginação e filtros
 * @access Public
 * @query {page?: number, limit?: number, search?: string, includeProducts?: boolean}
 * @returns {success: boolean, categories: object[], pagination: object}
 */
router.get('/', getAllCategories);

/**
 * @route GET /api/category/stats
 * @desc Buscar estatísticas das categorias
 * @access Public
 * @returns {success: boolean, stats: object}
 */
router.get('/stats', getCategoryStats);

/**
 * @route GET /api/category/:id
 * @desc Buscar categoria por ID
 * @access Public
 * @param {number} id - ID da categoria
 * @returns {success: boolean, category: object}
 */
router.get('/:id', getCategoryById);

/**
 * @route POST /api/category
 * @desc Criar nova categoria
 * @access Public (deve ser protegido por autenticação em produção)
 * @body {name: string}
 * @returns {success: boolean, message: string, category: object}
 */
router.post('/', createCategory);

/**
 * @route PUT /api/category/:id
 * @desc Atualizar categoria existente
 * @access Public (deve ser protegido por autenticação em produção)
 * @param {number} id - ID da categoria
 * @body {name?: string}
 * @returns {success: boolean, message: string, category: object}
 */
router.put('/:id', updateCategory);

/**
 * @route DELETE /api/category/:id
 * @desc Remover categoria
 * @access Public (deve ser protegido por autenticação em produção)
 * @param {number} id - ID da categoria
 * @returns {success: boolean, message: string}
 */
router.delete('/:id', deleteCategory);

export default router;
