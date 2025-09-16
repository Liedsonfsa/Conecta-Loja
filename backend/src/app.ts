import express from "express";

const app = express();

app.use(express.json());

// Rota inicial de teste
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Rota de healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor rodando corretamente" });
});

export default app;
