import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

/**
 * AdvancedOptionsSection - Seção de opções avançadas - Conecta-Loja
 *
 * Componente que gerencia configurações avançadas do sistema, incluindo otimização
 * para motores de busca (SEO), integração com ferramentas de analytics, configurações
 * de APIs externas e inserção de código personalizado. Oferece interface completa
 * para personalização técnica da plataforma.
 *
 * Funcionalidades principais:
 * - Configurações de SEO (meta tags, sitemap, dados estruturados)
 * - Integração com Google Analytics, Facebook Pixel, Hotjar
 * - Configurações de APIs (WhatsApp, SMS, Email, Pagamento, Entrega)
 * - Webhooks para notificações automáticas
 * - Código personalizado (HTML, CSS, JavaScript)
 *
 * Estados gerenciados:
 * - seoSettings: Configurações de otimização para buscadores
 * - analyticsSettings: Integrações com ferramentas de análise
 * - apiSettings: Chaves e URLs de APIs externas
 * - customCode: Scripts e estilos personalizados
 *
 * @example
 * // Uso na página de configurações da loja
 * import AdvancedOptionsSection from './components/AdvancedOptionsSection';
 *
 * function StoreSettings() {
 *   return (
 *     <div>
 *       <AdvancedOptionsSection />
 *     </div>
 *   );
 * }
 *
 */
const AdvancedOptionsSection = () => {
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Pizzaria Bella Vista - Pizzas Artesanais em São Paulo",
    metaDescription: "Pizzaria tradicional com mais de 20 anos de experiência. Pizzas artesanais com ingredientes frescos e entrega rápida em São Paulo.",
    metaKeywords: "pizza, pizzaria, delivery, são paulo, artesanal, italiana",
    canonicalUrl: "https://pizzariabellavista.com.br",
    robotsIndex: true,
    robotsFollow: true,
    sitemap: true,
    structuredData: true
  });

  const [analyticsSettings, setAnalyticsSettings] = useState({
    googleAnalyticsId: "GA-XXXXXXXXX-X",
    googleTagManagerId: "",
    facebookPixelId: "000000000000000",
    hotjarId: "",
    enableEcommerce: true,
    trackConversions: true,
    trackScrollDepth: true,
    trackFileDownloads: false
  });

  const [apiSettings, setApiSettings] = useState({
    whatsappApiUrl: "https://api.whatsapp.com/send",
    whatsappApiKey: "",
    smsApiProvider: "twilio",
    smsApiKey: "",
    emailApiProvider: "sendgrid",
    emailApiKey: "",
    paymentApiKey: "",
    deliveryApiKey: "",
    enableWebhooks: true,
    webhookUrl: "https://pizzariabellavista.com.br/webhook"
  });

  const [customCode, setCustomCode] = useState({
    headerCode: `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA-XXXXXXXXX-X');
</script>`,
    footerCode: `<!-- Custom Footer Scripts -->
<script>
  // Custom tracking or third-party integrations
</script>`,
    customCSS: `.custom-button {
  background: linear-gradient(45deg, #2563EB, #059669);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  transition: transform 0.2s;
}

.custom-button:hover {
  transform: translateY(-2px);
}`
  });

  /**
   * Opções disponíveis para provedores de SMS
   * @type {Array<{value: string, label: string}>}
   */
  const smsProviderOptions = [
    { value: "twilio", label: "Twilio" },
    { value: "nexmo", label: "Vonage (Nexmo)" },
    { value: "aws", label: "Amazon SNS" },
    { value: "custom", label: "API Personalizada" }
  ];

  /**
   * Opções disponíveis para provedores de e-mail
   * @type {Array<{value: string, label: string}>}
   */
  const emailProviderOptions = [
    { value: "sendgrid", label: "SendGrid" },
    { value: "mailgun", label: "Mailgun" },
    { value: "ses", label: "Amazon SES" },
    { value: "smtp", label: "SMTP Personalizado" }
  ];

  /**
   * Manipula mudanças nas configurações de SEO
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleSeoSettingsChange = (field, value) => {
    setSeoSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Manipula mudanças nas configurações de analytics
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleAnalyticsSettingsChange = (field, value) => {
    setAnalyticsSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Manipula mudanças nas configurações de APIs
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleApiSettingsChange = (field, value) => {
    setApiSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Manipula mudanças no código personalizado
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleCustomCodeChange = (field, value) => {
    setCustomCode(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Testa a configuração do webhook
   */
  const handleTestWebhook = () => {
    alert('Testando webhook... Verifique os logs para confirmar o recebimento.');
  };

  /**
   * Gera o sitemap do site
   */
  const handleGenerateSitemap = () => {
    alert('Sitemap gerado com sucesso! Disponível em: /sitemap.xml');
  };

  /**
   * Valida dados estruturados para SEO
   */
  const handleValidateStructuredData = () => {
    alert('Dados estruturados validados com sucesso! Compatível com Google Rich Snippets.');
  };

  /**
   * Salva todas as configurações avançadas
   */
  const handleSave = () => {
    console.log('Saving advanced settings:', { 
      seoSettings, 
      analyticsSettings, 
      apiSettings, 
      customCode 
    });
    alert('Configurações avançadas salvas com sucesso!');
  };

  return (
    <div className="space-y-8">
      {/* SEO Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Search" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Configurações de SEO</h3>
        </div>

        <div className="space-y-6">
          <Input
            label="Título da Página (Meta Title)"
            type="text"
            value={seoSettings?.metaTitle}
            onChange={(e) => handleSeoSettingsChange('metaTitle', e?.target?.value)}
            description="Título que aparece nos resultados de busca (máx. 60 caracteres)"
            maxLength="60"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descrição da Página (Meta Description)
            </label>
            <textarea
              value={seoSettings?.metaDescription}
              onChange={(e) => handleSeoSettingsChange('metaDescription', e?.target?.value)}
              rows={3}
              maxLength="160"
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Descrição que aparece nos resultados de busca..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Máximo 160 caracteres. Atual: {seoSettings?.metaDescription?.length}/160
            </p>
          </div>

          <Input
            label="Palavras-chave (Meta Keywords)"
            type="text"
            value={seoSettings?.metaKeywords}
            onChange={(e) => handleSeoSettingsChange('metaKeywords', e?.target?.value)}
            description="Palavras-chave separadas por vírgula"
            placeholder="pizza, delivery, restaurante, são paulo"
          />

          <Input
            label="URL Canônica"
            type="url"
            value={seoSettings?.canonicalUrl}
            onChange={(e) => handleSeoSettingsChange('canonicalUrl', e?.target?.value)}
            description="URL principal do seu site"
            placeholder="https://seusite.com.br"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Checkbox
                label="Permitir Indexação (robots index)"
                description="Permitir que buscadores indexem o site"
                checked={seoSettings?.robotsIndex}
                onChange={(e) => handleSeoSettingsChange('robotsIndex', e?.target?.checked)}
              />

              <Checkbox
                label="Permitir Seguir Links (robots follow)"
                description="Permitir que buscadores sigam os links"
                checked={seoSettings?.robotsFollow}
                onChange={(e) => handleSeoSettingsChange('robotsFollow', e?.target?.checked)}
              />
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Gerar Sitemap Automaticamente"
                description="Criar sitemap.xml automaticamente"
                checked={seoSettings?.sitemap}
                onChange={(e) => handleSeoSettingsChange('sitemap', e?.target?.checked)}
              />

              <Checkbox
                label="Dados Estruturados (Schema.org)"
                description="Adicionar marcação para rich snippets"
                checked={seoSettings?.structuredData}
                onChange={(e) => handleSeoSettingsChange('structuredData', e?.target?.checked)}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleGenerateSitemap}
              iconName="FileText"
              iconPosition="left"
              size="sm"
            >
              Gerar Sitemap
            </Button>

            <Button
              variant="outline"
              onClick={handleValidateStructuredData}
              iconName="CheckCircle"
              iconPosition="left"
              size="sm"
            >
              Validar Dados Estruturados
            </Button>
          </div>
        </div>
      </div>
      {/* Analytics Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Integração com Analytics</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Google Analytics ID"
              type="text"
              value={analyticsSettings?.googleAnalyticsId}
              onChange={(e) => handleAnalyticsSettingsChange('googleAnalyticsId', e?.target?.value)}
              placeholder="GA-XXXXXXXXX-X"
            />

            <Input
              label="Google Tag Manager ID"
              type="text"
              value={analyticsSettings?.googleTagManagerId}
              onChange={(e) => handleAnalyticsSettingsChange('googleTagManagerId', e?.target?.value)}
              placeholder="GTM-XXXXXXX"
            />

            <Input
              label="Facebook Pixel ID"
              type="text"
              value={analyticsSettings?.facebookPixelId}
              onChange={(e) => handleAnalyticsSettingsChange('facebookPixelId', e?.target?.value)}
              placeholder="000000000000000"
            />

            <Input
              label="Hotjar Site ID"
              type="text"
              value={analyticsSettings?.hotjarId}
              onChange={(e) => handleAnalyticsSettingsChange('hotjarId', e?.target?.value)}
              placeholder="0000000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Checkbox
                label="Rastreamento de E-commerce"
                description="Rastrear vendas e conversões"
                checked={analyticsSettings?.enableEcommerce}
                onChange={(e) => handleAnalyticsSettingsChange('enableEcommerce', e?.target?.checked)}
              />

              <Checkbox
                label="Rastreamento de Conversões"
                description="Rastrear objetivos e conversões"
                checked={analyticsSettings?.trackConversions}
                onChange={(e) => handleAnalyticsSettingsChange('trackConversions', e?.target?.checked)}
              />
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Rastreamento de Scroll"
                description="Medir profundidade de rolagem"
                checked={analyticsSettings?.trackScrollDepth}
                onChange={(e) => handleAnalyticsSettingsChange('trackScrollDepth', e?.target?.checked)}
              />

              <Checkbox
                label="Rastreamento de Downloads"
                description="Rastrear downloads de arquivos"
                checked={analyticsSettings?.trackFileDownloads}
                onChange={(e) => handleAnalyticsSettingsChange('trackFileDownloads', e?.target?.checked)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* API Integrations */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Plug" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Integrações de API</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="URL da API WhatsApp"
              type="url"
              value={apiSettings?.whatsappApiUrl}
              onChange={(e) => handleApiSettingsChange('whatsappApiUrl', e?.target?.value)}
              placeholder="https://api.whatsapp.com/send"
            />

            <Input
              label="Chave da API WhatsApp"
              type="password"
              value={apiSettings?.whatsappApiKey}
              onChange={(e) => handleApiSettingsChange('whatsappApiKey', e?.target?.value)}
              placeholder="••••••••••••••••"
            />

            <Select
              label="Provedor de SMS"
              options={smsProviderOptions}
              value={apiSettings?.smsApiProvider}
              onChange={(value) => handleApiSettingsChange('smsApiProvider', value)}
            />

            <Input
              label="Chave da API SMS"
              type="password"
              value={apiSettings?.smsApiKey}
              onChange={(e) => handleApiSettingsChange('smsApiKey', e?.target?.value)}
              placeholder="••••••••••••••••"
            />

            <Select
              label="Provedor de E-mail"
              options={emailProviderOptions}
              value={apiSettings?.emailApiProvider}
              onChange={(value) => handleApiSettingsChange('emailApiProvider', value)}
            />

            <Input
              label="Chave da API E-mail"
              type="password"
              value={apiSettings?.emailApiKey}
              onChange={(e) => handleApiSettingsChange('emailApiKey', e?.target?.value)}
              placeholder="••••••••••••••••"
            />

            <Input
              label="Chave da API Pagamento"
              type="password"
              value={apiSettings?.paymentApiKey}
              onChange={(e) => handleApiSettingsChange('paymentApiKey', e?.target?.value)}
              placeholder="••••••••••••••••"
              description="Para integração com gateways de pagamento"
            />

            <Input
              label="Chave da API Entrega"
              type="password"
              value={apiSettings?.deliveryApiKey}
              onChange={(e) => handleApiSettingsChange('deliveryApiKey', e?.target?.value)}
              placeholder="••••••••••••••••"
              description="Para rastreamento de entregas"
            />
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-md font-semibold text-foreground">Webhooks</h4>
                <p className="text-sm text-muted-foreground">
                  Receba notificações automáticas de eventos
                </p>
              </div>
              
              <Checkbox
                label="Habilitar Webhooks"
                checked={apiSettings?.enableWebhooks}
                onChange={(e) => handleApiSettingsChange('enableWebhooks', e?.target?.checked)}
              />
            </div>

            {apiSettings?.enableWebhooks && (
              <div className="flex space-x-3">
                <Input
                  label="URL do Webhook"
                  type="url"
                  value={apiSettings?.webhookUrl}
                  onChange={(e) => handleApiSettingsChange('webhookUrl', e?.target?.value)}
                  placeholder="https://seusite.com.br/webhook"
                  className="flex-1"
                />
                
                <Button
                  variant="outline"
                  onClick={handleTestWebhook}
                  iconName="TestTube"
                  className="mt-6"
                  size="sm"
                >
                  Testar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Custom Code */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Code" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Código Personalizado</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Código do Cabeçalho (Header)
            </label>
            <textarea
              value={customCode?.headerCode}
              onChange={(e) => handleCustomCodeChange('headerCode', e?.target?.value)}
              rows={8}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm"
              placeholder="<!-- Código HTML/JavaScript para o cabeçalho -->"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Código inserido no &lt;head&gt; de todas as páginas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Código do Rodapé (Footer)
            </label>
            <textarea
              value={customCode?.footerCode}
              onChange={(e) => handleCustomCodeChange('footerCode', e?.target?.value)}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm"
              placeholder="<!-- Código HTML/JavaScript para o rodapé -->"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Código inserido antes do &lt;/body&gt; de todas as páginas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CSS Personalizado
            </label>
            <textarea
              value={customCode?.customCSS}
              onChange={(e) => handleCustomCodeChange('customCSS', e?.target?.value)}
              rows={10}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm"
              placeholder="/* Seu CSS personalizado aqui */"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Estilos CSS personalizados aplicados globalmente
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Atenção</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Código personalizado pode afetar o funcionamento do site. 
                Teste sempre em ambiente de desenvolvimento antes de aplicar em produção.
              </p>
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
          Salvar Configurações Avançadas
        </Button>
      </div>
    </div>
  );
};

export default AdvancedOptionsSection;