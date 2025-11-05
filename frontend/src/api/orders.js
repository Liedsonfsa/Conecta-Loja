import api from "./config";

/**
 * Serviço de pedidos - Conecta-Loja
 *
 * Gerencia todas as operações CRUD de pedidos através da API.
 */
export const orderService = {
  /**
   * Busca todos os pedidos da loja (para funcionários/administradores)
   * @returns {Promise} Lista de todos os pedidos da loja
   */
  async getAllOrders() {
    const response = await api.get("/order/all");
    return response.data;
  },

  /**
   * Atualiza o status de um pedido
   * @param {number} orderId - ID do pedido
   * @param {object} updateData - Dados da atualização
   * @param {string} updateData.status - Novo status do pedido
   * @param {number} updateData.criadoPor - ID do funcionário que fez a atualização
   * @param {string} updateData.observacao - Observação da atualização
   * @param {boolean} updateData.notifyCustomer - Se deve notificar o cliente via WhatsApp
   * @returns {Promise} Pedido atualizado
   */
  async updateOrderStatus(orderId, updateData) {
    const response = await api.put(`/order/${orderId}/status`, updateData);
    return response.data;
  },

  /**
   * Busca todos os pedidos de um usuário
   * @param {number} usuarioId - ID do usuário
   * @returns {Promise} Lista de pedidos do usuário
   */
  async getUserOrders(usuarioId) {
    const response = await api.get(`/order?usuarioId=${usuarioId}`);
    return response.data;
  },

  /**
   * Cria um novo pedido
   * @param {object} orderData - Dados do pedido
   * @param {number} orderData.usuarioId - ID do usuário
   * @param {number} orderData.cupomId - ID do cupom (opcional)
   * @param {Array} orderData.produtos - Lista de produtos [{produtoId, quantidade, precoUnitario}]
   * @param {number} orderData.precoTotal - Preço total do pedido
   * @param {string} orderData.status - Status do pedido (opcional)
   * @returns {Promise} Pedido criado
   */
  async createOrder(orderData) {
    const response = await api.post("/order/cadastrar", orderData);
    return response.data;
  },

  /**
   * Exclui um pedido
   * @param {number} orderId - ID do pedido
   * @returns {Promise} Confirmação da exclusão
   */
  async deleteOrder(orderId) {
    const response = await api.delete(`/order/${orderId}`);
    return response.data;
  },
};

export default orderService;
