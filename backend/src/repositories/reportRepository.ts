import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class ReportsRepository {
  static async getTotalStats(start: Date, end: Date) {
    return prisma.pedido.aggregate({
      _sum: { precoTotal: true },
      _count: true,
      where: {
        createdAt: { gte: start, lte: end },
        status: { not: "CANCELADO" },
      },
    });
  }

  static async getTopProducts(start: Date, end: Date) {
    const grouped = await prisma.pedido_produto.groupBy({
      by: ["produtoId"],
      _sum: { quantidade: true, precoUnitario: true },
      where: {
        pedido: {
          createdAt: { gte: start, lte: end },
          status: { not: "CANCELADO" },
        },
      },
      orderBy: { _sum: { quantidade: "desc" } },
      take: 5,
    });

    const products = await Promise.all(
      grouped.map(async (g) => {
        const product = await prisma.product.findUnique({
          where: { id: g.produtoId },
        });
        return {
          id: product?.id,
          name: product?.name,
          quantity: g._sum.quantidade || 0,
          revenue:
            Number(g._sum.precoUnitario || 0) * Number(g._sum.quantidade || 0),
        };
      })
    );

    return products;
  }

  static async getCategoryDistribution(start: Date, end: Date) {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            pedidos: {
              include: { pedido: true },
            },
          },
        },
      },
    });

    return categories.map((cat) => {
      const sales = cat.products.reduce((acc, prod) => {
        const revenue = prod.pedidos
          .filter(
            (p) =>
              p.pedido.createdAt >= start &&
              p.pedido.createdAt <= end &&
              p.pedido.status !== "CANCELADO"
          )
          .reduce(
            (sum, p) => sum + Number(p.precoUnitario) * p.quantidade,
            0
          );
        return acc + revenue;
      }, 0);

      return {
        name: cat.name,
        value: cat.products.length,
        sales,
      };
    });
  }

  // Exemplo para horários de pico (pedidos agrupados por hora)
  static async getPeakHours(start: Date, end: Date) {
    const result = await prisma.$queryRawUnsafe<
      { hour: string; total_orders: number; total_revenue: number }[]
    >(`
      SELECT 
        TO_CHAR(p."created_at", 'HH24:00') AS hour,
        COUNT(p.id) AS total_orders,
        SUM(p."precoTotal") AS total_revenue
      FROM pedidos p
      WHERE p."created_at" BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'
      AND p.status != 'CANCELADO'
      GROUP BY 1
      ORDER BY 1;
    `);
    return result.map((r) => ({
      hour: r.hour,
      orders: Number(r.total_orders),
      revenue: Number(r.total_revenue),
    }));
  }
}
