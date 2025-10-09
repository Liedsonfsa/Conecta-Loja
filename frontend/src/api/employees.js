import api from "./config";

/**
 * Serviço de funcionários - Conecta-Loja
 *
 * Gerencia todas as operações CRUD de funcionários através da API.
 */
export const employeeService = {
  /**
   * Busca todos os funcionários com paginação e filtros
   * @param {object} params - Parâmetros de busca
   * @param {number} params.page - Página atual (opcional)
   * @param {number} params.limit - Limite de itens por página (opcional)
   * @param {string} params.search - Termo de busca por nome ou email (opcional)
   * @returns {Promise} Lista de funcionários com paginação
   */
  async getAllEmployees(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `/employee${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Busca um funcionário específico por ID
   * @param {number} employeeId - ID do funcionário
   * @returns {Promise} Dados do funcionário
   */
  async getEmployeeById(employeeId) {
    const response = await api.get(`/employee/${employeeId}`);
    return response.data;
  },

  /**
   * Cria um novo funcionário
   * @param {object} employeeData - Dados do funcionário
   * @param {string} employeeData.name - Nome do funcionário
   * @param {string} employeeData.email - Email do funcionário
   * @param {string} employeeData.password - Senha do funcionário
   * @param {string} employeeData.role - Cargo/função do funcionário
   * @param {number} employeeData.storeId - ID da loja
   * @returns {Promise} Funcionário criado
   */
  async createEmployee(employeeData) {
    const response = await api.post("/employee/cadastrar", employeeData);
    return response.data;
  },

  /**
   * Atualiza um funcionário existente
   * @param {number} employeeId - ID do funcionário
   * @param {object} employeeData - Dados para atualização
   * @param {string} employeeData.name - Novo nome (opcional)
   * @param {string} employeeData.email - Novo email (opcional)
   * @param {string} employeeData.password - Nova senha (opcional)
   * @param {string} employeeData.role - Novo cargo (opcional)
   * @param {number} employeeData.storeId - Novo ID da loja (opcional)
   * @returns {Promise} Funcionário atualizado
   */
  async updateEmployee(employeeId, employeeData) {
    const response = await api.put(
      `/employee/editar/${employeeId}`,
      employeeData
    );
    return response.data;
  },

  /**
   * Remove um funcionário
   * @param {number} employeeId - ID do funcionário
   * @returns {Promise} Confirmação da exclusão
   */
  async deleteEmployee(employeeId) {
    const response = await api.delete(`/employee/${employeeId}`);
    return response.data;
  },
};

export default employeeService;
