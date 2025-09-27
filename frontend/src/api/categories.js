import api from "./config";

/**
 * Serviço de categorias - Conecta-Loja
 *
 * Gerencia todas as operações CRUD de categorias através da API.
 */
export const categoryService = {
  /**
   * Busca todas as categorias com paginação e filtros
   * @param {object} params - Parâmetros de busca
   * @param {number} params.page - Página atual (opcional)
   * @param {number} params.limit - Limite de itens por página (opcional)
   * @param {string} params.search - Termo de busca (opcional)
   * @param {boolean} params.includeProducts - Incluir produtos na resposta (opcional)
   * @returns {Promise} Lista de categorias com paginação
   */
  async getAllCategories(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.includeProducts !== undefined)
      queryParams.append("includeProducts", params.includeProducts.toString());

    const queryString = queryParams.toString();
    const url = `/category${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Busca estatísticas das categorias
   * @returns {Promise} Estatísticas das categorias
   */
  async getCategoryStats() {
    const response = await api.get("/category/stats");
    return response.data;
  },

  /**
   * Busca uma categoria específica por ID
   * @param {number} categoryId - ID da categoria
   * @returns {Promise} Dados da categoria
   */
  async getCategoryById(categoryId) {
    const response = await api.get(`/category/${categoryId}`);
    return response.data;
  },

  /**
   * Cria uma nova categoria
   * @param {object} categoryData - Dados da categoria
   * @param {string} categoryData.name - Nome da categoria
   * @returns {Promise} Categoria criada
   */
  async createCategory(categoryData) {
    const response = await api.post("/category", categoryData);
    return response.data;
  },

  /**
   * Atualiza uma categoria existente
   * @param {number} categoryId - ID da categoria
   * @param {object} categoryData - Dados para atualização
   * @param {string} categoryData.name - Novo nome da categoria (opcional)
   * @returns {Promise} Categoria atualizada
   */
  async updateCategory(categoryId, categoryData) {
    const response = await api.put(`/category/${categoryId}`, categoryData);
    return response.data;
  },

  /**
   * Remove uma categoria
   * @param {number} categoryId - ID da categoria
   * @returns {Promise} Confirmação da exclusão
   */
  async deleteCategory(categoryId) {
    const response = await api.delete(`/category/${categoryId}`);
    return response.data;
  },
};

export default categoryService;
