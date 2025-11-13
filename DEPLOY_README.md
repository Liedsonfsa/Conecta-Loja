# 🚀 Deploy no Fly.io - Conecta-Loja

Este guia explica como fazer o deploy da aplicação Conecta-Loja no Fly.io usando GitHub Actions.

## 📋 Pré-requisitos

1. **Conta no Fly.io**: [fly.io](https://fly.io)
2. **Flyctl instalado**: `curl -L https://fly.io/install.sh | sh`
3. **Token de API do Fly.io**: Obtenha em [fly.io/user/personal_access_tokens](https://fly.io/user/personal_access_tokens)

## 🏗️ Configuração Inicial

### 1. Instalar Flyctl e fazer login

```bash
# Instalar Flyctl
curl -L https://fly.io/install.sh | sh

# Fazer login
fly auth login

# Verificar instalação
fly version
```

### 2. Criar aplicações no Fly.io

```bash
# Criar aplicação para PostgreSQL
fly launch --name conecta-loja-postgres --image postgres:17-alpine --no-deploy

# Criar aplicação para backend
fly launch --name conecta-loja-backend --no-deploy

# Criar aplicação para frontend
fly launch --name conecta-loja-frontend --no-deploy
```

### 3. Configurar PostgreSQL

```bash
# Conectar ao PostgreSQL app
fly ssh console --app conecta-loja-postgres

# Dentro do container, criar banco e usuário
psql -U postgres
```

```sql
-- Criar banco de dados
CREATE DATABASE conecta_loja_backend;

-- Criar usuário
CREATE USER conecta_loja_backend WITH ENCRYPTED PASSWORD 'sua_senha_segura_aqui';

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE conecta_loja_backend TO conecta_loja_backend;

-- Sair
\q
exit
```

### 4. Configurar secrets no Fly.io

```bash
# Para o backend
fly secrets set JWT_SECRET="sua_jwt_secret_segura_aqui" --app conecta-loja-backend
fly secrets set DATABASE_URL="postgresql://conecta_loja_backend:sua_senha_segura_aqui@conecta-loja-postgres.flycast:5432/conecta_loja_backend?sslmode=require" --app conecta-loja-backend

# Para o frontend (opcional - se precisar de variáveis)
fly secrets set VITE_API_URL="https://conecta-loja-backend.fly.dev" --app conecta-loja-frontend
```

## 🔧 Configuração do GitHub Actions

### 1. Adicionar secret ao repositório

No GitHub, vá para:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Adicione:
- **Nome**: `FLY_API_TOKEN`
- **Valor**: Seu token de API do Fly.io

### 2. Workflow do GitHub Actions

O workflow está configurado em `.github/workflows/deploy.yml` e será executado automaticamente quando você fizer push para a branch `main`.

## 🚀 Fazendo Deploy

### Deploy Manual (primeira vez)

```bash
# Deploy do PostgreSQL (se não foi feito automaticamente)
fly deploy --app conecta-loja-postgres

# Executar migrações do Prisma no backend
cd backend
fly ssh console --app conecta-loja-backend
npm run prisma:migrate
npm run seed
exit

# Deploy do backend
fly deploy --app conecta-loja-backend

# Deploy do frontend (após backend estar funcionando)
fly deploy --app conecta-loja-frontend
```

### Deploy Automático

Após configurar tudo, basta fazer push para a branch `main`:

```bash
git add .
git commit -m "feat: implementa nova funcionalidade"
git push origin main
```

O GitHub Actions fará o deploy automaticamente.

## 📊 Monitoramento

### Verificar status das aplicações

```bash
# Status geral
fly status --app conecta-loja-backend
fly status --app conecta-loja-frontend
fly status --app conecta-loja-postgres

# Logs
fly logs --app conecta-loja-backend
fly logs --app conecta-loja-frontend

# Monitorar recursos
fly monitor --app conecta-loja-backend
```

### URLs de produção

- **Frontend**: https://conecta-loja-frontend.fly.dev
- **Backend API**: https://conecta-loja-backend.fly.dev
- **Prisma Studio**: https://conecta-loja-backend.fly.dev/prisma-studio (se configurado)

## 🛠️ Troubleshooting

### Problemas comuns

**1. Erro de conexão com PostgreSQL**
```bash
# Verificar se PostgreSQL está rodando
fly status --app conecta-loja-postgres

# Verificar conexão
fly ssh console --app conecta-loja-backend
npx prisma db push
```

**2. Frontend não consegue acessar API**
```bash
# Verificar CORS no backend
fly logs --app conecta-loja-backend | grep CORS

# Verificar se VITE_API_URL está correto
fly secrets list --app conecta-loja-frontend
```

**3. Build falhando**
```bash
# Verificar logs detalhados
fly logs --app conecta-loja-backend --instance <instance-id>
fly logs --app conecta-loja-frontend --instance <instance-id>
```

**4. Aplicação lenta**
```bash
# Verificar recursos
fly scale show --app conecta-loja-backend

# Aumentar recursos se necessário
fly scale memory 1024 --app conecta-loja-backend
fly scale vm shared-cpu-2x --app conecta-loja-backend
```

### Comandos úteis

```bash
# Reiniciar aplicação
fly restart --app conecta-loja-backend

# Ver variáveis de ambiente
fly secrets list --app conecta-loja-backend

# SSH para debug
fly ssh console --app conecta-loja-backend

# Ver configuração
fly config show --app conecta-loja-backend
```

## 📈 Otimizações

### Performance

1. **CDN**: Fly.io já inclui CDN automaticamente
2. **Compressão**: Configurada no nginx do frontend
3. **Cache**: Headers de cache configurados para assets estáticos

### Segurança

1. **HTTPS**: Forçado automaticamente pelo Fly.io
2. **Secrets**: Todas as credenciais em secrets
3. **Non-root user**: Backend roda como usuário não-root
4. **Health checks**: Configurados para monitoramento

### Custos

- **PostgreSQL**: ~$10/mês (com dados persistentes)
- **Backend**: ~$5-15/mês (dependendo do uso)
- **Frontend**: ~$1-5/mês (apenas para servir arquivos estáticos)

## 🔄 Atualizações

Para atualizar aplicações:

```bash
# Deploy específico
fly deploy --app conecta-loja-backend

# Ou deixar o GitHub Actions fazer automaticamente
git push origin main
```

## 📞 Suporte

- **Fly.io Docs**: https://fly.io/docs/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Prisma Deploy**: https://www.prisma.io/docs/guides/deployment

---

**Nota**: Este guia assume que você tem conhecimentos básicos de Docker, Git e linha de comando. Para dúvidas específicas, consulte a documentação oficial do Fly.io.
