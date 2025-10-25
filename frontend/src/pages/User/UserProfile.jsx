import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ButtonDash from "@/components/ui/ButtonDash";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit3,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect  } from "react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/api/userService";

/**
 * UserProfile - Página de perfil do usuário da aplicação Conecta-Loja
 *
 * Página moderna e profissional dedicada à visualização das informações pessoais do usuário,
 * com opções organizadas para gerenciar dados de contato, endereços e configurações da conta.
 * Interface limpa e intuitiva similar aos principais e-commerces, com botões de ação para edição.
 *
 * Funcionalidades principais:
 * - Visualização organizada das informações pessoais
 * - Botões de ação para editar dados pessoais e contato
 * - Gerenciamento de endereços de entrega
 * - Design responsivo e profissional
 *
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

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

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

    const getInitials = (name = "") => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const handleEditPersonalInfo = () => {
        // TODO: Implementar modal ou navegação para edição de dados pessoais
        toast({
            title: "Editar dados pessoais",
            description: "Funcionalidade em desenvolvimento.",
        });
    };

    const handleEditContact = () => {
        // TODO: Implementar modal ou navegação para edição de contato
        toast({
            title: "Editar contato",
            description: "Funcionalidade em desenvolvimento.",
        });
    };

    const handleManageAddresses = () => {
        navigate("/profile/addresses");
    };

    const handleAddAddress = () => {
        navigate("/profile/address/new");
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
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <ButtonDash variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </ButtonDash>
                    <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-32 w-32">
                                            <AvatarImage src="" alt={profile.name} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                                {getInitials(profile.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <ButtonDash size="icon" className="absolute -bottom-1 -right-1 h-10 w-10 rounded-full shadow-lg">
                                            <Camera className="h-4 w-4" />
                                        </ButtonDash>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informações Pessoais */}
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Informações Pessoais
                                </CardTitle>
                                <ButtonDash
                                    variant="outline"
                                    size="sm"
                                    iconName="Edit3"
                                    onClick={handleEditPersonalInfo}
                                >
                                    Editar
                                </ButtonDash>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Nome completo</p>
                                        <p className="text-gray-900">{profile.name}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contato */}
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-primary" />
                                    Contato
                                </CardTitle>
                                <ButtonDash
                                    variant="outline"
                                    size="sm"
                                    iconName="Edit3"
                                    onClick={handleEditContact}
                                >
                                    Editar
                                </ButtonDash>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-gray-900">{profile.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                                        <p className="text-gray-900">{profile.contact || 'Não informado'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Endereços */}
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Endereços de Entrega
                                </CardTitle>
                                <div className="flex gap-2">
                                    <ButtonDash
                                        variant="outline"
                                        size="sm"
                                        iconName="Settings"
                                        onClick={handleManageAddresses}
                                    >
                                        Gerenciar
                                    </ButtonDash>
                                    <ButtonDash
                                        variant="default"
                                        size="sm"
                                        iconName="Plus"
                                        onClick={handleAddAddress}
                                    >
                                        Adicionar
                                    </ButtonDash>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {profile.address ? (
                                    <div className="space-y-2">
                                        <p className="text-gray-900 font-medium">
                                            {profile.address.logradouro}, {profile.address.numero}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {profile.address.complemento && `${profile.address.complemento}, `}
                                            {profile.address.bairro}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {profile.address.cidade} - {profile.address.estado}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            CEP: {profile.address.cep}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-4">Nenhum endereço cadastrado</p>
                                        <ButtonDash
                                            variant="default"
                                            iconName="Plus"
                                            onClick={handleAddAddress}
                                        >
                                            Adicionar primeiro endereço
                                        </ButtonDash>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;