"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.getAllEmployees = exports.getEmployeeById = exports.updateEmployee = exports.createEmployee = void 0;
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
/**
 * Atualiza os dados de um funcionário existente
 *
 * Recebe o ID do funcionário via parâmetro da URL e os novos dados via body da requisição.
 * Valida e processa as informações recebidas, chama o serviço para atualizar o funcionário
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados para atualização
 * @param req.params.id - ID do funcionário a ser atualizado
 * @param req.body - Dados do funcionário a serem atualizados
 * @param req.body.name - (Opcional) Novo nome do funcionário
 * @param req.body.email - (Opcional) Novo email do funcionário
 * @param req.body.password - (Opcional) Nova senha do funcionário (será hasheada)
 * @param req.body.role - (Opcional) Nova função/cargo do funcionário
 * @param req.body.storeId - (Opcional) Novo ID da loja onde trabalha
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta com funcionário atualizado ou erro
 *
 * @example
 * // Requisição PUT /api/employee/editar/1
 * {
 *   "name": "João Silva Atualizado",
 *   "password": "novaSenha456"
 * }
 */
const updateEmployee = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const updatedEmployee = await employeeService_1.EmployeeService.editEmployee(id, req.body);
        return res.status(200).json(updatedEmployee);
    }
    catch (error) {
        console.error(error);
        if (error.message === "Funcionário não encontrado") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
};
exports.updateEmployee = updateEmployee;
/**
 * Busca um funcionário pelo ID
 *
 * Recebe o ID do funcionário via parâmetro da URL e retorna os dados do funcionário.
 *
 * @param req - Requisição Express com ID do funcionário
 * @param req.params.id - ID do funcionário a ser buscado
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta com dados do funcionário ou erro
 *
 * @example
 * // Requisição GET /api/employee/1
 * // Retorna dados do funcionário com ID 1
 */
const getEmployeeById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const employee = await employeeService_1.EmployeeService.getEmployeeById(id);
        return res.status(200).json({ employee });
    }
    catch (error) {
        console.error(error);
        if (error.message === "Funcionário não encontrado") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro ao buscar funcionário" });
    }
};
exports.getEmployeeById = getEmployeeById;
/**
 * Lista todos os funcionários com paginação e filtros
 *
 * Recebe parâmetros de paginação e filtros opcionais via query parameters.
 *
 * @param req - Requisição Express com parâmetros de busca
 * @param req.query.page - (Opcional) Página atual (padrão: 1)
 * @param req.query.limit - (Opcional) Limite de itens por página (padrão: 10)
 * @param req.query.search - (Opcional) Termo de busca por nome ou email
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta com lista de funcionários e metadados de paginação
 *
 * @example
 * // Requisição GET /api/employee?page=1&limit=5&search=João
 * // Retorna funcionários da página 1, limitados a 5, filtrados por "João"
 */
const getAllEmployees = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const options = {};
        if (page) {
            const pageNum = parseInt(page, 10);
            if (!isNaN(pageNum) && pageNum > 0) {
                options.page = pageNum;
            }
        }
        if (limit) {
            const limitNum = parseInt(limit, 10);
            if (!isNaN(limitNum) && limitNum > 0 && limitNum <= 100) {
                options.limit = limitNum;
            }
        }
        if (search) {
            options.search = search;
        }
        const result = await employeeService_1.EmployeeService.getAllEmployees(options);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
};
exports.getAllEmployees = getAllEmployees;
/**
 * Remove um funcionário do sistema
 *
 * Recebe o ID do funcionário via parâmetro da URL e remove o funcionário do banco de dados.
 *
 * @param req - Requisição Express com ID do funcionário
 * @param req.params.id - ID do funcionário a ser removido
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta de confirmação ou erro
 *
 * @example
 * // Requisição DELETE /api/employee/1
 * // Remove o funcionário com ID 1
 */
const deleteEmployee = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        await employeeService_1.EmployeeService.deleteEmployee(id);
        return res.status(200).json({
            success: true,
            message: "Funcionário removido com sucesso"
        });
    }
    catch (error) {
        console.error(error);
        if (error.message === "Funcionário não encontrado") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro ao remover funcionário" });
    }
};
exports.deleteEmployee = deleteEmployee;
//# sourceMappingURL=employeeController.js.map