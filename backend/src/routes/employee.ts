/**
 * Definição das rotas relacionadas a funcionários
 *
 * Este arquivo configura as rotas específicas para operações
 * com funcionários, como criação de novos funcionários.
 */
import { Router } from 'express';
import { createEmployee } from '../controllers/employeeController';

const router = Router();

router.post('/cadastrar', createEmployee);

export default router;