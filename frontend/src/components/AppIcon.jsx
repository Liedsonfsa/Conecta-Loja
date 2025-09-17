import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

/**
 * Componente Icon - Renderiza ícones da biblioteca Lucide React
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.name - Nome do ícone da biblioteca Lucide (ex: "Home", "User", "Settings")
 * @param {number} [props.size=24] - Tamanho do ícone em pixels
 * @param {string} [props.color="currentColor"] - Cor do ícone
 * @param {string} [props.className=""] - Classes CSS adicionais
 * @param {number} [props.strokeWidth=2] - Largura do traço do ícone
 * @param {Object} props - Outras propriedades passadas para o elemento SVG
 *
 * @returns {JSX.Element} Elemento SVG do ícone ou ícone de ajuda se não encontrado
 *
 * @example
 * // Uso básico
 * <Icon name="Home" size={32} color="blue" />
 *
 * // Com classes CSS
 * <Icon name="User" className="text-primary" strokeWidth={1.5} />
 */
function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    const IconComponent = LucideIcons?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;