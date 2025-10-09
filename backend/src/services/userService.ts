// Localização: backend/src/services/userService.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { EmployeeRepository } from '../repositories/employeeRepository';

/**
 * Serviço responsável pelas regras de negócio relacionadas a usuários
 */
export class UserService {
    /**
     * Cria um novo usuário no banco de dados
     * (Seu método existente)
     */
    static async createUser(data: {
        name: string;
        email: string;
        password: string;
        contact: string;
    }) {
        try {
            const existingUser = await UserRepository.findUserByEmail(data.email);
            if (existingUser) {
                throw new Error('Email já está cadastrado');
            }
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            const user = await UserRepository.createUser({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                contact: data.contact,
            });
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verifica se a senha fornecida corresponde ao hash armazenado
     * (Seu método existente)
     */
    static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Realiza login do usuário com email e senha
     * (Seu método existente)
     */
    static async login(email: string, password: string) {
        try {
            let foundUser = null;
            let userType: 'cliente' | 'funcionario' | 'admin' = 'cliente';
            foundUser = await UserRepository.findUserByEmail(email);
            if (foundUser) {
                userType = 'cliente';
            } else {
                foundUser = await EmployeeRepository.findEmployeeByEmail(email);
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
            const token = jwt.sign(
                {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: foundUser.name,
                    userType: userType,
                    cargoId: 'cargoId' in foundUser ? foundUser.cargoId : null
                },
                secret,
                { expiresIn: '24h' }
            );
            const { password: _, ...userWithoutPassword } = foundUser;
            return {
                token,
                user: { ...userWithoutPassword, userType: userType },
                expiresIn: '24h'
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Busca o perfil completo do usuário logado.
     * @param userId - ID do usuário autenticado.
     */
    static async getProfile(userId: number) {
        const user = await UserRepository.findUserById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        const address = await UserRepository.findAddressByUserId(userId);
        return { ...user, address };
    }

    /**
     * Atualiza as informações do perfil do usuário.
     * @param userId - ID do usuário autenticado.
     * @param profileData - Dados a serem atualizados.
     */
    static async updateProfile(userId: number, profileData: any) {
        const { name, email, contact, address } = profileData;
        const updatedUser = await UserRepository.updateUser(userId, { name, email, contact });
        if (address) {
            const existingAddress = await UserRepository.findAddressByUserId(userId);
            if (existingAddress) {
                await UserRepository.updateAddress(existingAddress.id, address);
            }
        }
        return updatedUser;
    }
}