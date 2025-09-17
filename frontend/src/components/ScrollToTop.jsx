import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Componente que rola a página para o topo ao mudar de rota
 *
 * Este componente utiliza o hook useLocation do React Router para detectar
 * mudanças de rota e automaticamente rolar a página para o topo (0, 0).
 * É útil para melhorar a experiência do usuário em aplicações de página única.
 *
 * @returns {null} Não renderiza nenhum elemento visual
 *
 * @example
 * // Deve ser usado dentro de um BrowserRouter
 * <BrowserRouter>
 *   <ScrollToTop />
 *   <Routes>...</Routes>
 * </BrowserRouter>
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;