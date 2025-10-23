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
  createOrder,
  deleteOrder  
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

/**
 * @route DELETE /api/orders/:id
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