/**
 * Definição das rotas relacionadas a usuários
 *
 * Este arquivo configura as rotas específicas para operações
 * com usuários, como criação de novos usuários.
 */
import { Router } from 'express';
import { createUser } from '../controllers/userController';

const router = Router();

router.post('/cadastrar', createUser);

export default router;