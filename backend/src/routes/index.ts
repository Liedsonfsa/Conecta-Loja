/**
 * Configuração das rotas principais da API
 *
 * Este arquivo agrupa e organiza todas as rotas da aplicação por domínio,
 * facilitando a manutenção e escalabilidade da API REST.
 *
 * Estrutura de rotas:
 * - /api/user/* - Operações relacionadas a usuários
 * - /api/employee/* - Operações relacionadas a funcionários
 * - /api/role/* - Operações relacionadas a cargos
 * - /api/auth/* - Operações de autenticação e autorização
 * - /api/product/* - Operações relacionadas a produtos
 * - /api/category/* - Operações relacionadas a categorias
 * - /api/store/* - Operações relacionadas a loja
 * - /api/cart/* - Operações relacionadas ao carrinho de compras
 */
import { Router } from 'express';
import userRoutes from './user';
import employeeRoutes from './employee';
import roleRoutes from './role';
import authRoutes from './auth';
import productRoutes from './product';
import categoryRoutes from './category';
import storeRoutes from './store';
import profileRoutes from './profile';
import cartRoutes from './cart';
import orderRoutes from './order';
import reportRoutes from './report';

const router = Router();

// Montagem das rotas por domínio
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/role', roleRoutes);
router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/store', storeRoutes);
router.use('/cart', cartRoutes);
router.use('/profile', profileRoutes);
router.use('/order', orderRoutes);
router.use('/report', reportRoutes);

export default router;