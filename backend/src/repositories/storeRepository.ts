import { PrismaClient } from "../generated/prisma";


const prisma = new PrismaClient();

/**
 * Classe StoreRepository
 *
 * Responsável pela comunicação direta com o banco de dados relacionada
 * a operações envolvendo funcionários e lojas.
 *
 * Esta classe utiliza o Prisma como ORM para executar consultas e operações
 * de manipulação de dados. Sua função é isolar a lógica de acesso a dados,
 * mantendo o código organizado e desacoplado da camada de serviço.
 *
 * Métodos principais:
 * - listEmployees(lojaId: number): Busca todos os funcionários de uma loja.
 * - deleteEmployee(id: number): Remove um funcionário pelo ID.
 *
 * @class StoreRepository
 * @example
 * // Buscar funcionários de uma loja
 * const employees = await StoreRepository.listEmployees(1);
 *
 * // Deletar funcionário
 * const deleted = await StoreRepository.deleteEmployee(5);
 */
export class StoreRepository {
    /**
     * Repositório: busca os funcionários de uma loja no banco de dados
     *
     * Executa uma consulta utilizando o Prisma para retornar todos os
     * funcionários vinculados ao ID da loja informado.
     *
     * @param lojaId - ID da loja cujos funcionários devem ser buscados
     * @returns Promise<object[]> - Lista de funcionários encontrados
     */
    static async listEmployees(lojaId: number) {
        return await prisma.funcionario.findMany({
            where: {lojaId}
        });
    };

    /**
     * Repositório: deleta um funcionário no banco de dados
     *
     * Utiliza o Prisma para remover o funcionário pelo ID informado.
     *
     * @param id - ID do funcionário a ser deletado
     * @returns Promise<object> - Funcionário deletado
     *
     * @throws Error - Se o ID não existir no banco
     */
    static async deleteEmployee(id: number) {
        return await prisma.funcionario.delete({
            where: {id}
        });
    };

    /**
     * Repositório: busca as configurações da loja.
     * Assume que as configurações pertencem à loja com ID 1.
     * @returns Promise com as configurações encontradas ou null
     */
    static async findConfig() {
        // Usando o nome do model 'store' como definido no schema.prisma
        return await prisma.store.findUnique({
            where: { id: 1 },
        });
    }

    /**
     * Repositório: atualiza as configurações da loja.
     * @param data - Objeto com os campos a serem atualizados.
     * @returns Promise com as configurações atualizadas
     */
    static async updateConfig(data: any) { // Use um tipo mais específico para 'data' se tiver
        return await prisma.store.update({
            where: { id: 1 },
            data,
        });
    }
};
