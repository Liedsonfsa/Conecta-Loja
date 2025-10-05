import { StoreRepository } from "../repositories/storeRepository";

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