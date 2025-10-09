/**
 * Definição das rotas relacionadas a cargos
 *
 * Este arquivo configura as rotas específicas para operações
 * com cargos, como CRUD completo de cargos.
 *
 * Rotas disponíveis:
 * - GET /api/role - Buscar todos os cargos (com paginação e filtros)
 * - GET /api/role/stats - Buscar estatísticas dos cargos
 * - GET /api/role/:id - Buscar cargo por ID
 * - POST /api/role - Criar novo cargo
 * - PUT /api/role/:id - Atualizar cargo
 * - DELETE /api/role/:id - Remover cargo
 */
import { Router } from 'express';
import {
  createRole,
  getRoleById,
  getAllRoles,
  getRoleStats,
  updateRole,
  deleteRole
} from '../controllers/roleController';

const router = Router();

/**
 * @route GET /api/role
 * @desc Buscar todos os cargos com paginação e filtros
 * @access Public
 * @query {page?: number, limit?: number, search?: string, includeEmployees?: boolean}
 * @returns {success: boolean, roles: object[], pagination: object}
 */
router.get('/', getAllRoles);

/**
 * @route GET /api/role/stats
 * @desc Buscar estatísticas dos cargos
 * @access Public
 * @returns {success: boolean, stats: object}
 */
router.get('/stats', getRoleStats);

/**
 * @route GET /api/role/:id
 * @desc Buscar cargo por ID
 * @access Public
 * @param {number} id - ID do cargo
 * @returns {success: boolean, role: object}
 */
router.get('/:id', getRoleById);

/**
 * @route POST /api/role
 * @desc Criar novo cargo
 * @access Public (deve ser protegido por autenticação em produção)
 * @body {name: string, description?: string}
 * @returns {success: boolean, message: string, role: object}
 */
router.post('/', createRole);

/**
 * @route PUT /api/role/:id
 * @desc Atualizar cargo existente
 * @access Public (deve ser protegido por autenticação em produção)
 * @param {number} id - ID do cargo
 * @body {name?: string, description?: string}
 * @returns {success: boolean, message: string, role: object}
 */
router.put('/:id', updateRole);

/**
 * @route DELETE /api/role/:id
 * @desc Remover cargo
 * @access Public (deve ser protegido por autenticação em produção)
 * @param {number} id - ID do cargo
 * @returns {success: boolean, message: string}
 */
router.delete('/:id', deleteRole);

export default router;
