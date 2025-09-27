"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Definição das rotas relacionadas a funcionários
 *
 * Este arquivo configura as rotas específicas para operações
 * com funcionários, incluindo criação, atualização e gerenciamento
 * de dados de funcionários.
 *
 * Rotas disponíveis:
 * - POST /api/employee/cadastrar - Cria um novo funcionário
 */
const express_1 = require("express");
const employeeController_1 = require("../controllers/employeeController");
const router = (0, express_1.Router)();
/**
 * @route POST /api/employee/cadastrar
 * @desc Cria um novo funcionário
 * @access Public
 * @body {name: string, email: string, password: string, role: string, storeId: number}
 * @returns {employee: object} - Dados do funcionário criado (sem senha)
 */
router.post('/cadastrar', employeeController_1.createEmployee);
exports.default = router;
//# sourceMappingURL=employee.js.map