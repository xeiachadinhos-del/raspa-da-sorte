import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const achievements = [
  {
    name: "Primeiro Jogo",
    description: "Jogue sua primeira raspadinha",
    type: "MILESTONE",
    requirement: 1,
    reward: 5,
    icon: "🎯"
  },
  {
    name: "Jogador Ativo",
    description: "Jogue 10 raspadinhas",
    type: "MILESTONE",
    requirement: 10,
    reward: 15,
    icon: "🎮"
  },
  {
    name: "Viciado em Jogos",
    description: "Jogue 50 raspadinhas",
    type: "MILESTONE",
    requirement: 50,
    reward: 50,
    icon: "🎲"
  },
  {
    name: "Primeiro Prêmio",
    description: "Ganhe seu primeiro prêmio",
    type: "MILESTONE",
    requirement: 1,
    reward: 10,
    icon: "🏆"
  },
  {
    name: "Ganhador Frequente",
    description: "Ganhe 5 prêmios",
    type: "MILESTONE",
    requirement: 5,
    reward: 25,
    icon: "💰"
  },
  {
    name: "Login Diário",
    description: "Faça login por 3 dias seguidos",
    type: "DAILY",
    requirement: 3,
    reward: 20,
    icon: "📅"
  },
  {
    name: "Semana Perfeita",
    description: "Faça login por 7 dias seguidos",
    type: "DAILY",
    requirement: 7,
    reward: 100,
    icon: "🌟"
  },
  {
    name: "Comprador",
    description: "Compre créditos pela primeira vez",
    type: "MILESTONE",
    requirement: 1,
    reward: 20,
    icon: "💳"
  },
  {
    name: "Investidor",
    description: "Compre créditos 5 vezes",
    type: "MILESTONE",
    requirement: 5,
    reward: 50,
    icon: "📈"
  },
  {
    name: "Lucky Day",
    description: "Ganhe um prêmio de R$ 50 ou mais",
    type: "SPECIAL",
    requirement: 1,
    reward: 30,
    icon: "🍀"
  }
];

async function seedAchievements() {
  try {
    console.log('🌱 Populando banco com conquistas...');

    for (const achievement of achievements) {
      await prisma.achievement.create({
        data: achievement
      });
    }

    console.log('✅ Conquistas criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar conquistas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAchievements(); 