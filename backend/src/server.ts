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
import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});
