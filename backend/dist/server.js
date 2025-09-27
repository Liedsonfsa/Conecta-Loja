"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Inicialização e configuração do servidor HTTP - Conecta-Loja API
 *
 * Este arquivo configura e inicia o servidor Express da API Conecta-Loja,
 * definindo a porta de escuta (padrão: 8000) e exibindo confirmação
 * quando o servidor estiver pronto para receber conexões.
 *
 * Funcionalidades:
 * - Configuração da porta via variável de ambiente PORT
 * - Fallback para porta 8000 se não especificada
 * - Log de inicialização com URL de acesso
 * - Confirmação visual de que o servidor está funcionando
 */
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8000;
app_1.default.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=server.js.map