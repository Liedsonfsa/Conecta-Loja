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
 * - /api/role/* - Operações relacionadas a cargos
 * - /api/auth/* - Operações de autenticação e autorização
 * - /api/product/* - Operações relacionadas a produtos
 * - /api/category/* - Operações relacionadas a categorias
 * - /api/store/* - Operações relacionadas a loja
 * - /api/cart/* - Operações relacionadas ao carrinho de compras
 */
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const employee_1 = __importDefault(require("./employee"));
const role_1 = __importDefault(require("./role"));
const auth_1 = __importDefault(require("./auth"));
const product_1 = __importDefault(require("./product"));
const category_1 = __importDefault(require("./category"));
const store_1 = __importDefault(require("./store"));
const profile_1 = __importDefault(require("./profile"));
const cart_1 = __importDefault(require("./cart"));
const order_1 = __importDefault(require("./order"));
const router = (0, express_1.Router)();
// Montagem das rotas por domínio
router.use('/user', user_1.default);
router.use('/employee', employee_1.default);
router.use('/role', role_1.default);
router.use('/auth', auth_1.default);
router.use('/product', product_1.default);
router.use('/category', category_1.default);
router.use('/store', store_1.default);
router.use('/cart', cart_1.default);
router.use('/profile', profile_1.default);
router.use('/order', order_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map