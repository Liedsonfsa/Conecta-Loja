"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployee = void 0;
const employeeService_1 = require("../services/employeeService");
/**
 * Cria um novo funcionário
 *
 * Recebe os dados do funcionário via body da requisição,
 * valida e processa os dados, chama o serviço para criar o funcionário
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do funcionário no body
 * @param req.body - Dados do funcionário a ser criado
 * @param req.body.name - Nome do funcionário
 * @param req.body.email - Email do funcionário
 * @param req.body.password - Senha do funcionário (será hasheada)
 * @param req.body.role - Função/cargo do funcionário
 * @param req.body.storeId - ID da loja onde trabalha
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta com funcionário criado ou erro
 *
 * @example
 * // Requisição POST /api/employee/cadastrar
 * {
 *   "name": "João Silva",
 *   "email": "joao@empresa.com",
 *   "password": "senha123",
 *   "role": "vendedor",
 *   "storeId": 1
 * }
 */
const createEmployee = async (req, res) => {
    try {
        const employee = await employeeService_1.EmployeeService.createEmployee(req.body);
        res.status(201).json({ employee: employee });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createEmployee = createEmployee;
//# sourceMappingURL=employeeController.js.map