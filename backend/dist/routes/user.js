"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Definição das rotas relacionadas a usuários
 *
 * Este arquivo configura as rotas específicas para operações
 * com usuários, como criação de novos usuários.
 *
 * Rotas disponíveis:
 * - POST /api/user/cadastrar - Cria um novo usuário
 */
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userValidation_1 = require("../middlewares/userValidation");
const router = (0, express_1.Router)();
/**
 * @route POST /api/user/cadastrar
 * @desc Cria um novo usuário
 * @access Public
 * @body {name: string, email: string, password: string, contact: string}
 * @returns {success: boolean, message: string, user: object}
 */
router.post('/cadastrar', userValidation_1.validateCreateUser, userController_1.createUser);
exports.default = router;
//# sourceMappingURL=user.js.map