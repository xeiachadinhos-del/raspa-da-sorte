import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco...');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida!');
    
    // Testar query simples
    const userCount = await prisma.user.count();
    console.log(`📊 Total de usuários: ${userCount}`);
    
    // Listar usuários
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
    console.log('👥 Usuários:', users);
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 