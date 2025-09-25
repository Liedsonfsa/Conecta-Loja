/**
 * Hook personalizado para detectar se a tela está em modo mobile
 *
 * Este hook monitora a largura da tela e retorna true quando a largura
 * é menor que 768px (breakpoint padrão para mobile). Ele utiliza
 * window.matchMedia para detectar mudanças de tamanho de tela em tempo real.
 *
 * @returns {boolean} Retorna true se a tela estiver em modo mobile (< 768px), false caso contrário
 *
 * @example
 * // Uso básico em um componente
 * const MyComponent = () => {
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *     </div>
 *   );
 * };
 */
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
