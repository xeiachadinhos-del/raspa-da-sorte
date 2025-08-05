import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin já existe no banco de dados');
      console.log('Email: admin@gmail.com');
      console.log('Senha: 123456');
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
        balance: 0,
        credits: 0,
        isBlocked: false
      }
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('Email: admin@gmail.com');
    console.log('Senha: 123456');
    console.log('ID:', admin.id);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 