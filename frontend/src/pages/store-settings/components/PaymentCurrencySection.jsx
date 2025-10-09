import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

/**
 * PaymentCurrencySection - Seção de pagamentos e moeda - Conecta-Loja
 *
 * Componente que gerencia todas as configurações financeiras da loja, incluindo
 * formatação de moeda, métodos de pagamento aceitos, taxas e impostos, além de
 * certificações empresariais. Permite configuração completa do sistema de
 * pagamentos com foco nas necessidades brasileiras.
 *
 * Funcionalidades principais:
 * - Configuração de moeda e formatação (BRL, USD, EUR)
 * - Personalização de separadores e casas decimais
 * - Configuração de métodos de pagamento (dinheiro, PIX, cartões)
 * - Gerenciamento de taxas e impostos
 * - Controle de certificações empresariais (CNPJ, licenças)
 * - Configuração de chave PIX para pagamentos
 *
 * Estados gerenciados:
 * - paymentSettings: Configurações de moeda e pagamentos
 * - businessCertifications: Lista de certificações empresariais
 *
 * @example
 * // Uso na página de configurações da loja
 * import PaymentCurrencySection from './components/PaymentCurrencySection';
 *
 * function StoreSettings() {
 *   return (
 *     <div>
 *       <PaymentCurrencySection />
 *     </div>
 *   );
 * }
 *
 */
const PaymentCurrencySection = () => {
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "BRL",
    currencySymbol: "R$",
    currencyPosition: "before",
    decimalPlaces: 2,
    thousandSeparator: ".",
    decimalSeparator: ",",
    taxRate: "0,00",
    serviceFee: "0,00",
    acceptCash: true,
    acceptPix: true,
    acceptCard: true,
    acceptDebitCard: true,
    acceptCreditCard: true,
    pixKey: "12345678901",
    pixKeyType: "cpf"
  });

  const [businessCertifications, setBusinessCertifications] = useState([
    {
      id: 1,
      name: "CNPJ Ativo",
      description: "Cadastro Nacional da Pessoa Jurídica",
      status: "verified",
      icon: "FileCheck",
      validUntil: "2025-12-31"
    },
    {
      id: 2,
      name: "Licença Sanitária",
      description: "Autorização para funcionamento",
      status: "verified",
      icon: "Shield",
      validUntil: "2025-06-30"
    },
    {
      id: 3,
      name: "Alvará de Funcionamento",
      description: "Licença municipal",
      status: "pending",
      icon: "FileText",
      validUntil: "2025-03-15"
    }
  ]);

  /**
   * Opções de moedas disponíveis
   * @type {Array<{value: string, label: string}>}
   */
  const currencyOptions = [
    { value: "BRL", label: "Real Brasileiro (R$)" },
    { value: "USD", label: "Dólar Americano ($)" },
    { value: "EUR", label: "Euro (€)" }
  ];

  /**
   * Opções de posição do símbolo da moeda
   * @type {Array<{value: string, label: string}>}
   */
  const currencyPositionOptions = [
    { value: "before", label: "Antes do valor (R$ 10,00)" },
    { value: "after", label: "Depois do valor (10,00 R$)" }
  ];

  /**
   * Opções de tipos de chave PIX
   * @type {Array<{value: string, label: string}>}
   */
  const pixKeyTypeOptions = [
    { value: "cpf", label: "CPF" },
    { value: "cnpj", label: "CNPJ" },
    { value: "email", label: "E-mail" },
    { value: "phone", label: "Telefone" },
    { value: "random", label: "Chave Aleatória" }
  ];

  /**
   * Manipula mudanças nas configurações de pagamento
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handlePaymentSettingsChange = (field, value) => {
    setPaymentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Manipula mudanças no status das certificações
   * @param {number} certId - ID da certificação
   * @param {string} newStatus - Novo status da certificação
   */
  const handleCertificationStatusChange = (certId, newStatus) => {
    setBusinessCertifications(prev => prev?.map(cert =>
      cert?.id === certId ? { ...cert, status: newStatus } : cert
    ));
  };

  /**
   * Renderiza o badge de status da certificação
   * @param {string} status - Status da certificação (verified/pending/expired)
   * @returns {JSX.Element} Elemento do badge de status
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: { label: "Verificado", className: "bg-success text-success-foreground", icon: "CheckCircle" },
      pending: { label: "Pendente", className: "bg-warning text-warning-foreground", icon: "Clock" },
      expired: { label: "Expirado", className: "bg-destructive text-destructive-foreground", icon: "XCircle" }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <div className="flex items-center space-x-2">
        <Icon name={config?.icon} size={16} />
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.className}`}>
          {config?.label}
        </span>
      </div>
    );
  };

  /**
   * Formata valor monetário para prévia das configurações
   * @param {string|number} value - Valor a ser formatado
   * @returns {string} Valor formatado conforme configurações atuais
   */
  const formatCurrencyPreview = (value) => {
    const formattedValue = parseFloat(value || 0)?.toLocaleString('pt-BR', {
      minimumFractionDigits: paymentSettings?.decimalPlaces,
      maximumFractionDigits: paymentSettings?.decimalPlaces
    });

    return paymentSettings?.currencyPosition === 'before'
      ? `${paymentSettings?.currencySymbol} ${formattedValue}`
      : `${formattedValue} ${paymentSettings?.currencySymbol}`;
  };

  /**
   * Salva todas as configurações de pagamento e certificações
   */
  const handleSave = () => {
    console.log('Saving payment settings:', { paymentSettings, businessCertifications });
    alert('Configurações de pagamento salvas com sucesso!');
  };

  /**
   * Processa o upload de uma certificação específica
   * @param {number} certId - ID da certificação a ser enviada
   */
  const handleUploadCertification = (certId) => {
    alert(`Upload de certificação para ${businessCertifications?.find(c => c?.id === certId)?.name}`);
  };

  return (
    <div className="space-y-8">
      {/* Currency Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="DollarSign" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Configurações de Moeda</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Moeda"
            options={currencyOptions}
            value={paymentSettings?.currency}
            onChange={(value) => handlePaymentSettingsChange('currency', value)}
            description="Moeda utilizada na loja"
          />

          <Input
            label="Símbolo da Moeda"
            type="text"
            value={paymentSettings?.currencySymbol}
            onChange={(e) => handlePaymentSettingsChange('currencySymbol', e?.target?.value)}
            placeholder="R$"
          />

          <Select
            label="Posição do Símbolo"
            options={currencyPositionOptions}
            value={paymentSettings?.currencyPosition}
            onChange={(value) => handlePaymentSettingsChange('currencyPosition', value)}
          />

          <Input
            label="Casas Decimais"
            type="number"
            value={paymentSettings?.decimalPlaces}
            onChange={(e) => handlePaymentSettingsChange('decimalPlaces', parseInt(e?.target?.value))}
            min="0"
            max="4"
          />

          <Input
            label="Separador de Milhares"
            type="text"
            value={paymentSettings?.thousandSeparator}
            onChange={(e) => handlePaymentSettingsChange('thousandSeparator', e?.target?.value)}
            placeholder="."
            maxLength="1"
          />

          <Input
            label="Separador Decimal"
            type="text"
            value={paymentSettings?.decimalSeparator}
            onChange={(e) => handlePaymentSettingsChange('decimalSeparator', e?.target?.value)}
            placeholder=","
            maxLength="1"
          />
        </div>

        {/* Currency Preview */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Prévia da Formatação</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor pequeno:</span>
              <span className="font-medium">{formatCurrencyPreview("15.50")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor médio:</span>
              <span className="font-medium">{formatCurrencyPreview("1250.75")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor grande:</span>
              <span className="font-medium">{formatCurrencyPreview("15750.99")}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Tax and Fees */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Calculator" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Taxas e Impostos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Taxa de Imposto (%)"
            type="text"
            value={paymentSettings?.taxRate}
            onChange={(e) => handlePaymentSettingsChange('taxRate', e?.target?.value)}
            placeholder="0,00"
            description="Taxa de imposto aplicada aos produtos"
          />

          <Input
            label="Taxa de Serviço (%)"
            type="text"
            value={paymentSettings?.serviceFee}
            onChange={(e) => handlePaymentSettingsChange('serviceFee', e?.target?.value)}
            placeholder="0,00"
            description="Taxa de serviço adicional"
          />
        </div>
      </div>
      {/* Payment Methods */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="CreditCard" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Métodos de Pagamento</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Dinheiro"
              description="Pagamento em espécie na entrega"
              checked={paymentSettings?.acceptCash}
              onChange={(e) => handlePaymentSettingsChange('acceptCash', e?.target?.checked)}
            />

            <Checkbox
              label="PIX"
              description="Pagamento instantâneo via PIX"
              checked={paymentSettings?.acceptPix}
              onChange={(e) => handlePaymentSettingsChange('acceptPix', e?.target?.checked)}
            />

            <Checkbox
              label="Cartão de Débito"
              description="Pagamento com cartão de débito"
              checked={paymentSettings?.acceptDebitCard}
              onChange={(e) => handlePaymentSettingsChange('acceptDebitCard', e?.target?.checked)}
            />

            <Checkbox
              label="Cartão de Crédito"
              description="Pagamento com cartão de crédito"
              checked={paymentSettings?.acceptCreditCard}
              onChange={(e) => handlePaymentSettingsChange('acceptCreditCard', e?.target?.checked)}
            />
          </div>

          {/* PIX Configuration */}
          {paymentSettings?.acceptPix && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="text-md font-semibold text-foreground mb-4">Configuração PIX</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Tipo de Chave PIX"
                  options={pixKeyTypeOptions}
                  value={paymentSettings?.pixKeyType}
                  onChange={(value) => handlePaymentSettingsChange('pixKeyType', value)}
                />

                <Input
                  label="Chave PIX"
                  type="text"
                  value={paymentSettings?.pixKey}
                  onChange={(e) => handlePaymentSettingsChange('pixKey', e?.target?.value)}
                  placeholder={
                    paymentSettings?.pixKeyType === 'cpf' ? '000.000.000-00' :
                    paymentSettings?.pixKeyType === 'cnpj' ? '00.000.000/0000-00' :
                    paymentSettings?.pixKeyType === 'email' ? 'seu@email.com' :
                    paymentSettings?.pixKeyType === 'phone' ? '(11) 99999-9999' :
                    'chave-aleatoria-gerada'
                  }
                  description="Chave PIX para recebimento de pagamentos"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Business Certifications */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Award" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Certificações Empresariais</h3>
        </div>

        <div className="space-y-4">
          {businessCertifications?.map((cert) => (
            <div key={cert?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={cert?.icon} size={24} className="text-primary" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{cert?.name}</h4>
                  <p className="text-sm text-muted-foreground">{cert?.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Válido até: {new Date(cert.validUntil)?.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {getStatusBadge(cert?.status)}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUploadCertification(cert?.id)}
                  iconName="Upload"
                  iconPosition="left"
                >
                  {cert?.status === 'verified' ? 'Atualizar' : 'Enviar'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Sobre as Certificações</h4>
              <p className="text-sm text-blue-700 mt-1">
                As certificações empresariais aumentam a confiança dos clientes e podem ser exibidas na sua loja online. 
                Mantenha sempre os documentos atualizados para garantir a credibilidade do seu negócio.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Brazilian Business Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="MapPin" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Informações Fiscais Brasileiras</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Formato de Números</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Moeda: R$ 1.234,56</li>
                <li>• Data: DD/MM/AAAA</li>
                <li>• Telefone: (11) 99999-9999</li>
                <li>• CPF: 000.000.000-00</li>
                <li>• CNPJ: 00.000.000/0000-00</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Conformidade Fiscal</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Emissão de nota fiscal</li>
                <li>• Cálculo de impostos</li>
                <li>• Relatórios para contabilidade</li>
                <li>• Integração com SPED</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={handleSave}
          iconName="Save"
          iconPosition="left"
          className="px-8"
        >
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default PaymentCurrencySection;