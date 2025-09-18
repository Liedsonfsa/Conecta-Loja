import React from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Button - Componente de botão reutilizável e altamente customizável
 *
 * Componente versátil que suporta múltiplas variantes, tamanhos e estilos,
 * utilizando class-variance-authority (CVA) para gerenciamento de variantes
 * e Tailwind CSS para estilização.
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.text="Adicionar ao Carrinho"] - Texto do botão
 * @param {string} [props.variant="primary"] - Variante visual: "primary" | "secondary" | "outline"
 * @param {string} [props.size="medium"] - Tamanho do botão: "small" | "medium" | "large"
 * @param {boolean} [props.disabled=false] - Se o botão está desabilitado
 * @param {Function} [props.onClick] - Função chamada ao clicar no botão
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {Object} [props.leftImage] - Imagem à esquerda com propriedades src, width, height
 * @param {string} [props.type="button"] - Tipo do botão HTML
 *
 * @param {Object} [props.text_font_size] - Tamanho da fonte do texto (inline style)
 * @param {string} [props.text_font_family] - Família da fonte
 * @param {string} [props.text_font_weight] - Peso da fonte
 * @param {string} [props.text_line_height] - Altura da linha
 * @param {string} [props.text_text_align] - Alinhamento do texto
 * @param {string} [props.text_color] - Cor do texto
 * @param {string} [props.fill_background] - Cor de fundo (inline style)
 * @param {string} [props.fill_background_color] - Cor de fundo alternativa
 * @param {string} [props.border_border] - Estilo da borda
 * @param {string} [props.border_border_radius] - Raio da borda
 * @param {string} [props.effect_box_shadow] - Sombra do botão
 * @param {string} [props.layout_width] - Largura do layout
 * @param {string} [props.padding] - Padding interno
 * @param {string} [props.position] - Posicionamento CSS
 * @param {string} [props.layout_gap] - Espaçamento entre elementos
 *
 * @returns {JSX.Element} Elemento button renderizado
 *
 * @example
 * // Botão primário simples
 * <Button text="Clique aqui" variant="primary" onClick={handleClick} />
 *
 * // Botão com imagem à esquerda
 * <Button
 *   text="Adicionar ao Carrinho"
 *   leftImage={{ src: "/cart-icon.png", width: 20, height: 20 }}
 *   variant="primary"
 * />
 *
 * // Botão outline customizado
 * <Button
 *   text="Cancelar"
 *   variant="outline"
 *   size="large"
 *   text_color="#666"
 *   border_border="2px solid #ccc"
 * />
 */

const buttonClasses = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'hover:opacity-90 focus:ring-orange-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border-2 bg-transparent hover:bg-opacity-10 focus:ring-orange-500',
      },
      size: {
        small: 'text-sm px-3 py-1.5',
        medium: 'text-base px-4 py-2',
        large: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

const Button = ({
  // Required parameters with defaults
  text = "Adicionar ao Carrinho",
  text_font_size = "13",
  text_font_family = "Inter",
  text_font_weight = "400",
  text_line_height = "17px",
  text_text_align = "center",
  text_color = "#ffffff",
  fill_background_color = "#ff6600",
  border_border_radius = "10px",
  effect_box_shadow = "0px 2px 8px #2a262219",
  
  // Optional parameters (no defaults)
  fill_background,
  border_border,
  layout_width,
  padding,
  position,
  layout_gap,
  
  // Standard React props
  variant,
  size,
  disabled = false,
  className,
  children,
  onClick,
  type = "button",
  leftImage,
  ...props
}) => {
  // Safe validation for optional parameters
  const hasValidBackground = fill_background && typeof fill_background === 'string' && fill_background?.trim() !== '';
  const hasValidBorder = border_border && typeof border_border === 'string' && border_border?.trim() !== '';
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
    hasValidGap ? `gap-[${layout_gap}]` : '',
  ]?.filter(Boolean)?.join(' ');

  // Build inline styles for required parameters
  const buttonStyles = {
    fontSize: text_font_size ? `${text_font_size}px` : '13px',
    fontFamily: text_font_family || 'Inter',
    fontWeight: text_font_weight || '400',
    lineHeight: text_line_height || '17px',
    textAlign: text_text_align || 'center',
    color: text_color || '#ffffff',
    backgroundColor: hasValidBackground ? fill_background : (fill_background_color || '#ff6600'),
    borderRadius: border_border_radius || '10px',
    boxShadow: effect_box_shadow || '0px 2px 8px #2a262219',
    border: hasValidBorder ? border_border : 'none',
  };

  // Safe click handler
  const handleClick = (event) => {
    if (disabled) return;
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      style={buttonStyles}
      className={twMerge(
        buttonClasses({ variant, size }),
        optionalClasses,
        className
      )}
      aria-disabled={disabled}
      {...props}
    >
      {leftImage && (
        <img 
          src={leftImage?.src} 
          alt="" 
          className="w-4 h-4 mr-2"
          style={{ width: `${leftImage?.width}px`, height: `${leftImage?.height}px` }}
        />
      )}
      {children || text}
    </button>
  );
};

export default Button;