import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { OrderStatus } from '../generated/prisma';


/**
 * @route GET /api/order/all
 * @desc Retorna todos os pedidos da loja (para funcionários/administradores)
 * @access Privado (funcionários/admins)
 * @returns {success: boolean, orders: object[]} - Lista de todos os pedidos
 */
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await OrderService.getAllOrders();

        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar pedidos"
        });
    }
};

/**
 * @route GET /api/order
 * @desc Retorna todos os pedidos de um usuário
 * @access Público (ou ajuste conforme regras de autenticação)
 * @query {usuarioId: number} - ID do usuário que terá os pedidos buscados
 * @returns {success: boolean, orders: object[]} - Lista de pedidos do usuário
 */
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const usuarioId = Number(req.query.usuarioId);

        if (isNaN(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: "ID do usuário inválido"
            });
        }

        const orders = await OrderService.getUserOrders(usuarioId);

        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar pedidos"
        });
    }
};

/**
 * Cria um novo pedido
 *
 * Recebe os dados do pedido via body da requisição, chama o service responsável
 * pela criação e retorna o pedido cadastrado com sucesso ou um erro apropriado.
 *
 * @param req - Requisição Express contendo os dados do pedido no body
 * @param res - Resposta Express
 * @returns Promise<Response> - Retorna o pedido criado ou mensagem de erro
 *
 * @example
 * POST /api/order/cadastrar
 * {
 *   "usuarioId": 1,
 *   "cupomId": 2,
 *   "produtos": [
 *     { "produtoId": 5, "quantidade": 2 },
 *     { "produtoId": 8, "quantidade": 1}
 *   ],
 *   "precoTotal": 219.80,
 *   "status": "RECEBIDO"
 * }
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        const order = await OrderService.createOrder(req.body);
        return res.status(201).json({
            success: true,
            message: "Pedido criado com sucesso!",
            pedido: order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao criar pedido"
        });
    }
};

/**
 * @route DELETE /api/order/:id
 * @desc Exclui um pedido existente
 * @access Public
 * @param {id: number} - ID do pedido a ser deletado (parâmetro de rota)
 * @returns {object} - Mensagem de sucesso e dados do pedido excluído
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const deletedOrder = await OrderService.deleteOrder(id);

    return res.status(200).json({
      success: true,
      message: "Pedido excluído com sucesso",
      order: deletedOrder,
    });
  } catch (error: any) {
    if (error.message === "Pedido não encontrado") {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Erro ao excluir pedido" });
  }
};

/**
 * Busca um pedido específico por ID
 *
 * Recebe o ID do pedido via parâmetro de rota e retorna os detalhes completos
 * do pedido incluindo produtos, endereço e histórico de status.
 *
 * @param req - Requisição Express contendo o parâmetro `id` da rota
 * @param res - Resposta Express
 * @returns Promise<Response> - Retorna os detalhes do pedido ou mensagem de erro
 *
 * @example
 * GET /api/order/123
 */
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID do pedido inválido"
            });
        }

        const order = await OrderService.getOrderById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Pedido não encontrado"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Erro ao buscar pedido por ID:', error);
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar pedido"
        });
    }
};

/**
 * Atualiza o status de um pedido
 *
 * Recebe o ID do pedido e o novo status, atualiza o pedido e registra
 * a mudança no histórico de status.
 *
 * @param req - Requisição Express contendo id (params) e status, criadoPor, observacao (body)
 * @param res - Resposta Express
 * @returns Promise<Response> - Retorna o pedido atualizado ou mensagem de erro
 *
 * @example
 * PUT /api/order/123/status
 * {
 *   "status": "PREPARO",
 *   "criadoPor": 1,
 *   "observacao": "Pedido iniciado na cozinha"
 * }
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status, criadoPor, observacao } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID do pedido inválido"
            });
        }

        if (!status || !(status in OrderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status inválido"
            });
        }

        const pedidoAtualizado = await OrderService.updateOrderStatus(
            id,
            status as OrderStatus,
            criadoPor,
            observacao
        );

        res.status(200).json({
            success: true,
            message: "Status do pedido atualizado com sucesso",
            pedido: pedidoAtualizado
        });
    } catch (error: any) {
        if (error.message === "Pedido não encontrado") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error('Erro ao atualizar status do pedido:', error);
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar status do pedido"
        });
    }
};