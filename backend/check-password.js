import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkPassword() {
  try {
    console.log('🔍 Verificando senha do usuário admin@gmail.com...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log('✅ Usuário encontrado!');
    console.log('Email:', user.email);
    console.log('Nome:', user.name);
    console.log('Senha hash:', user.password.substring(0, 20) + '...');
    
    // Testar senhas
    const testPasswords = ['admin123', 'admin', '123456', 'password'];
    
    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`Senha "${password}": ${isValid ? '✅ CORRETA' : '❌ INCORRETA'}`);
    }

    // Criar nova senha se necessário
    console.log('\n🔧 Criando nova senha...');
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { email: 'admin@gmail.com' },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Senha atualizada para: admin123');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword(); 