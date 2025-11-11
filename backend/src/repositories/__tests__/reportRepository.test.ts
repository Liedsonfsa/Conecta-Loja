import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';

// Mock do Prisma Client deve ser feito ANTES da importação do repositório
const mockPrismaClient: any = {
  pedido: {
    aggregate: jest.fn(),
  },
  pedido_produto: {
    groupBy: jest.fn(),
  },
  category: {
    findMany: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
  usuario: {
    count: jest.fn(),
  },
  $queryRawUnsafe: jest.fn(),
};

jest.mock('../../generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

import { ReportsRepository } from '../reportRepository';

describe('ReportsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalStats', () => {
    it('should call prisma.pedido.aggregate with correct parameters', async () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const mockResult = {
        _sum: { precoTotal: 1000 },
        _count: 10,
      };

      mockPrismaClient.pedido.aggregate.mockResolvedValue(mockResult);

      const result = await ReportsRepository.getTotalStats(start, end);

      expect(mockPrismaClient.pedido.aggregate).toHaveBeenCalledWith({
        _sum: { precoTotal: true },
        _count: true,
        where: {
          createdAt: { gte: start, lte: end },
          status: { not: 'CANCELADO' },
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getSalesByDay', () => {
    it('should call $queryRawUnsafe with correct SQL query', async () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const mockResult = [
        { date: '01/11', total_sales: 500, total_orders: 5 },
      ];

      mockPrismaClient.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await ReportsRepository.getSalesByDay(start, end);

      expect(mockPrismaClient.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('SELECT')
      );
      expect(result).toEqual([
        { date: '01/11', sales: 500, orders: 5 },
      ]);
    });

    it('should format data correctly', async () => {
      const mockResult = [
        { date: '01/11', total_sales: '1000.50', total_orders: '15' },
        { date: '02/11', total_sales: '2000.75', total_orders: '25' },
      ];

      mockPrismaClient.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await ReportsRepository.getSalesByDay(new Date(), new Date());

      expect(result).toEqual([
        { date: '01/11', sales: 1000.5, orders: 15 },
        { date: '02/11', sales: 2000.75, orders: 25 },
      ]);
    });
  });

  describe('getTopProducts', () => {
    it('should return formatted top products', async () => {
      const start = new Date();
      const end = new Date();

      const mockGrouped = [
        {
          produtoId: 1,
          _sum: { quantidade: 10, precoUnitario: 50 },
        },
      ];

      const mockProduct = {
        id: 1,
        name: 'Produto Teste',
        price: 50,
      };

      mockPrismaClient.pedido_produto.groupBy.mockResolvedValue(mockGrouped);
      mockPrismaClient.product.findUnique.mockResolvedValue(mockProduct);

      const result = await ReportsRepository.getTopProducts(start, end);

      expect(result).toEqual([
        {
          id: 1,
          name: 'Produto Teste',
          quantity: 10,
          revenue: 500, // 10 * 50
        },
      ]);
    });

    it('should handle product not found', async () => {
      const mockGrouped = [
        {
          produtoId: 999,
          _sum: { quantidade: 5, precoUnitario: 100 },
        },
      ];

      mockPrismaClient.pedido_produto.groupBy.mockResolvedValue(mockGrouped);
      mockPrismaClient.product.findUnique.mockResolvedValue(null);

      const result = await ReportsRepository.getTopProducts(new Date(), new Date());

      expect(result).toEqual([
        {
          id: undefined, // produto não encontrado, então id é undefined
          name: 'Produto Desconhecido',
          quantity: 5,
          revenue: 0, // null * 5 = 0
        },
      ]);
    });
  });

  describe('getActiveCustomers', () => {
    it('should call usuario.count and return result', async () => {
      mockPrismaClient.usuario.count.mockResolvedValue(42);

      const result = await ReportsRepository.getActiveCustomers(new Date(), new Date());

      expect(mockPrismaClient.usuario.count).toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });

  describe('getPeakHours', () => {
    it('should format peak hours data correctly', async () => {
      const mockResult = [
        { hour: '10:00', total_orders: '5', total_revenue: '250.50' },
      ];

      mockPrismaClient.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await ReportsRepository.getPeakHours(new Date(), new Date());

      expect(result).toEqual([
        { hour: '10:00', orders: 5, revenue: 250.5 },
      ]);
    });
  });
});
