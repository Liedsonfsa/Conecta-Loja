import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

/**
 * @route GET /api/orders
 * @desc Retorna todos os pedidos de um usuário
 * @access Público (ou ajuste conforme regras de autenticação)
 * @body {usuarioId: number} - ID do usuário que terá os pedidos buscados
 * @returns {success: boolean, orders: object[]} - Lista de pedidos do usuário
 */
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const orders = OrderService.getUserOrders(req.body.usuarioId);

        res.status(200).json({
            success: true,
            orders: orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false
        });
    }
};

/**
 * Cria um novo pedido
 *
 * Recebe os dados do pedido via body da requisição, chama o service responsável
 * pela criação e retorna o pedido cadastrado com sucesso ou um erro apropriado.
 *
 * @param req - Requisição Express contendo os dados do pedido no body
 * @param res - Resposta Express
 * @returns Promise<Response> - Retorna o pedido criado ou mensagem de erro
 *
 * @example
 * POST /api/pedidos/cadastrar
 * {
 *   "usuarioId": 1,
 *   "cupomId": 2,
 *   "produtos": [
 *     { "produtoId": 5, "quantidade": 2 },
 *     { "produtoId": 8, "quantidade": 1}
 *   ],
 *   "precoTotal": 219.80,
 *   "status": "RECEBIDO"
 * }
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        const order = await OrderService.createOrder(req.body);
        return res.status(201).json({
            success: true,
            message: "Pedido criado com sucesso!",
            pedido: order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao criar pedido"
        });
    }
};

/**
 * @route DELETE /api/orders/:id
 * @desc Exclui um pedido existente
 * @access Public
 * @param {id: number} - ID do pedido a ser deletado (parâmetro de rota)
 * @returns {object} - Mensagem de sucesso e dados do pedido excluído
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedOrder = await OrderService.deleteOrder(id);

    return res.status(200).json({
      success: true,
      message: "Pedido excluído com sucesso",
      order: deletedOrder,
    });
  } catch (error: any) {
    if (error.message === "Pedido não encontrado") {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Erro ao excluir pedido" });
  }
};