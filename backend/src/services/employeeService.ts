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
     * @param data.cargoId - ID do cargo/função do funcionário
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
     *   cargoId: 1,
     *   storeId: 1
     * };
     * const adminData = {
     *   name: "João Admin",
     *   email: "admin@empresa.com",
     *   password: "admin123",
     *   cargoId: 2,
     *   storeId: 1
     * };
     * const employee = await EmployeeService.createEmployee(employeeData);
     * const admin = await EmployeeService.createEmployee(adminData);
     */
    static async createEmployee(data: {
        name: string,
        email: string,
        password: string,
        cargoId: number,
        storeId: number
    }) {
        try {
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            const employee = await EmployeeRepository.createEmployee({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                cargoId: data.cargoId,
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

            // Mapear role para cargoId se fornecido
            if (data.role) {
                updatedData.cargoId = data.role === 'ADMIN' ? 2 : 1;
                delete updatedData.role; // Remover o campo role antigo
            }

            const updatedEmployee = await EmployeeRepository.updateEmployee(id, updatedData);

            const { password, ...employeeWithoutPassword } = updatedEmployee;
            return employeeWithoutPassword;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Busca um funcionário pelo ID
     *
     * @param id - ID do funcionário a ser buscado
     * @returns Promise com o funcionário encontrado (sem senha)
     *
     * @throws Error se o funcionário não for encontrado
     *
     * @example
     * const employee = await EmployeeService.getEmployeeById(1);
     */
    static async getEmployeeById(id: number) {
        try {
            const employee = await EmployeeRepository.findEmployeeById(id);
            if (!employee) {
                throw new Error("Funcionário não encontrado");
            }

            const { password, ...employeeWithoutPassword } = employee;
            return employeeWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lista todos os funcionários com paginação e filtros
     *
     * @param options - Opções de busca
     * @param options.page - Página atual (padrão: 1)
     * @param options.limit - Limite de itens por página (padrão: 10)
     * @param options.search - Termo de busca por nome ou email
     * @returns Promise com lista de funcionários e metadados de paginação
     *
     * @example
     * const result = await EmployeeService.getAllEmployees({
     *   page: 1,
     *   limit: 10,
     *   search: "João"
     * });
     */
    static async getAllEmployees(options?: {
        page?: number;
        limit?: number;
        search?: string;
    }) {
        try {
            const { page = 1, limit = 10, search } = options || {};

            // Construir filtros
            const where: any = {};

            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ];
            }

            const skip = (page - 1) * limit;

            const [employees, total] = await Promise.all([
                EmployeeRepository.findAllEmployees({ skip, take: limit, where }),
                EmployeeRepository.countEmployees(where),
            ]);

            // Remover senha de todos os funcionários
            const employeesWithoutPassword = employees.map(employee => {
                const { password, ...employeeWithoutPassword } = employee;
                return employeeWithoutPassword;
            });

            return {
                employees: employeesWithoutPassword,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Remove um funcionário do banco de dados
     *
     * @param id - ID do funcionário a ser removido
     * @returns Promise<void>
     *
     * @throws Error se o funcionário não for encontrado
     *
     * @example
     * await EmployeeService.deleteEmployee(1);
     */
    static async deleteEmployee(id: number) {
        try {
            const employee = await EmployeeRepository.findEmployeeById(id);
            if (!employee) {
                throw new Error("Funcionário não encontrado");
            }

            await EmployeeRepository.deleteEmployee(id);
        } catch (error) {
            throw error;
        }
    }

}