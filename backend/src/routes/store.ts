import { Router } from 'express';
import { deleteEmployee, listEmployees } from '../controllers/storeControllers';

const router = Router();

/**
 * @route POST /:lojaId/listar-funcionarios
 * @desc Lista todos os funcionários de uma loja específica
 * @access Public
 * @param {lojaId: number} - ID da loja cujos funcionários serão listados (via URL param)
 * @returns {employees: object[]} - Lista de funcionários da loja
 */
router.get('/:lojaId/listar-funcionarios', listEmployees);

/**
 * @route DELETE /api/employee/deletar-funcionario/:id
 * @desc Deleta um funcionário pelo ID
 * @access Public
 * @param {id: number} - ID do funcionário a ser deletado (via URL param)
 * @returns {message: string} - Confirmação da exclusão
 *
 * @example
 * // DELETE /api/employee/deletar-funcionario/1
 * {
 *   "message": "Funcionário deletado com sucesso"
 * }
 */
router.delete('/deletar-funcionario/:id', deleteEmployee);

export default router;