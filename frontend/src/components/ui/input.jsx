/**
 * Componente Input - Campo de entrada customizável
 *
 * Componente de entrada de texto baseado no Radix UI, com estilização
 * personalizada usando Tailwind CSS. Suporta todos os tipos de input
 * HTML padrão e inclui foco visual, estados desabilitados e responsividade.
 *
 * Estilos incluídos:
 * - Bordas arredondadas e foco com ring
 * - Suporte a arquivos com estilos específicos
 * - Placeholder com cor muted
 * - Estados disabled e focus
 * - Responsividade para mobile/desktop
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {string} [props.type="text"] - Tipo do input HTML
 * @param {React.Ref} ref - Referência para o elemento input
 *
 * @returns {JSX.Element} Elemento input renderizado
 *
 * @example
 * // Input básico
 * <Input placeholder="Digite seu nome" />
 *
 * // Input de email
 * <Input type="email" placeholder="seu@email.com" />
 *
 * // Input com classes customizadas
 * <Input className="border-red-500" placeholder="Campo obrigatório" />
 */

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Base input classes
    const baseInputClasses =
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Checkbox-specific styles
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // Radio button-specific styles
    if (type === "radio") {
      return (
        <input
          type="radio"
          className={cn(
            "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // For regular inputs with wrapper structure
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          type={type}
          className={cn(
            baseInputClasses,
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
