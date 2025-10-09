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
import express from "express";
import cors from "cors";
import path from "path";
import routes from './routes';

const app = express();

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] >>> REQUISIÇÃO RECEBIDA: ${req.method} ${req.originalUrl}`);
    next();
});

// Configuração do CORS para permitir requisições do frontend
// Em produção, deve ser configurado para aceitar apenas origens específicas
app.use(cors({
    origin: "http://localhost:4028", // Ou a porta correta do seu frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
}));

// Middleware para parsing de JSON no corpo das requisições
app.use(express.json());

// Servir arquivos estáticos (imagens dos produtos)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
app.use('/api', routes);

export default app;
