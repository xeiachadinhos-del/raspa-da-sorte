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
app.post('/api/games/buy-scratch', authenticateToken, async (req, res) => {
  try {
    const { gameId, price } = req.body;
    
    if (!gameId || !price) {
      return res.status(400).json({ error: 'ID do jogo e preço são obrigatórios' });
    }

    // Verificar se o usuário tem saldo suficiente
    if (req.user.balance < price) {
      return res.status(400).json({ error: 'Saldo insuficiente para comprar esta raspadinha' });
    }

    // Deduzir o valor do saldo
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { balance: req.user.balance - price }
    });

    // Criar sessão de jogo
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: req.user.id,
        creditsUsed: 1,
        xpEarned: 10
      }
    });

    res.json({
      success: true,
      message: 'Raspadinha comprada com sucesso!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        credits: updatedUser.credits,
        balance: updatedUser.balance
      },
      gameSession: {
        id: gameSession.id,
        creditsUsed: gameSession.creditsUsed,
        xpEarned: gameSession.xpEarned
      }
    });
  } catch (error) {
    console.error('Erro ao comprar raspadinha:', error);
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

// Rota para adicionar saldo ao usuário
app.post('/api/user/add-balance', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Atualizar saldo do usuário
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { balance: req.user.balance + amount }
    });

    res.json({
      success: true,
      message: `Saldo adicionado: R$ ${amount.toFixed(2)}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        credits: updatedUser.credits,
        balance: updatedUser.balance
      }
    });
  } catch (error) {
    console.error('Erro ao adicionar saldo:', error);
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