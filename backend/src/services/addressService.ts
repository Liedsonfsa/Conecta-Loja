import { AddressRepository } from '../repositories/addressRepository';

/**
 * Serviço responsável pelas regras de negócio relacionadas a endereços
 */
export class AddressService {
  /**
   * Busca todos os endereços de um usuário
   *
   * @param userId - ID do usuário
   * @returns Promise com lista de endereços
   */
  static async getUserAddresses(userId: number) {
    try {
      return await AddressRepository.findUserAddresses(userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um endereço específico por ID e verifica se pertence ao usuário
   *
   * @param addressId - ID do endereço
   * @param userId - ID do usuário (para verificação de propriedade)
   * @returns Promise com o endereço encontrado
   */
  static async getAddressById(addressId: number, userId: number) {
    try {
      const address = await AddressRepository.findAddressById(addressId);
      if (!address || address.usuarioId !== userId) {
        throw new Error('Endereço não encontrado');
      }
      return address;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cria um novo endereço
   *
   * @param data - Dados do endereço
   * @param data.usuarioId - ID do usuário
   * @param data.cep - CEP
   * @param data.logradouro - Logradouro
   * @param data.numero - Número
   * @param data.complemento - Complemento (opcional)
   * @param data.informacoes_adicionais - Informações adicionais (opcional)
   * @param data.bairro - Bairro
   * @param data.cidade - Cidade
   * @param data.estado - Estado (UF)
   * @returns Promise com o endereço criado
   */
  static async createAddress(data: {
    usuarioId: number;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    informacoes_adicionais?: string;
    bairro: string;
    cidade: string;
    estado: string;
  }) {
    try {
      // Validações básicas
      if (!data.cep || data.cep.trim().length === 0) {
        throw new Error('CEP é obrigatório');
      }

      if (!data.logradouro || data.logradouro.trim().length === 0) {
        throw new Error('Logradouro é obrigatório');
      }

      if (!data.numero || data.numero.trim().length === 0) {
        throw new Error('Número é obrigatório');
      }

      if (!data.bairro || data.bairro.trim().length === 0) {
        throw new Error('Bairro é obrigatório');
      }

      if (!data.cidade || data.cidade.trim().length === 0) {
        throw new Error('Cidade é obrigatório');
      }

      if (!data.estado || data.estado.trim().length === 0) {
        throw new Error('Estado é obrigatório');
      }

      // Validar formato do CEP (XXXXX-XXX ou XXXXXXXX)
      const cepRegex = /^\d{5}-?\d{3}$/;
      if (!cepRegex.test(data.cep)) {
        throw new Error('CEP deve estar no formato XXXXX-XXX ou XXXXXXXX');
      }

      // Validar estado (2 letras maiúsculas)
      const estadoRegex = /^[A-Z]{2}$/;
      if (!estadoRegex.test(data.estado.toUpperCase())) {
        throw new Error('Estado deve ter exatamente 2 letras maiúsculas');
      }

      // Criar endereço
      const addressData = {
        ...data,
        cep: data.cep.replace('-', ''), // Remove hífen se existir
        estado: data.estado.toUpperCase()
      };

      return await AddressRepository.createAddress(addressData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza um endereço existente
   *
   * @param addressId - ID do endereço
   * @param userId - ID do usuário (para verificação de propriedade)
   * @param data - Dados para atualização
   * @returns Promise com o endereço atualizado
   */
  static async updateAddress(addressId: number, userId: number, data: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    informacoes_adicionais?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  }) {
    try {
      // Verificar se o endereço existe e pertence ao usuário
      const existingAddress = await AddressRepository.findAddressById(addressId);
      if (!existingAddress || existingAddress.usuarioId !== userId) {
        throw new Error('Endereço não encontrado');
      }

      // Validações se campos obrigatórios forem fornecidos
      if (data.cep !== undefined && (!data.cep || data.cep.trim().length === 0)) {
        throw new Error('CEP não pode ser vazio');
      }

      if (data.logradouro !== undefined && (!data.logradouro || data.logradouro.trim().length === 0)) {
        throw new Error('Logradouro não pode ser vazio');
      }

      if (data.numero !== undefined && (!data.numero || data.numero.trim().length === 0)) {
        throw new Error('Número não pode ser vazio');
      }

      if (data.bairro !== undefined && (!data.bairro || data.bairro.trim().length === 0)) {
        throw new Error('Bairro não pode ser vazio');
      }

      if (data.cidade !== undefined && (!data.cidade || data.cidade.trim().length === 0)) {
        throw new Error('Cidade não pode ser vazia');
      }

      if (data.estado !== undefined && (!data.estado || data.estado.trim().length === 0)) {
        throw new Error('Estado não pode ser vazio');
      }

      // Validar formato do CEP se fornecido
      if (data.cep) {
        const cepRegex = /^\d{5}-?\d{3}$/;
        if (!cepRegex.test(data.cep)) {
          throw new Error('CEP deve estar no formato XXXXX-XXX ou XXXXXXXX');
        }
      }

      // Validar estado se fornecido
      if (data.estado) {
        const estadoRegex = /^[A-Z]{2}$/;
        if (!estadoRegex.test(data.estado.toUpperCase())) {
          throw new Error('Estado deve ter exatamente 2 letras maiúsculas');
        }
      }

      // Preparar dados para atualização
      const updateData: any = { ...data };
      if (data.cep) {
        updateData.cep = data.cep.replace('-', '');
      }
      if (data.estado) {
        updateData.estado = data.estado.toUpperCase();
      }

      return await AddressRepository.updateAddress(addressId, updateData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove um endereço
   *
   * @param addressId - ID do endereço
   * @param userId - ID do usuário (para verificação de propriedade)
   * @returns Promise com confirmação de remoção
   */
  static async deleteAddress(addressId: number, userId: number) {
    try {
      // Verificar se o endereço existe e pertence ao usuário
      const address = await AddressRepository.findAddressById(addressId);
      if (!address || address.usuarioId !== userId) {
        throw new Error('Endereço não encontrado');
      }

      // Verificar se o endereço está sendo usado em pedidos
      // Nota: Esta verificação pode ser removida se quisermos permitir exclusão
      // mesmo com pedidos existentes

      await AddressRepository.deleteAddress(addressId);

      return { message: 'Endereço removido com sucesso' };
    } catch (error) {
      throw error;
    }
  }
}
