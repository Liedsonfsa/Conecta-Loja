"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateUser = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware para validar dados de criação de usuário
 */
exports.validateCreateUser = [
    // Validação do nome
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage('Nome deve conter apenas letras e espaços'),
    // Validação do email
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email deve ter no máximo 255 caracteres'),
    // Validação da senha
    (0, express_validator_1.body)('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('Senha deve ter entre 6 e 128 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
    // Validação do contato (telefone)
    (0, express_validator_1.body)('contact')
        .trim()
        .isLength({ min: 10, max: 20 })
        .withMessage('Contato deve ter entre 10 e 20 caracteres')
        .matches(/^[\d\s\-\(\)\+]+$/)
        .withMessage('Contato deve conter apenas números, espaços, hífens, parênteses e sinal de mais'),
    // Middleware para verificar se há erros de validação
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Dados de entrada inválidos',
                details: errors.array().map(err => ({
                    field: err.path || err.param || 'unknown',
                    message: err.msg
                }))
            });
        }
        next();
    }
];
//# sourceMappingURL=userValidation.js.map