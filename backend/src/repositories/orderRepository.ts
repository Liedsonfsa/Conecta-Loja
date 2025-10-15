import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class OrderRepository {
    static async getUserOrders(usuarioId: number) {
        return await prisma.pedido.findMany({
            where: { usuarioId },
        })
    }
}