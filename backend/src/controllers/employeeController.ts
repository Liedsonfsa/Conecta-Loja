/**
 * Controller para operações relacionadas a funcionários
 *
 * Este módulo contém os handlers para operações CRUD de funcionários,
 * incluindo criação, atualização e gerenciamento de dados de funcionários.
 */
import { Request, Response } from 'express';
import {EmployeeService} from '../services/employeeService';

/**
 * Cria um novo funcionário
 *
 * Recebe os dados do funcionário via body da requisição,
 * valida e processa os dados, chama o serviço para criar o funcionário
 * e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo os dados do funcionário no body
 * @param req.body - Dados do funcionário a ser criado
 * @param req.body.name - Nome do funcionário
 * @param req.body.email - Email do funcionário
 * @param req.body.password - Senha do funcionário (será hasheada)
 * @param req.body.role - Função/cargo do funcionário
 * @param req.body.storeId - ID da loja onde trabalha
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta com funcionário criado ou erro
 *
 * @example
 * // Requisição POST /api/employee/cadastrar
 * {
 *   "name": "João Silva",
 *   "email": "joao@empresa.com",
 *   "password": "senha123",
 *   "role": "vendedor",
 *   "storeId": 1
 * }
 */
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await EmployeeService.createEmployee(req.body);
        res.status(201).json({ employee: employee});
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const updatedEmployee = await EmployeeService.editEmployee(id, req.body);

        return res.status(200).json(updatedEmployee);

    } catch (error: any) {
        console.error(error);

        if (error.message === "Funcionário não encontrado") {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
};