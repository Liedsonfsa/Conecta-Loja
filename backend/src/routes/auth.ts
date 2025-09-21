/**
 * Definição das rotas relacionadas à autenticação
 *
 * Este arquivo configura as rotas específicas para operações
 * de autenticação, como login e verificação de token.
 *
 * Rotas disponíveis:
 * - POST /api/auth/login - Realizar login
 * - GET /api/auth/verify - Verificar token JWT (rota protegida)
 */
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateLogin } from '../middlewares/userValidation';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route POST /api/auth/login
 * @desc Realizar login do usuário
 * @access Public
 * @body {email: string, password: string}
 * @returns {success: boolean, message: string, data: {token: string, user: object, expiresIn: string}}
 */
router.post('/login', validateLogin, AuthController.login);

/**
 * @route GET /api/auth/verify
 * @desc Verificar se o token JWT é válido
 * @access Private (requer token)
 * @returns {success: boolean, message: string, user: object}
 */
router.get('/verify', authenticateToken, AuthController.verifyToken);

export default router;
