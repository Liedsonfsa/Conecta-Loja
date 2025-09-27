import api from "./config";

/**
 * Serviço de produtos - Conecta-Loja
 *
 * Gerencia todas as operações CRUD de produtos através da API.
 */
export const productService = {
  /**
   * Busca todos os produtos com paginação e filtros
   * @param {object} params - Parâmetros de busca
   * @param {number} params.page - Página atual (opcional)
   * @param {number} params.limit - Limite de itens por página (opcional)
   * @param {number} params.categoryId - ID da categoria para filtrar (opcional)
   * @param {boolean} params.available - Filtrar apenas produtos disponíveis (opcional)
   * @param {string} params.search - Termo de busca (opcional)
   * @returns {Promise} Lista de produtos com paginação
   */
  async getAllProducts(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.categoryId)
      queryParams.append("categoryId", params.categoryId.toString());
    if (params.available !== undefined)
      queryParams.append("available", params.available.toString());
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `/product${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Busca apenas produtos disponíveis
   * @returns {Promise} Lista de produtos disponíveis
   */
  async getAvailableProducts() {
    const response = await api.get("/product/available");
    return response.data;
  },

  /**
   * Busca um produto específico por ID
   * @param {number} productId - ID do produto
   * @returns {Promise} Dados do produto
   */
  async getProductById(productId) {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  },

  /**
   * Cria um novo produto
   * @param {object} productData - Dados do produto
   * @param {string} productData.name - Nome do produto
   * @param {string} productData.description - Descrição do produto
   * @param {number} productData.price - Preço do produto
   * @param {number} productData.categoryId - ID da categoria
   * @param {boolean} productData.available - Disponibilidade (opcional, padrão: true)
   * @param {number} productData.estoque - Quantidade em estoque (opcional, padrão: 0)
   * @param {string} productData.image - URL da imagem (opcional)
   * @param {number} productData.discount - Valor do desconto (opcional)
   * @param {string} productData.discountType - Tipo do desconto: 'PERCENTAGE' ou 'FIXED_VALUE' (opcional)
   * @returns {Promise} Produto criado
   */
  async createProduct(productData) {
    const response = await api.post("/product", productData);
    return response.data;
  },

  /**
   * Atualiza um produto existente
   * @param {number} productId - ID do produto
   * @param {object} productData - Dados para atualização (parcial)
   * @param {string} productData.name - Nome do produto (opcional)
   * @param {string} productData.description - Descrição (opcional)
   * @param {number} productData.price - Preço (opcional)
   * @param {number} productData.categoryId - ID da categoria (opcional)
   * @param {boolean} productData.available - Disponibilidade (opcional)
   * @param {number} productData.estoque - Quantidade em estoque (opcional)
   * @param {string} productData.image - URL da imagem (opcional)
   * @param {number} productData.discount - Valor do desconto (opcional)
   * @param {string} productData.discountType - Tipo do desconto (opcional)
   * @returns {Promise} Produto atualizado
   */
  async updateProduct(productId, productData) {
    const response = await api.put(`/product/${productId}`, productData);
    return response.data;
  },

  /**
   * Remove um produto
   * @param {number} productId - ID do produto
   * @returns {Promise} Confirmação da exclusão
   */
  async deleteProduct(productId) {
    const response = await api.delete(`/product/${productId}`);
    return response.data;
  },

  /**
   * Faz upload de imagem para um produto
   * @param {number} productId - ID do produto
   * @param {File} imageFile - Arquivo de imagem
   * @returns {Promise} Produto atualizado com nova imagem
   */
  async uploadProductImage(productId, imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post(
      `/product/${productId}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export default productService;
