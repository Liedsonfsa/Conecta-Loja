import api from './config';

/**
 * Serviço de endereços - Conecta-Loja
 *
 * Gerencia todas as operações CRUD de endereços de usuários através da API.
 */
export const addressService = {
  /**
   * Busca todos os endereços do usuário logado
   * @returns {Promise} Lista de endereços do usuário
   */
  async getUserAddresses() {
    const response = await api.get('/profile/addresses');
    return response.data;
  },

  /**
   * Busca um endereço específico por ID
   * @param {number} addressId - ID do endereço
   * @returns {Promise} Dados do endereço
   */
  async getAddressById(addressId) {
    const response = await api.get(`/profile/addresses/${addressId}`);
    return response.data;
  },

  /**
   * Cria um novo endereço para o usuário
   * @param {object} addressData - Dados do endereço
   * @param {string} addressData.cep - CEP
   * @param {string} addressData.logradouro - Logradouro
   * @param {string} addressData.numero - Número
   * @param {string} addressData.complemento - Complemento (opcional)
   * @param {string} addressData.informacoes_adicionais - Informações adicionais (opcional)
   * @param {string} addressData.bairro - Bairro
   * @param {string} addressData.cidade - Cidade
   * @param {string} addressData.estado - Estado (UF)
   * @returns {Promise} Endereço criado
   */
  async createAddress(addressData) {
    const response = await api.post('/profile/addresses', addressData);
    return response.data;
  },

  /**
   * Atualiza um endereço existente
   * @param {number} addressId - ID do endereço
   * @param {object} addressData - Dados atualizados do endereço
   * @returns {Promise} Endereço atualizado
   */
  async updateAddress(addressId, addressData) {
    const response = await api.put(`/profile/addresses/${addressId}`, addressData);
    return response.data;
  },

  /**
   * Remove um endereço
   * @param {number} addressId - ID do endereço
   * @returns {Promise} Confirmação da exclusão
   */
  async deleteAddress(addressId) {
    const response = await api.delete(`/profile/addresses/${addressId}`);
    return response.data;
  },
};

export default addressService;
