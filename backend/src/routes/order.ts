/**
 * Definição das rotas relacionadas aos pedidos
 *
 * Este arquivo configura as rotas específicas para operações
 * com pedidos, como CRUD completo de pedidos.
 *
 * Rotas disponíveis:
 * - GET /api/order/all - Buscar todos os pedidos da loja (funcionários/admins)
 * - GET /api/order - Buscar todos os pedidos de um usuário
 * - POST /api/order/cadastrar - Criar novo pedido
 * - DELETE /api/order/:id - Excluir um pedido
 */
import { Router } from 'express';
import {
  getAllOrders,
  getUserOrders,
  createOrder,
  deleteOrder,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController';

const router = Router();

/**
 * @route GET /api/order/all
 * @desc Rota para buscar todos os pedidos da loja
 * @access Privado (funcionários/admins)
 */
router.get('/all', getAllOrders);

/**
 * @route GET /api/order
 * @desc Rota para buscar os pedidos de um usuário
 * @access Privado
 */
router.get('/', getUserOrders);

/**
 * @route POST /api/order/cadastrar
 * @desc Cria um novo pedido no sistema
 * @access Público (ou restrito conforme autenticação)
 * @body {usuarioId: number, cupomId?: number, produtos: [{produtoId: number, quantidade: number, precoUnitario: number}], precoTotal: number, status?: string}
 * @returns {object} Pedido criado com seus produtos associados
 */
router.post('/cadastrar', createOrder);

/**
 * @route PUT /api/order/:id/status
 * @desc Atualiza o status de um pedido
 * @access Privado (funcionários/admins)
 * @param {id: number} - ID do pedido (parâmetro de rota)
 * @body {status: OrderStatus, criadoPor?: number, observacao?: string}
 * @returns {object} Pedido atualizado
 */
router.put('/:id/status', updateOrderStatus);

/**
 * @route DELETE /api/order/:id
 * @desc Exclui um pedido existente no sistema
 * @access Public
 * 
 * @param {Request} req - Objeto de requisição do Express contendo o parâmetro `id` do pedido
 * @param {Response} res - Objeto de resposta do Express usado para retornar o status e a mensagem
 *
 * @returns {200 OK} Pedido excluído com sucesso, incluindo os dados do pedido removido
 * @returns {400 Bad Request} Caso o ID seja inválido ou não numérico
 * @returns {404 Not Found} Caso o pedido não seja encontrado
 * @returns {500 Internal Server Error} Em caso de erro inesperado no servidor
 * 
 */
router.delete('/:id', deleteOrder);

export default router;