#!/bin/bash

echo "🚀 DEPLOY DO BACKEND NO RAILWAY"
echo "================================"

# Verificar se o Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado!"
    echo "📦 Instalando Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI encontrado!"

# Fazer login no Railway (se necessário)
echo "🔐 Fazendo login no Railway..."
railway login

# Inicializar projeto (se necessário)
if [ ! -f ".railway" ]; then
    echo "📁 Inicializando projeto Railway..."
    railway init
fi

# Configurar variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."
railway variables set JWT_SECRET="sua_chave_secreta_muito_segura_aqui"
railway variables set DATABASE_URL="file:./dev.db"
railway variables set FRONTEND_URL="https://raspa-da-sorte-gray.vercel.app"

# Fazer deploy
echo "🚀 Fazendo deploy..."
railway up

echo "✅ Deploy concluído!"
echo "🌐 URL do backend será mostrada acima"
echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo "1. Copie a URL do backend (algo como: https://seu-app.railway.app)"
echo "2. Vá para o Vercel e atualize a variável NEXT_PUBLIC_API_URL"
echo "3. Teste o login novamente" 