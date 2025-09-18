import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Cria um novo usuário no banco de dados
 *
 * @param data - Dados do usuário a ser criado
 * @param data.name - Nome do usuário
 * @param data.email - Email do usuário
 * @param data.password - Senha do usuário
 * @param data.contact - Contato do usuário
 * @returns Promise com o usuário criado
 */
export const createUser = async (data: {
    name: string,
    email: string,
    password: string,
    contact: string
}) => {
    return await prisma.usuario.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            contact: data.contact
        }
    });
};