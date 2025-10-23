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

    /**
     * Cria um novo pedido no banco de dados.
     *
     * @param data - Dados do pedido (usuarioId, cupomId, produtos, precoTotal, status)
     * @returns Promise<object> - Pedido criado com produtos associados
     * @throws Error - Se ocorrer erro no repositório
     */
    static async createOrder(data: {
        usuarioId: number,
        cupomId?: number,
        produtos: { produtoId: number, quantidade: number, precoUnitario: number }[],
        precoTotal: number,
        status?: string
    }) {
        try {
            const order = await OrderRepository.createOrder(data);
            return order;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Exclui um pedido
     *
     * Valida o ID e chama o repositório para remover o pedido do banco.
     *
     * @param id - ID do pedido a ser excluído
     * @returns Promise<object> - Pedido excluído
     * @throws Error - Se o ID for inválido ou não encontrado
     */
    static async deleteOrder(id: number) {
        try {
            const deletedOrder = await OrderRepository.deleteOrder(id);
            return deletedOrder;
        } catch (error) {
            throw error;
        }
    }
}