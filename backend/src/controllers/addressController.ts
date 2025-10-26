import { Request, Response } from 'express';
import { AddressService } from '../services/addressService';

/**
 * Controller para operações CRUD de endereços
 */

/**
 * Busca todos os endereços do usuário logado
 *
 * @param req - Requisição Express com usuário autenticado
 * @param res - Resposta Express
 */
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Usuário extraído do middleware de autenticação

    const result = await AddressService.getUserAddresses(userId);
    res.status(200).json({
      success: true,
      addresses: result
    });
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Busca um endereço específico por ID
 *
 * @param req - Requisição Express com ID do endereço nos parâmetros
 * @param res - Resposta Express
 */
export const getAddressById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const addressId = parseInt(id, 10);

    if (isNaN(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do endereço deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const address = await AddressService.getAddressById(addressId, userId);
    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Endereço não encontrado',
        code: 'ADDRESS_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      address: address
    });
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Cria um novo endereço para o usuário
 *
 * @param req - Requisição Express com dados do endereço no body
 * @param res - Resposta Express
 */
export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const addressData = {
      ...req.body,
      usuarioId: userId
    };

    const address = await AddressService.createAddress(addressData);
    res.status(201).json({
      success: true,
      message: 'Endereço criado com sucesso',
      address: address
    });
  } catch (error) {
    console.error('Erro ao criar endereço:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage.includes('CEP é obrigatório') ||
        errorMessage.includes('Logradouro é obrigatório') ||
        errorMessage.includes('Número é obrigatório') ||
        errorMessage.includes('Bairro é obrigatório') ||
        errorMessage.includes('Cidade é obrigatório') ||
        errorMessage.includes('Estado é obrigatório')) {
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
 * Atualiza um endereço existente
 *
 * @param req - Requisição Express com ID nos parâmetros e dados no body
 * @param res - Resposta Express
 */
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const addressId = parseInt(id, 10);

    if (isNaN(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do endereço deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const address = await AddressService.updateAddress(addressId, userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Endereço atualizado com sucesso',
      address: address
    });
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Endereço não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Endereço não encontrado',
        code: 'ADDRESS_NOT_FOUND'
      });
    }

    if (errorMessage.includes('CEP é obrigatório') ||
        errorMessage.includes('Logradouro é obrigatório') ||
        errorMessage.includes('Número é obrigatório') ||
        errorMessage.includes('Bairro é obrigatório') ||
        errorMessage.includes('Cidade é obrigatório') ||
        errorMessage.includes('Estado é obrigatório')) {
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
 * Remove um endereço
 *
 * @param req - Requisição Express com ID nos parâmetros
 * @param res - Resposta Express
 */
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const addressId = parseInt(id, 10);

    if (isNaN(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do endereço deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const result = await AddressService.deleteAddress(addressId, userId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erro ao remover endereço:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Endereço não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Endereço não encontrado',
        code: 'ADDRESS_NOT_FOUND'
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
 * Define um endereço como principal
 *
 * @param req - Requisição Express com ID do endereço nos parâmetros
 * @param res - Resposta Express
 */
export const setAddressAsPrincipal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const addressId = parseInt(id, 10);

    if (isNaN(addressId)) {
      return res.status(400).json({
        success: false,
        error: 'ID do endereço deve ser um número válido',
        code: 'INVALID_ID'
      });
    }

    const address = await AddressService.setAddressAsPrincipal(userId, addressId);
    res.status(200).json({
      success: true,
      message: 'Endereço definido como principal com sucesso',
      address: address
    });
  } catch (error) {
    console.error('Erro ao definir endereço como principal:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage === 'Endereço não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'Endereço não encontrado',
        code: 'ADDRESS_NOT_FOUND'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};