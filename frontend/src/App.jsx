import React from "react";
import Routes from "./Routes";
import { StoreProvider } from "./contexts/StoreContext";

/**
 * App - Componente raiz da aplicação Conecta-Loja
 *
 * Este é o componente principal da aplicação React que serve como ponto de entrada.
 * Ele renderiza o sistema de roteamento que controla toda a navegação da aplicação.
 * Inclui o provedor do contexto da loja para gerenciar o estado global da aplicação.
 *
 * @returns {JSX.Element} Elemento raiz da aplicação com sistema de roteamento
 *
 * @example
 * // Renderizado em index.jsx
 * root.render(<App />);
 */
function App() {
  return (
      <StoreProvider>
          <Routes />
      </StoreProvider>

  );
}

export default App;
