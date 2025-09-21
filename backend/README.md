# Backend Conecta-Loja

API REST desenvolvida com Node.js, Express, TypeScript e Prisma para o sistema Conecta-Loja.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Superset JavaScript
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **express-validator** - Validação de entrada

## 📁 Estrutura do Projeto

```
src/
├── controllers/     # Controladores da API
├── services/        # Lógica de negócio
├── repositories/    # Camada de acesso a dados
├── routes/         # Definição das rotas
├── middlewares/    # Middlewares customizados
└── app.ts          # Configuração do Express
```

## 🔐 Autenticação JWT

O sistema utiliza autenticação baseada em JSON Web Tokens (JWT) com sessão de 24 horas.

### 📝 Como Usar

#### 1. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "usuario@email.com",
      "contact": "(11)99999-9999",
      "createdAt": "2025-01-21T10:35:41.000Z",
      "updatedAt": "2025-01-21T10:35:41.000Z"
    },
    "expiresIn": "24h"
  }
}
```

#### 2. Usar Token em Requisições

```bash
GET /api/auth/verify
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

**Resposta:**

```json
{
  "success": true,
  "message": "Token válido",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "name": "João Silva"
  }
}
```

### ⚙️ Configuração

#### Variáveis de Ambiente (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="sua-chave-secreta-muito-segura-aqui"
```

> **IMPORTANTE:** Nunca use a chave secreta padrão em produção!

## 📚 API Endpoints

### 👤 Usuários

#### Criar Usuário

```http
POST /api/user/cadastrar
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123",
  "contact": "(11)99999-9999"
}
```

### 🔐 Autenticação

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "Senha123"
}
```

#### Verificar Token

```http
GET /api/auth/verify
Authorization: Bearer {token}
```

### 🏢 Funcionários

#### Criar Funcionário

```http
POST /api/employee/cadastrar
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "Senha123",
  "role": "gerente",
  "lojaId": 1
}
```

## 🔒 Segurança

- **Senhas:** Hash com bcrypt (12 salt rounds)
- **Validações:** Entrada sanitizada com express-validator
- **JWT:** Tokens com expiração de 24 horas
- **SQL Injection:** Protegido pelo Prisma ORM
- **Rate Limiting:** Recomendado implementar (não incluído)

## 🛠️ Desenvolvimento

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

### Banco de Dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrações
npx prisma migrate dev

# Visualizar banco
npx prisma studio
```

## 📋 Validações

### Cadastro de Usuário

- **Nome:** 2-100 caracteres, letras e espaços
- **Email:** Formato válido, único no sistema
- **Senha:** 6-128 caracteres, maiúscula + minúscula + número
- **Contato:** 10-20 caracteres, formato telefone

### Login

- **Email:** Formato válido
- **Senha:** Campo obrigatório

## 🔍 Tratamento de Erros

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado
- `400` - Dados inválidos
- `401` - Não autorizado (token inválido/expirado)
- `409` - Conflito (email já cadastrado)
- `500` - Erro interno

### Estrutura de Resposta de Erro

```json
{
  "success": false,
  "error": "Mensagem descritiva",
  "code": "CODIGO_DO_ERRO"
}
```

## 🚀 Produção

1. Configure `JWT_SECRET` com uma chave forte
2. Configure `DATABASE_URL` para o banco de produção
3. Execute migrações: `npx prisma migrate deploy`
4. Configure rate limiting
5. Configure CORS adequadamente
6. Configure logs de produção

## 📄 Licença

Este projeto está sob a licença ISC.
