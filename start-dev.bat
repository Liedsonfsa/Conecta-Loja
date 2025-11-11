@echo off

REM Script para iniciar o ambiente de desenvolvimento Conecta-Loja
REM Uso: start-dev.bat

echo 🚀 Iniciando ambiente de desenvolvimento Conecta-Loja...
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está instalado. Instale o Docker primeiro.
    pause
    exit /b 1
)

REM Verificar se Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose não está instalado. Instale o Docker Compose primeiro.
    pause
    exit /b 1
)

echo 🐳 Construindo e iniciando containers...
docker-compose up --build -d

echo.
echo ✅ Ambiente iniciado com sucesso!
echo.
echo 📋 Serviços disponíveis:
echo   🌐 Frontend:     http://localhost:5173
echo   🔧 Backend API:  http://localhost:8000
echo   📚 API Docs:     http://localhost:8000/api
echo   🏥 Health Check:  http://localhost:8000/health
echo   🗄️  Prisma Studio: http://localhost:5555
echo.
echo 🔄 Hot reload ativado para desenvolvimento!
echo.
echo 💡 Comandos úteis:
echo   docker-compose logs -f              # Ver logs em tempo real
echo   docker-compose down                 # Parar todos os serviços
echo   docker-compose restart frontend     # Reiniciar apenas o frontend
echo   docker-compose restart backend      # Reiniciar apenas o backend
echo.
pause
