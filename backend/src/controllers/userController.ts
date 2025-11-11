import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { EmployeeService } from '../services/employeeService';

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
 * Detecta o tipo de usuário (cliente/funcionário) e chama o serviço apropriado.
 */
export const getProfile = async (req: Request, res: Response) => {
    console.log("--- [CONTROLLER] A função getProfile foi chamada. ---");
    try {
        // O ID e tipo do usuário são injetados na requisição pelo middleware de autenticação
        const userId = (req as any).user.id;
        const userType = (req as any).user.userType;

        let userProfile;

        // Chamar serviço apropriado baseado no tipo de usuário
        if (userType === 'funcionario' || userType === 'admin') {
            // Para funcionários e admins, buscar dados da tabela funcionário
            userProfile = await EmployeeService.getEmployeeProfile(userId);
        } else {
            // Para clientes, buscar dados da tabela usuário
            userProfile = await UserService.getProfile(userId);
        }

        res.status(200).json(userProfile);
    } catch (error) {
        const errorMessage = (error as Error).message;
        // Retorna erros específicos vindos do serviço
        if (errorMessage === "Usuário não encontrado" || errorMessage === "Funcionário não encontrado") {
            return res.status(404).json({ success: false, error: errorMessage });
        }
        // Retorna um erro genérico para outros casos
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
};

/**
 * Controller para atualizar informações pessoais do usuário logado.
 * Detecta o tipo de usuário e chama o serviço apropriado.
 */
export const updatePersonalInfo = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const userType = (req as any).user.userType;
        const personalData = req.body;

        let updatedUser;

        // Chamar serviço apropriado baseado no tipo de usuário
        if (userType === 'funcionario' || userType === 'admin') {
            // Para funcionários e admins, campos permitidos são diferentes
            const allowedFields = ['name', 'email', 'avatar'];
            const filteredData: any = {};

            for (const field of allowedFields) {
                if (personalData[field] !== undefined) {
                    filteredData[field] = personalData[field];
                }
            }

            updatedUser = await EmployeeService.updateEmployeePersonalInfo(userId, filteredData);
        } else {
            // Para clientes, campos incluem contact (telefone)
            const allowedFields = ['name', 'email', 'contact', 'avatar'];
            const filteredData: any = {};

            for (const field of allowedFields) {
                if (personalData[field] !== undefined) {
                    filteredData[field] = personalData[field];
                }
            }

            updatedUser = await UserService.updatePersonalInfo(userId, filteredData);
        }

        res.status(200).json({
            success: true,
            message: 'Informações pessoais atualizadas com sucesso',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                contact: 'contact' in updatedUser ? updatedUser.contact : null // Funcionários podem não ter contact
            }
        });
    } catch (error) {
        console.error("Controller Error - updatePersonalInfo:", error);

        const errorMessage = (error as Error).message;
        if (errorMessage === 'Nome não pode ser vazio' ||
            errorMessage === 'Email não pode ser vazio' ||
            errorMessage === 'Telefone não pode ser vazio' ||
            errorMessage === 'Formato de email inválido' ||
            errorMessage === 'Email já está em uso') {
            return res.status(400).json({
                success: false,
                error: errorMessage,
                code: 'VALIDATION_ERROR'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao atualizar informações pessoais',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }
};

/**
 * Controller para atualizar o perfil do usuário logado (método legado).
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
