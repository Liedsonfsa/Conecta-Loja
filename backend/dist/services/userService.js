"use strict";
// Localização: backend/src/services/userService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const employeeRepository_1 = require("../repositories/employeeRepository");
/**
 * Serviço responsável pelas regras de negócio relacionadas a usuários
 */
class UserService {
    /**
     * Cria um novo usuário no banco de dados
     * (Seu método existente)
     */
    static async createUser(data) {
        try {
            const existingUser = await userRepository_1.UserRepository.findUserByEmail(data.email);
            if (existingUser) {
                throw new Error('Email já está cadastrado');
            }
            const saltRounds = 12;
            const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
            const user = await userRepository_1.UserRepository.createUser({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                contact: data.contact,
            });
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Verifica se a senha fornecida corresponde ao hash armazenado
     * (Seu método existente)
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt_1.default.compare(plainPassword, hashedPassword);
    }
    /**
     * Realiza login do usuário com email e senha
     * (Seu método existente)
     */
    static async login(email, password) {
        try {
            let foundUser = null;
            let userType = 'cliente';
            foundUser = await userRepository_1.UserRepository.findUserByEmail(email);
            if (foundUser) {
                userType = 'cliente';
            }
            else {
                foundUser = await employeeRepository_1.EmployeeRepository.findEmployeeByEmail(email);
                if (foundUser) {
                    userType = foundUser.cargoId === 2 ? 'admin' : 'funcionario';
                }
            }
            if (!foundUser) {
                throw new Error('Email ou senha incorretos');
            }
            const isPasswordValid = await this.verifyPassword(password, foundUser.password);
            if (!isPasswordValid) {
                throw new Error('Email ou senha incorretos');
            }
            const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
            const token = jsonwebtoken_1.default.sign({
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                userType: userType,
                cargoId: 'cargoId' in foundUser ? foundUser.cargoId : null
            }, secret, { expiresIn: '24h' });
            const { password: _, ...userWithoutPassword } = foundUser;
            return {
                token,
                user: { ...userWithoutPassword, userType: userType },
                expiresIn: '24h'
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Busca o perfil completo do usuário logado.
     * @param userId - ID do usuário autenticado.
     */
    static async getProfile(userId) {
        const user = await userRepository_1.UserRepository.findUserById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        // Buscar endereço principal em vez do primeiro endereço
        const address = await userRepository_1.UserRepository.findPrincipalAddressByUserId(userId);
        return { ...user, address, avatar: user.avatar };
    }
    /**
     * Atualiza as informações pessoais do perfil do usuário.
     * @param userId - ID do usuário autenticado.
     * @param personalData - Dados pessoais a serem atualizados (name, email, contact, avatar).
     */
    static async updatePersonalInfo(userId, personalData) {
        try {
            // Validações básicas
            if (personalData.name !== undefined && (!personalData.name || personalData.name.trim().length === 0)) {
                throw new Error('Nome não pode ser vazio');
            }
            if (personalData.email !== undefined && (!personalData.email || personalData.email.trim().length === 0)) {
                throw new Error('Email não pode ser vazio');
            }
            if (personalData.contact !== undefined && (!personalData.contact || personalData.contact.trim().length === 0)) {
                throw new Error('Telefone não pode ser vazio');
            }
            // Validar formato do email se fornecido
            if (personalData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(personalData.email)) {
                    throw new Error('Formato de email inválido');
                }
                // Verificar se email já está em uso por outro usuário
                const existingUser = await userRepository_1.UserRepository.findUserByEmail(personalData.email);
                if (existingUser && existingUser.id !== userId) {
                    throw new Error('Email já está em uso');
                }
            }
            // Preparar dados para atualização, convertendo null para undefined
            const updateData = { ...personalData };
            if (updateData.avatar === null) {
                updateData.avatar = undefined;
            }
            return await userRepository_1.UserRepository.updateUser(userId, updateData);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Atualiza as informações do perfil do usuário (método legado para compatibilidade).
     * @param userId - ID do usuário autenticado.
     * @param profileData - Dados a serem atualizados.
     */
    static async updateProfile(userId, profileData) {
        const { name, email, contact, address } = profileData;
        const updatedUser = await userRepository_1.UserRepository.updateUser(userId, { name, email, contact });
        if (address) {
            const existingAddress = await userRepository_1.UserRepository.findAddressByUserId(userId);
            if (existingAddress) {
                await userRepository_1.UserRepository.updateAddress(existingAddress.id, address);
            }
        }
        return updatedUser;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map