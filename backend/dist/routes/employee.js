"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Definição das rotas relacionadas a funcionários
 *
 * Este arquivo configura as rotas específicas para operações
 * com funcionários, como criação de novos funcionários.
 */
const express_1 = require("express");
const employeeController_1 = require("../controllers/employeeController");
const router = (0, express_1.Router)();
router.post('/cadastrar', employeeController_1.createEmployee);
exports.default = router;
//# sourceMappingURL=employee.js.map