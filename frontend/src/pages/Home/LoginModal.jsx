import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/api/auth";

const LoginModal = ({ children, onLogin }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');

      const response = await authService.login(email, password);

      // Armazenar o token no localStorage
      if (response.data && response.data.token) {
        console.log('💾 Salvando token no localStorage:', response.data.token.substring(0, 20) + '...');
        localStorage.setItem('authToken', response.data.token);
      } else {
        console.log('⚠️ Nenhum token recebido na resposta do login');
      }

      // Chamar onLogin com os dados do usuário
      if (response.data && response.data.user) {
        onLogin(response.data.user);
      }

      setOpen(false);
      toast({
        title: "Login realizado!",
        description: `Bem-vindo, ${response.data.user.name}!`,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Email ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        contact: formData.get('phone'), // O backend espera 'contact' para telefone
      };

      // Debug: log dos dados sendo enviados
      console.log('Dados sendo enviados para cadastro:', userData);

      // Verificar se todos os campos estão preenchidos
      if (!userData.name || !userData.email || !userData.password || !userData.contact) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const response = await authService.register(userData);

      // Após cadastro bem-sucedido, fazer login automático
      const loginResponse = await authService.login(userData.email, userData.password);

      // Armazenar o token no localStorage
      if (loginResponse.data && loginResponse.data.token) {
        console.log('💾 Salvando token no localStorage (cadastro):', loginResponse.data.token.substring(0, 20) + '...');
        localStorage.setItem('authToken', loginResponse.data.token);
      } else {
        console.log('⚠️ Nenhum token recebido na resposta do login automático após cadastro');
      }

      // Chamar onLogin com os dados do usuário
      if (loginResponse.data && loginResponse.data.user) {
        onLogin(loginResponse.data.user);
      }

      setOpen(false);
      toast({
        title: "Cadastro realizado!",
        description: `Bem-vindo, ${response.user.name}!`,
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
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
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;