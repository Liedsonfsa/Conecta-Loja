import { PrismaClient, OrderStatus } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável por acessar os dados de pedidos no banco
 *
 * Utiliza o Prisma para realizar operações diretamente na tabela "pedido".
 */
export class OrderRepository {
    /**
     * Busca os pedidos vinculados a um usuário específico
     *
     * @param usuarioId - ID do usuário cujos pedidos devem ser retornados
     * @returns Promise<object[]> - Lista de pedidos encontrados
     */
    static async getUserOrders(usuarioId: number) {
        return await prisma.pedido.findMany({
            where: { usuarioId },
        })
    }

    /**
     * Cria um novo pedido e associa seus produtos.
     *
     * @param data - Dados do pedido, incluindo lista de produtos
     * @returns Promise<object> - Pedido criado com relação aos produtos
     */
    static async createOrder(data: {
        usuarioId: number,
        cupomId?: number,
        produtos: { produtoId: number, quantidade: number, precoUnitario: number }[],
        precoTotal: number,
        status?: string
    }) {
        const { usuarioId, cupomId, produtos, precoTotal, status } = data;

        const orderStatus: OrderStatus = (status && status in OrderStatus)
            ? (status as OrderStatus)
            : OrderStatus.RECEBIDO;

        return await prisma.pedido.create({
            data: {
                usuarioId,
                cupomId,
                precoTotal,
                status: orderStatus,
                produtos: {
                    create: produtos.map(p => ({
                        produtoId: p.produtoId,
                        quantidade: p.quantidade,
                        precoUnitario: p.precoUnitario
                    }))
                }
            },
            include: {
                produtos: true
            }
        });
    }
}
