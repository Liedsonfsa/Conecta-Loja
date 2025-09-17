import React from "react";
import Routes from "./Routes";

/**
 * App - Componente raiz da aplicação Conecta-Loja
 *
 * Este é o componente principal da aplicação React que serve como ponto de entrada.
 * Ele renderiza o sistema de roteamento que controla toda a navegação da aplicação.
 *
 * @returns {JSX.Element} Elemento raiz da aplicação com sistema de roteamento
 *
 * @example
 * // Renderizado em index.jsx
 * root.render(<App />);
 */
function App() {
  return (
    <Routes />
  );
}

export default App;