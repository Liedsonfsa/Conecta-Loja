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
 * - /api/product/* - Operações relacionadas a produtos
 * - /api/category/* - Operações relacionadas a categorias
 */
import { Router } from 'express';
import userRoutes from './user';
import employeeRoutes from './employee';
import authRoutes from './auth';
import productRoutes from './product';
import categoryRoutes from './category';

const router = Router();

// Montagem das rotas por domínio
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);

export default router;