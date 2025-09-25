/**
 * Componentes Tabs - Sistema de navegação por abas
 *
 * Conjunto de componentes para criar interfaces com abas baseadas no Radix UI Tabs.
 * Permite alternar entre diferentes conteúdos através de botões de navegação.
 *
 * Componentes incluídos:
 * - Tabs: Container raiz das abas
 * - TabsList: Container para os botões das abas
 * - TabsTrigger: Botão individual de aba
 * - TabsContent: Conteúdo associado a uma aba
 *
 * @module tabs
 */

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/utils/utils";

/**
 * Container raiz das abas. Gerencia o estado ativo.
 * @type {React.Component}
 */
const Tabs = TabsPrimitive.Root;

/**
 * Container para os botões das abas.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento lista
 */
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Botão individual para uma aba.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento trigger
 */
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Conteúdo associado a uma aba específica.
 * @param {Object} props - Propriedades do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {React.Ref} ref - Referência para o elemento conteúdo
 */
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };