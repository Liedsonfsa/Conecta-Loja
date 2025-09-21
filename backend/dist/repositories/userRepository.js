"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../generated/prisma");
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
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map