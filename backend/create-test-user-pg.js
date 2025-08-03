import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'teste@teste.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário de teste já existe!');
      console.log('Email: teste@teste.com');
      console.log('Senha: 123456');
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        password: hashedPassword,
        credits: 100,
        balance: 0,
        level: 1,
        xp: 0
      }
    });

    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('Email: teste@teste.com');
    console.log('Senha: 123456');
    console.log('ID:', user.id);

  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 