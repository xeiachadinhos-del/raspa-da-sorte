import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    });

    if (existingUser) {
      console.log('Usuário de teste já existe:', existingUser.email);
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('test123', 12);

    // Criar usuário de teste
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'test@test.com',
        password: hashedPassword,
        credits: 100,
        balance: 50.00
      }
    });

    console.log('Usuário de teste criado com sucesso:');
    console.log('Email:', user.email);
    console.log('Nome:', user.name);
    console.log('Créditos:', user.credits);
    console.log('Saldo:', user.balance);
    console.log('ID:', user.id);

  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
