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
     * O role pode ser 'FUNCIONARIO' ou 'ADMIN'.
     *
     * @param data - Dados do funcionário a ser criado
     * @param data.name - Nome completo do funcionário
     * @param data.email - Email único do funcionário
     * @param data.password - Senha em texto plano (será hasheada)
     * @param data.role - Função/cargo: 'FUNCIONARIO' ou 'ADMIN'
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
     *   role: "FUNCIONARIO",
     *   storeId: 1
     * };
     * const adminData = {
     *   name: "João Admin",
     *   email: "admin@empresa.com",
     *   password: "admin123",
     *   role: "ADMIN",
     *   storeId: 1
     * };
     * const employee = await EmployeeService.createEmployee(employeeData);
     * const admin = await EmployeeService.createEmployee(adminData);
     */
    static async createEmployee(data: {
        name: string,
        email: string,
        password: string,
        role: 'FUNCIONARIO' | 'ADMIN',
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

    /**
     * Atualiza os dados de um funcionário existente no banco de dados.
     *
     * Permite modificar nome, email, função/cargo, ID da loja e senha (opcional).
     * Caso uma nova senha seja fornecida, ela será automaticamente hasheada com bcrypt.
     *
     * @param id - ID do funcionário a ser atualizado
     * @param data - Dados a serem atualizados
     * @param data.name - (Opcional) Novo nome do funcionário
     * @param data.email - (Opcional) Novo email do funcionário
     * @param data.password - (Opcional) Nova senha em texto plano (será hasheada)
     * @param data.role - (Opcional) Nova função/cargo do funcionário
     * @param data.storeId - (Opcional) Novo ID da loja onde o funcionário trabalha
     * @returns Promise com o funcionário atualizado (sem senha)
     *
     * @throws Error se o funcionário não for encontrado ou se ocorrer falha na atualização
     *
     * @example
     * const updatedEmployee = await EmployeeService.editEmployee(1, {
     *   name: "João Silva Atualizado",
     *   password: "novaSenha456"
     * });
     */
    static async editEmployee(
        id: number,
        data: {
            name?: string,
            email?: string,
            password?: string,
            role?: 'FUNCIONARIO' | 'ADMIN',
            storeId?: number
        }
    ) {
        try {
            const existingEmployee = await EmployeeRepository.findEmployeeById(id);
            if (!existingEmployee) {
                throw new Error("Funcionário não encontrado");
            }

            const updatedData: any = { ...data };

            if (data.password) {
                const saltRounds = 12;
                updatedData.password = await bcrypt.hash(data.password, saltRounds);
            }

            const updatedEmployee = await EmployeeRepository.updateEmployee(id, updatedData);

            const { password, ...employeeWithoutPassword } = updatedEmployee;
            return employeeWithoutPassword;

        } catch (error) {
            throw error;
        }
    }

}