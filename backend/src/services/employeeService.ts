import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Cria um novo funcionário no banco de dados
 *
 * @param data - Dados do funcionário a ser criado
 * @param data.name - Nome do funcionário
 * @param data.email - Email do funcionário
 * @param data.password - Senha do funcionário
 * @param data.role - Role do funcionário
 * @param data.lojaId - Id da loja ao qual o usuário pertence
 * @returns Promise com o funcionário criado
 */
export const createEmployee = async (data: {
    name: string,
    email: string,
    password: string,
    role: string,
    storeId: number
}) => {
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