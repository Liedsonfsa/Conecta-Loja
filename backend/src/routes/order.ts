import { Router } from 'express';
import {
  getUserOrders  
} from '../controllers/orderController';

const router = Router();

/**
 * @route GET /api/orders
 * @desc Rota para buscar os pedidos de um usuário
 * @access Privado
 */
router.get('/', getUserOrders);

export default router;