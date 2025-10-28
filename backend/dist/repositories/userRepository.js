"use strict";
// Localização: backend/src/repositories/userRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../generated/prisma"); // Verifique se o caminho do seu prisma client está correto
const prisma = new prisma_1.PrismaClient();
/**
 * Repositório responsável pelas operações de banco de dados relacionadas a usuários
 */
class UserRepository {
    /**
     * Cria um novo usuário no banco de dados
     *
     * @param data - Dados do usuário a ser criado
     * @returns Promise com o usuário criado
     */
    static async createUser(data) {
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
    static async findUserByEmail(email) {
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
    static async findUserById(id) {
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
    static async findAddressByUserId(userId) {
        // Supondo que o nome do seu model de endereço seja 'endereco'
        return await prisma.endereco.findFirst({
            where: { usuarioId: userId },
        });
    }
    /**
     * Encontra o endereço principal de um usuário.
     */
    static async findPrincipalAddressByUserId(userId) {
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
    static async updateUser(id, data) {
        return await prisma.usuario.update({
            where: { id },
            data,
        });
    }
    /**
     * Atualiza os dados de um endereço.
     */
    static async updateAddress(id, data) {
        return await prisma.endereco.update({
            where: { id },
            data,
        });
    }
} // A chave extra estava aqui
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map