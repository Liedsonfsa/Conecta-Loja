import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonDash from "@/components/ui/ButtonDash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addressService } from "@/api/addressService";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Home,
  Star,
} from "lucide-react";

/**
 * AddressManagement - Página completa de gerenciamento de endereços de entrega
 *
 * Interface administrativa para usuários gerenciarem todos os seus endereços
 * de entrega. Oferece operações CRUD completas com interface moderna,
 * definição de endereço principal e organização visual dos endereços.
 *
 * @component
 *
 * Funcionalidades principais:
 * - Listagem completa de todos os endereços cadastrados
 * - Visualização organizada com cards para cada endereço
 * - Definição de endereço principal com indicador visual
 * - Adição de novos endereços com navegação integrada
 * - Edição de endereços existentes
 * - Exclusão de endereços com confirmação
 * - Interface responsiva e moderna
 * - Feedback visual de estados de loading
 *
 * Estados gerenciados:
 * - Lista completa de endereços do usuário
 * - Estados de loading para operações
 * - Detecção de endereço principal
 * - Estados de operações CRUD
 *
 * Integrações principais:
 * - addressService: Para todas as operações de endereços
 * - useToast: Para notificações de sucesso/erro
 * - React Router: Para navegação entre páginas
 *
 * Funcionalidades especiais:
 * - Indicador visual para endereço principal (estrela)
 * - Confirmação automática para definir endereço principal
 * - Navegação fluida para formulários de edição/criação
 * - Tratamento robusto de erros com notificações
 * - Interface vazia amigável quando não há endereços
 *
 * @example
 * // Rota configurada em Routes.jsx
 * <Route path="/profile/addresses" element={<AddressManagement />} />
 *
 * @example
 * // Navegação via botão no perfil
 * <Button onClick={() => navigate('/profile/addresses')}>
 *   Gerenciar Endereços
 * </Button>
 */
const AddressManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carrega todos os endereços do usuário autenticado
   *
   * Busca a lista completa de endereços através da API e atualiza
   * o estado local. Trata erros de carregamento com notificações.
   *
   * @async
   * @function loadAddresses
   * @returns {Promise<void>} Promise que resolve quando os endereços são carregados
   *
   * @throws {Error} Quando há erro na comunicação com a API
   */
  const loadAddresses = async () => {
    try {
      const response = await addressService.getUserAddresses();
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      toast({
        title: "Erro ao carregar endereços",
        description: error.message || "Não foi possível carregar seus endereços.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [toast]);

  /**
   * Navega para a página de criação de novo endereço
   *
   * Redireciona o usuário para o formulário de criação de endereço,
   * permitindo adicionar um novo endereço de entrega.
   *
   * @function handleAddAddress
   * @returns {void}
   *
   * @example
   * // Chamado quando usuário clica no botão "Adicionar Endereço"
   * <Button onClick={handleAddAddress}>
   *   <Plus className="h-4 w-4 mr-2" />
   *   Adicionar Endereço
   * </Button>
   */
  const handleAddAddress = () => {
    navigate("/profile/address/new");
  };

  /**
   * Navega para a página de edição de endereço específico
   *
   * Redireciona para o formulário de edição passando os dados
   * do endereço selecionado através do state do React Router.
   *
   * @function handleEditAddress
   * @param {Object} address - Objeto contendo dados do endereço a ser editado
   * @param {number} address.id - ID único do endereço
   * @returns {void}
   *
   * @example
   * // Chamado quando usuário clica no botão de editar
   * <Button onClick={() => handleEditAddress(address)}>
   *   <Edit3 className="h-4 w-4" />
   * </Button>
   */
  const handleEditAddress = (address) => {
    navigate(`/profile/address/${address.id}/edit`, { state: { address } });
  };

  /**
   * Exclui um endereço de entrega específico
   *
   * Mostra confirmação ao usuário e, se confirmado, remove o endereço
   * através da API. Atualiza a lista local e mostra notificações.
   *
   * @async
   * @function handleDeleteAddress
   * @param {number} addressId - ID do endereço a ser excluído
   * @returns {Promise<void>} Promise que resolve quando o endereço é excluído
   *
   * @throws {Error} Quando há erro na exclusão ou comunicação com a API
   *
   * @example
   * // Chamado quando usuário clica no botão de excluir
   * <Button onClick={() => handleDeleteAddress(address.id)}>
   *   <Trash2 className="h-4 w-4" />
   * </Button>
   */
  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) {
      return;
    }

    try {
      await addressService.deleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast({
        title: "Endereço excluído",
        description: "O endereço foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o endereço.",
        variant: "destructive",
      });
    }
  };

  /**
   * Define um endereço como principal para entregas
   *
   * Marca o endereço selecionado como principal através da API
   * e recarrega a lista completa de endereços para refletir a mudança.
   * Mostra notificações de sucesso em caso de operação bem-sucedida.
   *
   * @async
   * @function handleSetPrincipal
   * @param {number} addressId - ID do endereço a ser definido como principal
   * @returns {Promise<void>} Promise que resolve quando o endereço é definido como principal
   *
   * @throws {Error} Quando há erro na definição ou comunicação com a API
   *
   * @example
   * // Chamado quando usuário clica no botão de estrela
   * <Button onClick={() => handleSetPrincipal(address.id)}>
   *   <Star className="h-4 w-4" />
   * </Button>
   */
  const handleSetPrincipal = async (addressId) => {
    try {
      await addressService.setAddressAsPrincipal(addressId);

      // Recarregar endereços para refletir a mudança
      const response = await addressService.getUserAddresses();
      setAddresses(response.addresses || []);

      toast({
        title: "Endereço principal definido",
        description: "Este endereço será usado como padrão para entregas.",
      });
    } catch (error) {
      console.error("Erro ao definir endereço principal:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível definir o endereço principal.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando endereços...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ButtonDash variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </ButtonDash>
            <h1 className="text-3xl font-bold text-gray-900">Meus Endereços</h1>
          </div>
          <ButtonDash
            variant="default"
            iconName="Plus"
            onClick={handleAddAddress}
          >
            Novo Endereço
          </ButtonDash>
        </div>

        {addresses.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum endereço cadastrado
              </h3>
              <p className="text-gray-500 mb-6">
                Adicione seu primeiro endereço para facilitar suas compras
              </p>
              <ButtonDash
                variant="default"
                iconName="Plus"
                onClick={handleAddAddress}
              >
                Adicionar Endereço
              </ButtonDash>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        {address.isPrincipal && (
                          <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mr-2">
                            <Star className="h-4 w-4 fill-current" />
                            Principal
                          </span>
                        )}
                        Endereço {address.id}
                      </CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <ButtonDash
                        variant="ghost"
                        size="sm"
                        iconName="Edit3"
                        onClick={() => handleEditAddress(address)}
                        className="h-8 w-8 p-0"
                      />
                      <ButtonDash
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-gray-900 font-medium">
                      {address.logradouro}, {address.numero}
                    </p>
                    {address.complemento && (
                      <p className="text-gray-600 text-sm">{address.complemento}</p>
                    )}
                    <p className="text-gray-600 text-sm">
                      {address.bairro}, {address.cidade} - {address.estado}
                    </p>
                                        <p className="text-gray-600 text-sm">
                                            CEP: {address.cep}
                                        </p>
                                        {address.informacoes_adicionais && (
                                            <p className="text-gray-600 text-sm italic">
                                                Ref: {address.informacoes_adicionais}
                                            </p>
                                        )}
                  </div>

                  {!address.isPrincipal && (
                    <div className="pt-2">
                      <ButtonDash
                        variant="outline"
                        size="sm"
                        iconName="Star"
                        onClick={() => handleSetPrincipal(address.id)}
                        className="w-full"
                      >
                        Definir como Principal
                      </ButtonDash>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dicas */}
        <Card className="mt-8 shadow-sm bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Dicas para seus endereços</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Mantenha no máximo 3 endereços para facilitar a escolha</li>
                  <li>• Use referências claras para ajudar os entregadores</li>
                  <li>• Defina um endereço principal para compras mais rápidas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/**
 * Exporta o componente AddressManagement como padrão
 *
 * O componente AddressManagement oferece uma interface completa
 * para gerenciamento de endereços de entrega, com todas as operações
 * CRUD necessárias para uma experiência de usuário fluida.
 *
 * @exports default
 * @type {React.Component}
 */
export default AddressManagement;
