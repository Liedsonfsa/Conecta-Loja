import { Request, Response } from 'express';
import { StoreService } from '../services/storeService';

/**
 * Lista os funcionários de uma loja
 *
 * Recebe o ID da loja via parâmetro da URL, valida o valor
 * e chama o serviço para buscar os funcionários associados à loja.
 * Retorna a lista de funcionários em formato JSON.
 *
 * @param req - Requisição Express contendo o ID da loja em `req.params.lojaId`
 * @param req.params.lojaId - ID da loja cujos funcionários devem ser buscados
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta com lista de funcionários ou erro
 *
 * @example
 * // Requisição GET /api/store/1/listar-funcionarios
 * [
 *   { "id": 1, "name": "Maria", "role": "gerente" },
 *   { "id": 2, "name": "João", "role": "vendedor" }
 * ]
 */
export const listEmployees = async (req: Request, res: Response) => {
    try {
        const lojaId = Number(req.params.lojaId);

         if (isNaN(lojaId)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const employees = await StoreService.listEmployees(lojaId);

        return res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
};

/**
 * Controller para deletar um funcionário
 *
 * Recebe o ID do funcionário via parâmetro da URL, valida o valor,
 * chama o serviço responsável pela exclusão e retorna a resposta apropriada.
 *
 * @param req - Requisição Express contendo o ID do funcionário em `req.params.id`
 * @param req.params.id - ID do funcionário a ser deletado
 * @param res - Resposta Express
 * @returns Promise<Response> - Resposta com mensagem de sucesso ou erro
 *
 * @example
 * // DELETE /api/store/deletar-funcionario/5
 * {
 *   "message": "Funcionário deletado com sucesso"
 * }
 */
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        await StoreService.deleteEmployee(id);

        return res.status(200).json({ message: "Funcionário deletado com sucesso" });
    } catch (error: any) {
        console.error(error);

        if (error.message === "Funcionário não encontrado") {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ error: "Erro ao deletar funcionário" });
    }
};