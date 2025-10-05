import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório: busca os funcionários de uma loja no banco de dados
 *
 * Executa uma consulta utilizando o Prisma para retornar todos os
 * funcionários vinculados ao ID da loja informado.
 *
 * @param lojaId - ID da loja cujos funcionários devem ser buscados
 * @returns Promise<object[]> - Lista de funcionários encontrados
 */
export class StoreRepository {
    static async listEmployees(lojaId: number) {
        return await prisma.funcionario.findMany({
            where: {lojaId}
        });
    };
};