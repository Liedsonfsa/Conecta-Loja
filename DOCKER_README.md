# Docker Compose - Conecta-Loja

Este documento explica como executar a aplicação Conecta-Loja usando Docker Compose com hot reload para desenvolvimento.

## Serviços Disponíveis

- **PostgreSQL** (porta 5432) - Banco de dados
- **Backend** (porta 8000) - API Node.js/TypeScript com Express
- **Frontend** (porta 5173) - Aplicação React com Vite
- **Prisma Studio** (porta 5555) - Interface gráfica para o banco de dados

## Como Usar

### 1. Pré-requisitos

- Docker
- Docker Compose

### 2. Executar a Aplicação

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Ou executar em background
docker-compose up --build -d
```

### 3. Acessar os Serviços

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/health
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432

### 4. Hot Reload

O hot reload está configurado para ambos os serviços:

- **Backend**: Modificações em arquivos `.ts` no diretório `src/` são detectadas automaticamente
- **Frontend**: Modificações em arquivos `.jsx`, `.js`, `.css` são detectadas automaticamente

### 5. Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs backend
docker-compose logs frontend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reiniciar um serviço específico
docker-compose restart backend
docker-compose restart frontend
```

### 6. Desenvolvimento

Durante o desenvolvimento, os containers estão conectados aos seus arquivos locais através de volumes, permitindo que as mudanças sejam refletidas imediatamente nos containers em execução.

**Arquivos monitorados para hot reload:**

**Backend:**
- `src/` - Todo o código fonte TypeScript
- `prisma/` - Schema e configurações do Prisma

**Frontend:**
- `src/` - Todo o código fonte React
- `public/` - Assets estáticos
- `index.html` - HTML principal
- Arquivos de configuração (vite.config.js, tailwind.config.js, etc.)

### 7. Variáveis de Ambiente

As variáveis de ambiente estão configuradas no `docker-compose.yml`. Para personalizar, edite o arquivo ou crie um `.env` baseado no `env.example`.

### 8. Banco de Dados

O PostgreSQL é inicializado automaticamente com:
- Database: `conecta_loja`
- User: `postgres`
- Password: `postgres123`

O Prisma Studio permite visualizar e editar os dados diretamente no navegador.

### 9. Troubleshooting

**Container não inicia:**
```bash
# Verificar logs detalhados
docker-compose logs

# Limpar e reconstruir
docker-compose down -v
docker-compose up --build
```

**Hot reload não funciona:**
```bash
# Verificar se os volumes estão montados corretamente
docker-compose exec backend ls -la src/
docker-compose exec frontend ls -la src/
```

**Portas ocupadas:**
```bash
# Verificar processos usando as portas
netstat -tulpn | grep :8000
netstat -tulpn | grep :5173
netstat -tulpn | grep :5432
netstat -tulpn | grep :5555
```

**Problemas de comunicação entre frontend e backend:**
- **Sintomas:** Frontend não consegue fazer login/cadastro, requisições OPTIONS chegando na API mas falhando
- **Causa:** Configuração CORS incorreta no backend
- **Solução:** Verificar se o CORS no `backend/src/app.ts` está configurado para aceitar a origem do frontend (localhost:5173 para desenvolvimento)
- **Debug:** Verificar logs do backend para confirmar que requisições POST estão sendo processadas após OPTIONS

## Estrutura do Projeto

```
conecta-loja/
├── backend/
│   ├── Dockerfile
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── env.example
```
