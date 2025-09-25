/**
 * Sistema de notificações toast para React
 *
 * Este módulo implementa um sistema completo de notificações toast
 * baseado em estado global e reducer. Permite criar, atualizar,
 * dispensar e remover notificações com controle de tempo.
 *
 * Principais funcionalidades:
 * - Limite de toasts simultâneos
 * - Controle de tempo de exibição
 * - Estados de abertura/fechamento
 * - Ações para manipular toasts
 *
 * @module use-toast
 */

import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

/**
 * Estrutura base de um toast
 * @typedef {Object} ToasterToast
 * @property {string} id - Identificador único do toast
 * @property {string|null} title - Título do toast
 * @property {string|null} description - Descrição do toast
 * @property {React.Component|null} action - Ação customizada do toast
 */
const ToasterToast = {
  id: "",
  title: null,
  description: null,
  action: null,
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

/**
 * Gera um ID único para cada toast
 * @returns {string} ID único do toast
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const ActionType = actionTypes;

const State = {
  toasts: [],
};

const toastTimeouts = new Map();

/**
 * Adiciona um toast à fila de remoção
 * @param {string} toastId - ID do toast a ser removido
 */
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Reducer para gerenciar o estado dos toasts
 * @param {Object} state - Estado atual
 * @param {Object} action - Ação a ser executada
 * @param {string} action.type - Tipo da ação
 * @param {Object} [action.toast] - Dados do toast (para ADD_TOAST e UPDATE_TOAST)
 * @param {string} [action.toastId] - ID do toast (para DISMISS_TOAST e REMOVE_TOAST)
 * @returns {Object} Novo estado após a ação
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

/**
 * Despacha uma ação para atualizar o estado global dos toasts
 * @param {Object} action - Ação a ser despachada
 */
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Cria e exibe um novo toast
 * @param {Object} props - Propriedades do toast
 * @param {string} [props.title] - Título do toast
 * @param {string} [props.description] - Descrição do toast
 * @param {React.Component} [props.action] - Ação customizada do toast
 * @returns {Object} Objeto com métodos para controlar o toast
 * @returns {string} returns.id - ID único do toast
 * @returns {Function} returns.dismiss - Função para dispensar o toast
 * @returns {Function} returns.update - Função para atualizar o toast
 *
 * @example
 * // Toast simples
 * toast({
 *   title: "Sucesso!",
 *   description: "Operação realizada com sucesso."
 * });
 *
 * // Toast com ação customizada
 * const { dismiss } = toast({
 *   title: "Erro",
 *   description: "Algo deu errado",
 *   action: <Button onClick={dismiss}>Fechar</Button>
 * });
 */
function toast({ ...props }) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * Hook principal para usar o sistema de toasts
 *
 * Retorna o estado atual dos toasts e funções para manipulá-los.
 * Este hook se inscreve automaticamente nas mudanças de estado global
 * e atualiza o componente quando necessário.
 *
 * @returns {Object} Estado e funções do sistema de toast
 * @returns {Array} returns.toasts - Array com todos os toasts ativos
 * @returns {Function} returns.toast - Função para criar um novo toast
 * @returns {Function} returns.dismiss - Função para dispensar um toast específico
 *
 * @example
 * // Uso básico em um componente
 * const MyComponent = () => {
 *   const { toast, dismiss, toasts } = useToast();
 *
 *   const handleAction = () => {
 *     toast({
 *       title: "Ação realizada!",
 *       description: "Tudo ocorreu bem."
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleAction}>Executar Ação</button>
 *       {toasts.map(t => (
 *         <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
 *       ))}
 *     </div>
 *   );
 * };
 */
function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
