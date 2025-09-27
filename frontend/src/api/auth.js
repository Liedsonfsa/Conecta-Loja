import api from "./config";

/**
 * Serviço de autenticação
 */
export const authService = {
  /**
   * Realiza login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Dados do login (token, user, etc.)
   */
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * Cadastra um novo usuário
   * @param {object} userData - Dados do usuário (name, email, password, contact)
   * @returns {Promise} Dados do usuário criado
   */
  async register(userData) {
    const response = await api.post("/user/cadastrar", userData);
    return response.data;
  },

  /**
   * Verifica se o token JWT é válido
   * @returns {Promise} Dados do usuário se token válido
   */
  async verifyToken() {
    const response = await api.get("/auth/verify");
    return response.data;
  },

  /**
   * Faz logout removendo o token
   */
  logout() {
    localStorage.removeItem("authToken");
  },
};
