import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// EMAIL DA CONTA QUE VOCÊ QUER ADICIONAR SALDO
const TARGET_EMAIL = 'admin@gmail.com'; // MUDAR AQUI PARA O EMAIL CORRETO

async function addUserBalance() {
  try {
    console.log(`🔍 Procurando usuário ${TARGET_EMAIL}...`);
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: TARGET_EMAIL }
    });

    if (!user) {
      console.log(`❌ Usuário ${TARGET_EMAIL} não encontrado`);
      console.log('📝 Criando usuário...');
      
      // Criar usuário se não existir
      const newUser = await prisma.user.create({
        data: {
          email: TARGET_EMAIL,
          name: 'Usuário',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QZqKqG', // senha: admin123
          credits: 1000,
          balance: 100.00,
          level: 1,
          xp: 0
        }
      });
      
      console.log('✅ Usuário criado com sucesso!');
      console.log(`Email: ${TARGET_EMAIL}`);
      console.log('Senha: admin123');
      console.log('Saldo inicial: R$ 100,00');
      console.log('ID:', newUser.id);
    } else {
      console.log(`✅ Usuário ${TARGET_EMAIL} encontrado!`);
      console.log('Saldo atual:', user.balance);
      
      // Atualizar saldo para R$ 100,00
      const updatedUser = await prisma.user.update({
        where: { email: TARGET_EMAIL },
        data: { balance: 100.00 }
      });
      
      console.log('✅ Saldo atualizado com sucesso!');
      console.log('Novo saldo: R$', updatedUser.balance);
    }

    // Verificar novamente para confirmar
    const finalCheck = await prisma.user.findUnique({
      where: { email: TARGET_EMAIL }
    });

    console.log('\n📊 VERIFICAÇÃO FINAL:');
    console.log('Email:', finalCheck.email);
    console.log('Nome:', finalCheck.name);
    console.log('Saldo:', finalCheck.balance);
    console.log('Créditos:', finalCheck.credits);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUserBalance(); 