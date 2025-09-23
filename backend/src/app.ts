/**
 * Configuração principal da aplicação Express
 *
 * Esta aplicação configura um servidor Express com:
 * - Middleware para parsing de JSON
 * - Rotas básicas de teste e healthcheck
 * - Rotas da API agrupadas em /api
 */
import express from "express";
import cors from "cors";
import routes from './routes';

const app = express();

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: "http://localhost:4028", // URL padrão do Vite em desenvolvimento
  credentials: true
}));

app.use(express.json());

// Rota inicial de teste
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Rota de healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor rodando corretamente" });
});

app.use('/api', routes);

export default app;
