import api from "./config";

/**
 * Serviço de relatórios - Conecta-Loja
 *
 * Gerencia as operações de obtenção de relatórios analíticos da aplicação.
 * Todas as requisições são feitas via API do backend.
 */
export const reportService = {
  /**
   * Busca um relatório conforme o período selecionado.
   * @param {object} params - Parâmetros do relatório.
   * @param {"today"|"week"|"month"|"year"|"custom"} params.period - Tipo de período.
   * @param {string} [params.startDate] - Data inicial (somente se period = "custom").
   * @param {string} [params.endDate] - Data final (somente se period = "custom").
   * @returns {Promise<object>} Dados consolidados do relatório.
   *
   * @example
   * // Relatório mensal
   * const data = await reportService.getReport({ period: "month" });
   *
   * // Relatório personalizado
   * const data = await reportService.getReport({
   *   period: "custom",
   *   startDate: "2025-01-01",
   *   endDate: "2025-01-31"
   * });
   */
  async getReport(params = { period: "month" }) {
    const queryParams = new URLSearchParams();

    if (params.period) queryParams.append("period", params.period);
    if (params.period === "custom" && params.startDate && params.endDate) {
      queryParams.append("startDate", params.startDate);
      queryParams.append("endDate", params.endDate);
    }

    const queryString = queryParams.toString();
    const url = `/report${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response.data;
  },

  /**
   * Exporta os dados do relatório em um formato específico (PDF, CSV, etc.)
   * — recurso opcional que pode ser implementado futuramente no backend.
   * @param {object} params - Parâmetros do relatório para exportação.
   * @param {"pdf"|"csv"} params.format - Formato do arquivo.
   * @param {string} params.period - Tipo de período.
   * @param {string} [params.startDate] - Data inicial (somente se period = "custom").
   * @param {string} [params.endDate] - Data final (somente se period = "custom").
   * @returns {Promise<Blob>} Arquivo gerado.
   */
  async exportReport(params) {
    const queryParams = new URLSearchParams();

    queryParams.append("format", params.format || "pdf");
    queryParams.append("period", params.period || "month");

    if (params.period === "custom" && params.startDate && params.endDate) {
      queryParams.append("startDate", params.startDate);
      queryParams.append("endDate", params.endDate);
    }

    const url = `/reports/export?${queryParams.toString()}`;

    const response = await api.get(url, { responseType: "blob" });
    return response.data;
  },
};

export default reportService;
