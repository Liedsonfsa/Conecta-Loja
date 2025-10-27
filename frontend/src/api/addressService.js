// Localização: frontend/src/api/addressService.js

import api from "./config"; // Importa a configuração do Axios

/**
 * Serviço para gerenciar endereços do usuário via API.
 */
export const addressService = {
  /**
   * Busca todos os endereços do usuário logado.
   * Chama a rota GET /api/profile/addresses no backend.
   * @returns {Promise<object>} Lista de endereços do usuário.
   */
  async getUserAddresses() {
    const response = await api.get("/profile/addresses");
    return response.data;
  },

  /**
   * Busca um endereço específico por ID.
   * Chama a rota GET /api/profile/addresses/:id no backend.
   * @param {number} addressId - ID do endereço.
   * @returns {Promise<object>} Dados do endereço.
   */
  async getAddressById(addressId) {
    const response = await api.get(`/profile/addresses/${addressId}`);
    return response.data;
  },

  /**
   * Cria um novo endereço para o usuário.
   * Chama a rota POST /api/profile/addresses no backend.
   * @param {object} addressData - Dados do endereço a ser criado.
   * @returns {Promise<object>} Endereço criado.
   */
  async createAddress(addressData) {
    const response = await api.post("/profile/addresses", addressData);
    return response.data;
  },

  /**
   * Atualiza um endereço existente.
   * Chama a rota PUT /api/profile/addresses/:id no backend.
   * @param {number} addressId - ID do endereço.
   * @param {object} addressData - Dados atualizados do endereço.
   * @returns {Promise<object>} Endereço atualizado.
   */
  async updateAddress(addressId, addressData) {
    const response = await api.put(
      `/profile/addresses/${addressId}`,
      addressData
    );
    return response.data;
  },

  /**
   * Remove um endereço.
   * Chama a rota DELETE /api/profile/addresses/:id no backend.
   * @param {number} addressId - ID do endereço a ser removido.
   * @returns {Promise<object>} Confirmação de remoção.
   */
  async deleteAddress(addressId) {
    const response = await api.delete(`/profile/addresses/${addressId}`);
    return response.data;
  },

  /**
   * Define um endereço como principal.
   * Chama a rota PATCH /api/profile/addresses/:id/principal no backend.
   * @param {number} addressId - ID do endereço a ser definido como principal.
   * @returns {Promise<object>} Endereço atualizado.
   */
  async setAddressAsPrincipal(addressId) {
    const response = await api.patch(
      `/profile/addresses/${addressId}/principal`
    );
    return response.data;
  },
};
