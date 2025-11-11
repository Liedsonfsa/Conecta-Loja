#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento Conecta-Loja
# Uso: ./start-dev.sh

echo "🚀 Iniciando ambiente de desenvolvimento Conecta-Loja..."
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

echo "🐳 Construindo e iniciando containers..."
docker-compose up --build -d

echo ""
echo "✅ Ambiente iniciado com sucesso!"
echo ""
echo "📋 Serviços disponíveis:"
echo "  🌐 Frontend:     http://localhost:5173"
echo "  🔧 Backend API:  http://localhost:8000"
echo "  📚 API Docs:     http://localhost:8000/api"
echo "  🏥 Health Check:  http://localhost:8000/health"
echo "  🗄️  Prisma Studio: http://localhost:5555"
echo ""
echo "🔄 Hot reload ativado para desenvolvimento!"
echo ""
echo "💡 Comandos úteis:"
echo "  docker-compose logs -f              # Ver logs em tempo real"
echo "  docker-compose down                 # Parar todos os serviços"
echo "  docker-compose restart frontend     # Reiniciar apenas o frontend"
echo "  docker-compose restart backend      # Reiniciar apenas o backend"
