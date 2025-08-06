import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function forceAdminBalance() {
  try {
    console.log('🔍 Verificando usuário admin@gmail.com...');
    
    // Buscar usuário admin
    let user = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuário admin@gmail.com não encontrado');
      console.log('📝 Criando usuário admin...');
      
      // Criar usuário admin
      user = await prisma.user.create({
        data: {
          email: 'admin@gmail.com',
          name: 'Administrador',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QZqKqG', // senha: admin123
          credits: 1000,
          balance: 100.00,
          level: 10,
          xp: 1000
        }
      });
      
      console.log('✅ Usuário admin criado com sucesso!');
      console.log('Email: admin@gmail.com');
      console.log('Senha: admin123');
      console.log('Saldo inicial: R$ 100,00');
      console.log('ID:', user.id);
    } else {
      console.log('✅ Usuário admin encontrado!');
      console.log('Saldo atual:', user.balance);
      
      // Forçar atualização do saldo para R$ 100,00
      const updatedUser = await prisma.user.update({
        where: { email: 'admin@gmail.com' },
        data: { 
          balance: 100.00,
          credits: 1000,
          level: 10,
          xp: 1000
        }
      });
      
      console.log('✅ Saldo FORÇADO para R$ 100,00!');
      console.log('Novo saldo: R$', updatedUser.balance);
      console.log('Créditos:', updatedUser.credits);
      console.log('Nível:', updatedUser.level);
    }

    // Verificar novamente para confirmar
    const finalCheck = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });

    console.log('\n📊 VERIFICAÇÃO FINAL:');
    console.log('Email:', finalCheck.email);
    console.log('Nome:', finalCheck.name);
    console.log('Saldo:', finalCheck.balance);
    console.log('Créditos:', finalCheck.credits);
    console.log('Nível:', finalCheck.level);
    console.log('XP:', finalCheck.xp);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

forceAdminBalance(); 