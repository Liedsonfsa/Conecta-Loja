import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar dados de criação de usuário
 */
export const validateCreateUser = [
  // Validação do nome
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),

  // Validação do email
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email deve ter no máximo 255 caracteres'),

  // Validação da senha
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Senha deve ter entre 6 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),

  // Validação do contato (telefone)
  body('contact')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Contato deve ter entre 10 e 20 caracteres')
    .matches(/^[\d\s\-\(\)\+]+$/)
    .withMessage('Contato deve conter apenas números, espaços, hífens, parênteses e sinal de mais'),

  // Middleware para verificar se há erros de validação
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados de entrada inválidos',
        details: errors.array().map(err => ({
          field: (err as any).path || (err as any).param || 'unknown',
          message: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Middleware para validar dados de login
 */
export const validateLogin = [
  // Validação do email
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ter um formato válido'),

  // Validação da senha
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),

  // Middleware para verificar se há erros de validação
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Dados de entrada inválidos',
        details: errors.array().map(err => ({
          field: (err as any).path || (err as any).param || 'unknown',
          message: err.msg
        })),
        code: 'VALIDATION_ERROR'
      });
    }
    next();
  }
];
