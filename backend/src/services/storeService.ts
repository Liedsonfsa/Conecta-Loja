import { StoreRepository } from "../repositories/storeRepository";
import { EmployeeRepository } from "../repositories/employeeRepository";



export class StoreService {
    /**
     * Serviço para listar os funcionários de uma loja
     *
     * Lista todos os funcionários da loja
     * '../controllers/storeController
     * @param lojaId - ID da loja cujos funcionários devem ser listados
     * @returns Promise<object[]> - Lista de funcionários da loja
     *
     * @throws Error - Caso haja falha ao acessar o repositório
     */
    static async listEmployees(lojaId: number) {
        try {
            const employees = await StoreRepository.listEmployees(lojaId);
            return employees;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Serviço para deletar um funcionário
     *
     * Busca o funcionário pelo ID para verificar se existe.
     * Caso exista, solicita ao repositório a exclusão do registro.
     *
     * @param id - ID do funcionário a ser deletado
     * @returns Promise<object> - Funcionário deletado
     *
     * @throws Error - Se o funcionário não for encontrado
     */
    static async deleteEmployee(id: number) {
        try {
            const existingEmployee = await EmployeeRepository.findEmployeeById(id);
            if (!existingEmployee) {
                throw new Error("Funcionário não encontrado");
            }

            return await StoreRepository.deleteEmployee(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Serviço: busca as configurações da loja.
     */
    static async getConfig() {
        const config = await StoreRepository.findConfig();
        if (!config) {
            throw new Error("Configurações da loja não encontradas.");
        }
        return config;
    }

    /**
     * Serviço: atualiza as configurações da loja.
     */
    static async updateConfig(data: any) {
        return StoreRepository.updateConfig(data);
    }
};