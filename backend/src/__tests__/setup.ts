import { PrismaClient } from '../generated/prisma';

// Mock do Prisma Client para testes
const prisma = new PrismaClient();

// Limpar banco de dados após cada teste
afterEach(async () => {
  try {
    // Limpar dados de teste
    await prisma.$executeRaw`TRUNCATE TABLE pedidos, pedido_produto, carrinhos, carrinho_produto, usuarios, enderecos, produtos, categoria, cupons CASCADE`;
  } catch (error) {
    // Ignorar erros de limpeza
  }
});

// Fechar conexão após todos os testes
afterAll(async () => {
  await prisma.$disconnect();
});
