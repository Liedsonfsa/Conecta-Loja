import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
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

    // Estados para os modais de edição
    const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isSavingPersonal, setIsSavingPersonal] = useState(false);
    const [isSavingContact, setIsSavingContact] = useState(false);

    // Estados dos formulários
    const [personalForm, setPersonalForm] = useState({ name: "" });
    const [contactForm, setContactForm] = useState({ email: "", contact: "" });

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
        // Preencher o formulário com os dados atuais
        setPersonalForm({ name: profile.name });
        setIsPersonalInfoModalOpen(true);
    };

    const handleEditContact = () => {
        // Preencher o formulário com os dados atuais
        setContactForm({
            email: profile.email,
            contact: profile.contact || ""
        });
        setIsContactModalOpen(true);
    };

    const handleSavePersonalInfo = async () => {
        if (!personalForm.name.trim()) {
            toast({
                title: "Nome obrigatório",
                description: "Por favor, digite seu nome.",
                variant: "destructive",
            });
            return;
        }

        setIsSavingPersonal(true);
        try {
            await userService.updatePersonalInfo({
                name: personalForm.name.trim()
            });
            setProfile(prev => ({ ...prev, name: personalForm.name.trim() }));
            setIsPersonalInfoModalOpen(false);
            toast({
                title: "Nome atualizado",
                description: "Seu nome foi atualizado com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro ao atualizar nome",
                description: error.message || "Não foi possível atualizar seu nome.",
                variant: "destructive",
            });
        } finally {
            setIsSavingPersonal(false);
        }
    };

    const handleSaveContact = async () => {
        if (!contactForm.email.trim()) {
            toast({
                title: "Email obrigatório",
                description: "Por favor, digite seu email.",
                variant: "destructive",
            });
            return;
        }

        const updates = {};

        if (contactForm.email.trim() !== profile.email) {
            updates.email = contactForm.email.trim();
        }

        if (contactForm.contact.trim() !== (profile.contact || "")) {
            updates.contact = contactForm.contact.trim();
        }

        if (Object.keys(updates).length > 0) {
            setIsSavingContact(true);
            try {
                await userService.updatePersonalInfo(updates);
                setProfile(prev => ({ ...prev, ...updates }));
                setIsContactModalOpen(false);
                toast({
                    title: "Contato atualizado",
                    description: "Seus dados de contato foram atualizados com sucesso.",
                });
            } catch (error) {
                toast({
                    title: "Erro ao atualizar contato",
                    description: error.message || "Não foi possível atualizar seus dados de contato.",
                    variant: "destructive",
                });
            } finally {
                setIsSavingContact(false);
            }
        } else {
            setIsContactModalOpen(false);
        }
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
                                <Dialog open={isPersonalInfoModalOpen} onOpenChange={setIsPersonalInfoModalOpen}>
                                    <DialogTrigger asChild>
                                        <ButtonDash
                                            variant="outline"
                                            size="sm"
                                            iconName="Edit3"
                                            onClick={handleEditPersonalInfo}
                                        >
                                            Editar
                                        </ButtonDash>
                                    </DialogTrigger>
                                </Dialog>
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
                                <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                                    <DialogTrigger asChild>
                                        <ButtonDash
                                            variant="outline"
                                            size="sm"
                                            iconName="Edit3"
                                            onClick={handleEditContact}
                                        >
                                            Editar
                                        </ButtonDash>
                                    </DialogTrigger>
                                </Dialog>
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

            {/* Modal de edição de informações pessoais */}
            <Dialog open={isPersonalInfoModalOpen} onOpenChange={setIsPersonalInfoModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Informações Pessoais</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name" className="text-sm font-medium">
                                Nome completo
                            </Label>
                            <Input
                                id="edit-name"
                                value={personalForm.name}
                                onChange={(e) => setPersonalForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Digite seu nome completo"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsPersonalInfoModalOpen(false)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <ButtonDash
                                variant="default"
                                onClick={handleSavePersonalInfo}
                                loading={isSavingPersonal}
                                disabled={isSavingPersonal}
                                className="flex-1"
                            >
                                {isSavingPersonal ? "Salvando..." : "Salvar"}
                            </ButtonDash>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de edição de contato */}
            <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Contato</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="Digite seu email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-phone" className="text-sm font-medium">
                                Telefone
                            </Label>
                            <Input
                                id="edit-phone"
                                value={contactForm.contact}
                                onChange={(e) => setContactForm(prev => ({ ...prev, contact: e.target.value }))}
                                placeholder="Digite seu telefone"
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsContactModalOpen(false)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <ButtonDash
                                variant="default"
                                onClick={handleSaveContact}
                                loading={isSavingContact}
                                disabled={isSavingContact}
                                className="flex-1"
                            >
                                {isSavingContact ? "Salvando..." : "Salvar"}
                            </ButtonDash>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserProfile;