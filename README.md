# 🎫 Raspa da Sorte

Sistema completo de raspadinhas online com autenticação, banco de dados e API REST.

## 🚀 Como executar (MÉTODO SIMPLES)

### ✅ Pré-requisitos
- Node.js 18+ instalado
- Git instalado

### 🎯 Passo a passo:

1. **Clone o repositório** (se ainda não fez):
```bash
git clone https://github.com/seu-usuario/raspa-da-sorte.git
cd raspa-da-sorte
```

2. **Execute o script automático**:
```bash
./start.sh
```

3. **Acesse no navegador**:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🎮 Como usar o sistema:

1. **Acesse**: http://localhost:3000
2. **Cadastre-se** ou **Faça login**
3. **Compre créditos** (simulação)
4. **Jogue as raspadinhas**!
5. **Veja seu histórico** no painel

## 📁 Estrutura do projeto:

```
raspa-da-sorte/
├── backend/          # API Node.js + Express
│   ├── prisma/      # Banco de dados SQLite
│   └── index.js     # Servidor principal
├── frontend/         # Next.js + React
│   ├── src/app/     # Páginas da aplicação
│   └── public/      # Arquivos estáticos
└── start.sh         # Script para iniciar tudo
```

## 🔧 Funcionalidades:

✅ **Cadastro e Login** - Sistema completo de autenticação
✅ **Sistema de Créditos** - Compra e gestão de créditos
✅ **Jogo de Raspadinha** - Interface interativa
✅ **Histórico de Prêmios** - Rastreamento de ganhos
✅ **Painel do Usuário** - Dashboard completo
✅ **API REST** - Backend completo

## 🌐 Deploy (para deixar online):

### Frontend (Vercel):
1. Conecte seu repositório no Vercel
2. Configure a variável: `NEXT_PUBLIC_API_URL`
3. Deploy automático

### Backend (Railway):
1. Conecte seu repositório no Railway
2. Configure as variáveis de ambiente
3. Deploy automático

## 🛠️ Comandos úteis:

```bash
# Iniciar tudo automaticamente
./start.sh

# Iniciar apenas backend
cd backend && npm run dev

# Iniciar apenas frontend
cd frontend && npm run dev

# Parar todos os serviços
pkill -f "node.*index.js"
pkill -f "next.*dev"
```

## 📞 Suporte:

Se algo não funcionar:
1. Verifique se as portas 3000 e 3001 estão livres
2. Execute `./start.sh` novamente
3. Verifique se Node.js está instalado: `node --version`

## 🎉 Pronto!

Agora você tem um sistema completo de raspadinhas funcionando localmente! 