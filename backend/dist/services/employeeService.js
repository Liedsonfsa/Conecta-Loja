"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
/**
 * Serviço responsável pelas regras de negócio relacionadas a funcionários
 *
 * Este módulo contém a lógica de negócio para operações com funcionários,
 * incluindo criação, validação de dados e processamento de senhas.
 */
const bcrypt_1 = __importDefault(require("bcrypt"));
const employeeRepository_1 = require("../repositories/employeeRepository");
class EmployeeService {
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
    static async createEmployee(data) {
        try {
            const saltRounds = 12;
            const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
            const employee = await employeeRepository_1.EmployeeRepository.createEmployee({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                storeId: data.storeId
            });
            const { password, ...employeeWithoutPassword } = employee;
            return employeeWithoutPassword;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employeeService.js.map