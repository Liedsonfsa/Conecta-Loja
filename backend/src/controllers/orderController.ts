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
}