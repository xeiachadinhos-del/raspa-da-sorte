#!/bin/bash

echo "🚀 Iniciando Raspa da Sorte..."

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Porta $1 já está em uso"
        return 1
    else
        echo "✅ Porta $1 está livre"
        return 0
    fi
}

# Verificar portas
echo "🔍 Verificando portas..."
check_port 3001 || exit 1
check_port 3000 || exit 1

# Iniciar backend
echo "🔧 Iniciando Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Testar backend
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend funcionando!"
else
    echo "❌ Erro no backend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Iniciar frontend
echo "🎨 Iniciando Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Aguardar frontend inicializar
echo "⏳ Aguardando frontend inicializar..."
sleep 8

# Testar frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Frontend funcionando!"
else
    echo "❌ Erro no frontend"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 SUCESSO! Raspa da Sorte está rodando!"
echo ""
echo "🌐 Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📱 Para parar os serviços, pressione Ctrl+C"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Serviços parados"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter script rodando
wait 