"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepository_1 = require("../repositories/userRepository");
/**
 * Serviço responsável pelas regras de negócio relacionadas a usuários
 */
class UserService {
    /**
     * Cria um novo usuário no banco de dados
     *
     * @param data - Dados do usuário a ser criado
     * @param data.name - Nome do usuário
     * @param data.email - Email do usuário
     * @param data.password - Senha do usuário (será hasheada)
     * @param data.contact - Contato do usuário
     * @returns Promise com o usuário criado (sem senha)
     */
    static async createUser(data) {
        try {
            // Verificar se email já existe
            const existingUser = await userRepository_1.UserRepository.findUserByEmail(data.email);
            if (existingUser) {
                throw new Error('Email já está cadastrado');
            }
            // Hash da senha
            const saltRounds = 12;
            const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
            // Criar usuário no banco
            const user = await userRepository_1.UserRepository.createUser({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                contact: data.contact,
            });
            // Retornar usuário sem senha
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            // Re-throw para manter o tipo de erro
            throw error;
        }
    }
    /**
     * Verifica se a senha fornecida corresponde ao hash armazenado
     *
     * @param plainPassword - Senha em texto plano
     * @param hashedPassword - Hash da senha armazenada
     * @returns Promise<boolean> - true se as senhas coincidem
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt_1.default.compare(plainPassword, hashedPassword);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map