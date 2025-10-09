import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Icon from '../../../components/AppIcon';
import { roleService } from '../../../api';

/**
 * RoleManagementSection - Seção de gerenciamento de cargos
 *
 * Permite criar, editar, listar e excluir cargos da loja.
 * Baseado no modelo cargo do backend (name, description).
 */
const RoleManagementSection = () => {
  // Estados para dados e loading
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: ""
  });

  // Carregar cargos da API ao montar o componente
  useEffect(() => {
    loadRoles();
  }, []);

  /**
   * Carrega a lista de cargos da API
   */
  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roleService.getAllRoles({ includeEmployees: true });
      setRoles(response.roles || []);
    } catch (err) {
      console.error('Erro ao carregar cargos:', err);
      setError('Erro ao carregar cargos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRoleChange = (field, value) => {
    setNewRole(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddRole = async () => {
    if (!newRole?.name?.trim()) {
      alert('Por favor, preencha o nome do cargo.');
      return;
    }

    try {
      if (editingRole) {
        // Editando cargo existente
        await roleService.updateRole(editingRole.id, {
          name: newRole.name.trim(),
          description: newRole.description?.trim() || undefined
        });
        alert('Cargo atualizado com sucesso!');
      } else {
        // Adicionando novo cargo
        await roleService.createRole({
          name: newRole.name.trim(),
          description: newRole.description?.trim() || undefined
        });
        alert('Cargo adicionado com sucesso!');
      }

      // Reset form
      setNewRole({
        name: "",
        description: ""
      });
      setShowAddForm(false);
      setEditingRole(null);

      // Recarregar lista
      await loadRoles();
    } catch (error) {
      console.error('Erro ao salvar cargo:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao salvar cargo. Tente novamente.';
      alert(errorMessage);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setNewRole({
      name: role?.name || "",
      description: role?.description || ""
    });
    setShowAddForm(true);
  };

  const handleDeleteRole = async (roleId) => {
    const role = roles?.find(r => r?.id === roleId);
    if (!role) return;

    const employeeCount = role?.funcionarios?.length || 0;

    if (employeeCount > 0) {
      alert(`Não é possível remover este cargo pois existem ${employeeCount} funcionário(s) associados a ele.`);
      return;
    }

    const confirmMessage = `Tem certeza que deseja remover o cargo "${role?.name}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await roleService.deleteRole(roleId);
      alert('Cargo removido com sucesso!');

      // Recarregar lista
      await loadRoles();
    } catch (error) {
      console.error('Erro ao remover cargo:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao remover cargo. Tente novamente.';
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingRole(null);
    setNewRole({
      name: "",
      description: ""
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Briefcase" size={24} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gerenciamento de Cargos</h3>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Carregando...' : `${roles?.length} cargo${roles?.length !== 1 ? 's' : ''} cadastrado${roles?.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <Button
          variant="default"
          onClick={() => setShowAddForm(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Novo Cargo
        </Button>
      </div>

      {/* Add/Edit Role Form */}
      {showAddForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-foreground">
              {editingRole ? 'Editar Cargo' : 'Novo Cargo'}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Nome do Cargo"
              type="text"
              value={newRole?.name}
              onChange={(e) => handleNewRoleChange('name', e?.target?.value)}
              placeholder="Ex: Gerente, Caixa, Entregador..."
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Descrição <span className="text-muted-foreground">(opcional)</span>
              </label>
              <textarea
                value={newRole?.description}
                onChange={(e) => handleNewRoleChange('description', e?.target?.value)}
                placeholder="Descreva as responsabilidades e permissões deste cargo..."
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleAddRole}
              iconName={editingRole ? "Save" : "Plus"}
              iconPosition="left"
            >
              {editingRole ? 'Atualizar Cargo' : 'Adicionar Cargo'}
            </Button>
          </div>
        </div>
      )}

      {/* Roles List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Icon name="Loader2" size={48} className="text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando cargos...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Erro ao carregar cargos</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={loadRoles}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Cargo</th>
                    <th className="text-left p-4 font-medium text-foreground">Descrição</th>
                    <th className="text-left p-4 font-medium text-foreground">Funcionários</th>
                    <th className="text-left p-4 font-medium text-foreground">Criado em</th>
                    <th className="text-left p-4 font-medium text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {roles?.map((role, index) => (
                    <tr key={role?.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{role?.name}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate" title={role?.description}>
                            {role?.description || 'Sem descrição'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-foreground">
                          {role?.funcionarios?.length || 0} funcionário{(role?.funcionarios?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(role?.createdAt)?.toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRole(role)}
                            title="Editar cargo"
                          >
                            <Icon name="Edit" size={16} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(role?.id)}
                            title="Remover cargo"
                            className="text-destructive hover:text-destructive"
                            disabled={(role?.funcionarios?.length || 0) > 0}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {roles?.length === 0 && (
              <div className="p-8 text-center">
                <Icon name="Briefcase" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum cargo cadastrado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece criando seu primeiro cargo para organizar seus funcionários.
                </p>
                <Button
                  variant="default"
                  onClick={() => setShowAddForm(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Criar Primeiro Cargo
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoleManagementSection;
