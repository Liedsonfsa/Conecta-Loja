/**
 * Componente Label - Rótulo para controles de formulário
 *
 * Componente de rótulo baseado no Radix UI Label, com variantes
 * de estilização usando class-variance-authority. Projetado para
 * ser usado com inputs e outros controles de formulário.
 *
 * Características:
 * - Suporte a estado disabled de elementos associados
 * - Estilização consistente com o sistema de design
 * - Semântica HTML correta com label
 * - Integração com peer classes do Tailwind
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento label
 *
 * @returns {JSX.Element} Elemento label renderizado
 *
 * @example
 * // Label básico
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" />
 *
 * // Label com estado disabled
 * <Label htmlFor="disabled-input">Campo Desabilitado</Label>
 * <Input id="disabled-input" disabled />
 *
 * // Label com classes customizadas
 * <Label className="text-red-600 font-bold">Campo Obrigatório</Label>
 */

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
