import api from "./config";

/**
 * Serviço de cargos - Conecta-Loja
 *
 * Gerencia todas as operações CRUD de cargos através da API.
 */
export const roleService = {
  /**
   * Busca todos os cargos com paginação e filtros
   * @param {object} params - Parâmetros de busca
   * @param {number} params.page - Página atual (opcional)
   * @param {number} params.limit - Limite de itens por página (opcional)
   * @param {string} params.search - Termo de busca (opcional)
   * @param {boolean} params.includeEmployees - Incluir funcionários na resposta (opcional)
   * @returns {Promise} Lista de cargos com paginação
   */
  async getAllRoles(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.includeEmployees !== undefined)
      queryParams.append(
        "includeEmployees",
        params.includeEmployees.toString()
      );

    const queryString = queryParams.toString();
    const url = `/role${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Busca estatísticas dos cargos
   * @returns {Promise} Estatísticas dos cargos
   */
  async getRoleStats() {
    const response = await api.get("/role/stats");
    return response.data;
  },

  /**
   * Busca um cargo específico por ID
   * @param {number} roleId - ID do cargo
   * @returns {Promise} Dados do cargo
   */
  async getRoleById(roleId) {
    const response = await api.get(`/role/${roleId}`);
    return response.data;
  },

  /**
   * Cria um novo cargo
   * @param {object} roleData - Dados do cargo
   * @param {string} roleData.name - Nome do cargo
   * @param {string} roleData.description - Descrição do cargo (opcional)
   * @returns {Promise} Cargo criado
   */
  async createRole(roleData) {
    const response = await api.post("/role", roleData);
    return response.data;
  },

  /**
   * Atualiza um cargo existente
   * @param {number} roleId - ID do cargo
   * @param {object} roleData - Dados para atualização
   * @param {string} roleData.name - Novo nome do cargo (opcional)
   * @param {string} roleData.description - Nova descrição do cargo (opcional)
   * @returns {Promise} Cargo atualizado
   */
  async updateRole(roleId, roleData) {
    const response = await api.put(`/role/${roleId}`, roleData);
    return response.data;
  },

  /**
   * Remove um cargo
   * @param {number} roleId - ID do cargo
   * @returns {Promise} Confirmação da exclusão
   */
  async deleteRole(roleId) {
    const response = await api.delete(`/role/${roleId}`);
    return response.data;
  },
};

export default roleService;
