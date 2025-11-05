import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { ReportsRepository } from "../repositories/reportRepository";

export class ReportsService {
  static getDateRange(period: string, startDate?: string, endDate?: string) {
    const today = new Date();
    switch (period) {
      case "today":
        return { start: startOfDay(today), end: endOfDay(today) };
      case "week":
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case "month":
        return { start: startOfMonth(today), end: endOfMonth(today) };
      case "year":
        return { start: startOfYear(today), end: endOfYear(today) };
      case "custom":
        return { start: new Date(startDate!), end: new Date(endDate!) };
      default:
        throw new Error("Período inválido");
    }
  }

  static async getReport(period: string, startDate?: string, endDate?: string) {
    const { start, end } = this.getDateRange(period, startDate, endDate);

    const totalStats = await ReportsRepository.getTotalStats(start, end);
    const totalSales = Number(totalStats._sum.precoTotal || 0);
    const totalOrders = totalStats._count;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    const topProducts = await ReportsRepository.getTopProducts(start, end);
    const categoryDistribution = await ReportsRepository.getCategoryDistribution(start, end);
    const peakHours = await ReportsRepository.getPeakHours(start, end);
    const activeCustomers = await ReportsRepository.getActiveCustomers(start, end);

    return {
      summary: {
        totalSales,
        totalOrders,
        averageTicket,
        growthRate: 0, // pode ser calculado futuramente
        topProduct: topProducts[0]?.name || "N/A",
      },
      topProducts,
      categoryDistribution,
      peakHours,
      operational: {
        activeCustomers,
      },
    };
  }
}
