// Localização: backend/src/repositories/userRepository.ts

import { PrismaClient } from "../generated/prisma"; // Verifique se o caminho do seu prisma client está correto

const prisma = new PrismaClient();

/**
 * Repositório responsável pelas operações de banco de dados relacionadas a usuários
 */
export class UserRepository {
    /**
     * Cria um novo usuário no banco de dados
     *
     * @param data - Dados do usuário a ser criado
     * @returns Promise com o usuário criado
     */
    static async createUser(data: {
        name: string;
        email: string;
        password: string;
        contact: string;
    }) {
        return await prisma.usuario.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                contact: data.contact,
            },
        });
    }

    /**
     * Busca um usuário pelo email
     *
     * @param email - Email do usuário
     * @returns Promise com o usuário encontrado ou null
     */
    static async findUserByEmail(email: string) {
        return await prisma.usuario.findUnique({
            where: { email },
        });
    }

    /**
     * Busca um usuário pelo ID
     *
     * @param id - ID do usuário
     * @returns Promise com o usuário encontrado ou null
     */
    static async findUserById(id: number) {
        return await prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                contact: true,
                avatar: true
            }
        });
    }

    /**
     * Encontra o primeiro endereço associado a um usuário.
     */
    static async findAddressByUserId(userId: number) {
        // Supondo que o nome do seu model de endereço seja 'endereco'
        return await prisma.endereco.findFirst({
            where: { usuarioId: userId },
        });
    }

    /**
     * Encontra o endereço principal de um usuário.
     */
    static async findPrincipalAddressByUserId(userId: number) {
        return await prisma.endereco.findFirst({
            where: {
                usuarioId: userId,
                isPrincipal: true
            },
        });
    }

    /**
     * Atualiza os dados de um usuário.
     */
    static async updateUser(id: number, data: { name?: string; email?: string; contact?: string; avatar?: string }) {
        return await prisma.usuario.update({
            where: { id },
            data,
        });
    }

    /**
     * Atualiza os dados de um endereço.
     */
    static async updateAddress(id: number, data: any) { // Use um tipo mais específico para 'data' se tiver
        return await prisma.endereco.update({
            where: { id },
            data,
        });
    }
} // A chave extra estava aqui