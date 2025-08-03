# 🚀 Guia de Deploy - Raspa da Sorte

## 📋 Pré-requisitos
- Conta no GitHub
- Conta no Vercel (para frontend)
- Conta no Render.com (para backend)

## 🎯 Status Atual
- ✅ **Frontend**: Pronto para deploy no Vercel
- ✅ **Backend**: Pronto para deploy no Render.com
- ✅ **Sistema de Saldo**: Implementado
- ✅ **Compra de Raspadinhas**: Implementado
- ✅ **Banco de Dados**: PostgreSQL configurado

## 🌐 Deploy do Frontend (Vercel)

### 1. Conectar ao Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe o repositório: `xeiachadinhos-del/raspa-da-sorte`

### 2. Configurar Variáveis de Ambiente
No Vercel, adicione as seguintes variáveis:
```
NEXT_PUBLIC_API_URL=https://seu-backend-render.onrender.com/api
```

### 3. Configurar Build
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4. Deploy
- Clique em "Deploy"
- Aguarde o build completar
- Seu frontend estará disponível em: `https://raspa-da-sorte.vercel.app`

## 🔧 Deploy do Backend (Render.com)

### 1. Conectar ao Render
1. Acesse [render.com](https://render.com)
2. Faça login com sua conta GitHub
3. Clique em "New +" → "Web Service"
4. Conecte o repositório: `xeiachadinhos-del/raspa-da-sorte`

### 2. Configurar Serviço
- **Name**: `raspa-da-sorte-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate && npx prisma db push`
- **Start Command**: `node index.js`

### 3. Configurar Banco de Dados
1. Clique em "New +" → "PostgreSQL"
2. **Name**: `raspa-da-sorte-db`
3. **Database**: `raspa_da_sorte`
4. **User**: `raspa_da_sorte_user`
5. Anote a **Connection String**

### 4. Configurar Variáveis de Ambiente
No serviço web, adicione:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
DATABASE_URL=sua_connection_string_do_postgresql
FRONTEND_URL=https://raspa-da-sorte.vercel.app
```

### 5. Deploy
- Clique em "Create Web Service"
- Aguarde o deploy completar
- Seu backend estará disponível em: `https://seu-backend-render.onrender.com`

## 🎮 Configurar Banco de Dados

### 1. Executar Setup
Após o deploy, execute o setup do banco:
```bash
# No Render.com, vá em "Shell" e execute:
npm run setup
```

### 2. Usuário de Teste
O sistema criará automaticamente:
- **Email**: `teste@raspa.com`
- **Senha**: `123456`
- **Saldo**: R$ 1.000,00

## 🔗 Conectar Frontend ao Backend

### 1. Atualizar URL da API
No Vercel, atualize a variável:
```
NEXT_PUBLIC_API_URL=https://seu-backend-render.onrender.com/api
```

### 2. Re-deploy do Frontend
- No Vercel, vá em "Deployments"
- Clique em "Redeploy" no último deploy

## ✅ Testar Sistema

### 1. Testar Login
- Acesse: `https://raspa-da-sorte.vercel.app`
- Clique em "Entrar"
- Use: `teste@raspa.com` / `123456`

### 2. Testar Compra de Raspadinha
- Faça login
- Vá para qualquer jogo
- Clique em "Jogar"
- Verifique se o saldo foi descontado

### 3. Testar Raspadinha
- Após comprar, a raspadinha ficará disponível
- Clique para revelar
- Verifique se ganhou prêmio

## 🛠️ Funcionalidades Implementadas

### ✅ Sistema de Saldo
- Cada usuário tem saldo individual
- Saldo é descontado ao comprar raspadinhas
- Saldo é creditado ao ganhar prêmios

### ✅ Compra de Raspadinhas
- Verificação de saldo suficiente
- Desconto automático do valor
- Criação de sessão de jogo

### ✅ Sistema de Prêmios
- Prêmios de R$ 1,00 a R$ 2.500,00
- 30% de chance de ganhar
- Crédito automático no saldo

### ✅ Histórico de Jogos
- Registro de todas as compras
- Registro de todos os prêmios
- Estatísticas do usuário

### ✅ Sistema de Conquistas
- Login diário
- Jogos consecutivos
- Prêmios ganhos

## 🔧 Comandos Úteis

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Produção
```bash
# Setup banco de dados
npm run setup

# Verificar logs
# No Render.com → Logs
```

## 📞 Suporte
Se encontrar problemas:
1. Verifique os logs no Render.com
2. Verifique as variáveis de ambiente
3. Teste a API diretamente: `https://seu-backend-render.onrender.com/api/health`

## 🎉 Pronto!
Seu sistema de raspadinhas está completamente funcional com:
- ✅ Sistema de saldo
- ✅ Compra de raspadinhas
- ✅ Sistema de prêmios
- ✅ Histórico de jogos
- ✅ Sistema de conquistas
- ✅ Deploy em produção 