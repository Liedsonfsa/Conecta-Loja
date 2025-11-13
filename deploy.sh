#!/bin/bash

# Script de deploy para Fly.io - Conecta-Loja
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy da aplicação Conecta-Loja no Fly.io"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se flyctl está instalado
if ! command -v fly &> /dev/null; then
    echo -e "${RED}❌ Flyctl não está instalado. Instale primeiro:${NC}"
    echo "curl -L https://fly.io/install.sh | sh"
    echo "export PATH=\"\$HOME/.fly/bin:\$PATH\""
    exit 1
fi

# Verificar se está logado
if ! fly auth whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você não está logado no Fly.io. Fazendo login...${NC}"
    fly auth login
fi

echo -e "${GREEN}✅ Flyctl instalado e logado${NC}"
echo ""

# Função para verificar se app existe
app_exists() {
    fly apps list | grep -q "$1"
}

# Deploy do backend
echo -e "${YELLOW}🔧 Fazendo deploy do backend...${NC}"
cd backend

if app_exists "conecta-loja-backend"; then
    echo "Aplicação backend já existe, fazendo deploy..."
    fly deploy --remote-only
else
    echo "Criando aplicação backend..."
    fly launch --name conecta-loja-backend --no-deploy
    fly deploy --remote-only
fi

cd ..
echo -e "${GREEN}✅ Backend deployado com sucesso${NC}"
echo ""

# Deploy do frontend
echo -e "${YELLOW}🌐 Fazendo deploy do frontend...${NC}"
cd frontend

if app_exists "conecta-loja-frontend"; then
    echo "Aplicação frontend já existe, fazendo deploy..."
    fly deploy --remote-only
else
    echo "Criando aplicação frontend..."
    fly launch --name conecta-loja-frontend --no-deploy
    fly deploy --remote-only
fi

cd ..
echo -e "${GREEN}✅ Frontend deployado com sucesso${NC}"
echo ""

# URLs de produção
echo -e "${GREEN}🎉 Deploy concluído!${NC}"
echo ""
echo "📋 URLs de produção:"
echo -e "  🌐 Frontend: ${GREEN}https://conecta-loja-frontend.fly.dev${NC}"
echo -e "  🔧 Backend:  ${GREEN}https://conecta-loja-backend.fly.dev${NC}"
echo ""
echo "💡 Próximos passos:"
echo "  1. Configure o PostgreSQL se ainda não fez"
echo "  2. Execute migrações: fly ssh console --app conecta-loja-backend && npm run prisma:migrate"
echo "  3. Monitore logs: fly logs --app conecta-loja-backend"
echo ""
echo -e "${YELLOW}📖 Para mais detalhes, consulte DEPLOY_README.md${NC}"
