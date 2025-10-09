import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

/**
 * ImportExportSection - Seção de importação/exportação - Conecta-Loja
 *
 * Componente que gerencia operações de importação e exportação de dados da loja,
 * incluindo backup completo do sistema, migração de dados e histórico de backups.
 * Permite exportar dados em diferentes formatos (JSON, CSV, XML) e importar
 * dados com validações e opções de segurança.
 *
 * Funcionalidades principais:
 * - Exportação seletiva de dados (produtos, pedidos, clientes, configurações)
 * - Importação de dados com validação e backup automático
 * - Histórico completo de backups (manuais e automáticos)
 * - Suporte a múltiplos formatos de arquivo
 * - Configurações de período para exportações filtradas
 *
 * Estados gerenciados:
 * - exportSettings: Configurações de exportação de dados
 * - importSettings: Configurações de importação de dados
 * - backupHistory: Lista histórica de backups realizados
 *
 * @example
 * // Uso na página de configurações da loja
 * import ImportExportSection from './components/ImportExportSection';
 *
 * function StoreSettings() {
 *   return (
 *     <div>
 *       <ImportExportSection />
 *     </div>
 *   );
 * }
 *
 */
const ImportExportSection = () => {
  const [exportSettings, setExportSettings] = useState({
    format: "json",
    includeProducts: true,
    includeOrders: true,
    includeCustomers: true,
    includeSettings: true,
    includeEmployees: false,
    dateRange: "all",
    startDate: "",
    endDate: ""
  });

  const [importSettings, setImportSettings] = useState({
    format: "json",
    overwriteExisting: false,
    createBackupBeforeImport: true,
    validateData: true
  });

  const [backupHistory, setBackupHistory] = useState([
    {
      id: 1,
      name: "backup_completo_2025-01-09.json",
      type: "manual",
      size: "2.4 MB",
      date: "2025-01-09 14:30:00",
      status: "completed",
      includes: ["products", "orders", "customers", "settings"]
    },
    {
      id: 2,
      name: "backup_automatico_2025-01-08.json",
      type: "automatic",
      size: "2.1 MB",
      date: "2025-01-08 02:00:00",
      status: "completed",
      includes: ["products", "orders", "customers", "settings"]
    },
    {
      id: 3,
      name: "backup_produtos_2025-01-07.csv",
      type: "manual",
      size: "856 KB",
      date: "2025-01-07 16:45:00",
      status: "completed",
      includes: ["products"]
    }
  ]);

  /**
   * Opções de formato para exportação de dados
   * @type {Array<{value: string, label: string, description: string}>}
   */
  const exportFormatOptions = [
    { value: "json", label: "JSON", description: "Formato completo com todas as informações" },
    { value: "csv", label: "CSV", description: "Planilha compatível com Excel" },
    { value: "xml", label: "XML", description: "Formato estruturado para integrações" }
  ];

  /**
   * Opções de período para filtros de exportação
   * @type {Array<{value: string, label: string}>}
   */
  const dateRangeOptions = [
    { value: "all", label: "Todos os dados" },
    { value: "last_month", label: "Último mês" },
    { value: "last_3_months", label: "Últimos 3 meses" },
    { value: "last_year", label: "Último ano" },
    { value: "custom", label: "Período personalizado" }
  ];

  /**
   * Manipula mudanças nas configurações de exportação
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleExportSettingsChange = (field, value) => {
    setExportSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Manipula mudanças nas configurações de importação
   * @param {string} field - Campo a ser alterado
   * @param {any} value - Novo valor do campo
   */
  const handleImportSettingsChange = (field, value) => {
    setImportSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Inicia o processo de exportação dos dados selecionados
   */
  const handleExport = () => {
    const selectedData = [];
    if (exportSettings?.includeProducts) selectedData?.push('produtos');
    if (exportSettings?.includeOrders) selectedData?.push('pedidos');
    if (exportSettings?.includeCustomers) selectedData?.push('clientes');
    if (exportSettings?.includeSettings) selectedData?.push('configurações');
    if (exportSettings?.includeEmployees) selectedData?.push('funcionários');

    alert(`Exportando ${selectedData?.join(', ')} em formato ${exportSettings?.format?.toUpperCase()}...`);
    
    // Simulate file download
    setTimeout(() => {
      const fileName = `conecta_loja_export_${new Date()?.toISOString()?.split('T')?.[0]}.${exportSettings?.format}`;
      alert(`Download iniciado: ${fileName}`);
    }, 1000);
  };

  /**
   * Inicia o processo de importação de dados
   */
  const handleImport = () => {
    if (!document.querySelector('input[type="file"]')?.files?.[0]) {
      alert('Por favor, selecione um arquivo para importar.');
      return;
    }

    if (importSettings?.createBackupBeforeImport) {
      alert('Criando backup antes da importação...');
    }

    alert('Importação iniciada! Você será notificado quando concluída.');
  };

  /**
   * Faz o download de um backup específico
   * @param {number} backupId - ID do backup a ser baixado
   */
  const handleDownloadBackup = (backupId) => {
    const backup = backupHistory?.find(b => b?.id === backupId);
    alert(`Baixando backup: ${backup?.name}`);
  };

  /**
   * Exclui um backup específico após confirmação
   * @param {number} backupId - ID do backup a ser excluído
   */
  const handleDeleteBackup = (backupId) => {
    if (confirm('Tem certeza que deseja excluir este backup?')) {
      setBackupHistory(prev => prev?.filter(b => b?.id !== backupId));
      alert('Backup excluído com sucesso!');
    }
  };

  /**
   * Cria um novo backup manual do sistema
   */
  const handleCreateManualBackup = () => {
    const newBackup = {
      id: backupHistory?.length + 1,
      name: `backup_manual_${new Date()?.toISOString()?.split('T')?.[0]}.json`,
      type: "manual",
      size: "2.3 MB",
      date: new Date()?.toLocaleString('pt-BR'),
      status: "completed",
      includes: ["products", "orders", "customers", "settings"]
    };

    setBackupHistory(prev => [newBackup, ...prev]);
    alert('Backup manual criado com sucesso!');
  };

  /**
   * Retorna o ícone apropriado para o tipo de backup
   * @param {string} type - Tipo do backup (automatic/manual)
   * @returns {string} Nome do ícone
   */
  const getBackupTypeIcon = (type) => {
    return type === 'automatic' ? 'Clock' : 'User';
  };

  /**
   * Renderiza o badge de tipo do backup
   * @param {string} type - Tipo do backup (automatic/manual)
   * @returns {JSX.Element} Elemento do badge
   */
  const getBackupTypeBadge = (type) => {
    const config = {
      automatic: { label: "Automático", className: "bg-blue-100 text-blue-800" },
      manual: { label: "Manual", className: "bg-green-100 text-green-800" }
    };

    const typeConfig = config?.[type] || config?.manual;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig?.className}`}>
        {typeConfig?.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Export Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Download" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Exportar Dados</h3>
        </div>

        <div className="space-y-6">
          <Select
            label="Formato de Exportação"
            options={exportFormatOptions}
            value={exportSettings?.format}
            onChange={(value) => handleExportSettingsChange('format', value)}
            description="Escolha o formato do arquivo exportado"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Dados para Exportar
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Checkbox
                label="Produtos"
                description="Catálogo completo de produtos"
                checked={exportSettings?.includeProducts}
                onChange={(e) => handleExportSettingsChange('includeProducts', e?.target?.checked)}
              />

              <Checkbox
                label="Pedidos"
                description="Histórico de pedidos"
                checked={exportSettings?.includeOrders}
                onChange={(e) => handleExportSettingsChange('includeOrders', e?.target?.checked)}
              />

              <Checkbox
                label="Clientes"
                description="Dados dos clientes"
                checked={exportSettings?.includeCustomers}
                onChange={(e) => handleExportSettingsChange('includeCustomers', e?.target?.checked)}
              />

              <Checkbox
                label="Configurações"
                description="Configurações da loja"
                checked={exportSettings?.includeSettings}
                onChange={(e) => handleExportSettingsChange('includeSettings', e?.target?.checked)}
              />

              <Checkbox
                label="Funcionários"
                description="Dados dos funcionários (sensível)"
                checked={exportSettings?.includeEmployees}
                onChange={(e) => handleExportSettingsChange('includeEmployees', e?.target?.checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Período dos Dados"
              options={dateRangeOptions}
              value={exportSettings?.dateRange}
              onChange={(value) => handleExportSettingsChange('dateRange', value)}
            />

            {exportSettings?.dateRange === 'custom' && (
              <>
                <Input
                  label="Data Inicial"
                  type="date"
                  value={exportSettings?.startDate}
                  onChange={(e) => handleExportSettingsChange('startDate', e?.target?.value)}
                />

                <Input
                  label="Data Final"
                  type="date"
                  value={exportSettings?.endDate}
                  onChange={(e) => handleExportSettingsChange('endDate', e?.target?.value)}
                />
              </>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handleExport}
              iconName="Download"
              iconPosition="left"
              className="px-8"
            >
              Exportar Dados
            </Button>
          </div>
        </div>
      </div>
      {/* Import Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Upload" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Importar Dados</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Selecionar Arquivo
            </label>
            <input
              type="file"
              accept=".json,.csv,.xml"
              className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formatos aceitos: JSON, CSV, XML. Tamanho máximo: 50MB
            </p>
          </div>

          <Select
            label="Formato do Arquivo"
            options={exportFormatOptions}
            value={importSettings?.format}
            onChange={(value) => handleImportSettingsChange('format', value)}
            description="Formato do arquivo que será importado"
          />

          <div className="space-y-4">
            <Checkbox
              label="Sobrescrever Dados Existentes"
              description="Substituir dados existentes pelos importados"
              checked={importSettings?.overwriteExisting}
              onChange={(e) => handleImportSettingsChange('overwriteExisting', e?.target?.checked)}
            />

            <Checkbox
              label="Criar Backup Antes da Importação"
              description="Recomendado para segurança dos dados"
              checked={importSettings?.createBackupBeforeImport}
              onChange={(e) => handleImportSettingsChange('createBackupBeforeImport', e?.target?.checked)}
            />

            <Checkbox
              label="Validar Dados Antes da Importação"
              description="Verificar integridade dos dados"
              checked={importSettings?.validateData}
              onChange={(e) => handleImportSettingsChange('validateData', e?.target?.checked)}
            />
          </div>

          {importSettings?.overwriteExisting && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-destructive mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-destructive">Atenção!</h4>
                  <p className="text-sm text-destructive/80 mt-1">
                    Esta opção irá substituir permanentemente os dados existentes. 
                    Certifique-se de ter um backup antes de prosseguir.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handleImport}
              iconName="Upload"
              iconPosition="left"
              className="px-8"
            >
              Importar Dados
            </Button>
          </div>
        </div>
      </div>
      {/* Backup History */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Archive" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Histórico de Backups</h3>
          </div>

          <Button
            variant="outline"
            onClick={handleCreateManualBackup}
            iconName="Plus"
            iconPosition="left"
          >
            Criar Backup
          </Button>
        </div>

        <div className="space-y-4">
          {backupHistory?.map((backup) => (
            <div key={backup?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getBackupTypeIcon(backup?.type)} size={24} className="text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="font-medium text-foreground">{backup?.name}</h4>
                    {getBackupTypeBadge(backup?.type)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{backup?.size}</span>
                    <span>{backup?.date}</span>
                    <span>{backup?.includes?.length} categoria{backup?.includes?.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadBackup(backup?.id)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Baixar
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteBackup(backup?.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {backupHistory?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Archive" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Nenhum backup encontrado</h4>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro backup para proteger os dados da sua loja
            </p>
            <Button
              variant="default"
              onClick={handleCreateManualBackup}
              iconName="Plus"
              iconPosition="left"
            >
              Criar Primeiro Backup
            </Button>
          </div>
        )}
      </div>
      {/* Import/Export Tips */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Lightbulb" size={24} className="text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Dicas de Importação/Exportação</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-foreground mb-2">Melhores Práticas</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sempre crie um backup antes de importar dados</li>
              <li>• Teste importações com poucos dados primeiro</li>
              <li>• Verifique a formatação dos dados antes da importação</li>
              <li>• Mantenha backups regulares dos seus dados</li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-foreground mb-2">Formatos Recomendados</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• JSON: Para backup completo e restauração</li>
              <li>• CSV: Para edição em planilhas</li>
              <li>• XML: Para integrações com outros sistemas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportSection;