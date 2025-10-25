import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonDash from "@/components/ui/ButtonDash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Save,
  Search,
} from "lucide-react";

/**
 * AddressForm - Formulário para adicionar ou editar endereços de entrega
 *
 * Formulário completo com validação e busca automática de CEP via API,
 * interface moderna e intuitiva para gerenciamento de endereços.
 *
 * @param {Object} props - Propriedades do componente
 * @param {Object} [props.address] - Endereço para editar (opcional)
 * @param {Function} [props.onSave] - Callback chamado após salvar
 * @param {Function} [props.onCancel] - Callback chamado ao cancelar
 *
 */
const AddressForm = ({ address, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cep: address?.cep || "",
    logradouro: address?.logradouro || "",
    numero: address?.numero || "",
    complemento: address?.complemento || "",
    bairro: address?.bairro || "",
    cidade: address?.cidade || "",
    estado: address?.estado || "",
    referencia: address?.referencia || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      // TODO: Implementar chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação

      toast({
        title: "Endereço salvo",
        description: "Seu endereço foi salvo com sucesso.",
      });

      if (onSave) {
        onSave(formData);
      } else {
        navigate(-1);
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o endereço.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            {address ? "Editar Endereço" : "Novo Endereço"}
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {address ? "Editar Endereço de Entrega" : "Adicionar Endereço de Entrega"}
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

export default AddressForm;
