import { RoleRepository } from '../repositories/roleRepository';

/**
 * Serviço responsável pelas regras de negócio relacionadas a cargos
 */
export class RoleService {
  /**
   * Cria um novo cargo no banco de dados
   *
   * @param data - Dados do cargo a ser criado
   * @param data.name - Nome do cargo
   * @param data.description - Descrição do cargo (opcional)
   * @returns Promise com o cargo criado
   */
  static async createRole(data: {
    name: string;
    description?: string;
  }) {
    try {
      // Validações básicas
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Nome do cargo é obrigatório');
      }

      // Verificar se já existe um cargo com este nome
      const existingRole = await RoleRepository.findRoleByName(data.name.trim());
      if (existingRole) {
        throw new Error('Já existe um cargo com este nome');
      }

      // Criar cargo
      const role = await RoleRepository.createRole({
        name: data.name.trim(),
        description: data.description?.trim(),
      });

      return role;
    } catch (error) {
      // Re-throw para manter o tipo de erro
      throw error;
    }
  }

  /**
   * Busca um cargo pelo ID
   *
   * @param id - ID do cargo
   * @returns Promise com o cargo encontrado
   */
  static async getRoleById(id: number) {
    try {
      const role = await RoleRepository.findRoleById(id);
      if (!role) {
        throw new Error('Cargo não encontrado');
      }
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um cargo pelo nome
   *
   * @param name - Nome do cargo
   * @returns Promise com o cargo encontrado
   */
  static async getRoleByName(name: string) {
    try {
      const role = await RoleRepository.findRoleByName(name);
      if (!role) {
        throw new Error('Cargo não encontrado');
      }
      return role;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca todos os cargos com paginação e filtros
   *
   * @param options - Opções de busca
   * @returns Promise com cargos e metadados de paginação
   */
  static async getAllRoles(options?: {
    page?: number;
    limit?: number;
    search?: string;
    includeEmployees?: boolean;
  }) {
    try {
      const { page = 1, limit = 10, search, includeEmployees = false } = options || {};

      // Construir filtros
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const skip = (page - 1) * limit;

      const [roles, total] = await Promise.all([
        RoleRepository.findAllRoles({ skip, take: limit, where, includeEmployees }),
        RoleRepository.countRoles(where),
      ]);

      return {
        roles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza um cargo existente
   *
   * @param id - ID do cargo a ser atualizado
   * @param data - Dados a serem atualizados
   * @returns Promise com o cargo atualizado
   */
  static async updateRole(id: number, data: {
    name?: string;
    description?: string;
  }) {
    try {
      // Verificar se o cargo existe
      const existingRole = await RoleRepository.findRoleById(id);
      if (!existingRole) {
        throw new Error('Cargo não encontrado');
      }

      // Validações se o nome for fornecido
      if (data.name !== undefined) {
        if (!data.name || data.name.trim().length === 0) {
          throw new Error('Nome do cargo não pode ser vazio');
        }

        // Verificar se já existe outro cargo com este nome
        const roleWithSameName = await RoleRepository.findRoleByName(data.name.trim());
        if (roleWithSameName && roleWithSameName.id !== id) {
          throw new Error('Já existe outro cargo com este nome');
        }
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (data.name !== undefined) {
        updateData.name = data.name.trim();
      }
      if (data.description !== undefined) {
        updateData.description = data.description?.trim() || null;
      }

      // Atualizar cargo
      const updatedRole = await RoleRepository.updateRole(id, updateData);

      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove um cargo do banco de dados
   *
   * @param id - ID do cargo a ser removido
   * @returns Promise com confirmação de remoção
   */
  static async deleteRole(id: number) {
    try {
      // Verificar se o cargo existe
      const role = await RoleRepository.findRoleById(id);
      if (!role) {
        throw new Error('Cargo não encontrado');
      }

      // Verificar se o cargo tem funcionários associados
      const employeeCount = await RoleRepository.countEmployeesByRole(id);
      if (employeeCount > 0) {
        throw new Error('Não é possível excluir um cargo que possui funcionários associados');
      }

      // Remover cargo
      await RoleRepository.deleteRole(id);

      return { message: 'Cargo removido com sucesso' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca estatísticas dos cargos
   *
   * @returns Promise com estatísticas dos cargos
   */
  static async getRoleStats() {
    try {
      const roles = await RoleRepository.findAllRoles({
        includeEmployees: true
      });

      const stats = {
        totalRoles: roles.length,
        totalEmployees: roles.reduce((sum, role) => sum + role.funcionarios.length, 0),
        rolesWithEmployees: roles.filter(role => role.funcionarios.length > 0).length,
        rolesWithoutEmployees: roles.filter(role => role.funcionarios.length === 0).length,
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }
}
