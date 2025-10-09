import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável pelas operações de banco de dados relacionadas a cargos
 */
export class RoleRepository {
  /**
   * Cria um novo cargo no banco de dados
   *
   * @param data - Dados do cargo a ser criado
   * @returns Promise com o cargo criado
   */
  static async createRole(data: {
    name: string;
    description?: string;
  }) {
    return await prisma.cargo.create({
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        funcionarios: true,
      },
    });
  }

  /**
   * Busca um cargo pelo ID
   *
   * @param id - ID do cargo
   * @returns Promise com o cargo encontrado ou null
   */
  static async findRoleById(id: number) {
    return await prisma.cargo.findUnique({
      where: { id },
      include: {
        funcionarios: true,
      },
    });
  }

  /**
   * Busca um cargo pelo nome
   *
   * @param name - Nome do cargo
   * @returns Promise com o cargo encontrado ou null
   */
  static async findRoleByName(name: string) {
    return await prisma.cargo.findUnique({
      where: { name },
      include: {
        funcionarios: true,
      },
    });
  }

  /**
   * Busca todos os cargos
   *
   * @param options - Opções de busca (paginação, filtros)
   * @returns Promise com array de cargos
   */
  static async findAllRoles(options?: {
    skip?: number;
    take?: number;
    where?: any;
    includeEmployees?: boolean;
  }) {
    const { skip, take, where, includeEmployees = false } = options || {};

    return await prisma.cargo.findMany({
      skip,
      take,
      where,
      include: includeEmployees ? {
        funcionarios: true,
      } : undefined,
      orderBy: { name: 'asc' },
    });
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
    return await prisma.cargo.update({
      where: { id },
      data,
      include: {
        funcionarios: true,
      },
    });
  }

  /**
   * Remove um cargo do banco de dados
   *
   * @param id - ID do cargo a ser removida
   * @returns Promise com o cargo removido
   */
  static async deleteRole(id: number) {
    return await prisma.cargo.delete({
      where: { id },
    });
  }

  /**
   * Conta o número total de cargos
   *
   * @param where - Filtros opcionais
   * @returns Promise com o número de cargos
   */
  static async countRoles(where?: any) {
    return await prisma.cargo.count({ where });
  }

  /**
   * Conta funcionários associados a um cargo
   *
   * @param roleId - ID do cargo
   * @returns Promise com a contagem de funcionários
   */
  static async countEmployeesByRole(roleId: number) {
    return await prisma.funcionario.count({
      where: { cargoId: roleId },
    });
  }
}
