/**
 * Definição das rotas relacionadas ao carrinho de compras
 *
 * Este arquivo configura as rotas específicas para operações
 * com o carrinho de compras do usuário.
 *
 * Todas as rotas requerem autenticação (middleware authMiddleware)
 *
 * Rotas disponíveis:
 * - GET /api/cart - Buscar carrinho do usuário autenticado
 * - POST /api/cart/items - Adicionar produto ao carrinho
 * - PUT /api/cart/items - Atualizar quantidade de item no carrinho
 * - DELETE /api/cart/items/:produtoId - Remover item do carrinho
 * - DELETE /api/cart - Limpar carrinho completamente
 */
import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  deleteCart
} from '../controllers/cartController';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

/**
 * @route GET /api/cart
 * @desc Buscar carrinho do usuário autenticado
 * @access Private (requer autenticação)
 * @returns {success: boolean, cart: object}
 */
router.get('/', getCart);

/**
 * @route POST /api/cart/items
 * @desc Adicionar produto ao carrinho
 * @access Private (requer autenticação)
 * @body {produtoId: number, quantidade?: number}
 * @returns {success: boolean, message: string, cart: object}
 */
router.post('/items', addToCart);

/**
 * @route PUT /api/cart/items
 * @desc Atualizar quantidade de um item no carrinho
 * @access Private (requer autenticação)
 * @body {produtoId: number, quantidade: number}
 * @returns {success: boolean, message: string, cart: object}
 */
router.put('/items', updateCartItem);

/**
 * @route DELETE /api/cart/items/:produtoId
 * @desc Remover item específico do carrinho
 * @access Private (requer autenticação)
 * @param {number} produtoId - ID do produto a ser removido
 * @returns {success: boolean, message: string, cart: object}
 */
router.delete('/items/:produtoId', removeFromCart);

/**
 * @route DELETE /api/cart
 * @desc Limpar todos os itens do carrinho
 * @access Private (requer autenticação)
 * @returns {success: boolean, message: string}
 */
router.delete('/', clearCart);

export default router;
