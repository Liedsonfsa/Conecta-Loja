/**
 * Configuração das rotas principais da API
 *
 * Este arquivo agrupa todas as rotas da aplicação,
 * organizando-as por domínio (usuários, funcionários, autenticação, etc.)
 */
import { Router } from 'express';
import userRoutes from './user';
import employeeRoutes from './employee';
import authRoutes from './auth';

const router = Router();

router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/auth', authRoutes);

export default router;