/**
 * Definição das rotas relacionadas aos pedidos
 *
 * Este arquivo configura as rotas específicas para operações
 * com pedidos, como CRUD completo de pedidos.
 *
 * Rotas disponíveis:
 * - GET /api/orders - Buscar todos os pedidos de um usuário
 */
import { Router } from 'express';
import {
  getUserOrders,
  createOrder  
} from '../controllers/orderController';

const router = Router();

/**
 * @route GET /api/orders
 * @desc Rota para buscar os pedidos de um usuário
 * @access Privado
 */
router.get('/', getUserOrders);

/**
 * @route POST /api/pedidos/cadastrar
 * @desc Cria um novo pedido no sistema
 * @access Público (ou restrito conforme autenticação)
 * @body {usuarioId: number, cupomId?: number, produtos: [{produtoId: number, quantidade: number, precoUnitario: number}], precoTotal: number, status?: string}
 * @returns {object} Pedido criado com seus produtos associados
 */
router.post('/cadastrar', createOrder);

export default router;