import { OrderRepository } from "../repositories/orderRepository";

export class OrderService {
    static async getUserOrders(usuarioId: number) {
        try {
            const orders = await OrderRepository.getUserOrders(usuarioId);

            return orders;
        } catch (error) {
            throw error;
        }
    }
}