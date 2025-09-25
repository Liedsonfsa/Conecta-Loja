import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável pelas operações de banco de dados relacionadas aos funcionários
 *
 * Esta classe centraliza todas as operações de CRUD para funcionários,
 * utilizando o Prisma ORM para interagir com o banco de dados PostgreSQL.
 */
export class EmployeeRepository {
    /**
     * Cria um novo funcionário no banco de dados
     *
     * Insere um novo registro na tabela 'funcionario' com os dados fornecidos,
     * incluindo a associação com a loja através do campo 'lojaId'.
     *
     * @param data - Dados do funcionário a ser criado
     * @param data.name - Nome completo do funcionário
     * @param data.email - Email único do funcionário
     * @param data.password - Senha hasheada do funcionário
     * @param data.role - Função/cargo do funcionário
     * @param data.storeId - ID da loja de referência
     * @returns Promise com o funcionário criado incluindo ID gerado
     *
     * @throws Error se houver problemas de integridade referencial ou dados inválidos
     *
     * @example
     * const employeeData = {
     *   name: "João Silva",
     *   email: "joao@empresa.com",
     *   password: "$2a$12$...", // senha hasheada
     *   role: "vendedor",
     *   storeId: 1
     * };
     * const employee = await EmployeeRepository.createEmployee(employeeData);
     */
    static async createEmployee(data: {
        name: string,
        email: string,
        password: string,
        role: string,
        storeId: number
    }) {
        return await prisma.funcionario.create({
        data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                lojaId: data.storeId
            }
        });
    };
}