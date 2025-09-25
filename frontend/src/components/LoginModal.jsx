/**
 * Modal de autenticação - Login e Cadastro
 *
 * Componente modal que fornece interface para login e cadastro de usuários.
 * Utiliza abas para alternar entre os modos de login e registro, com validação
 * de formulários e feedback visual através de toasts.
 *
 * Funcionalidades:
 * - Modal controlado por estado local
 * - Abas para alternar entre login e cadastro
 * - Validação básica de formulários
 * - Integração com sistema de notificações toast
 * - Simulação de autenticação (dados mock)
 *
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Elemento trigger para abrir o modal
 * @param {Function} props.onLogin - Callback chamado após login/cadastro bem-sucedido
 * @param {Object} props.onLogin.user - Dados do usuário logado
 * @param {string} props.onLogin.user.id - ID único do usuário
 * @param {string} props.onLogin.user.name - Nome completo do usuário
 * @param {string} props.onLogin.user.email - Email do usuário
 * @param {string} props.onLogin.user.phone - Telefone do usuário
 * @param {string} props.onLogin.user.address - Endereço do usuário
 *
 * @returns {JSX.Element} Modal de autenticação renderizado
 *
 * @example
 * // Uso básico
 * <LoginModal onLogin={handleUserLogin}>
 *   <Button>Entrar</Button>
 * </LoginModal>
 *
 * @example
 * // Com callback personalizado
 * const handleLogin = (user) => {
 *   console.log('Usuário logado:', user);
 *   // Redirecionar ou atualizar estado da aplicação
 * };
 *
 * <LoginModal onLogin={handleLogin}>
 *   <Button variant="outline">Fazer Login</Button>
 * </LoginModal>
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginModal = ({ children, onLogin }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  /**
   * Manipula o envio do formulário de login
   * @param {Event} e - Evento de submit do formulário
   */
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    // Simulação de login
    const mockUser = {
      id: "1",
      name: "João Silva",
      email: email,
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123 - São Paulo, SP",
    };

    onLogin(mockUser);
    setOpen(false);
    toast({
      title: "Login realizado!",
      description: `Bem-vindo, ${mockUser.name}!`,
    });
  };

  /**
   * Manipula o envio do formulário de cadastro
   * @param {Event} e - Evento de submit do formulário
   */
  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");

    // Simulação de cadastro
    const mockUser = {
      id: "1",
      name: name,
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: "Não informado",
    };

    onLogin(mockUser);
    setOpen(false);
    toast({
      title: "Cadastro realizado!",
      description: `Bem-vindo, ${mockUser.name}!`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Acesse sua conta</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(11) 99999-9999"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Criar conta
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
