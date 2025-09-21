"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configuração das rotas principais da API
 *
 * Este arquivo agrupa todas as rotas da aplicação,
 * organizando-as por domínio (usuários, etc.)
 */
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const employee_1 = __importDefault(require("./employee"));
const router = (0, express_1.Router)();
router.use('/user', user_1.default);
router.use('/employee', employee_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map