import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';
import { ReportsService } from '../reportService';

// Mock do ReportsRepository
jest.mock('../../repositories/reportRepository', () => ({
  ReportsRepository: {
    getTotalStats: jest.fn(),
    getTopProducts: jest.fn(),
    getCategoryDistribution: jest.fn(),
    getPeakHours: jest.fn(),
    getSalesByDay: jest.fn(),
    getActiveCustomers: jest.fn(),
  },
}));

import { ReportsRepository } from '../../repositories/reportRepository';

describe('ReportsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDateRange', () => {
    it('should return today range for "today" period', () => {
      const result = ReportsService.getDateRange('today');

      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
      expect(result.start.getHours()).toBe(0);
      expect(result.start.getMinutes()).toBe(0);
      expect(result.end.getHours()).toBe(23);
      expect(result.end.getMinutes()).toBe(59);
    });

    it('should return week range for "week" period', () => {
      const result = ReportsService.getDateRange('week');

      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    it('should return month range for "month" period', () => {
      const result = ReportsService.getDateRange('month');

      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    it('should return year range for "year" period', () => {
      const result = ReportsService.getDateRange('year');

      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });

    it('should return custom range for "custom" period', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const result = ReportsService.getDateRange('custom', startDate, endDate);

      expect(result.start).toEqual(new Date(startDate));
      expect(result.end).toEqual(new Date(endDate));
    });

    it('should throw error for invalid period', () => {
      expect(() => {
        ReportsService.getDateRange('invalid' as any);
      }).toThrow('Período inválido');
    });
  });

  describe('getReport', () => {
    const mockStats = {
      _sum: { precoTotal: 1000 },
      _count: 10,
    };

    const mockTopProducts = [
      {
        id: 1,
        name: 'Produto 1',
        quantity: 5,
        revenue: 500,
      },
    ];

    const mockCategoryDistribution = [
      {
        name: 'Categoria 1',
        value: 1,
        sales: 500,
      },
    ];

    const mockPeakHours = [
      {
        hour: '10:00',
        orders: 5,
        revenue: 250,
      },
    ];

    const mockSalesByDay = [
      {
        date: '01/11',
        sales: 500,
        orders: 5,
      },
    ];

    beforeEach(() => {
      (ReportsRepository.getTotalStats as any).mockResolvedValue(mockStats);
      (ReportsRepository.getTopProducts as any).mockResolvedValue(mockTopProducts);
      (ReportsRepository.getCategoryDistribution as any).mockResolvedValue(mockCategoryDistribution);
      (ReportsRepository.getPeakHours as any).mockResolvedValue(mockPeakHours);
      (ReportsRepository.getSalesByDay as any).mockResolvedValue(mockSalesByDay);
      (ReportsRepository.getActiveCustomers as any).mockResolvedValue(25);
    });

    it('should return complete report data', async () => {
      const result = await ReportsService.getReport('today');

      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('salesByDay');
      expect(result).toHaveProperty('topProducts');
      expect(result).toHaveProperty('categoryDistribution');
      expect(result).toHaveProperty('peakHours');
      expect(result).toHaveProperty('operational');
    });

    it('should calculate total sales and orders correctly', async () => {
      const result = await ReportsService.getReport('today');

      expect(result.summary.totalSales).toBe(1000);
      expect(result.summary.totalOrders).toBe(10);
      expect(result.summary.averageTicket).toBe(100);
    });

    it('should handle zero orders for average ticket', async () => {
      const zeroStats = {
        _sum: { precoTotal: 0 },
        _count: 0,
      };
      (ReportsRepository.getTotalStats as any).mockResolvedValue(zeroStats);

      const result = await ReportsService.getReport('today');

      expect(result.summary.averageTicket).toBe(0);
    });

    it('should call repository methods with correct date range', async () => {
      await ReportsService.getReport('today');

      expect(ReportsRepository.getTotalStats).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date)
      );
      expect(ReportsRepository.getTopProducts).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date)
      );
      expect(ReportsRepository.getSalesByDay).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date)
      );
    });

    it('should include salesByDay in response', async () => {
      const result = await ReportsService.getReport('today');

      expect(result.salesByDay).toEqual(mockSalesByDay);
    });

    it('should set topProduct correctly', async () => {
      const result = await ReportsService.getReport('today');

      expect(result.summary.topProduct).toBe('Produto 1');
    });

    it('should handle empty topProducts array', async () => {
      (ReportsRepository.getTopProducts as any).mockResolvedValue([]);

      const result = await ReportsService.getReport('today');

      expect(result.summary.topProduct).toBe('N/A');
    });

    it('should include active customers in operational data', async () => {
      const result = await ReportsService.getReport('today');

      expect(result.operational.activeCustomers).toBe(25);
    });
  });
});
