/**
 * Serviço responsável pelas regras de negócio relacionadas a funcionários
 *
 * Este módulo contém a lógica de negócio para operações com funcionários,
 * incluindo criação, validação de dados e processamento de senhas.
 */
import bcrypt from 'bcrypt';
import { EmployeeRepository } from '../repositories/employeeRepository';

export class EmployeeService {
    /**
     * Cria um novo funcionário no banco de dados
     *
     * Recebe os dados do funcionário, faz o hash da senha usando bcrypt,
     * e cria o registro no banco de dados através do repositório.
     *
     * @param data - Dados do funcionário a ser criado
     * @param data.name - Nome completo do funcionário
     * @param data.email - Email único do funcionário
     * @param data.password - Senha em texto plano (será hasheada)
     * @param data.role - Função/cargo do funcionário na empresa
     * @param data.storeId - ID da loja onde o funcionário trabalha
     * @returns Promise com o funcionário criado (sem senha)
     *
     * @throws Error se houver problemas na criação ou hash da senha
     *
     * @example
     * const employeeData = {
     *   name: "Maria Santos",
     *   email: "maria@empresa.com",
     *   password: "senha123",
     *   role: "gerente",
     *   storeId: 1
     * };
     * const employee = await EmployeeService.createEmployee(employeeData);
     */
    static async createEmployee(data: {
        name: string,
        email: string,
        password: string,
        role: string,
        storeId: number
    }) {
        try {
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            const employee = await EmployeeRepository.createEmployee({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                storeId: data.storeId
            });

            const { password, ...employeeWithoutPassword } = employee;
            return employeeWithoutPassword;
        } catch (error) {
            throw error;
        }
    }
}