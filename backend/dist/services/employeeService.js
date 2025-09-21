"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmployee = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
/**
 * Cria um novo funcionário no banco de dados
 *
 * @param data - Dados do funcionário a ser criado
 * @param data.name - Nome do funcionário
 * @param data.email - Email do funcionário
 * @param data.password - Senha do funcionário
 * @param data.role - Role do funcionário
 * @param data.lojaId - Id da loja ao qual o usuário pertence
 * @returns Promise com o funcionário criado
 */
const createEmployee = async (data) => {
    return await prisma.funcionario.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            lojaId: data.storeId
        }
    });
};
exports.createEmployee = createEmployee;
//# sourceMappingURL=employeeService.js.map