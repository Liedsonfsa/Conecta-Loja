"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configuração principal da aplicação Express - Conecta-Loja API
 *
 * Esta aplicação configura um servidor Express completo para a API REST
 * da plataforma Conecta-Loja, incluindo:
 *
 * Funcionalidades principais:
 * - Middleware para parsing de JSON e CORS
 * - Rotas básicas de teste e healthcheck
 * - Rotas da API organizadas por domínio (/api/*)
 * - Tratamento de requisições cross-origin
 *
 * Estrutura da API:
 * - GET / - Rota de teste básica
 * - GET /health - Healthcheck do servidor
 * - /api/user/* - Operações com usuários
 * - /api/employee/* - Operações com funcionários
 * - /api/auth/* - Autenticação e autorização
 */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Configuração do CORS para permitir requisições do frontend
// Em produção, deve ser configurado para aceitar apenas origens específicas
app.use((0, cors_1.default)({
    origin: "http://localhost:4028", // URL padrão do Vite em desenvolvimento
    credentials: true // Permite envio de cookies e headers de autorização
}));
// Middleware para parsing de JSON no corpo das requisições
app.use(express_1.default.json());
// Servir arquivos estáticos (imagens dos produtos)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
// Rota inicial de teste - útil para verificar se o servidor está respondendo
app.get("/", (req, res) => {
    res.send("Hello World");
});
// Rota de healthcheck - usada por load balancers e monitoramento
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Servidor rodando corretamente",
        timestamp: new Date().toISOString()
    });
});
// Montagem das rotas da API no prefixo /api
app.use('/api', routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map