@echo off
REM Script de deploy para Fly.io - Conecta-Loja
REM Uso: deploy.bat

echo 🚀 Iniciando deploy da aplicação Conecta-Loja no Fly.io
echo.

REM Verificar se flyctl está instalado
fly version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Flyctl não está instalado. Instale primeiro:
    echo curl -L https://fly.io/install.sh ^| sh
    echo export PATH="$HOME/.fly/bin:$PATH"
    pause
    exit /b 1
)

REM Verificar se está logado
fly auth whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Você não está logado no Fly.io. Fazendo login...
    fly auth login
    if %errorlevel% neq 0 (
        echo ❌ Falha no login. Verifique suas credenciais.
        pause
        exit /b 1
    )
)

echo ✅ Flyctl instalado e logado
echo.

REM Função para verificar se app existe
:check_app_exists
fly apps list | findstr /C:"%~1" >nul 2>&1
goto :eof

REM Deploy do backend
echo 🔧 Fazendo deploy do backend...
cd backend

call :check_app_exists "conecta-loja-backend"
if %errorlevel% equ 0 (
    echo Aplicação backend já existe, fazendo deploy...
    fly deploy --remote-only
) else (
    echo Criando aplicação backend...
    fly launch --name conecta-loja-backend --no-deploy
    fly deploy --remote-only
)

cd ..
echo ✅ Backend deployado com sucesso
echo.

REM Deploy do frontend
echo 🌐 Fazendo deploy do frontend...
cd frontend

call :check_app_exists "conecta-loja-frontend"
if %errorlevel% equ 0 (
    echo Aplicação frontend já existe, fazendo deploy...
    fly deploy --remote-only
) else (
    echo Criando aplicação frontend...
    fly launch --name conecta-loja-frontend --no-deploy
    fly deploy --remote-only
)

cd ..
echo ✅ Frontend deployado com sucesso
echo.

REM URLs de produção
echo 🎉 Deploy concluído!
echo.
echo 📋 URLs de produção:
echo   🌐 Frontend: https://conecta-loja-frontend.fly.dev
echo   🔧 Backend:  https://conecta-loja-backend.fly.dev
echo.
echo 💡 Próximos passos:
echo   1. Configure o PostgreSQL se ainda não fez
echo   2. Execute migrações: fly ssh console --app conecta-loja-backend
echo   3. Execute: npm run prisma:migrate
echo   4. Monitore logs: fly logs --app conecta-loja-backend
echo.
echo 📖 Para mais detalhes, consulte DEPLOY_README.md
echo.
pause
