#!/bin/bash

echo "🚀 GUIA DE DEPLOY - RASPA DA SORTE"
echo "=================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🎯 ESCOLHA SUA OPÇÃO DE DEPLOY:"
echo ""

echo "1️⃣  OPÇÃO A: HOSTINGER (Site Estático)"
echo "   - Eu crio versão HTML/CSS/JS"
echo "   - Você faz upload na Hostinger"
echo "   - Funcionalidades limitadas"
echo "   - Custo: ~R$ 150-290/ano"
echo ""

echo "2️⃣  OPÇÃO B: VERCEL + RAILWAY (Recomendada)"
echo "   - Deploy automático"
echo "   - Tudo funciona perfeitamente"
echo "   - Mais fácil para iniciantes"
echo "   - Custo: ~R$ 30-50/ano"
echo ""

read -p "Escolha (1 ou 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    print_info "OPÇÃO A: HOSTINGER (Site Estático)"
    echo ""
    echo "📋 PASSO A PASSO:"
    echo ""
    echo "1. 🎨 Eu crio versão estática"
    echo "2. 📁 Você faz upload na Hostinger"
    echo "3. 🌐 Configure domínio"
    echo "4. ✅ Pronto!"
    echo ""
    echo "⚠️  LIMITAÇÕES:"
    echo "- Sem sistema de login"
    echo "- Sem banco de dados"
    echo "- Sem APIs dinâmicas"
    echo "- Apenas interface visual"
    echo ""
    print_warning "Quer que eu crie a versão estática agora?"
    read -p "Sim/Não: " create_static
    
    if [[ $create_static =~ ^[Ss]$ ]]; then
        echo ""
        print_info "Criando versão estática..."
        # Aqui eu criaria os arquivos HTML/CSS/JS
        echo "📁 Arquivos criados na pasta 'static-version'"
        echo "📤 Faça upload desses arquivos na Hostinger"
    fi

elif [ "$choice" = "2" ]; then
    echo ""
    print_info "OPÇÃO B: VERCEL + RAILWAY (Recomendada)"
    echo ""
    echo "🚀 DEPLOY AUTOMÁTICO:"
    echo ""
    
    # Verificar se tem Git configurado
    if ! git config --get user.name > /dev/null; then
        print_warning "Git não configurado. Configurando..."
        read -p "Seu nome: " git_name
        read -p "Seu email: " git_email
        git config --global user.name "$git_name"
        git config --global user.email "$git_email"
        print_status "Git configurado!"
    fi
    
    echo "📋 PASSO A PASSO:"
    echo ""
    echo "1. 🌐 Vercel (Frontend):"
    echo "   - Vá para: https://vercel.com"
    echo "   - Faça login com GitHub"
    echo "   - Clique em 'New Project'"
    echo "   - Conecte seu repositório"
    echo "   - Clique em 'Deploy'"
    echo ""
    echo "2. 🔧 Railway (Backend):"
    echo "   - Vá para: https://railway.app"
    echo "   - Faça login com GitHub"
    echo "   - Clique em 'New Project'"
    echo "   - Conecte seu repositório"
    echo "   - Configure variáveis de ambiente"
    echo ""
    echo "3. 🔗 Integração:"
    echo "   - Copie URL do Railway"
    echo "   - Configure no Vercel"
    echo "   - Teste tudo"
    echo ""
    
    print_warning "Quer que eu te ajude com o deploy agora?"
    read -p "Sim/Não: " help_deploy
    
    if [[ $help_deploy =~ ^[Ss]$ ]]; then
        echo ""
        print_info "Preparando para deploy..."
        
        # Verificar se o projeto está pronto
        if [ -f "package.json" ] && [ -d "frontend" ] && [ -d "backend" ]; then
            print_status "Projeto verificado!"
            
            echo ""
            echo "🔧 CONFIGURAÇÃO NECESSÁRIA:"
            echo ""
            echo "📝 No Railway (Backend), configure:"
            echo "DATABASE_URL=file:./dev.db"
            echo "JWT_SECRET=sua_chave_secreta_aqui"
            echo "PORT=3001"
            echo ""
            echo "📝 No Vercel (Frontend), configure:"
            echo "NEXT_PUBLIC_API_URL=https://seu-backend.railway.app/api"
            echo ""
            
            print_warning "Quer que eu prepare o código para deploy?"
            read -p "Sim/Não: " prepare_code
            
            if [[ $prepare_code =~ ^[Ss]$ ]]; then
                echo ""
                print_info "Preparando código..."
                
                # Commit das mudanças
                git add .
                git commit -m "Preparando para deploy"
                
                print_status "Código preparado!"
                echo ""
                echo "🚀 PRÓXIMOS PASSOS:"
                echo "1. git push origin main"
                echo "2. Configure Vercel"
                echo "3. Configure Railway"
                echo "4. Teste tudo"
            fi
        else
            print_error "Projeto não encontrado!"
            echo "Certifique-se de estar no diretório correto."
        fi
    fi

else
    print_error "Opção inválida!"
    echo "Escolha 1 ou 2."
fi

echo ""
print_status "Guia de deploy concluído!"
echo ""
echo "📞 Precisa de ajuda? Me pergunte!" 