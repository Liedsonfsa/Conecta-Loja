/**
 * Definição das rotas relacionadas a funcionários
 *
 * Este arquivo configura as rotas específicas para operações
 * com funcionários, incluindo criação, atualização e gerenciamento
 * de dados de funcionários.
 *
 * Rotas disponíveis:
 * - POST /api/employee/cadastrar - Cria um novo funcionário
 */
import { Router } from 'express';
import { createEmployee } from '../controllers/employeeController';

const router = Router();

/**
 * @route POST /api/employee/cadastrar
 * @desc Cria um novo funcionário
 * @access Public
 * @body {name: string, email: string, password: string, role: string, storeId: number}
 * @returns {employee: object} - Dados do funcionário criado (sem senha)
 */
router.post('/cadastrar', createEmployee);

export default router;