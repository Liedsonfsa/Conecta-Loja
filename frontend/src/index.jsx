/**
 * Ponto de entrada da aplicação Conecta-Loja
 *
 * Este arquivo inicializa a aplicação React criando a raiz do DOM
 * e renderizando o componente App. Também importa os estilos globais
 * do Tailwind CSS e do tema personalizado.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);