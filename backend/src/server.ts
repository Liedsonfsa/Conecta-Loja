/**
 * Inicialização e configuração do servidor HTTP
 *
 * Este arquivo configura o servidor Express para ouvir na porta especificada
 * (padrão: 8000) e exibe uma mensagem de confirmação quando o servidor estiver rodando.
 */
import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
