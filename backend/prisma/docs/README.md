# Guia de Configuração do Banco de Dados - Conecta-Loja

Este documento explica como configurar e trabalhar com o banco de dados PostgreSQL hospedado no Render quando você clona este projeto.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Render (para acessar o banco de dados)

## 🔧 Configuração Inicial

### 1. Clonagem e Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd conecta-loja/backend

# Instale as dependências
npm install
```

### 2. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `backend` com a URL de conexão do banco de dados hospedado no Render:

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database?sslmode=require"
```

**⚠️ Importante:** A URL do banco de dados deve ser obtida no painel do Render. Ela terá o formato acima, mas com suas credenciais específicas.

### 3. Verificação da Conexão

Teste se a conexão com o banco de dados está funcionando:

```bash
# Testa a conexão com o Prisma
npx prisma db push --preview-feature

# Ou verifica o status da conexão
npx prisma db execute --file <caminho-para-arquivo-sql>
```

## 🗄️ Trabalhando com Migrations

### Quando Usar `prisma migrate dev`

Use este comando durante o **desenvolvimento local** quando:

- Você está criando novas tabelas ou modificando o schema
- Quer testar mudanças no banco de dados localmente
- Está trabalhando em features que requerem alterações na estrutura do banco

```bash
# Cria uma nova migration baseada nas mudanças no schema.prisma
npx prisma migrate dev --name nome-da-migration
```

**Exemplo:**

```bash
npx prisma migrate dev --name add-user-table
```

### Quando Usar `prisma db push`

Use este comando quando:

- Você quer aplicar mudanças rapidamente sem criar migrations
- Está sincronizando o schema do banco com o arquivo schema.prisma
- Não precisa versionar as mudanças (não recomendado para produção)

```bash
# Aplica as mudanças diretamente no banco
npx prisma db push
```

### Quando Usar `prisma migrate deploy`

Use este comando **apenas em produção** quando:

- Você quer aplicar migrations criadas em desenvolvimento
- Está fazendo deploy para produção
- Quer garantir que todas as migrations sejam aplicadas em ordem

```bash
# Aplica todas as migrations pendentes em produção
npx prisma migrate deploy
```

## 🚀 Fluxo de Desenvolvimento

### Para Novos Desenvolvedores (Primeiro Clone)

1. **Clone e configure o ambiente:**

   ```bash
   git clone <url-do-repositorio>
   cd conecta-loja/backend
   npm install
   cp .env.example .env  # Configure a DATABASE_URL
   ```

2. **Aplique as migrations existentes:**

   ```bash
   npx prisma migrate deploy
   ```

3. **Gere o cliente Prisma:**

   ```bash
   npx prisma generate
   ```

4. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

### Para Desenvolvimento Contínuo

1. **Quando modificar o schema.prisma:**

   ```bash
   npx prisma migrate dev --name descricao-da-mudanca
   ```

2. **Após pull de mudanças:**
   ```bash
   npx prisma migrate deploy  # Para aplicar migrations
   npx prisma generate # Para atualizar o cliente
   ```

## 🔍 Comandos Úteis do Prisma

```bash
# Visualizar o banco de dados
npx prisma studio

# Ver o status das migrations
npx prisma migrate status

# Resetar o banco (somente desenvolvimento!)
npx prisma migrate reset

# Validar o schema
npx prisma validate

# Ver logs do banco
npx prisma db execute --file <sql-file>
```

## ⚠️ Boas Práticas

### Desenvolvimento Local

- Sempre use `prisma migrate dev` para criar migrations versionadas
- Teste suas mudanças localmente antes de commitar
- Use `prisma studio` para visualizar dados durante desenvolvimento

### Produção

- Nunca use `prisma db push` em produção
- Sempre use `prisma migrate deploy` para aplicar migrations
- Faça backup do banco antes de aplicar migrations críticas
- Teste migrations em ambiente de staging primeiro

### Versionamento

- Inclua migrations no controle de versão
- Documente mudanças significativas no schema
- Use nomes descritivos para migrations

## 🐛 Troubleshooting

### Erro de Conexão

- Verifique se a `DATABASE_URL` está correta
- Confirme se o banco no Render está ativo
- Verifique se não há restrições de IP no Render

### Migration Pendente

```bash
# Aplicar migrations pendentes
npx prisma migrate deploy
```

### Schema Desincronizado

```bash
# Forçar sincronização (cuidado!)
npx prisma db push --force-reset
```

### Cliente Prisma Desatualizado

```bash
# Regenerar cliente
npx prisma generate
```

## 📚 Recursos Adicionais

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Guia de Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Render Database Docs](https://docs.render.com/databases)

---

Para dúvidas específicas sobre o projeto, consulte a documentação principal ou entre em contato com a equipe de desenvolvimento.
