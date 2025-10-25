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
        enderecoId?: number,
        cupomId?: number,
        produtos: { produtoId: number, quantidade: number, precoUnitario: number | string }[],
        precoTotal: number | string,
        status?: string
    }) {
        const { usuarioId, enderecoId, cupomId, produtos, precoTotal, status } = data;

        const orderStatus: OrderStatus = (status && status in OrderStatus)
            ? (status as OrderStatus)
            : OrderStatus.RECEBIDO;

        return await prisma.pedido.create({
            data: {
                usuarioId,
                enderecoId,
                cupomId,
                precoTotal: Number(precoTotal),
                status: orderStatus,
                produtos: {
                    create: produtos.map(p => ({
                        produtoId: p.produtoId,
                        quantidade: p.quantidade,
                        precoUnitario: Number(p.precoUnitario)
                    }))
                }
            },
            include: {
                produtos: true,
                endereco: true
            }
        });
    }

    /**
     * Exclui um pedido no banco de dados
     *
     * Utiliza o Prisma para remover um pedido a partir do ID informado.
     *
     * @param id - ID do pedido a ser excluído
     * @returns Promise<object> - Pedido excluído
     * @throws Error - Se o pedido não existir
     */
    static async deleteOrder(id: number) {
        const existingOrder = await prisma.pedido.findUnique({
            where: { id },
        });

        if (!existingOrder) {
            throw new Error("Pedido não encontrado");
        }

        return await prisma.pedido.delete({
            where: { id },
        });
    }
}
