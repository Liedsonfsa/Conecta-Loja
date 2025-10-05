import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class StoreRepository {
    static async listEmployees(lojaId: number) {
        return await prisma.funcionario.findMany({
            where: {lojaId}
        });
    };
};