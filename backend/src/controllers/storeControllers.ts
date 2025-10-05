import { Request, Response } from 'express';
import { StoreService } from '../services/storeService';

export const listEmployees = async (req: Request, res: Response) => {
    try {
        const lojaId = Number(req.params.lojaId);

         if (isNaN(lojaId)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const employeers = await StoreService.listEmployees(lojaId);

        return res.status(200).json(employeers);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
};