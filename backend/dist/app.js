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
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
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