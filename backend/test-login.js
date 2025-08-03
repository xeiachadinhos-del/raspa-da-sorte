import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Testando login...');
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: 'teste@teste.com' }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }

    console.log('✅ Usuário encontrado:', user.email);
    console.log('🔑 Hash da senha:', user.password);

    // Testar senha
    const isValid = await bcrypt.compare('123456', user.password);
    console.log('🔐 Senha válida:', isValid);

    if (isValid) {
      console.log('✅ Login funcionando!');
    } else {
      console.log('❌ Senha inválida');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 