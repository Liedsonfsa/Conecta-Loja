import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';

/**
 * Controller para operações CRUD de cargos
 */

/**
 * Cria um novo cargo
 *
 * Recebe os dados do cargo via body da requisição,
 * valida os dados, chama o serviço para criar o cargo
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do cargo no body
 * @param res - Resposta Express
 */
export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.createRole(req.body);
    res.status(201).json({
      success: true,
      message: 'Cargo criado com sucesso',
      role: role
    });
  } catch (error) {
    console.error('Erro ao criar cargo:', error);

    // Tratamento específico de erros
    const errorMessage = (error as Error).message;
    if (errorMessage === 'Nome do cargo é obrigatório' ||
        errorMessage === 'Já existe um cargo com este nome') {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
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
 * Busca um cargo pelo ID
 *
 * @param req - Requisição Express com ID do cargo nos parâmetros
 * @param res - Resposta Express
 */
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleId = parseInt(id, 10);

    if (isNaN(roleId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do cargo deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const role = await RoleService.getRoleById(roleId);
    res.status(200).json({
      success: true,
      role: role
    });
  } catch (error) {
    console.error('Erro ao buscar cargo:', error);

    if ((error as Error).message === 'Cargo não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Cargo não encontrado',
        code: 'ROLE_NOT_FOUND'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Busca todos os cargos com paginação e filtros
 *
 * @param req - Requisição Express com query parameters opcionais
 * @param res - Resposta Express
 */
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, includeEmployees } = req.query;

    const options: any = {};

    if (page) {
      const pageNum = parseInt(page as string, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        options.page = pageNum;
      }
    }

    if (limit) {
      const limitNum = parseInt(limit as string, 10);
      if (!isNaN(limitNum) && limitNum > 0 && limitNum <= 100) {
        options.limit = limitNum;
      }
    }

    if (search) {
      options.search = search as string;
    }

    if (includeEmployees !== undefined) {
      options.includeEmployees = includeEmployees === 'true';
    }

    const result = await RoleService.getAllRoles(options);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Erro ao buscar cargos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Atualiza um cargo existente
 *
 * @param req - Requisição Express com ID do cargo nos parâmetros e dados no body
 * @param res - Resposta Express
 */
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleId = parseInt(id, 10);

    if (isNaN(roleId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do cargo deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const role = await RoleService.updateRole(roleId, req.body);
    res.status(200).json({
      success: true,
      message: 'Cargo atualizado com sucesso',
      role: role
    });
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Cargo não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Cargo não encontrado',
        code: 'ROLE_NOT_FOUND'
      });
    }

    if (errorMessage === 'Nome do cargo não pode ser vazio' ||
        errorMessage === 'Já existe outro cargo com este nome') {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Remove um cargo
 *
 * @param req - Requisição Express com ID do cargo nos parâmetros
 * @param res - Resposta Express
 */
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleId = parseInt(id, 10);

    if (isNaN(roleId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do cargo deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const result = await RoleService.deleteRole(roleId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erro ao remover cargo:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Cargo não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Cargo não encontrado',
        code: 'ROLE_NOT_FOUND'
      });
    }

    if (errorMessage === 'Não é possível excluir um cargo que possui funcionários associados') {
      return res.status(409).json({
        success: false,
        error: errorMessage,
        code: 'ROLE_HAS_EMPLOYEES'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Busca estatísticas dos cargos
 *
 * @param req - Requisição Express
 * @param res - Resposta Express
 */
export const getRoleStats = async (req: Request, res: Response) => {
  try {
    const stats = await RoleService.getRoleStats();
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos cargos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};
