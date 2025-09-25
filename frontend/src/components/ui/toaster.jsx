/**
 * Toaster - Componente de renderização de notificações toast
 *
 * Componente que gerencia a exibição de múltiplas notificações toast
 * na aplicação. Utiliza o hook useToast para obter o estado atual
 * dos toasts e renderiza cada um com título, descrição e ações.
 *
 * @returns {JSX.Element} Container com todos os toasts ativos renderizados
 *
 * @example
 * // Deve ser incluído no componente raiz da aplicação
 * <Toaster />
 */
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
