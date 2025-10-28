import { OrderRepository } from "../repositories/orderRepository";

/**
 * Gera um número de pedido formatado
 * @param orderId - ID do pedido no banco de dados
 * @returns Número do pedido formatado (ex: PED-20250001)
 */
function generateOrderNumber(orderId: number): string {
    const currentYear = new Date().getFullYear();
    const paddedId = orderId.toString().padStart(5, '0');
    return `PED-${currentYear}${paddedId}`;
}

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
     * @returns Promise<object[]> - Lista de pedidos encontrados com números formatados
     * @throws Error - Caso ocorra um problema no repositório
     */
    static async getUserOrders(usuarioId: number) {
        try {
            const orders = await OrderRepository.getUserOrders(usuarioId);

            // Adiciona o número do pedido formatado a cada pedido
            return orders.map(order => ({
                ...order,
                numeroPedido: generateOrderNumber(order.id)
            }));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Cria um novo pedido no banco de dados.
     *
     * @param data - Dados do pedido (usuarioId, cupomId, produtos, precoTotal, status)
     * @returns Promise<object> - Pedido criado com produtos associados e número formatado
     * @throws Error - Se ocorrer erro no repositório
     */
    static async createOrder(data: {
        usuarioId: number,
        enderecoId?: number,
        cupomId?: number,
        produtos: { produtoId: number, quantidade: number, precoUnitario: number | string }[],
        precoTotal: number | string,
        status?: string
    }) {
        try {
            const order = await OrderRepository.createOrder(data);
            // Adiciona o número do pedido formatado ao objeto retornado
            return {
                ...order,
                numeroPedido: generateOrderNumber(order.id)
            };
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