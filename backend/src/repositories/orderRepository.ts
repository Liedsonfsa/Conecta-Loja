import { PrismaClient } from "../generated/prisma";

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
}