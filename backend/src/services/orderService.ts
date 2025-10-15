import { OrderRepository } from "../repositories/orderRepository";

/**
 * Serviço responsável por regras de negócio relacionadas aos pedidos
 *
 * Contém métodos que conectam o controller ao repositório, garantindo
 * que a lógica de acesso aos dados seja centralizada e reutilizável.
 */
export class OrderService {
    /**
     * Busca todos os pedidos de um usuário
     *
     * @param usuarioId - ID do usuário cujos pedidos serão buscados
     * @returns Promise<object[]> - Lista de pedidos encontrados
     * @throws Error - Caso ocorra um problema no repositório
     */
    static async getUserOrders(usuarioId: number) {
        try {
            const orders = await OrderRepository.getUserOrders(usuarioId);

            return orders;
        } catch (error) {
            throw error;
        }
    }
}