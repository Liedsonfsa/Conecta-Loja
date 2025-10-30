import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { employeeService, roleService } from '../../../api';
import { useToast } from '../../../hooks/use-toast';
import { User } from "lucide-react";


const EmployeeManagementSection = () => {
  // Estados para dados e loading
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para cargos
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Hook para notificações toast
  const { toast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Estados para dialog de confirmação de exclusão
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(false);

  // Estados para modal de edição
  const [showEditForm, setShowEditForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(false);

  // Carregar funcionários e cargos da API ao montar o componente
  useEffect(() => {
    loadEmployees();
    loadRoles();
  }, []);

  /**
   * Carrega a lista de funcionários da API
   */
  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAllEmployees();
      setEmployees(response.employees || []);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
      setError('Erro ao carregar funcionários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega a lista de cargos da API
   */
  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await roleService.getAllRoles();
      // Mapear os cargos para o formato esperado pelo componente Select
      const rolesOptions = response.roles?.map(role => ({
        value: role.id.toString(), // Usar ID como value
        label: role.name,
        description: role.description || 'Cargo sem descrição'
      })) || [];
      setRoles(rolesOptions);
    } catch (err) {
      console.error('Erro ao carregar cargos:', err);
      toast({
        title: "Erro ao carregar cargos",
        description: "Não foi possível carregar a lista de cargos. Tente recarregar a página.",
        duration: 5000,
      });
      // Fallback para cargos vazios
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };


  const getRoleLabel = (employee) => {
    // Primeiro tenta usar o nome do cargo da relação
    if (employee?.cargo?.name) {
      return employee.cargo.name;
    }

    // Fallback para buscar pelo ID nos cargos carregados
    if (employee?.cargoId) {
      const roleOption = roles?.find(r => r?.value === employee.cargoId.toString());
      return roleOption ? roleOption?.label : `Cargo ID: ${employee.cargoId}`;
    }

    return 'Cargo não definido';
  };


  const handleNewEmployeeChange = (field, value) => {
    setNewEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleAddEmployee = async () => {
    if (!newEmployee?.name?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome do funcionário.",
        duration: 4000,
      });
      return;
    }

    if (!newEmployee?.email?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o email do funcionário.",
        duration: 4000,
      });
      return;
    }

    if (!newEmployee?.role?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione um cargo para o funcionário.",
        duration: 4000,
      });
      return;
    }

    const cargoId = parseInt(newEmployee.role);
    if (isNaN(cargoId) || cargoId <= 0) {
      toast({
        title: "Cargo inválido",
        description: "Por favor, selecione um cargo válido.",
        duration: 4000,
      });
      return;
    }

    if (!newEmployee?.password?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha a senha do funcionário.",
        duration: 4000,
      });
      return;
    }

    if (newEmployee?.password?.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        duration: 4000,
      });
      return;
    }

    try {
      // Preparar dados para a API - usar cargoId validado
      await employeeService.createEmployee({
        name: newEmployee.name.trim(),
        email: newEmployee.email.trim(),
        password: newEmployee.password,
        cargoId: cargoId,
        storeId: 1 // TODO: implementar seleção de loja
      });

      toast({
        title: "Funcionário criado",
        description: "O funcionário foi criado com sucesso.",
        duration: 3000,
      });

      // Reset form
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        role: "",
      });
      setShowAddForm(false);

      // Recarregar lista
      await loadEmployees();
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao criar funcionário. Tente novamente.';
      toast({
        title: "Erro ao criar",
        description: errorMessage,
        duration: 5000,
      });
    }
  };


  const handleEditEmployee = (employeeId) => {
    const employee = employees?.find(emp => emp?.id === employeeId);
    if (!employee) return;

    // Preparar dados para edição
    setEmployeeToEdit(employee);

    // Preencher formulário com dados do funcionário
    // O valor do select deve ser o cargoId como string
    const roleValue = employee?.cargo?.id?.toString() || employee?.cargoId?.toString() || '';

    setNewEmployee({
      name: employee.name || "",
      email: employee.email || "",
      password: "", // Não preencher senha por segurança
      role: roleValue,
 // TODO: implementar permissões se necessário
    });

    // Abrir modal de edição
    setShowEditForm(true);
  };

  const handleUpdateEmployee = async () => {
    if (!employeeToEdit) return;

    if (!newEmployee?.name?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome do funcionário.",
        duration: 4000,
      });
      return;
    }

    try {
      setEditingEmployee(true);

      // Preparar dados para a API (apenas campos editáveis)
      const updateData = {
        name: newEmployee.name.trim(),
        cargoId: parseInt(newEmployee.role) // O value do select já é o ID do cargo
      };

      await employeeService.updateEmployee(employeeToEdit.id, updateData);

      toast({
        title: "Funcionário atualizado",
        description: "Os dados do funcionário foram atualizados com sucesso.",
        duration: 3000,
      });

      // Reset form
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        role: "",
      });
      setShowEditForm(false);
      setEmployeeToEdit(null);

      // Recarregar lista
      await loadEmployees();
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar funcionário. Tente novamente.';
      toast({
        title: "Erro ao atualizar",
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setEditingEmployee(false);
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    const employee = employees?.find(emp => emp?.id === employeeId);
    if (!employee) return;

    // Abrir dialog de confirmação
    setEmployeeToDelete(employee);
    setShowDeleteDialog(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    setDeletingEmployee(true);

    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      toast({
        title: "Funcionário removido",
        description: "O funcionário foi removido com sucesso.",
        duration: 3000,
      });

      // Recarregar lista
      await loadEmployees();
    } catch (error) {
      console.error('Erro ao remover funcionário:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao remover funcionário. Tente novamente.';
      toast({
        title: "Erro ao remover",
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setDeletingEmployee(false);
      setShowDeleteDialog(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Users" size={24} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gerenciamento de Funcionários</h3>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Carregando...' : `${employees?.length} funcionário${employees?.length !== 1 ? 's' : ''} cadastrado${employees?.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <Button
          variant="default"
          onClick={() => setShowAddForm(true)}
          iconName="UserPlus"
          iconPosition="left"
        >
          Adicionar Funcionário
        </Button>
      </div>
      {/* Add Employee Form */}
      {showAddForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-foreground">Novo Funcionário</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddForm(false)}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome Completo"
              type="text"
              value={newEmployee?.name}
              onChange={(e) => handleNewEmployeeChange('name', e?.target?.value)}
              required
            />

            <Input
              label="E-mail"
              type="email"
              value={newEmployee?.email}
              onChange={(e) => handleNewEmployeeChange('email', e?.target?.value)}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Senha <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newEmployee?.password}
                  onChange={(e) => handleNewEmployeeChange('password', e?.target?.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Icon
                    name={showPassword ? "EyeOff" : "Eye"}
                    size={18}
                  />
                </button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Select
                label="Cargo"
                options={roles}
                value={newEmployee?.role}
                onChange={(value) => handleNewEmployeeChange('role', value)}
                description="Defina o nível de acesso do funcionário"
                disabled={loadingRoles}
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleAddEmployee}
              iconName="UserPlus"
              iconPosition="left"
            >
              Adicionar Funcionário
            </Button>
          </div>
        </div>
      )}

      {/* Edit Employee Form */}
      {showEditForm && employeeToEdit && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-foreground">Editar Funcionário</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowEditForm(false);
                setEmployeeToEdit(null);
                setNewEmployee({
                  name: "",
                  email: "",
                  password: "",
                  role: "cashier",
                });
              }}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <Input
                label="Nome Completo"
                type="text"
                value={newEmployee?.name}
                onChange={(e) => handleNewEmployeeChange('name', e?.target?.value)}
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Select
                label="Cargo"
                options={roles}
                value={newEmployee?.role}
                onChange={(value) => handleNewEmployeeChange('role', value)}
                disabled={loadingRoles}
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditForm(false);
                setEmployeeToEdit(null);
                setNewEmployee({
                  name: "",
                  email: "",
                  password: "",
                  role: "cashier",
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleUpdateEmployee}
              disabled={editingEmployee}
              iconName={editingEmployee ? "Loader2" : "Save"}
              iconPosition="left"
            >
              {editingEmployee ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      )}

      {/* Employees List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Icon name="Loader2" size={48} className="text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando funcionários...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Erro ao carregar funcionários</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={loadEmployees}
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
                    <th className="text-left p-4 font-medium text-foreground">Funcionário</th>
                    <th className="text-left p-4 font-medium text-foreground">Cargo</th>
                    <th className="text-left p-4 font-medium text-foreground">Loja</th>
                    <th className="text-left p-4 font-medium text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {employees?.map((employee, index) => (
                    <tr key={employee?.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <div className="w-full h-full flex items-center justify-center bg-muted rounded-full">
                              <User className="w-8 h-8 text-muted-foreground" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{employee?.name}</div>
                            <div className="text-sm text-muted-foreground">{employee?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-foreground">{getRoleLabel(employee)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{employee?.loja?.name || 'N/A'}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditEmployee(employee?.id)}
                            title="Editar"
                          >
                            <Icon name="Edit" size={16} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEmployee(employee?.id)}
                            title="Remover"
                            className="text-destructive hover:text-destructive"
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

            {employees?.length === 0 && (
              <div className="p-8 text-center">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum funcionário cadastrado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece criando seu primeiro funcionário para organizar sua equipe.
                </p>
                <Button
                  variant="default"
                  onClick={() => setShowAddForm(true)}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Criar Primeiro Funcionário
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteEmployee}
        title="Remover funcionário"
        description={`Tem certeza que deseja remover o funcionário "${employeeToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText={deletingEmployee ? "Removendo..." : "Remover"}
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

export default EmployeeManagementSection;