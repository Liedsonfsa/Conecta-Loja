import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar loja
  const loja = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Sabor do Sertão',
      contact: '(11) 99999-9999',
      email: 'sabordosertao@gmail.com',
      description: 'Loja online'
    }
  });

  console.log('✅ Loja criada:', loja.name);

  // Criar cargo de administrador
  const cargoAdmin = await prisma.cargo.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: {
      name: 'Administrador',
      description: 'Administrador do sistema com acesso total'
    }
  });

  console.log('✅ Cargo criado:', cargoAdmin.name);

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.funcionario.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@gmail.com',
      password: hashedPassword,
      cargoId: cargoAdmin.id,
      lojaId: loja.id
    }
  });

  console.log('✅ Usuário admin criado:', adminUser.email);
  console.log('🔐 Senha: admin123');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
