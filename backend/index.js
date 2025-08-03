import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Rotas de Autenticação
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: 10 // Créditos iniciais
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        balance: user.balance
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Email ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        balance: user.balance
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter dados do usuário
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        balance: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para jogar raspadinha
app.post('/api/game/play', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (user.credits < 1) {
      return res.status(400).json({ error: 'Créditos insuficientes' });
    }

    // Simula prêmios aleatórios
    const prizes = [null, null, 5, null, 10, null, null, 50, null, null, 100];
    const wonPrize = prizes[Math.floor(Math.random() * prizes.length)];

    // Atualiza créditos do usuário
    await prisma.user.update({
      where: { id: req.user.id },
      data: { credits: user.credits - 1 }
    });

    // Registra sessão do jogo
    await prisma.gameSession.create({
      data: {
        userId: req.user.id,
        creditsUsed: 1,
        prizeWon: wonPrize
      }
    });

    // Se ganhou prêmio, adiciona ao saldo
    if (wonPrize) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { balance: user.balance + wonPrize }
      });

      // Registra o prêmio
      await prisma.prize.create({
        data: {
          userId: req.user.id,
          amount: wonPrize
        }
      });
    }

    // Busca dados atualizados do usuário
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        balance: true
      }
    });

    res.json({
      prize: wonPrize,
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro no jogo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para comprar créditos
app.post('/api/credits/purchase', authenticateToken, async (req, res) => {
  try {
    const { credits, amount } = req.body;

    if (!credits || !amount) {
      return res.status(400).json({ error: 'Quantidade de créditos e valor são obrigatórios' });
    }

    // Registra transação
    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: 'CREDIT_PURCHASE',
        amount: amount,
        credits: credits,
        status: 'COMPLETED'
      }
    });

    // Atualiza créditos do usuário
    await prisma.user.update({
      where: { id: req.user.id },
      data: { credits: { increment: credits } }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        balance: true
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Erro na compra de créditos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter histórico de prêmios
app.get('/api/prizes', authenticateToken, async (req, res) => {
  try {
    const prizes = await prisma.prize.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json(prizes);
  } catch (error) {
    console.error('Erro ao buscar prêmios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter transações
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para login diário
app.post('/api/daily-login', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verificar se já fez login hoje
    const existingLogin = await prisma.dailyLogin.findFirst({
      where: {
        userId: req.user.id,
        loginDate: {
          gte: today
        }
      }
    });

    if (existingLogin) {
      return res.status(400).json({ error: 'Você já fez login hoje!' });
    }

    // Verificar sequência de logins
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastLogin = await prisma.dailyLogin.findFirst({
      where: { userId: req.user.id },
      orderBy: { loginDate: 'desc' }
    });

    let streak = 1;
    let reward = 10;

    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin.loginDate);
      lastLoginDate.setHours(0, 0, 0, 0);

      if (lastLoginDate.getTime() === yesterday.getTime()) {
        streak = lastLogin.streak + 1;
        reward = Math.min(10 + (streak - 1) * 5, 50); // Máximo 50 créditos
      }
    }

    // Registrar login diário
    await prisma.dailyLogin.create({
      data: {
        userId: req.user.id,
        loginDate: today,
        streak: streak,
        reward: reward
      }
    });

    // Adicionar créditos ao usuário
    await prisma.user.update({
      where: { id: req.user.id },
      data: { credits: { increment: reward } }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        balance: true,
        level: true,
        xp: true
      }
    });

    res.json({
      user: updatedUser,
      streak: streak,
      reward: reward,
      message: `Login diário! +${reward} créditos (sequência: ${streak} dias)`
    });
  } catch (error) {
    console.error('Erro no login diário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter conquistas
app.get('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      include: {
        userAchievements: {
          where: { userId: req.user.id }
        }
      }
    });

    const userAchievements = achievements.map(achievement => {
      const userAchievement = achievement.userAchievements[0];
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        type: achievement.type,
        requirement: achievement.requirement,
        reward: achievement.reward,
        icon: achievement.icon,
        progress: userAchievement ? userAchievement.progress : 0,
        completed: userAchievement ? userAchievement.completed : false,
        completedAt: userAchievement ? userAchievement.completedAt : null
      };
    });

    res.json(userAchievements);
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter estatísticas do usuário
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const [totalGames, totalPrizes, totalSpent, dailyLogins] = await Promise.all([
      prisma.gameSession.count({ where: { userId: req.user.id } }),
      prisma.prize.count({ where: { userId: req.user.id } }),
      prisma.transaction.aggregate({
        where: { 
          userId: req.user.id,
          type: 'CREDIT_PURCHASE',
          status: 'COMPLETED'
        },
        _sum: { amount: true }
      }),
      prisma.dailyLogin.count({ where: { userId: req.user.id } })
    ]);

    const stats = {
      totalGames: totalGames,
      totalPrizes: totalPrizes,
      totalSpent: totalSpent._sum.amount || 0,
      totalLogins: dailyLogins,
      averagePrize: totalPrizes > 0 ? (await prisma.prize.aggregate({
        where: { userId: req.user.id },
        _avg: { amount: true }
      }))._avg.amount : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});

// Tratamento de erros
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 