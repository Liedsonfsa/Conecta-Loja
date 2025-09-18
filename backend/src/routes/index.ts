/**
 * Configuração das rotas principais da API
 *
 * Este arquivo agrupa todas as rotas da aplicação,
 * organizando-as por domínio (usuários, etc.)
 */
import { Router } from 'express';
import userRoutes from './user';

const router = Router();

router.use('/user', userRoutes);

export default router;