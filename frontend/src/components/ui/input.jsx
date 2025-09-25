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

import { cn } from "@/utils/utils";

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };