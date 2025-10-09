import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

/**
 * SystemConfigSection - Seção de configurações do sistema - Conecta-Loja
 *
 * Componente que gerencia configurações avançadas do sistema, incluindo backup
 * automático, configurações de segurança, otimização de performance e integrações
 * com serviços externos. Permite controle completo sobre o comportamento técnico
 * da plataforma.
 *
 * Funcionalidades principais:
 * - Configuração de backup automático (frequência e horários)
 * - Configurações de segurança (HTTPS, 2FA, sessões, rate limiting)
 * - Otimização de performance (cache, compressão, modos de performance)
 * - Sistema de notificações (email, SMS, WhatsApp)
 * - Integrações com APIs externas (Google Analytics, Facebook Pixel, etc.)
 * - Modo de manutenção para atualizações do sistema
 *
 * Estados gerenciados:
 * - systemConfig: Configurações gerais do sistema
 * - securitySettings: Configurações de segurança avançadas
 * - integrationSettings: Configurações de integrações externas
 *
 * @example
 * // Uso na página de configurações da loja
 * import SystemConfigSection from './components/SystemConfigSection';
 *
 * function StoreSettings() {
 *   return (
 *     <div>
 *       <SystemConfigSection />
 *     </div>
 *   );
 * }
 *
 */
const SystemConfigSection = () => {
  const [systemConfig, setSystemConfig] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    httpsEnabled: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    enableNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    performanceMode: "balanced",
    cacheEnabled: true,
    compressionEnabled: true,
    maintenanceMode: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordComplexity: "medium",
    sessionSecurity: "high",
    ipWhitelist: "",
    apiRateLimit: "100"
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalytics: "",
    facebookPixel: "",
    whatsappApiKey: "",
    smsApiKey: "",
    emailProvider: "smtp",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: ""
  });

  /**
   * Opções de frequência para backup automático
   * @type {Array<{value: string, label: string}>}
   */
  const backupFrequencyOptions = [
    { value: "hourly", label: "A cada hora" },
    { value: "daily", label: "Diariamente" },
    { value: "weekly", label: "Semanalmente" },
    { value: "monthly", label: "Mensalmente" }
  ];

  /**
   * Opções de modos de performance do sistema
   * @type {Array<{value: string, label: string, description: string}>}
   */
  const performanceModeOptions = [
    { value: "eco", label: "Econômico", description: "Menor consumo de recursos" },
    { value: "balanced", label: "Balanceado", description: "Equilibrio entre performance e recursos" },
    { value: "performance", label: "Alta Performance", description: "Máxima velocidade" }
  ];

  /**
   * Opções de complexidade de senha
   * @type {Array<{value: string, label: string, description: string}>}
   */
  const passwordComplexityOptions = [
    { value: "low", label: "Baixa", description: "Mínimo 6 caracteres" },
    { value: "medium", label: "Média", description: "8 caracteres, letras e números" },
    { value: "high", label: "Alta", description: "12 caracteres, letras, números e símbolos" }
  ];

  /**
   * Opções de nível de segurança da sessão
   * @type {Array<{value: string, label: string, description: string}>}
   */
  const sessionSecurityOptions = [
    { value: "low", label: "Baixa", description: "Sessão persistente" },
    { value: "medium", label: "Média", description: "Timeout padrão" },
    { value: "high", label: "Alta", description: "Timeout curto e validação IP" }
  ];

  /**
   * Opções de provedores de e-mail disponíveis
   * @type {Array<{value: string, label: string}>}
   */
  const emailProviderOptions = [
    { value: "smtp", label: "SMTP Personalizado" },
    { value: "gmail", label: "Gmail" },
    { value: "outlook", label: "Outlook" },
    { value: "sendgrid", label: "SendGrid" }
  ];

  /**
   * Manipula mudanças nas configurações gerais do sistema
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleSystemConfigChange = (field, value) => {
    setSystemConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Manipula mudanças nas configurações de segurança
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleSecuritySettingsChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Manipula mudanças nas configurações de integração
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleIntegrationSettingsChange = (field, value) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Inicia um backup manual do sistema
   */
  const handleBackupNow = () => {
    alert('Backup iniciado! Você será notificado quando concluído.');
  };

  /**
   * Testa conexão com um serviço específico
   * @param {string} service - Nome do serviço a ser testado
   */
  const handleTestConnection = (service) => {
    alert(`Testando conexão com ${service}...`);
  };

  /**
   * Salva todas as configurações do sistema
   */
  const handleSave = () => {
    console.log('Saving system config:', { systemConfig, securitySettings, integrationSettings });
    alert('Configurações do sistema salvas com sucesso!');
  };

  /**
   * Alterna o modo de manutenção do sistema
   */
  const handleMaintenanceToggle = () => {
    const newMode = !systemConfig?.maintenanceMode;
    handleSystemConfigChange('maintenanceMode', newMode);

    if (newMode) {
      alert('Modo de manutenção ativado. A loja ficará temporariamente indisponível para clientes.');
    } else {
      alert('Modo de manutenção desativado. A loja voltou ao funcionamento normal.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Backup Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Database" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Configurações de Backup</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={systemConfig?.autoBackup}
                onChange={(e) => handleSystemConfigChange('autoBackup', e?.target?.checked)}
              />
              <div>
                <h4 className="font-medium text-foreground">Backup Automático</h4>
                <p className="text-sm text-muted-foreground">
                  Realizar backup automaticamente dos dados
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleBackupNow}
              iconName="Download"
              iconPosition="left"
              size="sm"
            >
              Backup Agora
            </Button>
          </div>

          {systemConfig?.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Frequência do Backup"
                options={backupFrequencyOptions}
                value={systemConfig?.backupFrequency}
                onChange={(value) => handleSystemConfigChange('backupFrequency', value)}
              />

              <Input
                label="Horário do Backup"
                type="time"
                value={systemConfig?.backupTime}
                onChange={(e) => handleSystemConfigChange('backupTime', e?.target?.value)}
                description="Horário para execução automática"
              />
            </div>
          )}
        </div>
      </div>
      {/* Security Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Shield" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Configurações de Segurança</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Checkbox
                label="HTTPS Obrigatório"
                description="Forçar conexões seguras"
                checked={systemConfig?.httpsEnabled}
                onChange={(e) => handleSystemConfigChange('httpsEnabled', e?.target?.checked)}
              />

              <Checkbox
                label="Autenticação de Dois Fatores"
                description="Segurança adicional para login"
                checked={securitySettings?.twoFactorAuth}
                onChange={(e) => handleSecuritySettingsChange('twoFactorAuth', e?.target?.checked)}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Timeout de Sessão (minutos)"
                type="number"
                value={systemConfig?.sessionTimeout}
                onChange={(e) => handleSystemConfigChange('sessionTimeout', e?.target?.value)}
                min="5"
                max="480"
              />

              <Input
                label="Máximo de Tentativas de Login"
                type="number"
                value={systemConfig?.maxLoginAttempts}
                onChange={(e) => handleSystemConfigChange('maxLoginAttempts', e?.target?.value)}
                min="3"
                max="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Complexidade de Senha"
              options={passwordComplexityOptions}
              value={securitySettings?.passwordComplexity}
              onChange={(value) => handleSecuritySettingsChange('passwordComplexity', value)}
            />

            <Select
              label="Nível de Segurança da Sessão"
              options={sessionSecurityOptions}
              value={securitySettings?.sessionSecurity}
              onChange={(value) => handleSecuritySettingsChange('sessionSecurity', value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Lista de IPs Permitidos"
              type="text"
              value={securitySettings?.ipWhitelist}
              onChange={(e) => handleSecuritySettingsChange('ipWhitelist', e?.target?.value)}
              placeholder="192.168.1.1, 10.0.0.1"
              description="Separar por vírgula (opcional)"
            />

            <Input
              label="Limite de Requisições API (por minuto)"
              type="number"
              value={securitySettings?.apiRateLimit}
              onChange={(e) => handleSecuritySettingsChange('apiRateLimit', e?.target?.value)}
              min="10"
              max="1000"
            />
          </div>
        </div>
      </div>
      {/* Performance Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Zap" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Configurações de Performance</h3>
        </div>

        <div className="space-y-6">
          <Select
            label="Modo de Performance"
            options={performanceModeOptions}
            value={systemConfig?.performanceMode}
            onChange={(value) => handleSystemConfigChange('performanceMode', value)}
            description="Ajuste o equilíbrio entre velocidade e recursos"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Checkbox
              label="Cache Habilitado"
              description="Melhora a velocidade de carregamento"
              checked={systemConfig?.cacheEnabled}
              onChange={(e) => handleSystemConfigChange('cacheEnabled', e?.target?.checked)}
            />

            <Checkbox
              label="Compressão de Dados"
              description="Reduz o tamanho dos arquivos transferidos"
              checked={systemConfig?.compressionEnabled}
              onChange={(e) => handleSystemConfigChange('compressionEnabled', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Notification Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Bell" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Configurações de Notificações</h3>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Notificações Habilitadas"
            description="Ativar sistema de notificações"
            checked={systemConfig?.enableNotifications}
            onChange={(e) => handleSystemConfigChange('enableNotifications', e?.target?.checked)}
          />

          {systemConfig?.enableNotifications && (
            <div className="ml-6 space-y-4 border-l-2 border-border pl-4">
              <Checkbox
                label="Notificações por E-mail"
                description="Receber notificações por e-mail"
                checked={systemConfig?.emailNotifications}
                onChange={(e) => handleSystemConfigChange('emailNotifications', e?.target?.checked)}
              />

              <Checkbox
                label="Notificações por SMS"
                description="Receber notificações por SMS"
                checked={systemConfig?.smsNotifications}
                onChange={(e) => handleSystemConfigChange('smsNotifications', e?.target?.checked)}
              />

              <Checkbox
                label="Notificações por WhatsApp"
                description="Receber notificações pelo WhatsApp"
                checked={systemConfig?.whatsappNotifications}
                onChange={(e) => handleSystemConfigChange('whatsappNotifications', e?.target?.checked)}
              />
            </div>
          )}
        </div>
      </div>
      {/* Integration Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Plug" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Integrações e APIs</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Google Analytics ID"
              type="text"
              value={integrationSettings?.googleAnalytics}
              onChange={(e) => handleIntegrationSettingsChange('googleAnalytics', e?.target?.value)}
              placeholder="GA-XXXXXXXXX-X"
            />

            <Input
              label="Facebook Pixel ID"
              type="text"
              value={integrationSettings?.facebookPixel}
              onChange={(e) => handleIntegrationSettingsChange('facebookPixel', e?.target?.value)}
              placeholder="000000000000000"
            />

            <Input
              label="WhatsApp API Key"
              type="password"
              value={integrationSettings?.whatsappApiKey}
              onChange={(e) => handleIntegrationSettingsChange('whatsappApiKey', e?.target?.value)}
              placeholder="••••••••••••••••"
            />

            <Input
              label="SMS API Key"
              type="password"
              value={integrationSettings?.smsApiKey}
              onChange={(e) => handleIntegrationSettingsChange('smsApiKey', e?.target?.value)}
              placeholder="••••••••••••••••"
            />
          </div>

          {/* Email Configuration */}
          <div className="border-t border-border pt-6">
            <h4 className="text-md font-semibold text-foreground mb-4">Configuração de E-mail</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Provedor de E-mail"
                options={emailProviderOptions}
                value={integrationSettings?.emailProvider}
                onChange={(value) => handleIntegrationSettingsChange('emailProvider', value)}
              />

              <Input
                label="Servidor SMTP"
                type="text"
                value={integrationSettings?.smtpHost}
                onChange={(e) => handleIntegrationSettingsChange('smtpHost', e?.target?.value)}
                placeholder="smtp.gmail.com"
              />

              <Input
                label="Porta SMTP"
                type="number"
                value={integrationSettings?.smtpPort}
                onChange={(e) => handleIntegrationSettingsChange('smtpPort', e?.target?.value)}
                placeholder="587"
              />

              <div className="flex space-x-2">
                <Input
                  label="Usuário SMTP"
                  type="email"
                  value={integrationSettings?.smtpUser}
                  onChange={(e) => handleIntegrationSettingsChange('smtpUser', e?.target?.value)}
                  placeholder="seu@email.com"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('E-mail')}
                  iconName="TestTube"
                  className="mt-6"
                  size="sm"
                >
                  Testar
                </Button>
              </div>

              <Input
                label="Senha SMTP"
                type="password"
                value={integrationSettings?.smtpPassword}
                onChange={(e) => handleIntegrationSettingsChange('smtpPassword', e?.target?.value)}
                placeholder="••••••••••••••••"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Maintenance Mode */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={24} className="text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Modo de Manutenção</h3>
              <p className="text-sm text-muted-foreground">
                Temporariamente desabilitar a loja para manutenção
              </p>
            </div>
          </div>

          <Button
            variant={systemConfig?.maintenanceMode ? "destructive" : "outline"}
            onClick={handleMaintenanceToggle}
            iconName={systemConfig?.maintenanceMode ? "Power" : "PowerOff"}
            iconPosition="left"
          >
            {systemConfig?.maintenanceMode ? "Desativar Manutenção" : "Ativar Manutenção"}
          </Button>
        </div>

        {systemConfig?.maintenanceMode && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-destructive" />
              <span className="text-sm font-medium text-destructive">
                Modo de manutenção ativo - A loja está indisponível para clientes
              </span>
            </div>
          </div>
        )}
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

export default SystemConfigSection;