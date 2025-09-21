"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Inicialização e configuração do servidor HTTP
 *
 * Este arquivo configura o servidor Express para ouvir na porta especificada
 * (padrão: 8000) e exibe uma mensagem de confirmação quando o servidor estiver rodando.
 */
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8000;
app_1.default.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map