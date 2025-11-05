import { Request, Response } from "express";
import { ReportsService } from "../services/reportService";

export class ReportsController {
  static async getReports(req: Request, res: Response) {
    try {
      const { period, startDate, endDate } = req.query;
      const data = await ReportsService.getReport(
        period as string,
        startDate as string,
        endDate as string
      );
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro ao gerar relatório" });
    }
  }
}
