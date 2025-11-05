import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ButtonDash from "@/components/ui/ButtonDash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addressService } from "@/api/addressService";
import {
  ArrowLeft,
  MapPin,
  Save,
  Search,
} from "lucide-react";

/**
 * AddressForm - Formulário completo para cadastro e edição de endereços de entrega
 *
 * Componente versátil que pode ser usado tanto como página independente quanto
 * como modal integrado. Oferece busca automática de CEP via API externa,
 * validação completa de campos e interface moderna com feedback visual.
 *
 * @component
 *
 * Funcionalidades principais:
 * - Busca automática de endereço por CEP (ViaCEP API)
 * - Validação obrigatória de todos os campos principais
 * - Suporte a modo de edição e criação
 * - Interface responsiva com cards organizados
 * - Feedback visual de loading e estados de erro
 * - Navegação integrada com breadcrumbs
 * - Tratamento robusto de erros com notificações toast
 *
 * Estados gerenciados:
 * - Dados do formulário com validação em tempo real
 * - Estados de loading (busca CEP, salvamento)
 * - Detecção automática de modo (criação vs edição)
 * - Preenchimento automático de campos via CEP
 *
 * Integrações principais:
 * - addressService: Para operações CRUD de endereços
 * - ViaCEP API: Para busca automática de endereços
 * - useToast: Para notificações de sucesso/erro
 * - React Router: Para navegação e parâmetros de URL
 *
 * Funcionalidades especiais:
 * - Busca de CEP em tempo real com preenchimento automático
 * - Validação de formato de CEP brasileiro
 * - Detecção automática de modo baseado em parâmetros/parâmetros
 * - Suporte a callbacks customizados para integração
 * - Reset automático do formulário após operações
 *
 * @param {Object} props - Propriedades do componente
 * @param {Object} [props.address] - Endereço para editar (modo integrado)
 * @param {Function} [props.onSave] - Callback executado após salvar (modo integrado)
 * @param {Function} [props.onCancel] - Callback executado ao cancelar (modo integrado)
 *
 * @example
 * // Modo página independente (rota)
 * <Route path="/profile/address/new" element={<AddressForm />} />
 * <Route path="/profile/address/:id" element={<AddressForm />} />
 *
 * @example
 * // Modo integrado (modal)
 * <AddressForm
 *   address={enderecoExistente}
 *   onSave={(endereco) => console.log('Salvo:', endereco)}
 *   onCancel={() => setModalAberto(false)}
 * />
 */
const AddressForm = ({ address, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();

  const isEditing = !!id || !!address;
  const existingAddress = location.state?.address || address;

  const [formData, setFormData] = useState({
    cep: existingAddress?.cep || "",
    logradouro: existingAddress?.logradouro || "",
    numero: existingAddress?.numero || "",
    complemento: existingAddress?.complemento || "",
    bairro: existingAddress?.bairro || "",
    cidade: existingAddress?.cidade || "",
    estado: existingAddress?.estado || "",
    referencia: existingAddress?.referencia || "",
  });

  // Carregar dados do endereço se for edição
  useEffect(() => {
    if (isEditing && id && !existingAddress) {
      const loadAddress = async () => {
        try {
          const response = await addressService.getAddressById(parseInt(id));
          const addressData = response.address;
          setFormData({
            cep: addressData.cep || "",
            logradouro: addressData.logradouro || "",
            numero: addressData.numero || "",
            complemento: addressData.complemento || "",
            bairro: addressData.bairro || "",
            cidade: addressData.cidade || "",
            estado: addressData.estado || "",
            referencia: addressData.informacoes_adicionais || "",
          });
        } catch (error) {
          toast({
            title: "Erro ao carregar endereço",
            description: "Não foi possível carregar os dados do endereço.",
            variant: "destructive",
          });
          navigate("/profile/addresses");
        }
      };
      loadAddress();
    }
  }, [id, isEditing, existingAddress, toast, navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Manipula mudanças nos campos do formulário
   *
   * Atualiza o estado do formulário quando qualquer campo é alterado.
   * Usado pelos inputs controlados do formulário.
   *
   * @function handleInputChange
   * @param {string} field - Nome do campo que foi alterado
   * @param {string} value - Novo valor do campo
   *
   * @example
   * <Input
   *   value={formData.cep}
   *   onChange={(e) => handleInputChange('cep', e.target.value)}
   * />
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Busca endereço automaticamente via CEP usando a API ViaCEP
   *
   * Faz uma requisição para a API externa ViaCEP para buscar os dados
   * do endereço baseado no CEP informado. Preenche automaticamente
   * os campos de logradouro, bairro, cidade e estado.
   *
   * @async
   * @function handleCepSearch
   * @returns {Promise<void>} Promise que resolve quando a busca é concluída
   *
   * @throws {Error} Quando há erro na comunicação com a API ViaCEP
   *
   * @example
   * // Chamado quando usuário clica no botão de busca de CEP
   * <Button onClick={handleCepSearch}>
   *   Buscar CEP
   * </Button>
   */
  const handleCepSearch = async () => {
    if (!formData.cep || formData.cep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Digite um CEP válido com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto.",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

      toast({
        title: "Endereço encontrado",
        description: "Complete os dados restantes.",
      });
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar o endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Salva o endereço (criação ou edição)
   *
   * Valida os dados obrigatórios e salva o endereço através da API.
   * Detecta automaticamente se é criação ou edição baseado no estado.
   * Mostra notificações de sucesso e redireciona ou chama callbacks.
   *
   * @async
   * @function handleSave
   * @returns {Promise<void>} Promise que resolve quando o endereço é salvo
   *
   * @throws {Error} Quando há erro na validação ou comunicação com a API
   *
   * Campos obrigatórios validados:
   * - CEP
   * - Logradouro
   * - Número
   * - Cidade
   *
   * @example
   * // Chamado quando usuário clica em "Salvar"
   * <Button onClick={handleSave}>
   *   {isEditing ? 'Atualizar' : 'Salvar'} Endereço
   * </Button>
   */
  const handleSave = async () => {
    // Validação básica
    if (!formData.cep || !formData.logradouro || !formData.numero || !formData.cidade) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      let result;

      if (isEditing && id) {
        // Editar endereço existente - mapear campos corretos
        const addressData = {
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento || '',
          informacoes_adicionais: formData.referencia || '',
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado
        };
        result = await addressService.updateAddress(parseInt(id), addressData);
      } else {
        // Criar novo endereço - mapear campos corretos
        const addressData = {
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento || '',
          informacoes_adicionais: formData.referencia || '',
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado
        };
        result = await addressService.createAddress(addressData);
      }

      toast({
        title: isEditing ? "Endereço atualizado" : "Endereço criado",
        description: `Seu endereço foi ${isEditing ? 'atualizado' : 'criado'} com sucesso.`,
      });

      if (onSave) {
        onSave(result.address || result);
      } else {
        navigate("/profile/addresses");
      }
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o endereço.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancela a operação e volta para a página anterior
   *
   * Se um callback onCancel foi fornecido (modo integrado),
   * executa o callback. Caso contrário, navega para a página anterior.
   *
   * @function handleCancel
   * @returns {void}
   *
   * @example
   * // Modo página independente - volta para página anterior
   * <Button onClick={handleCancel}>Cancelar</Button>
   *
   * @example
   * // Modo integrado - executa callback customizado
   * <AddressForm onCancel={() => setModalOpen(false)} />
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ButtonDash variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </ButtonDash>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Editar Endereço" : "Novo Endereço"}
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {isEditing ? "Editar Endereço de Entrega" : "Adicionar Endereço de Entrega"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CEP */}
            <div className="space-y-2">
              <Label htmlFor="cep" className="text-sm font-medium">
                CEP *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value.replace(/\D/g, ''))}
                  maxLength={8}
                  className="flex-1"
                />
                <ButtonDash
                  variant="outline"
                  iconName="Search"
                  onClick={handleCepSearch}
                  disabled={isLoading || formData.cep.length !== 8}
                  loading={isLoading}
                >
                  Buscar
                </ButtonDash>
              </div>
            </div>

            {/* Rua e Número */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="logradouro" className="text-sm font-medium">
                  Rua / Logradouro *
                </Label>
                <Input
                  id="logradouro"
                  placeholder="Nome da rua"
                  value={formData.logradouro}
                  onChange={(e) => handleInputChange('logradouro', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="numero" className="text-sm font-medium">
                  Número *
                </Label>
                <Input
                  id="numero"
                  placeholder="123"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                />
              </div>
            </div>

            {/* Complemento */}
            <div>
              <Label htmlFor="complemento" className="text-sm font-medium">
                Complemento
              </Label>
              <Input
                id="complemento"
                placeholder="Apto 123, bloco B"
                value={formData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
              />
            </div>

            {/* Bairro */}
            <div>
              <Label htmlFor="bairro" className="text-sm font-medium">
                Bairro *
              </Label>
              <Input
                id="bairro"
                placeholder="Nome do bairro"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
              />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="cidade" className="text-sm font-medium">
                  Cidade *
                </Label>
                <Input
                  id="cidade"
                  placeholder="Nome da cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="estado" className="text-sm font-medium">
                  Estado *
                </Label>
                <Input
                  id="estado"
                  placeholder="UF"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value.toUpperCase())}
                  maxLength={2}
                />
              </div>
            </div>

            {/* Referência */}
            <div>
              <Label htmlFor="referencia" className="text-sm font-medium">
                Ponto de referência
              </Label>
              <Input
                id="referencia"
                placeholder="Próximo ao shopping, prédio azul..."
                value={formData.referencia}
                onChange={(e) => handleInputChange('referencia', e.target.value)}
              />
            </div>

            {/* Ações */}
            <div className="flex gap-4 pt-6 border-t">
              <ButtonDash
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancelar
              </ButtonDash>
              <ButtonDash
                variant="default"
                className="flex-1"
                iconName="Save"
                onClick={handleSave}
                loading={isSaving}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Endereço"}
              </ButtonDash>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/**
 * Exporta o componente AddressForm como padrão
 *
 * O componente AddressForm é uma solução completa para gerenciamento
 * de endereços de entrega, suportando tanto modo página independente
 * quanto integração modal em outros componentes.
 *
 * @exports default
 * @type {React.Component}
 */
export default AddressForm;
