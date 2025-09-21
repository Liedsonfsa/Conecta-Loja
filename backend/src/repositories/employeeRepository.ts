import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class EmployeeRepository {
    /**
   * Cria um novo funcionário no banco de dados
   *
   * @param data - Dados do funcionário a ser criado
   * @returns Promise com o funcionário criado
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