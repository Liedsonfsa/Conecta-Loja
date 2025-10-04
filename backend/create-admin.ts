/**
 * Script para criar um usuário administrador
 * Execute com: npx ts-node create-admin.ts
 */

import { EmployeeService } from './src/services/employeeService';
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔍 Verificando se existe uma loja...');

    // Verificar se existe alguma loja
    const store = await prisma.store.findFirst();

    if (!store) {
      console.log('❌ Nenhuma loja encontrada. Criando uma loja padrão...');

      // Criar uma loja padrão
      const newStore = await prisma.store.create({
        data: {
          name: 'Conecta-Loja Principal',
          contact: '(89) 99999-9999',
          email: 'contato@conectaloja.com',
          description: 'Loja principal do sistema Conecta-Loja'
        }
      });

      console.log('✅ Loja criada:', newStore);
    }

    const finalStore = store || await prisma.store.findFirst();

    if (!finalStore) {
      throw new Error('Não foi possível criar ou encontrar uma loja');
    }

    console.log('👤 Criando usuário administrador...');

    // Dados do admin
    const adminData = {
      name: 'Administrador Sistema',
      email: 'admin@conectaloja.com',
      password: 'admin123',
      role: 'ADMIN' as const,
      storeId: finalStore.id
    };

    // Criar o funcionário admin
    const admin = await EmployeeService.createEmployee(adminData);

    console.log('✅ Administrador criado com sucesso!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha:', adminData.password);
    console.log('👤 Tipo:', admin.role);
    console.log('🏪 Loja ID:', admin.lojaId);

    console.log('\n🚀 Você pode fazer login com:');
    console.log('Email: admin@conectaloja.com');
    console.log('Senha: admin123');

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);

    if ((error as Error).message.includes('Unique constraint')) {
      console.log('⚠️ Administrador já existe com este email');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
createAdmin();
