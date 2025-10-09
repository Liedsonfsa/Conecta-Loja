/**
 * Definição das rotas relacionadas a funcionários
 *
 * Este arquivo configura as rotas específicas para operações
 * com funcionários, incluindo criação, atualização, listagem e remoção
 * de dados de funcionários.
 *
 * Rotas disponíveis:
 * - GET /api/employee - Lista todos os funcionários (com paginação e filtros)
 * - GET /api/employee/:id - Busca funcionário por ID
 * - POST /api/employee/cadastrar - Cria um novo funcionário
 * - PUT /api/employee/editar/:id - Atualiza funcionário existente
 * - DELETE /api/employee/:id - Remove funcionário
 */
import { Router } from 'express';
import {
    createEmployee,
    updateEmployee,
    getEmployeeById,
    getAllEmployees,
    deleteEmployee
} from '../controllers/employeeController';

const router = Router();

/**
 * @route GET /api/employee
 * @desc Lista todos os funcionários com paginação e filtros
 * @access Public
 * @query {page?: number, limit?: number, search?: string}
 * @returns {employees: object[], pagination: object} - Lista de funcionários com metadados
 */
router.get('/', getAllEmployees);

/**
 * @route GET /api/employee/:id
 * @desc Busca funcionário específico por ID
 * @access Public
 * @param {id: number} - ID do funcionário
 * @returns {employee: object} - Dados do funcionário
 */
router.get('/:id', getEmployeeById);

/**
 * @route POST /api/employee/cadastrar
 * @desc Cria um novo funcionário
 * @access Public
 * @body {name: string, email: string, password: string, role: string, storeId: number}
 * @returns {employee: object} - Dados do funcionário criado (sem senha)
 */
router.post('/cadastrar', createEmployee);

/**
 * @route PUT /api/employee/editar/:id
 * @desc Atualiza os dados de um funcionário existente
 * @access Public
 * @param {id: number} - ID do funcionário a ser atualizado
 * @body {name?: string, email?: string, password?: string, role?: string, storeId?: number}
 * @returns {employee: object} - Dados do funcionário atualizado (sem senha)
 */
router.put('/editar/:id', updateEmployee);

/**
 * @route DELETE /api/employee/:id
 * @desc Remove funcionário do sistema
 * @access Public
 * @param {id: number} - ID do funcionário a ser removido
 * @returns {success: boolean, message: string} - Confirmação de remoção
 */
router.delete('/:id', deleteEmployee);

export default router;