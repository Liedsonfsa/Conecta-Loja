"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const userService_1 = require("../services/userService");
/**
 * Controller para criação de usuário
 *
 * Recebe os dados do usuário via body da requisição,
 * valida os dados, chama o serviço para criar o usuário
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do usuário no body
 * @param res - Resposta Express
 */
const createUser = async (req, res) => {
    try {
        const user = await userService_1.UserService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            user: user
        });
    }
    catch (error) {
        console.error('Erro ao criar usuário:', error);
        // Tratamento específico de erros
        if (error.message === 'Email já está cadastrado') {
            return res.status(409).json({
                success: false,
                error: 'Email já está cadastrado',
                code: 'EMAIL_ALREADY_EXISTS'
            });
        }
        // Erro genérico
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }
};
exports.createUser = createUser;
//# sourceMappingURL=userController.js.map