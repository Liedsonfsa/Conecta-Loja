import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * Repositório para operações de banco de dados relacionadas a endereços
 */
export class AddressRepository {
  /**
   * Busca todos os endereços de um usuário específico
   *
   * @param userId - ID do usuário
   * @returns Promise com lista de endereços
   */
  static async findUserAddresses(userId: number) {
    return await prisma.endereco.findMany({
      where: {
        usuarioId: userId
      },
      orderBy: {
        createdAt: 'desc' // Mais recentes primeiro
      }
    });
  }

  /**
   * Busca um endereço específico por ID
   *
   * @param addressId - ID do endereço
   * @returns Promise com o endereço encontrado ou null
   */
  static async findAddressById(addressId: number) {
    return await prisma.endereco.findUnique({
      where: {
        id: addressId
      }
    });
  }

  /**
   * Cria um novo endereço
   *
   * @param data - Dados do endereço
   * @returns Promise com o endereço criado
   */
  static async createAddress(data: {
    usuarioId: number;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    informacoes_adicionais?: string;
    bairro: string;
    cidade: string;
    estado: string;
  }) {
    return await prisma.endereco.create({
      data: data
    });
  }

  /**
   * Atualiza um endereço existente
   *
   * @param addressId - ID do endereço
   * @param data - Dados para atualização
   * @returns Promise com o endereço atualizado
   */
  static async updateAddress(addressId: number, data: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    informacoes_adicionais?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  }) {
    return await prisma.endereco.update({
      where: {
        id: addressId
      },
      data: data
    });
  }

  /**
   * Remove um endereço do banco de dados
   *
   * @param addressId - ID do endereço a ser removido
   * @returns Promise com o endereço removido
   */
  static async deleteAddress(addressId: number) {
    return await prisma.endereco.delete({
      where: {
        id: addressId
      }
    });
  }

  /**
   * Conta quantos endereços um usuário possui
   *
   * @param userId - ID do usuário
   * @returns Promise com a quantidade de endereços
   */
  static async countUserAddresses(userId: number): Promise<number> {
    return await prisma.endereco.count({
      where: {
        usuarioId: userId
      }
    });
  }
}
