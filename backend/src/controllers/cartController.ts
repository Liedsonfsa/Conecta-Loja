import { Request, Response } from 'express';
import { CartService } from '../services/cartService';

/**
 * Controller para operações CRUD do carrinho
 */ 

/**
 * Busca o carrinho do usuário autenticado
 *
 * @param req - Requisição Express (usuário deve estar autenticado)
 * @param res - Resposta Express
 */
export const getCart = async (req: Request, res: Response) => {
  try {
    // O ID do usuário vem do middleware de autenticação
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const cart = await CartService.getCartByUserId(usuarioId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Carrinho não encontrado',
        code: 'CART_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);

    const errorMessage = (error as Error).message;
    res.status(500).json({
      success: false,
      error: errorMessage,
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Adiciona um produto ao carrinho
 *
 * @param req - Requisição Express com produtoId e quantidade no body
 * @param res - Resposta Express
 */
export const addToCart = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const { produtoId, quantidade } = req.body;

    if (!produtoId || typeof produtoId !== 'number' || produtoId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto é obrigatório e deve ser um número positivo',
        code: 'VALIDATION_ERROR'
      });
    }

    const cart = await CartService.addToCart(usuarioId, produtoId, quantidade);

    res.json({
      success: true,
      message: 'Produto adicionado ao carrinho com sucesso',
      cart
    });
  } catch (error) {
    console.error('Erro ao adicionar produto ao carrinho:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage.includes('Produto não encontrado') ||
        errorMessage.includes('não está disponível') ||
        errorMessage.includes('Estoque insuficiente') ||
        errorMessage.includes('Quantidade deve ser um número positivo')) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Atualiza a quantidade de um item no carrinho
 *
 * @param req - Requisição Express com produtoId e quantidade no body
 * @param res - Resposta Express
 */
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const { produtoId, quantidade } = req.body;

    if (!produtoId || typeof produtoId !== 'number' || produtoId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto é obrigatório e deve ser um número positivo',
        code: 'VALIDATION_ERROR'
      });
    }

    if (quantidade === undefined || typeof quantidade !== 'number' || quantidade < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade deve ser um número não negativo',
        code: 'VALIDATION_ERROR'
      });
    }

    const cart = await CartService.updateCartItem(usuarioId, produtoId, quantidade);

    res.json({
      success: true,
      message: 'Item do carrinho atualizado com sucesso',
      cart
    });
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage.includes('Carrinho não encontrado') ||
        errorMessage.includes('Produto não encontrado') ||
        errorMessage.includes('não está disponível') ||
        errorMessage.includes('Estoque insuficiente') ||
        errorMessage.includes('Quantidade não pode ser negativa')) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Remove um item do carrinho
 *
 * @param req - Requisição Express com produtoId como parâmetro de URL
 * @param res - Resposta Express
 */
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const produtoId = parseInt(req.params.produtoId);

    if (!produtoId || produtoId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto é obrigatório e deve ser um número positivo',
        code: 'VALIDATION_ERROR'
      });
    }

    const cart = await CartService.removeFromCart(usuarioId, produtoId);

    res.json({
      success: true,
      message: 'Item removido do carrinho com sucesso',
      cart
    });
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage.includes('Carrinho não encontrado') ||
        errorMessage.includes('ID do produto')) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Limpa todos os itens do carrinho
 *
 * @param req - Requisição Express
 * @param res - Resposta Express
 */
export const clearCart = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const result = await CartService.clearCart(usuarioId);

    res.json({
      success: true,
      message: 'Carrinho limpo com sucesso',
      ...result
    });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage.includes('ID do usuário')) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Remove o carrinho completamente
 *
 * @param req - Requisição Express
 * @param res - Resposta Express
 */
export const deleteCart = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const result = await CartService.deleteCart(usuarioId);

    res.json({
      success: true,
      message: 'Carrinho removido com sucesso',
      ...result
    });
  } catch (error) {
    console.error('Erro ao remover carrinho:', error);

    const errorMessage = (error as Error).message;
    if (errorMessage.includes('ID do usuário')) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};
