"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configuração principal da aplicação Express
 *
 * Esta aplicação configura um servidor Express com:
 * - Middleware para parsing de JSON
 * - Rotas básicas de teste e healthcheck
 * - Rotas da API agrupadas em /api
 */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Configuração do CORS para permitir requisições do frontend
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // URL padrão do Vite em desenvolvimento
    credentials: true
}));
app.use(express_1.default.json());
// Rota inicial de teste
app.get("/", (req, res) => {
    res.send("Hello World");
});
// Rota de healthcheck
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Servidor rodando corretamente" });
});
app.use('/api', routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map