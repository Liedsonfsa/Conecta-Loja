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
/**
 * Controller para buscar o perfil do usuário logado.
 * Chama o serviço que busca os dados no banco.
 */
export const getProfile = async (req: Request, res: Response) => {
    console.log("--- [CONTROLLER] A função getProfile foi chamada. ---");
    try {
        // O ID do usuário é injetado na requisição pelo seu middleware de autenticação
        const userId = (req as any).user.id;

        const userProfile = await UserService.getProfile(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        const errorMessage = (error as Error).message;
        // Retorna erros específicos vindos do serviço
        if (errorMessage === "Usuário não encontrado") {
            return res.status(404).json({ success: false, error: errorMessage });
        }
        // Retorna um erro genérico para outros casos
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
};

/**
 * Controller para atualizar o perfil do usuário logado.
 * Chama o serviço que salva os dados no banco.
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const profileData = req.body;
        // Chama o serviço para atualizar os dados
        await UserService.updateProfile(userId, profileData);
        res.status(200).json({ success: true, message: 'Perfil atualizado com sucesso' });
    } catch (error)
    {
        console.error("Controller Error - updateProfile:", error); // Log para ajudar na depuração
        res.status(500).json({ success: false, error: 'Erro interno do servidor ao atualizar perfil' });
    }
};