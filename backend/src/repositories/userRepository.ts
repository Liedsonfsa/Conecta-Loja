import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

/**
 * Repositório responsável pelas operações de banco de dados relacionadas a usuários
 */
export class UserRepository {
  /**
   * Cria um novo usuário no banco de dados
   *
   * @param data - Dados do usuário a ser criado
   * @returns Promise com o usuário criado
   */
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    contact: string;
  }) {
    return await prisma.usuario.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        contact: data.contact,
      },
    });
  }

  /**
   * Busca um usuário pelo email
   *
   * @param email - Email do usuário
   * @returns Promise com o usuário encontrado ou null
   */
  static async findUserByEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  }

  /**
   * Busca um usuário pelo ID
   *
   * @param id - ID do usuário
   * @returns Promise com o usuário encontrado ou null
   */
  static async findUserById(id: number) {
    return await prisma.usuario.findUnique({
      where: { id },
    });
  }
}
