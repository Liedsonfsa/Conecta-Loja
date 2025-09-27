/**
 * Componentes AlertDialog - Modal de confirmação/alerta
 *
 * Conjunto de componentes para criar modais de confirmação acessíveis.
 * Baseado no Radix UI Dialog, mas otimizado para alertas e confirmações.
 *
 * Componentes incluídos:
 * - AlertDialog: Container raiz do modal de alerta
 * - AlertDialogTrigger: Elemento que abre o modal
 * - AlertDialogContent: Conteúdo principal do modal
 * - AlertDialogHeader: Cabeçalho do modal
 * - AlertDialogFooter: Rodapé do modal
 * - AlertDialogTitle: Título do modal
 * - AlertDialogDescription: Descrição do modal
 * - AlertDialogAction: Botão de ação principal (confirmar)
 * - AlertDialogCancel: Botão de cancelamento
 *
 * @module alert-dialog
 */

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/utils/utils";

/**
 * Container raiz do modal de alerta. Controla o estado aberto/fechado.
 * @type {React.Component}
 */
const AlertDialog = AlertDialogPrimitive.Root;

/**
 * Elemento trigger que abre o modal de alerta quando clicado.
 * @type {React.Component}
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

/**
 * Portal para renderizar o modal de alerta fora da árvore DOM normal.
 * @type {React.Component}
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal;

/**
 * Overlay escuro que cobre a tela atrás do modal de alerta.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento overlay
 */
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[1030] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

/**
 * Conteúdo principal do modal de alerta.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Conteúdo do modal
 * @param {React.Ref} ref - Referência para o elemento de conteúdo
 */
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-[1040] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

/**
 * Cabeçalho do modal de alerta com layout responsivo.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 */
const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

/**
 * Rodapé do modal de alerta com layout responsivo para botões.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 */
const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

/**
 * Título do modal de alerta com semântica adequada para acessibilidade.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento título
 */
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

/**
 * Descrição do modal de alerta com semântica adequada para acessibilidade.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento descrição
 */
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

/**
 * Botão de ação principal (confirmar) do modal de alerta.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o botão
 */
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4",
      className,
    )}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

/**
 * Botão de cancelamento do modal de alerta.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o botão
 */
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      "mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 sm:mt-0",
      className,
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
