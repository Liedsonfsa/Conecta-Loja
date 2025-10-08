import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '../../../components/ui/ButtonDash';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EmployeeManagementSection = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos@pizzariabellavista.com.br",
      role: "manager",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "active",
      permissions: ["orders", "products", "reports"],
      lastLogin: "2025-01-09 14:30",
      createdAt: "2024-12-15"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@pizzariabellavista.com.br",
      role: "cashier",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "active",
      permissions: ["orders"],
      lastLogin: "2025-01-09 16:45",
      createdAt: "2025-01-02"
    },
    {
      id: 3,
      name: "João Oliveira",
      email: "joao@pizzariabellavista.com.br",
      role: "delivery",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      status: "inactive",
      permissions: ["orders"],
      lastLogin: "2025-01-08 12:15",
      createdAt: "2024-11-20"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
    permissions: []
  });

  const roleOptions = [
    { value: "admin", label: "Administrador", description: "Acesso total ao sistema" },
    { value: "manager", label: "Gerente", description: "Gerenciamento de operações" },
    { value: "cashier", label: "Caixa", description: "Atendimento e pedidos" },
    { value: "delivery", label: "Entregador", description: "Apenas visualização de pedidos" },
    { value: "kitchen", label: "Cozinha", description: "Preparação de pedidos" }
  ];

  const permissionOptions = [
    { value: "orders", label: "Gerenciar Pedidos", description: "Criar, editar e visualizar pedidos" },
    { value: "products", label: "Gerenciar Produtos", description: "Adicionar e editar produtos" },
    { value: "reports", label: "Relatórios", description: "Visualizar relatórios e analytics" },
    { value: "settings", label: "Configurações", description: "Alterar configurações da loja" },
    { value: "employees", label: "Gerenciar Funcionários", description: "Adicionar e remover funcionários" }
  ];

  const getRoleLabel = (role) => {
    const roleOption = roleOptions?.find(r => r?.value === role);
    return roleOption ? roleOption?.label : role;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Ativo", className: "bg-success text-success-foreground" },
      inactive: { label: "Inativo", className: "bg-muted text-muted-foreground" },
      suspended: { label: "Suspenso", className: "bg-destructive text-destructive-foreground" }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.className}`}>
        {config?.label}
      </span>
    );
  };

  const handleNewEmployeeChange = (field, value) => {
    setNewEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permission, checked) => {
    setNewEmployee(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev?.permissions, permission]
        : prev?.permissions?.filter(p => p !== permission)
    }));
  };

  const handleAddEmployee = () => {
    if (!newEmployee?.name || !newEmployee?.email || !newEmployee?.password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (newEmployee?.password?.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const employee = {
      id: employees?.length + 1,
      ...newEmployee,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
      status: "active",
      lastLogin: "Nunca",
      createdAt: new Date()?.toISOString()?.split('T')?.[0]
    };

    setEmployees(prev => [...prev, employee]);
    setNewEmployee({
      name: "",
      email: "",
      password: "",
      role: "cashier",
      permissions: []
    });
    setShowAddForm(false);
    alert('Funcionário adicionado com sucesso!');
  };

  const handleToggleStatus = (employeeId) => {
    setEmployees(prev => prev?.map(emp => 
      emp?.id === employeeId 
        ? { ...emp, status: emp?.status === 'active' ? 'inactive' : 'active' }
        : emp
    ));
  };

  const handleDeleteEmployee = (employeeId) => {
    if (confirm('Tem certeza que deseja remover este funcionário?')) {
      setEmployees(prev => prev?.filter(emp => emp?.id !== employeeId));
      alert('Funcionário removido com sucesso!');
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
              {employees?.length} funcionário{employees?.length !== 1 ? 's' : ''} cadastrado{employees?.length !== 1 ? 's' : ''}
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

            <Input
              label="Senha"
              type="password"
              value={newEmployee?.password}
              onChange={(e) => handleNewEmployeeChange('password', e?.target?.value)}
              required
            />

            <div className="col-span-1 md:col-span-2">
              <Select
                label="Cargo"
                options={roleOptions}
                value={newEmployee?.role}
                onChange={(value) => handleNewEmployeeChange('role', value)}
                description="Defina o nível de acesso do funcionário"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-3">
                Permissões
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionOptions?.map(permission => (
                  <Checkbox
                    key={permission?.value}
                    label={permission?.label}
                    description={permission?.description}
                    checked={newEmployee?.permissions?.includes(permission?.value)}
                    onChange={(e) => handlePermissionChange(permission?.value, e?.target?.checked)}
                  />
                ))}
              </div>
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
      {/* Employees List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Funcionário</th>
                <th className="text-left p-4 font-medium text-foreground">Cargo</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Último Acesso</th>
                <th className="text-left p-4 font-medium text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((employee, index) => (
                <tr key={employee?.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={employee?.avatar}
                          alt={employee?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{employee?.name}</div>
                        <div className="text-sm text-muted-foreground">{employee?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">{getRoleLabel(employee?.role)}</span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(employee?.status)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{employee?.lastLogin}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(employee?.id)}
                        title={employee?.status === 'active' ? 'Desativar' : 'Ativar'}
                      >
                        <Icon 
                          name={employee?.status === 'active' ? 'UserX' : 'UserCheck'} 
                          size={16} 
                        />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => alert(`Editando ${employee?.name}`)}
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
      </div>
      {/* Role Permissions Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Shield" size={24} className="text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Níveis de Acesso</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleOptions?.map(role => (
            <div key={role?.value} className="p-4 bg-muted rounded-lg">
              <h5 className="font-medium text-foreground mb-1">{role?.label}</h5>
              <p className="text-sm text-muted-foreground">{role?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementSection;