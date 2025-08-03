#!/bin/bash

echo "🚀 CONFIGURAÇÃO V0.DEV - RASPA DA SORTE"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "📋 PASSO A PASSO PARA INTEGRAÇÃO COM V0.DEV"
echo ""

print_info "FASE 1: PREPARAÇÃO DO PROJETO"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Você precisa estar na raiz do projeto!"
    print_info "Execute: cd /caminho/para/raspa-da-sorte-main"
    exit 1
fi

print_status "Diretório do projeto verificado"

# Verificar se o backend está rodando
if curl -s http://localhost:3001/api/health > /dev/null; then
    print_status "Backend está rodando na porta 3001"
else
    print_warning "Backend não está rodando. Iniciando..."
    cd backend && npm run dev &
    sleep 5
    if curl -s http://localhost:3001/api/health > /dev/null; then
        print_status "Backend iniciado com sucesso"
    else
        print_error "Falha ao iniciar backend"
        exit 1
    fi
    cd ..
fi

echo ""
print_info "FASE 2: CONFIGURAÇÃO DO V0.DEV"
echo ""

echo "📝 PROMPTS PRONTOS PARA V0.DEV:"
echo ""

echo "🎨 PROMPT 1 - PÁGINA PRINCIPAL:"
echo "--------------------------------"
cat << 'EOF'
Crie uma página inicial para um jogo de raspadinhas online chamado "Raspa da Sorte" com:

- Header com logo e navegação
- Hero section com chamada para ação
- Seção de login/cadastro
- Design moderno com gradientes amarelos
- Responsivo para mobile
- Botões para "Jogar Agora" e "Cadastrar"
- Footer com informações

Use Tailwind CSS e Next.js 14 com App Router.
EOF

echo ""
echo "🔐 PROMPT 2 - PÁGINA DE LOGIN:"
echo "------------------------------"
cat << 'EOF'
Crie uma página de login para o jogo "Raspa da Sorte" com:

- Formulário de login com email e senha
- Link para cadastro
- Design moderno com gradientes
- Validação de campos
- Loading states
- Mensagens de erro
- Responsivo

Use Tailwind CSS e Next.js 14.
EOF

echo ""
echo "🎮 PROMPT 3 - PÁGINA DO JOGO:"
echo "-----------------------------"
cat << 'EOF'
Crie uma página de jogo de raspadinhas com:

- Header com saldo, créditos e navegação
- Área principal do jogo com raspadinha
- Botão "Raspar" para jogar
- Área de resultado (prêmio ou "tente novamente")
- Sidebar com opções de compra de créditos
- Estatísticas de prêmios recentes
- Design atrativo e responsivo

Use Tailwind CSS e Next.js 14.
EOF

echo ""
echo "🏆 PROMPT 4 - PÁGINA DE CONQUISTAS:"
echo "----------------------------------"
cat << 'EOF'
Crie uma página de conquistas/gamificação com:

- Grid de cards de conquistas
- Progresso visual com barras
- Sistema de login diário
- Estatísticas do jogador
- Badges e ícones
- Design moderno e gamificado

Use Tailwind CSS e Next.js 14.
EOF

echo ""
print_info "FASE 3: CONFIGURAÇÃO DO DEPLOY"
echo ""

echo "🔧 VARIÁVEIS DE AMBIENTE PARA VERCEL:"
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api"
echo ""

echo "🌐 URL DO BACKEND PARA PRODUÇÃO:"
echo "Substitua pela URL do seu backend no Railway/Render"
echo ""

print_info "FASE 4: WORKFLOW DE DESENVOLVIMENTO"
echo ""

echo "1. 📱 Acesse: https://v0.dev"
echo "2. 🔐 Faça login com GitHub"
echo "3. ➕ Clique em 'New Project'"
echo "4. 🎯 Escolha 'Next.js 14'"
echo "5. 📝 Cole os prompts acima"
echo "6. 🎨 Ajuste o design"
echo "7. 📤 Exporte o código"
echo "8. 🔗 Configure no Vercel"
echo ""

print_info "FASE 5: TESTE E INTEGRAÇÃO"
echo ""

echo "🧪 TESTES NECESSÁRIOS:"
echo "- ✅ Cadastro de usuário"
echo "- ✅ Login/logout"
echo "- ✅ Jogo de raspadinhas"
echo "- ✅ Sistema de conquistas"
echo "- ✅ Responsividade mobile"
echo "- ✅ Integração com backend"
echo ""

print_warning "IMPORTANTE:"
echo "- Mantenha backup do código original"
echo "- Teste em diferentes dispositivos"
echo "- Configure CORS no backend"
echo "- Use variáveis de ambiente"
echo ""

print_status "Configuração concluída!"
echo ""
echo "🎉 Agora você pode começar a usar o v0.dev!"
echo ""
echo "📞 Precisa de ajuda? Consulte o arquivo v0-integration-guide.md" 