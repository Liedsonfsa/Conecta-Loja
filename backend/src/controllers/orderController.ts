import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

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