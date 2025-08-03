import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function setupRender() {
  console.log('🚀 Configurando banco de dados para produção...\n');

  try {
    // Conectar ao banco
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados');

    // Verificar se há usuários
    const userCount = await prisma.user.count();
    console.log(`📊 Usuários existentes: ${userCount}`);

    if (userCount === 0) {
      console.log('👤 Criando usuário de teste...');
      
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
      
      console.log('✅ Usuário criado:', user.email);
    } else {
      console.log('✅ Usuário de teste já existe');
    }

    // Verificar se há conquistas
    const achievementCount = await prisma.achievement.count();
    console.log(`🏆 Conquistas existentes: ${achievementCount}`);

    if (achievementCount === 0) {
      console.log('🏆 Criando conquistas padrão...');
      
      const achievements = [
        {
          name: 'Primeiro Login',
          description: 'Faça seu primeiro login no jogo',
          type: 'DAILY',
          requirement: 1,
          reward: 10,
          icon: '🎯'
        },
        {
          name: 'Jogador Ativo',
          description: 'Jogue 10 partidas',
          type: 'MILESTONE',
          requirement: 10,
          reward: 50,
          icon: '🎮'
        },
        {
          name: 'Vencedor',
          description: 'Ganhe R$ 100 em prêmios',
          type: 'MILESTONE',
          requirement: 100,
          reward: 100,
          icon: '💰'
        }
      ];

      for (const achievement of achievements) {
        await prisma.achievement.create({
          data: achievement
        });
      }
      
      console.log('✅ Conquistas criadas');
    } else {
      console.log('✅ Conquistas já existem');
    }

    console.log('\n🎯 Configuração concluída!');
    console.log('📧 Email de teste: teste@raspa.com');
    console.log('🔑 Senha: 123456');

  } catch (error) {
    console.error('❌ Erro na configuração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupRender(); 