import { StoreRepository } from "../repositories/storeRepository";

/**
 * Serviço para listar os funcionários de uma loja
 *
 * Encapsula a chamada ao repositório responsável por buscar os dados
 * e trata eventuais erros, repassando-os para a camada superior.
 *
 * @param lojaId - ID da loja cujos funcionários devem ser listados
 * @returns Promise<object[]> - Lista de funcionários da loja
 *
 * @throws Error - Caso haja falha ao acessar o repositório
 */
export class StoreService {
    static async listEmployees(lojaId: number) {
        try {
            const employees = await StoreRepository.listEmployees(lojaId);
            return employees;
        } catch (error) {
            throw error;
        }
    };
};