/**
 * Configuração das rotas principais da API
 *
 * Este arquivo agrupa e organiza todas as rotas da aplicação por domínio,
 * facilitando a manutenção e escalabilidade da API REST.
 *
 * Estrutura de rotas:
 * - /api/user/* - Operações relacionadas a usuários
 * - /api/employee/* - Operações relacionadas a funcionários
 * - /api/auth/* - Operações de autenticação e autorização
 */
import { Router } from 'express';
import userRoutes from './user';
import employeeRoutes from './employee';
import authRoutes from './auth';

const router = Router();

// Montagem das rotas por domínio
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/auth', authRoutes);

export default router;