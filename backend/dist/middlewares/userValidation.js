"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateCreateUser = void 0;
/**
 * Middlewares de validação para dados de usuário
 *
 * Este módulo contém middlewares Express Validator para validar
 * dados de entrada em operações relacionadas a usuários, incluindo
 * criação de usuários e login.
 */
const express_validator_1 = require("express-validator");
/**
 * Array de middlewares para validar dados de criação de usuário
 *
 * Valida os campos obrigatórios e formatos para criação de novo usuário:
 * - Nome: 2-100 caracteres, apenas letras e espaços
 * - Email: formato válido, até 255 caracteres
 * - Senha: 6-128 caracteres, deve conter maiúscula, minúscula e número
 * - Contato: 10-20 caracteres, apenas números, espaços, hífens, parênteses e +
 *
 * @returns Array de middlewares Express Validator
 *
 * @example
 * // Uso em rota
 * router.post('/user/cadastrar', validateCreateUser, createUserHandler);
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
/**
 * Array de middlewares para validar dados de login
 *
 * Valida os campos obrigatórios para autenticação de usuário:
 * - Email: formato válido, normalizado
 * - Senha: campo obrigatório, não vazio
 *
 * @returns Array de middlewares Express Validator
 *
 * @example
 * // Uso em rota de login
 * router.post('/auth/login', validateLogin, loginHandler);
 */
exports.validateLogin = [
    // Validação do email
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email deve ter um formato válido'),
    // Validação da senha
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    // Middleware para verificar se há erros de validação
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Dados de entrada inválidos',
                details: errors.array().map(err => ({
                    field: err.path || err.param || 'unknown',
                    message: err.msg
                })),
                code: 'VALIDATION_ERROR'
            });
        }
        next();
    }
];
//# sourceMappingURL=userValidation.js.map