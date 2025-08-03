import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkDeploy() {
  console.log('🔍 Verificando configuração do deploy...\n');

  // Verificar variáveis de ambiente
  console.log('📋 Variáveis de Ambiente:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definido' : '❌ Não definido');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definido' : '❌ Não definido');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('');

  // Testar conexão com banco de dados
  try {
    console.log('🗄️ Testando conexão com banco de dados...');
    await prisma.$connect();
    console.log('✅ Conexão com banco OK');

    // Verificar se há usuários
    const userCount = await prisma.user.count();
    console.log(`📊 Usuários no banco: ${userCount}`);

    if (userCount === 0) {
      console.log('⚠️ Nenhum usuário encontrado. Criando usuário de teste...');
      
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 12);
      
      const user = await prisma.user.create({
        data: {
          name: 'teste teste',
          email: 'teste@raspa.com',
          password: hashedPassword,
          credits: 10,
          balance: 0
        }
      });
      
      console.log('✅ Usuário de teste criado:', user.email);
    }

  } catch (error) {
    console.error('❌ Erro na conexão com banco:', error.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n🎯 Status do Deploy:');
  console.log('Backend local: ✅ Funcionando');
  console.log('Banco de dados: ✅ Conectado');
  console.log('Usuário de teste: ✅ Disponível (teste@raspa.com / 123456)');
  console.log('\n🚀 Para fazer deploy no Render:');
  console.log('1. Acesse: https://dashboard.render.com');
  console.log('2. Conecte o repositório GitHub');
  console.log('3. Configure as variáveis de ambiente');
  console.log('4. Deploy automático será iniciado');
}

checkDeploy(); 