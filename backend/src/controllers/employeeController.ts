import { Request, Response } from 'express';
import {EmployeeService} from '../services/employeeService';

/**
 * Controller para criação de funcionário
 *
 * Recebe os dados do usuário via body da requisição,
 * chama o serviço para criar o funcionário e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do funcionário no body
 * @param res - Resposta Express
 */
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await EmployeeService.createEmployee(req.body);
        res.status(201).json({ employee: employee});
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};