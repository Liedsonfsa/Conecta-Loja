// Localização: frontend/src/api/userService.js

import api from './config'; // Importa a configuração do Axios que você já tem

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
        const response = await api.get('/profile');
        return response.data;
    },

    /**
     * Atualiza os dados do perfil do usuário.
     * Chama a rota PUT /api/profile no backend.
     * @param {object} profileData - Os novos dados do perfil a serem salvos.
     * @returns {Promise<object>} Os dados do perfil atualizados.
     */
    async updateProfile(profileData) {
        const response = await api.put('/profile', profileData);
        return response.data;
    },
};