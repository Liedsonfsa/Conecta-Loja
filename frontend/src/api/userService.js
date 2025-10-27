// Localização: frontend/src/api/userService.js

import api from "./config"; // Importa a configuração do Axios que você já tem

/**
 * Serviço para gerenciar os dados do perfil do usuário via API.
 */
export const userService = {
  /**
   * Busca os dados do perfil do usuário logado.
   * Chama a rota GET /api/profile no backend.
   * @returns {Promise<object>} Os dados do perfil do usuário.
   */
  async getProfile() {
    // O .data é importante pois o axios encapsula a resposta
    const response = await api.get("/profile");
    return response.data;
  },

  /**
   * Atualiza os dados do perfil do usuário.
   * Chama a rota PUT /api/profile no backend.
   * @param {object} profileData - Os novos dados do perfil a serem salvos.
   * @returns {Promise<object>} Os dados do perfil atualizados.
   */
  async updateProfile(profileData) {
    const response = await api.put("/profile", profileData);
    return response.data;
  },

  /**
   * Atualiza informações pessoais do usuário (nome, email, telefone).
   * Chama a rota PUT /api/profile/personal-info no backend.
   * @param {object} personalData - Os novos dados pessoais a serem salvos.
   * @param {string} [personalData.name] - Nome do usuário.
   * @param {string} [personalData.email] - Email do usuário.
   * @param {string} [personalData.contact] - Telefone do usuário.
   * @returns {Promise<object>} Os dados pessoais atualizados.
   */
  async updatePersonalInfo(personalData) {
    const response = await api.put("/profile/personal-info", personalData);
    return response.data;
  },
};
