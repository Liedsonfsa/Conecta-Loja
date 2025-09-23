import bcrypt from 'bcrypt';
import { EmployeeRepository } from '../repositories/employeeRepository';

export class EmployeeService {
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