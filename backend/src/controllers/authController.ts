import { Request, Response } from 'express';
import { UserService } from '../services/userService';

/**
 * Controller responsável pelas operações de autenticação
 */
export class AuthController {
  /**
   * Realiza login do usuário
   *
   * Recebe email e senha, valida as credenciais e retorna um token JWT
   * com duração de 24 horas.
   *
   * @param req - Requisição Express contendo email e senha no body
   * @param res - Resposta Express
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios',
          code: 'MISSING_CREDENTIALS'
        });
      }

      const result = await UserService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro no login:', error);

      if ((error as Error).message === 'Email ou senha incorretos') {
        return res.status(401).json({
          success: false,
          error: 'Email ou senha incorretos',
          code: 'INVALID_CREDENTIALS'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  /**
   * Verifica se o token JWT é válido (rota protegida de exemplo)
   *
   * @param req - Requisição Express com dados do usuário no req.user
   * @param res - Resposta Express
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      // O middleware authenticateToken já validou o token
      // e adicionou os dados do usuário em req.user
      res.status(200).json({
        success: true,
        message: 'Token válido',
        user: req.user
      });
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}
