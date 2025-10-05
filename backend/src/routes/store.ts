import { Router } from 'express';
import { listEmployees } from '../controllers/storeControllers';

const router = Router();

/**
 * @route POST /:lojaId/listar-funcionarios
 * @desc Lista todos os funcionários de uma loja específica
 * @access Public
 * @param {lojaId: number} - ID da loja cujos funcionários serão listados (via URL param)
 * @returns {employees: object[]} - Lista de funcionários da loja
 */
router.get('/:lojaId/listar-funcionarios', listEmployees);

export default router;