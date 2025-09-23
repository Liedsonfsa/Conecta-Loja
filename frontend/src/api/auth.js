import axios from "axios";

/**
 * Configuração base do axios
 */
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor para adicionar token JWT automaticamente nas requisições
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratamento de respostas
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento específico de erros
    if (error.response) {
      // Erro da API (status code fora do range 2xx)
      const { status, data } = error.response;

      // Debug: log da resposta completa do erro
      console.log("Erro da API:", { status, data });

      switch (status) {
        case 400:
          // Para erros de validação, incluir detalhes específicos
          if (data.details && Array.isArray(data.details)) {
            const errorMessages = data.details
              .map((detail) => `${detail.field}: ${detail.message}`)
              .join(", ");
            throw new Error(`Dados inválidos: ${errorMessages}`);
          }
          throw new Error(data.error || "Dados inválidos");
        case 401:
          // Token expirado ou inválido
          localStorage.removeItem("authToken");
          throw new Error("Sessão expirada. Faça login novamente.");
        case 409:
          throw new Error(data.error || "Conflito de dados");
        case 500:
          throw new Error("Erro interno do servidor");
        default:
          throw new Error(data.error || data.message || "Erro desconhecido");
      }
    } else if (error.request) {
      // Erro de rede
      throw new Error("Erro de conexão. Verifique sua internet.");
    } else {
      // Outro tipo de erro
      throw new Error(error.message || "Erro inesperado");
    }
  }
);

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

export default api;
