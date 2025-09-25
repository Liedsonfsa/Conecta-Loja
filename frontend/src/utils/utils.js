/**
 * Utilitários gerais da aplicação
 *
 * Este módulo contém funções utilitárias compartilhadas
 * pela aplicação, incluindo helpers para manipulação de CSS.
 *
 * @module utils
 */

/**
 * Utilitário para combinar classes CSS com Tailwind Merge
 *
 * Combina múltiplas classes CSS usando clsx para lógica condicional
 * e tailwind-merge para resolver conflitos de classes Tailwind,
 * garantindo que estilos específicos tenham prioridade sobre genéricos.
 *
 * @param {...string|Object|Array} inputs - Classes CSS a serem combinadas
 * @returns {string} String de classes CSS otimizada e sem conflitos
 *
 * @example
 * // Classes simples
 * cn("px-4 py-2", "bg-blue-500") // "px-4 py-2 bg-blue-500"
 *
 * // Com condições
 * cn("px-4", isActive && "bg-blue-500", "text-white") // "px-4 bg-blue-500 text-white"
 *
 * // Resolvendo conflitos (hover:bg-red-500 prevalece)
 * cn("hover:bg-blue-500", "hover:bg-red-500") // "hover:bg-red-500"
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
