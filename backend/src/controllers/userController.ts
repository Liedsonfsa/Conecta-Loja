import { Request, Response } from 'express';
import { UserService } from '../services/userService';

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
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: user
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    // Tratamento específico de erros
    if ((error as Error).message === 'Email já está cadastrado') {
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