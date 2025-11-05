import { OrderRepository } from "../repositories/orderRepository";
import { PrismaClient, OrderStatus } from "../generated/prisma";

const prisma = new PrismaClient();

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
 * Registra uma mudança de status no histórico
 * @param pedidoId - ID do pedido
 * @param novoStatus - Novo status do pedido
 * @param criadoPor - ID do funcionário que fez a mudança (opcional)
 * @param observacao - Observação sobre a mudança (opcional)
 */
async function registrarHistoricoStatus(
    pedidoId: number,
    novoStatus: OrderStatus,
    criadoPor?: number,
    observacao?: string
) {
    try {
        await prisma.pedido_status_historico.create({
            data: {
                pedidoId,
                status: novoStatus,
                criadoPor,
                observacao
            }
        });
    } catch (error) {
        console.error('Erro ao registrar histórico de status:', error);
        // Não lança erro para não quebrar o fluxo principal
    }
}

/**
 * Serviço responsável por regras de negócio relacionadas aos pedidos
 *
 * Contém métodos que conectam o controller ao repositório, garantindo
 * que a lógica de acesso aos dados seja centralizada e reutilizável.
 */
export class OrderService {
    /**
     * Busca todos os pedidos da loja (para funcionários/administradores)
     *
     * @returns Promise<object[]> - Lista de todos os pedidos encontrados com números formatados
     * @throws Error - Caso ocorra um problema no repositório
     */
    static async getAllOrders() {
        try {
            const orders = await OrderRepository.getAllOrders();

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

            // Registrar status inicial no histórico
            const statusInicial: OrderStatus = (data.status && data.status in OrderStatus)
                ? (data.status as OrderStatus)
                : OrderStatus.RECEBIDO;

            await registrarHistoricoStatus(
                order.id,
                statusInicial,
                undefined, // Cliente criou o pedido, não há funcionário
                "Pedido criado pelo cliente"
            );

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

    /**
     * Busca um pedido específico por ID
     *
     * @param id - ID do pedido a ser buscado
     * @returns Promise<object> - Pedido encontrado com relacionamentos
     * @throws Error - Se o pedido não for encontrado
     */
    static async getOrderById(id: number) {
        try {
            const order = await OrderRepository.getOrderById(id);

            if (!order) {
                throw new Error("Pedido não encontrado");
            }

            // Adiciona o número do pedido formatado
            return {
                ...order,
                numeroPedido: generateOrderNumber(order.id)
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Atualiza o status de um pedido e registra no histórico
     *
     * @param id - ID do pedido
     * @param novoStatus - Novo status do pedido
     * @param criadoPor - ID do funcionário que fez a mudança (opcional)
     * @param observacao - Observação sobre a mudança (opcional)
     * @returns Promise<object> - Pedido atualizado
     * @throws Error - Se o pedido não for encontrado
     */
    static async updateOrderStatus(
        id: number,
        novoStatus: OrderStatus,
        criadoPor?: number,
        observacao?: string
    ) {
        try {
            // Primeiro, buscar o pedido atual para verificar se o status mudou
            const pedidoAtual = await OrderRepository.getOrderById(id);

            if (!pedidoAtual) {
                throw new Error("Pedido não encontrado");
            }

            // Se o status não mudou, não faz nada
            if (pedidoAtual.status === novoStatus) {
                return pedidoAtual;
            }

            // Atualizar o status no pedido
            const pedidoAtualizado = await OrderRepository.updateOrderStatus(id, novoStatus);

            // Registrar a mudança no histórico
            await registrarHistoricoStatus(id, novoStatus, criadoPor, observacao);

            return pedidoAtualizado;
        } catch (error) {
            throw error;
        }
    }
}