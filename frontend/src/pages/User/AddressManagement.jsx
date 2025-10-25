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
 * AddressManagement - Página de gerenciamento de endereços de entrega
 *
 * Interface completa para visualizar, adicionar, editar e excluir endereços,
 * com possibilidade de definir endereço principal e organizar endereços salvos.
 *
 */
const AddressManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    loadAddresses();
  }, [toast]);

  const handleAddAddress = () => {
    navigate("/profile/address/new");
  };

  const handleEditAddress = (address) => {
    navigate(`/profile/address/${address.id}/edit`, { state: { address } });
  };

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

  const handleSetPrincipal = async (addressId) => {
    // Por enquanto, vamos apenas marcar como principal no frontend
    // TODO: Implementar no backend a lógica de endereço principal
    try {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isPrincipal: addr.id === addressId
      })));

      toast({
        title: "Endereço principal definido",
        description: "Este endereço será usado como padrão para entregas.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível definir o endereço principal.",
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
                    {address.referencia && (
                      <p className="text-gray-600 text-sm italic">
                        Ref: {address.referencia}
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

export default AddressManagement;
