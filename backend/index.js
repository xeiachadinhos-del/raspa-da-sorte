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
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://raspa-da-sorte-gray.vercel.app',
    'https://raspa-da-sorte.vercel.app',
    'https://raspa-da-sorte-frontend.vercel.app',
    'https://raspa-da-sorte-main.vercel.app',
    'https://raspa-da-sorte-xeiachadinhos-del.vercel.app',
    'https://*.vercel.app',
    'https://vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

// Middleware para verificar token de admin
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  // Verificar se é o token de admin
  if (token === 'admin-token-123') {
    next();
  } else {
    res.status(401).json({ error: 'Token inválido' });
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

// Rota para comprar raspadinha
app.post('/api/buy-scratch', authenticateToken, async (req, res) => {
  try {
    const { price } = req.body;
    const userId = req.user.id;

    if (!price || price <= 0) {
      return res.status(400).json({ error: 'Preço inválido' });
    }

    // Verificar se o usuário tem saldo suficiente
    if (req.user.balance < price) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Deduzir o valor do saldo
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: req.user.balance - price }
    });

    // Registrar a jogada
    const game = await prisma.game.create({
      data: {
        userId: userId,
        gameType: 'Raspadinha',
        betAmount: price,
        winAmount: 0, // Será atualizado quando o usuário ganhar
        affiliateEmail: req.user.affiliateEmail
      }
    });

    res.json({ 
      success: true, 
      newBalance: updatedUser.balance,
      gameId: game.id
    });
  } catch (error) {
    console.error('Erro ao comprar raspadinha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para adicionar saldo quando o usuário ganha
app.post('/api/user/add-balance', authenticateToken, async (req, res) => {
  try {
    const { amount, gameId } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Atualizar o saldo do usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: req.user.balance + amount }
    });

    // Se foi fornecido um gameId, atualizar a jogada com o valor ganho
    if (gameId) {
      await prisma.game.update({
        where: { id: gameId },
        data: { winAmount: amount }
      });
    }

    res.json({ 
      success: true, 
      newBalance: updatedUser.balance 
    });
  } catch (error) {
    console.error('Erro ao adicionar saldo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para revelar raspadinha e verificar prêmio
app.post('/api/games/reveal-scratch', authenticateToken, async (req, res) => {
  try {
    const { gameSessionId } = req.body;
    
    if (!gameSessionId) {
      return res.status(400).json({ error: 'ID da sessão de jogo é obrigatório' });
    }

    // Verificar se a sessão existe e pertence ao usuário
    const gameSession = await prisma.gameSession.findFirst({
      where: { 
        id: gameSessionId,
        userId: req.user.id
      }
    });

    if (!gameSession) {
      return res.status(404).json({ error: 'Sessão de jogo não encontrada' });
    }

    // Simular resultado da raspadinha (em produção, seria mais complexo)
    const possiblePrizes = [0, 1, 2, 3, 5, 10, 50, 100, 200, 500, 1000, 2500];
    const prizeWon = Math.random() < 0.3 ? possiblePrizes[Math.floor(Math.random() * possiblePrizes.length)] : 0;

    // Atualizar sessão com o prêmio
    const updatedSession = await prisma.gameSession.update({
      where: { id: gameSessionId },
      data: { prizeWon }
    });

    // Se ganhou prêmio, adicionar ao saldo e criar registro de prêmio
    if (prizeWon > 0) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { balance: req.user.balance + prizeWon }
      });

      await prisma.prize.create({
        data: {
          userId: req.user.id,
          amount: prizeWon,
          claimed: true,
          claimedAt: new Date()
        }
      });
    }

    // Buscar usuário atualizado
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    res.json({
      success: true,
      prizeWon,
      message: prizeWon > 0 ? `Parabéns! Você ganhou R$ ${prizeWon.toFixed(2)}!` : 'Tente novamente!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        credits: updatedUser.credits,
        balance: updatedUser.balance
      }
    });
  } catch (error) {
    console.error('Erro ao revelar raspadinha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para estatísticas do dashboard
app.get('/api/admin/stats', verifyAdminToken, async (req, res) => {
  try {
    const { date } = req.query;
    
    // Buscar estatísticas do banco de dados
    const totalUsers = await prisma.user.count();
    
    const totalRegistrations = date ? 
      await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      }) : 0;
    
    const totalGames = await prisma.game.count();
    
    const totalDeposits = await prisma.deposit.aggregate({
      _sum: { amount: true }
    });
    
    const totalWithdrawals = await prisma.withdrawal.aggregate({
      _sum: { amount: true }
    });
    
    // Calcular receita total (apostas - ganhos)
    const totalBets = await prisma.game.aggregate({
      _sum: { betAmount: true }
    });
    
    const totalWins = await prisma.game.aggregate({
      _sum: { winAmount: true }
    });
    
    const totalRevenue = (totalBets._sum.betAmount || 0) - (totalWins._sum.winAmount || 0);
    
    res.json({
      totalUsers,
      totalRegistrations,
      totalGames,
      totalDeposits: totalDeposits._sum.amount || 0,
      totalWithdrawals: totalWithdrawals._sum.amount || 0,
      totalRevenue
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para jogadas recentes
app.get('/api/admin/recent-games', verifyAdminToken, async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    const formattedGames = games.map(game => ({
      id: game.id,
      userId: game.userId,
      userName: game.user.name,
      affiliateEmail: game.affiliateEmail,
      gameType: game.gameType,
      betAmount: game.betAmount,
      winAmount: game.winAmount,
      result: game.winAmount > 0 ? 'VITÓRIA' : 'DERROTA',
      profit: game.winAmount - game.betAmount,
      createdAt: game.createdAt
    }));
    
    res.json(formattedGames);
  } catch (error) {
    console.error('Erro ao buscar jogadas recentes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar usuários
app.get('/api/admin/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        games: {
          select: {
            id: true,
            winAmount: true,
            betAmount: true
          }
        }
      }
    });
    
    const formattedUsers = users.map(user => {
      const totalGames = user.games.length;
      const totalWins = user.games.filter(g => g.winAmount > 0).length;
      const totalLosses = totalGames - totalWins;
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        totalGames,
        totalWins,
        totalLosses,
        affiliateEmail: user.affiliateEmail
      };
    });
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar saldo do usuário
app.put('/api/admin/users/:userId/balance', verifyAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { balance } = req.body;
    
    if (typeof balance !== 'number' || balance < 0) {
      return res.status(400).json({ error: 'Saldo inválido' });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance }
    });
    
    res.json({ message: 'Saldo atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar jogadas com filtros
app.get('/api/admin/games', verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, result, startDate, endDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtros
    const where = {};
    
    if (search) {
      where.user = {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      };
    }
    
    if (result && result !== 'all') {
      if (result === 'VITÓRIA') {
        where.winAmount = { gt: 0 };
      } else if (result === 'DERROTA') {
        where.winAmount = { equals: 0 };
      }
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    
    // Buscar jogadas
    const [games, totalGames] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.game.count({ where })
    ]);
    
    const formattedGames = games.map(game => ({
      id: game.id,
      userId: game.userId,
      userName: game.user.name,
      affiliateEmail: game.affiliateEmail,
      gameType: game.gameType,
      betAmount: game.betAmount,
      winAmount: game.winAmount,
      result: game.winAmount > 0 ? 'VITÓRIA' : 'DERROTA',
      profit: game.winAmount - game.betAmount,
      createdAt: game.createdAt
    }));
    
    const totalPages = Math.ceil(totalGames / parseInt(limit));
    
    res.json({
      games: formattedGames,
      totalGames,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Erro ao buscar jogadas:', error);
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