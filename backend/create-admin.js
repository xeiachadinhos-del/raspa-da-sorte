import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Criando usuário administrador...');

    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe!');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Senha: 123456');
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('123456', 12);

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@gmail.com',
        password: hashedPassword,
        credits: 1000,
        balance: 10000,
        level: 100,
        xp: 10000,
        isBlocked: false
      }
    });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Senha: 123456');
    console.log('🆔 ID:', admin.id);

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 