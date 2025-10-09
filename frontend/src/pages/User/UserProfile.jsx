import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect  } from "react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/api/userService";

/**
 * UserProfile - Página de perfil do usuário da aplicação Conecta-Loja
 *
 * Página dedicada à visualização e edição das informações pessoais do usuário,
 * permitindo gerenciar dados de contato, endereço e configurações da conta.
 * Interface intuitiva com formulários organizados em seções temáticas.
 *
 *
 * Estrutura de dados gerenciada:
 * - Nome completo e data de nascimento
 * - Email e telefone de contato

 * @example
 * // Rota configurada em Routes.jsx
 * <Route path="/profile" element={<UserProfile />} />
 *
 * @example
 * // Navegação via dropdown de usuário
 * <UserProfileDropdown user={currentUser} onLogout={handleLogout} />
 *
 */

const UserProfile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [profile, setProfile] = useState(null); // Inicia como nulo
    const [isLoading, setIsLoading] = useState(true); // Controla o "Carregando..."
    const [isSaving, setIsSaving] = useState(false); // Controla o botão "Salvar"

    // ESTE BLOCO BUSCA OS DADOS QUANDO A PÁGINA CARREGA
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await userService.getProfile();
                setProfile(userData);
            } catch (error) {
                toast({
                    title: "Erro ao carregar perfil",
                    description: error.message || "Não foi possível buscar seus dados.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [toast]);

    // ESTA FUNÇÃO SALVA AS ALTERAÇÕES
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await userService.updateProfile(profile);
            toast({
                title: "Perfil atualizado!",
                description: "Suas informações foram salvas com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro ao salvar",
                description: error.message || "Não foi possível atualizar seu perfil.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (name = "") => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando seu perfil...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Não foi possível carregar as informações do perfil.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Meu Perfil</h1>
                </div>

                {/* Profile Photo */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="" alt={profile.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                        {getInitials(profile.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <Button size="icon" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-semibold">{profile.name}</h2>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Endereco de entrega */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Endereço de Entrega
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Campos do endereço agora usam dados da API */}
                        <div><Label htmlFor="cep">CEP</Label><Input id="cep" value={profile.address?.cep || ''} readOnly /></div>
                        <div><Label htmlFor="rua">Rua</Label><Input id="rua" value={profile.address?.logradouro || ''} readOnly /></div>
                        {/* Adicione os outros campos de endereço aqui se necessário */}
                    </CardContent>
                </Card>

                {/* Informações Pessoais */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informações Pessoais
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label htmlFor="name">Nome completo</Label>
                            <Input id="name" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} />
                        </div>
                    </CardContent>
                </Card>

                {/* Contato */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Contato
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} />
                        </div>
                        <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" value={profile.contact} onChange={(e) => setProfile((prev) => ({ ...prev, contact: e.target.value }))} />
                        </div>
                    </CardContent>
                </Card>

                {/* Botão Salvar */}
                <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                    {isSaving ? "Salvando..." : <><Save className="mr-2 h-4 w-4" />Salvar Alterações</>}
                </Button>
            </div>
        </div>
    );
};

export default UserProfile;