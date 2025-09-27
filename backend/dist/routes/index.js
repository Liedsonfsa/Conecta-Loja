"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configuração das rotas principais da API
 *
 * Este arquivo agrupa e organiza todas as rotas da aplicação por domínio,
 * facilitando a manutenção e escalabilidade da API REST.
 *
 * Estrutura de rotas:
 * - /api/user/* - Operações relacionadas a usuários
 * - /api/employee/* - Operações relacionadas a funcionários
 * - /api/auth/* - Operações de autenticação e autorização
 * - /api/product/* - Operações relacionadas a produtos
 * - /api/category/* - Operações relacionadas a categorias
 */
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const employee_1 = __importDefault(require("./employee"));
const auth_1 = __importDefault(require("./auth"));
const product_1 = __importDefault(require("./product"));
const category_1 = __importDefault(require("./category"));
const router = (0, express_1.Router)();
// Montagem das rotas por domínio
router.use('/user', user_1.default);
router.use('/employee', employee_1.default);
router.use('/auth', auth_1.default);
router.use('/product', product_1.default);
router.use('/category', category_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map