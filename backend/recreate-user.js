import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function recreateUser() {
  try {
    console.log('🗑️ Deletando usuário existente...');
    
    // Deletar usuário existente
    await prisma.user.deleteMany({
      where: { email: 'teste@teste.com' }
    });

    console.log('📝 Criando novo usuário...');
    
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

    console.log('✅ Usuário recriado com sucesso!');
    console.log('Email: teste@teste.com');
    console.log('Senha: 123456');
    console.log('ID:', user.id);

  } catch (error) {
    console.error('❌ Erro ao recriar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateUser(); 