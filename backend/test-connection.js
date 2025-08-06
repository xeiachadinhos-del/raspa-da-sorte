import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida!');
    
    // Contar usuários
    const userCount = await prisma.user.count();
    console.log('📊 Total de usuários:', userCount);
    
    // Listar todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        balance: true,
        credits: true,
        createdAt: true
      }
    });
    
    console.log('\n👥 Usuários no banco:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Saldo: R$ ${user.balance} - Créditos: ${user.credits}`);
    });
    
    // Verificar usuário admin especificamente
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });
    
    if (admin) {
      console.log('\n👑 USUÁRIO ADMIN:');
      console.log('Email:', admin.email);
      console.log('Nome:', admin.name);
      console.log('Saldo:', admin.balance);
      console.log('Créditos:', admin.credits);
      console.log('Nível:', admin.level);
      console.log('XP:', admin.xp);
    } else {
      console.log('\n❌ Usuário admin não encontrado!');
    }
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 