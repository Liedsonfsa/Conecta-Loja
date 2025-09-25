/**
 * Componentes Dialog - Modal customizável
 *
 * Conjunto de componentes para criar modais acessíveis baseados no Radix UI Dialog.
 * Inclui overlay, conteúdo, cabeçalho, rodapé e botões de controle com animações
 * e foco adequados para acessibilidade.
 *
 * Componentes incluídos:
 * - Dialog: Container raiz do modal
 * - DialogTrigger: Elemento que abre o modal
 * - DialogContent: Conteúdo principal do modal
 * - DialogHeader: Cabeçalho do modal
 * - DialogFooter: Rodapé do modal
 * - DialogTitle: Título do modal
 * - DialogDescription: Descrição do modal
 * - DialogClose: Botão para fechar o modal
 *
 * @module dialog
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/utils/utils";

/**
 * Container raiz do modal. Controla o estado aberto/fechado.
 * @type {React.Component}
 */
const Dialog = DialogPrimitive.Root;

/**
 * Elemento trigger que abre o modal quando clicado.
 * @type {React.Component}
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Portal para renderizar o modal fora da árvore DOM normal.
 * @type {React.Component}
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * Botão para fechar o modal.
 * @type {React.Component}
 */
const DialogClose = DialogPrimitive.Close;

/**
 * Overlay escuro que cobre a tela atrás do modal.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento overlay
 */
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Conteúdo principal do modal com botão de fechar integrado.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Conteúdo do modal
 * @param {React.Ref} ref - Referência para o elemento de conteúdo
 */
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * Cabeçalho do modal com layout responsivo.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 */
const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

/**
 * Rodapé do modal com layout responsivo para botões.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 */
const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

/**
 * Título do modal com semântica adequada para acessibilidade.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento título
 */
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * Descrição do modal com semântica adequada para acessibilidade.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento descrição
 */
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};