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
import { useAuth } from "@/hooks/use-auth.js";
import { userService } from "@/api/userService";

/**
 * UserProfile - Página completa de perfil do usuário da aplicação Conecta-Loja
 *
 * Página moderna e profissional dedicada à visualização e edição das informações pessoais do usuário.
 * Suporta diferentes tipos de usuários (clientes e funcionários) com interfaces adaptadas.
 * Oferece gerenciamento completo de dados pessoais, contato, endereços e avatar.
 *
 * @component
 *
 * Funcionalidades principais:
 * - Visualização organizada das informações pessoais com avatar
 * - Edição de dados pessoais (nome, email, telefone para clientes)
 * - Gerenciamento de endereços de entrega (apenas para clientes)
 * - Upload e gerenciamento de avatar com preview
 * - Interface adaptada para funcionários (cargo, loja, informações profissionais)
 * - Design responsivo e profissional com cards organizados
 * - Tratamento robusto de erros com notificações toast
 *
 * Estados gerenciados:
 * - Dados do perfil do usuário carregados da API
 * - Estados de loading para diferentes operações
 * - Modais de edição (informações pessoais, contato)
 * - Estados de upload de avatar e exclusão
 * - Formulários de edição com validação
 *
 * Integrações principais:
 * - useAuth: Para detectar tipo de usuário (cliente/funcionário)
 * - userService: Para operações de perfil (busca, atualização, avatar)
 * - useToast: Para notificações de sucesso/erro
 * - useNavigate: Para navegação entre páginas
 *
 * Funcionalidades especiais:
 * - Suporte a diferentes tipos de usuário com interfaces adaptadas
 * - Upload de avatar com validação de tamanho e tipo
 * - Preview de avatar com fallback para iniciais
 * - Confirmação de exclusão de avatar
 * - Navegação integrada para gerenciamento de endereços
 *
 * @example
 * // Rota configurada em Routes.jsx
 * <Route path="/profile" element={<UserProfile />} />
 *
 * @example
 * // Navegação via dropdown de usuário
 * <UserProfileDropdown user={currentUser} onLogout={handleLogout} />
 *
 * @example
 * // Uso direto do componente
 * <UserProfile />
 */

const UserProfile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { userType } = useAuth();

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Estados para os modais de edição
    const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isDeleteAvatarModalOpen, setIsDeleteAvatarModalOpen] = useState(false);
    const [isSavingPersonal, setIsSavingPersonal] = useState(false);
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);

    // Estados dos formulários
    const [personalForm, setPersonalForm] = useState({ name: "" });
    const [contactForm, setContactForm] = useState({ email: "", contact: "" });

    // Estado para upload de avatar
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    /**
     * Busca os dados do perfil do usuário autenticado da API
     *
     * Carrega todas as informações do perfil (pessoal, contato, endereços, avatar)
     * e atualiza o estado local. Trata erros de carregamento com notificações.
     *
     * @async
     * @function fetchUserProfile
     * @returns {Promise<void>} Promise que resolve quando os dados são carregados
     *
     * @throws {Error} Quando há erro na comunicação com a API
     */
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

    useEffect(() => {
        fetchUserProfile();
    }, [toast]);

    /**
     * Gera iniciais do nome para o avatar fallback
     *
     * Extrai as primeiras letras de cada palavra do nome e cria uma string
     * de até 2 caracteres em maiúsculo para usar como fallback do avatar.
     *
     * @function getInitials
     * @param {string} [name=""] - Nome completo do usuário
     * @returns {string} Iniciais em maiúsculo (máximo 2 caracteres)
     *
     * @example
     * getInitials("João Silva"); // "JS"
     * getInitials("Maria"); // "MA"
     * getInitials(""); // ""
     */
    const getInitials = (name = "") => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    /**
     * Abre o modal de edição de informações pessoais
     *
     * Preenche o formulário com os dados atuais do perfil e abre
     * o modal de edição de informações pessoais (nome).
     *
     * @function handleEditPersonalInfo
     * @returns {void}
     */
    const handleEditPersonalInfo = () => {
        // Preencher o formulário com os dados atuais
        setPersonalForm({ name: profile.name });
        setIsPersonalInfoModalOpen(true);
    };

    /**
     * Abre o modal de edição de contato (apenas para clientes)
     *
     * Verifica se o usuário é cliente antes de abrir o modal.
     * Preenche o formulário com dados atuais de email e telefone.
     *
     * @function handleEditContact
     * @returns {void}
     */
    const handleEditContact = () => {
        // Só permite edição de contato para clientes
        if (userType === 'cliente') {
            // Preencher o formulário com os dados atuais
            setContactForm({
                email: profile.email,
                contact: profile.contact || ""
            });
            setIsContactModalOpen(true);
        }
    };

    /**
     * Salva as alterações das informações pessoais
     *
     * Valida e salva o nome atualizado através da API.
     * Fecha o modal e mostra notificações de sucesso/erro.
     *
     * @async
     * @function handleSavePersonalInfo
     * @returns {Promise<void>} Promise que resolve quando os dados são salvos
     */
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

    /**
     * Salva as alterações de contato (email/telefone)
     *
     * Compara dados atuais com novos, valida e salva apenas mudanças.
     * Fecha o modal e mostra notificações apropriadas.
     *
     * @async
     * @function handleSaveContact
     * @returns {Promise<void>} Promise que resolve quando os dados são salvos
     */
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

    /**
     * Processa o upload de avatar do usuário
     *
     * Valida tipo e tamanho do arquivo, converte para base64
     * e salva através da API. Atualiza o estado do perfil.
     *
     * @async
     * @function handleAvatarUpload
     * @param {Event} event - Evento de mudança do input file
     * @returns {Promise<void>} Promise que resolve quando o avatar é salvo
     */
    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo do arquivo
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Tipo de arquivo inválido",
                description: "Por favor, selecione uma imagem válida.",
                variant: "destructive",
            });
            return;
        }

        // Validar tamanho (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "Arquivo muito grande",
                description: "A imagem deve ter no máximo 2MB.",
                variant: "destructive",
            });
            return;
        }

        setIsUploadingAvatar(true);

        // Converter arquivo para base64
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const base64String = e.target.result;
                const result = await userService.updatePersonalInfo({
                    avatar: base64String
                });

                setProfile(prev => ({ ...prev, avatar: base64String }));
                toast({
                    title: "Avatar atualizado",
                    description: "Sua foto de perfil foi atualizada com sucesso.",
                });
            } catch (error) {
                console.error("Erro ao salvar avatar:", error);
            toast({
                title: "Erro ao salvar",
                    description: error.message || "Não foi possível salvar a imagem.",
                    variant: "destructive",
                });
            } finally {
                setIsUploadingAvatar(false);
            }
        };

        reader.onerror = () => {
            toast({
                title: "Erro ao processar imagem",
                description: "Não foi possível processar a imagem selecionada.",
                variant: "destructive",
            });
            setIsUploadingAvatar(false);
        };

        reader.readAsDataURL(file);
    };

    /**
     * Abre o modal de confirmação de exclusão de avatar
     *
     * @function handleAvatarDelete
     * @returns {void}
     */
    const handleAvatarDelete = () => {
        setIsDeleteAvatarModalOpen(true);
    };

    /**
     * Confirma e executa a exclusão do avatar
     *
     * Remove o avatar através da API e atualiza o estado do perfil.
     *
     * @async
     * @function confirmDeleteAvatar
     * @returns {Promise<void>} Promise que resolve quando o avatar é removido
     */
    const confirmDeleteAvatar = async () => {
        setIsDeletingAvatar(true);
        try {
            await userService.updatePersonalInfo({
                avatar: null
            });
            setProfile(prev => ({ ...prev, avatar: null }));
            setIsDeleteAvatarModalOpen(false);
            toast({
                title: "Avatar removido",
                description: "Sua foto de perfil foi removida com sucesso.",
            });
        } catch (error) {
            console.error("Erro ao remover avatar:", error);
            toast({
                title: "Erro ao remover",
                description: error.message || "Não foi possível remover a foto.",
                variant: "destructive",
            });
        } finally {
            setIsDeletingAvatar(false);
        }
    };

    /**
     * Navega para a página de gerenciamento de endereços
     *
     * @function handleManageAddresses
     * @returns {void}
     */
    const handleManageAddresses = () => {
        navigate("/profile/addresses");
    };

    /**
     * Navega para a página de criação de novo endereço
     *
     * @function handleAddAddress
     * @returns {void}
     */
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
                                            <AvatarImage
                                                src={profile.avatar || ""}
                                                alt={profile.name}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {getInitials(profile.name)}
                                    </AvatarFallback>
                                </Avatar>

                                        {/* Botões de ação para avatar */}
                                        <div className="absolute -bottom-1 -right-1 flex gap-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                                id="avatar-upload"
                                                disabled={isUploadingAvatar}
                                            />
                                            <label
                                                htmlFor="avatar-upload"
                                                className={`inline-flex items-center justify-center rounded-full h-10 w-10 shadow-lg cursor-pointer transition-colors ${
                                                    isUploadingAvatar
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-primary hover:bg-primary/90'
                                                }`}
                                            >
                                                {isUploadingAvatar ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                ) : (
                                                    <Camera className="h-4 w-4 text-white" />
                                                )}
                                            </label>

                                            {profile.avatar && (
                                                <ButtonDash
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-10 w-10 rounded-full shadow-lg"
                                                    onClick={handleAvatarDelete}
                                                    disabled={isUploadingAvatar}
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </ButtonDash>
                                            )}
                                        </div>
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

                        {/* Contato / Informações Profissionais */}
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    {userType === 'cliente' ? (
                                        <>
                                            <Phone className="h-5 w-5 text-primary" />
                                            Contato
                                        </>
                                    ) : (
                                        <>
                                            <User className="h-5 w-5 text-primary" />
                                            Informações Profissionais
                                        </>
                                    )}
                                </CardTitle>
                                {userType === 'cliente' && (
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
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                            <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-gray-900">{profile.email}</p>
                            </div>
                            {userType === 'cliente' ? (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                                    <p className="text-gray-900">{profile.contact || 'Não informado'}</p>
                                </div>
                            ) : (
                                <>
                                    {profile.cargo && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Cargo</p>
                                            <p className="text-gray-900">{profile.cargo.name}</p>
                                            {profile.cargo.description && (
                                                <p className="text-sm text-gray-600">{profile.cargo.description}</p>
                                            )}
                                        </div>
                                    )}
                                    {profile.store && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Loja</p>
                                            <p className="text-gray-900">{profile.store.name}</p>
                                            <p className="text-sm text-gray-600">{profile.store.email}</p>
                                            {profile.store.contact && (
                                                <p className="text-sm text-gray-600">{profile.store.contact}</p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                        {/* Endereços - Apenas para clientes */}
                        {userType === 'cliente' && (
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
                                        {profile.address.informacoes_adicionais && (
                                            <p className="text-gray-600 text-sm italic">
                                                Ref: {profile.address.informacoes_adicionais}
                                            </p>
                                        )}
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
                        )}

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

            {/* Modal de confirmação de exclusão de avatar */}
            <Dialog open={isDeleteAvatarModalOpen} onOpenChange={setIsDeleteAvatarModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Remover Foto do Perfil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Tem certeza que deseja remover sua foto de perfil?
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteAvatarModalOpen(false)}
                                className="flex-1"
                            >
                                Cancelar
                </Button>
                            <ButtonDash
                                variant="destructive"
                                onClick={confirmDeleteAvatar}
                                loading={isDeletingAvatar}
                                disabled={isDeletingAvatar}
                                className="flex-1"
                            >
                                {isDeletingAvatar ? "Removendo..." : "Remover"}
                            </ButtonDash>
                        </div>
            </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

/**
 * Exporta o componente UserProfile como padrão
 *
 * O componente UserProfile é a página principal de gerenciamento de perfil
 * da aplicação Conecta-Loja, oferecendo interface completa para usuários
 * e funcionários gerenciarem suas informações pessoais.
 *
 * @exports default
 * @type {React.Component}
 */
export default UserProfile;