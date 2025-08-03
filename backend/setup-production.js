import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupProduction() {
  try {
    console.log('🔧 Configurando banco de dados em produção...');

    // Gerar Prisma Client
    console.log('📦 Gerando Prisma Client...');
    await prisma.$connect();

    // Criar conquistas iniciais
    console.log('🏆 Criando conquistas iniciais...');
    const achievements = [
      {
        name: 'Primeiro Login',
        description: 'Faça seu primeiro login no jogo',
        type: 'DAILY',
        requirement: 1,
        reward: 50,
        icon: '🎯'
      },
      {
        name: 'Jogador Assíduo',
        description: 'Faça login por 7 dias consecutivos',
        type: 'WEEKLY',
        requirement: 7,
        reward: 200,
        icon: '🔥'
      },
      {
        name: 'Vencedor',
        description: 'Ganhe seu primeiro prêmio',
        type: 'SPECIAL',
        requirement: 1,
        reward: 100,
        icon: '🏆'
      },
      {
        name: 'Jogador Experiente',
        description: 'Jogue 50 raspadinhas',
        type: 'MILESTONE',
        requirement: 50,
        reward: 500,
        icon: '⭐'
      }
    ];

    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: achievement,
        create: achievement
      });
    }

    // Criar usuário de teste se não existir
    console.log('👤 Criando usuário de teste...');
    const testUser = await prisma.user.upsert({
      where: { email: 'teste@raspa.com' },
      update: {},
      create: {
        email: 'teste@raspa.com',
        name: 'Usuário Teste',
        password: await bcrypt.hash('123456', 12),
        balance: 1000, // Saldo inicial de R$ 1000
        credits: 100
      }
    });

    console.log('✅ Configuração concluída com sucesso!');
    console.log(`👤 Usuário de teste criado: ${testUser.email}`);
    console.log(`💰 Saldo inicial: R$ ${testUser.balance.toFixed(2)}`);
    console.log(`🎮 Créditos iniciais: ${testUser.credits}`);

  } catch (error) {
    console.error('❌ Erro na configuração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupProduction(); 