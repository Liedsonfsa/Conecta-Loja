# 🏷️ API de Categorias - Guia de Teste no Postman

Este documento explica como testar todos os endpoints da API de categorias usando o Postman.

## 📋 Configuração Inicial

### URL Base

```
http://localhost:8000/api
```

### Headers Padrão

```
Content-Type: application/json
```

### Ambiente no Postman

Crie um ambiente chamado "Conecta-Loja" com:

- `base_url`: `http://localhost:8000/api`

---

## 🎯 Endpoints Disponíveis

### 1. 📝 **POST** `/category` - Criar Categoria

#### Descrição

Cria uma nova categoria no sistema.

#### Request

```http
POST {{base_url}}/category
Content-Type: application/json

{
  "name": "Lanches"
}
```

#### Campos Obrigatórios

- `name` (string): Nome da categoria (único, não vazio)

#### Exemplos de Body

**Categoria simples:**

```json
{
  "name": "Bebidas"
}
```

**Categoria composta:**

```json
{
  "name": "Lanches e Sanduíches"
}
```

**Categoria específica:**

```json
{
  "name": "Sobremesas"
}
```

#### Resposta de Sucesso (201)

```json
{
  "success": true,
  "message": "Categoria criada com sucesso",
  "category": {
    "id": 1,
    "name": "Lanches",
    "activeProducts": 0,
    "totalValue": 0,
    "createdAt": "2025-09-27T15:30:00.000Z",
    "updatedAt": "2025-09-27T15:30:00.000Z"
  }
}
```

#### Possíveis Erros

**Nome vazio (400):**

```json
{
  "success": false,
  "error": "Nome da categoria é obrigatório",
  "code": "VALIDATION_ERROR"
}
```

**Nome já existe (400):**

```json
{
  "success": false,
  "error": "Já existe uma categoria com este nome",
  "code": "VALIDATION_ERROR"
}
```

---

### 2. 📋 **GET** `/category` - Listar Categorias

#### Descrição

Busca todas as categorias com paginação e filtros opcionais.

#### Request

```http
GET {{base_url}}/category
```

#### Parâmetros de Query (opcionais)

- `page` (number): Página atual (padrão: 1)
- `limit` (number): Itens por página (padrão: 10, máximo: 100)
- `search` (string): Busca por nome da categoria

#### Exemplos

**Listagem simples:**

```http
GET {{base_url}}/category
```

**Com paginação:**

```http
GET {{base_url}}/category?page=1&limit=5
```

**Com busca:**

```http
GET {{base_url}}/category?search=Lanches
```

**Combinação:**

```http
GET {{base_url}}/category?page=1&limit=10&search=Bebidas
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Lanches",
      "activeProducts": 0,
      "totalValue": 0,
      "createdAt": "2025-09-27T15:30:00.000Z",
      "updatedAt": "2025-09-27T15:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Bebidas",
      "activeProducts": 2,
      "totalValue": 15.5,
      "createdAt": "2025-09-27T15:35:00.000Z",
      "updatedAt": "2025-09-27T15:35:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

---

### 3. 📊 **GET** `/category/stats` - Estatísticas das Categorias

#### Descrição

Retorna estatísticas gerais sobre as categorias.

#### Request

```http
GET {{base_url}}/category/stats
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "stats": {
    "totalCategories": 3,
    "totalActiveProducts": 15,
    "totalValue": 245.8,
    "categoriesWithProducts": 2,
    "categoriesWithoutProducts": 1
  }
}
```

---

### 4. 🔍 **GET** `/category/{id}` - Buscar Categoria por ID

#### Descrição

Busca uma categoria específica pelo ID.

#### Request

```http
GET {{base_url}}/category/1
```

#### Parâmetros da URL

- `id` (number): ID da categoria

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "category": {
    "id": 1,
    "name": "Lanches",
    "activeProducts": 3,
    "totalValue": 45.9,
    "products": [
      {
        "id": 1,
        "name": "Hambúrguer",
        "price": 15.9,
        "available": true,
        "createdAt": "2025-09-27T15:40:00.000Z"
      }
    ],
    "createdAt": "2025-09-27T15:30:00.000Z",
    "updatedAt": "2025-09-27T15:30:00.000Z"
  }
}
```

#### Erro - Categoria não encontrada (404)

```json
{
  "success": false,
  "error": "Categoria não encontrada",
  "code": "CATEGORY_NOT_FOUND"
}
```

---

### 5. ✏️ **PUT** `/category/{id}` - Atualizar Categoria

#### Descrição

Atualiza os dados de uma categoria existente.

#### Request

```http
PUT {{base_url}}/category/1
Content-Type: application/json

{
  "name": "Lanches e Sanduíches"
}
```

#### Campos Opcionais

- `name` (string): Novo nome da categoria

#### Exemplos de Body

**Alterar nome:**

```json
{
  "name": "Lanches Premium"
}
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Categoria atualizada com sucesso",
  "category": {
    "id": 1,
    "name": "Lanches e Sanduíches",
    "activeProducts": 3,
    "totalValue": 45.9,
    "createdAt": "2025-09-27T15:30:00.000Z",
    "updatedAt": "2025-09-27T15:42:00.000Z"
  }
}
```

#### Possíveis Erros

**Categoria não encontrada (404):**

```json
{
  "success": false,
  "error": "Categoria não encontrada",
  "code": "CATEGORY_NOT_FOUND"
}
```

**Nome já existe (400):**

```json
{
  "success": false,
  "error": "Já existe outra categoria com este nome",
  "code": "VALIDATION_ERROR"
}
```

---

### 6. 🗑️ **DELETE** `/category/{id}` - Remover Categoria

#### Descrição

Remove uma categoria do sistema (apenas se estiver vazia).

#### Request

```http
DELETE {{base_url}}/category/1
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Categoria removida com sucesso"
}
```

#### Possíveis Erros

**Categoria não encontrada (404):**

```json
{
  "success": false,
  "error": "Categoria não encontrada",
  "code": "CATEGORY_NOT_FOUND"
}
```

**Categoria possui produtos (409):**

```json
{
  "success": false,
  "error": "Não é possível excluir uma categoria que possui produtos associados",
  "code": "CATEGORY_HAS_PRODUCTS"
}
```

---

## 🎯 Ordem Recomendada de Teste

1. **POST** `/category` - Criar algumas categorias
2. **GET** `/category` - Listar todas as categorias
3. **GET** `/category/stats` - Ver estatísticas
4. **GET** `/category/{id}` - Buscar categoria específica
5. **PUT** `/category/{id}` - Atualizar categoria
6. **DELETE** `/category/{id}` - Remover categoria (apenas vazias)

---

## 💡 Dicas para Testes no Postman

### 1. **Variáveis de Ambiente**

- Salve IDs de categorias criadas em variáveis
- Use `{{category_id}}` nos testes subsequentes

### 2. **Collection do Postman**

Organize os requests em uma collection "Conecta-Loja - Categorias"

### 3. **Tests Automáticos**

Adicione testes nos requests:

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response has success true", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.eql(true);
});
```

### 4. **Variáveis Dinâmicas**

Após criar uma categoria, salve o ID:

```javascript
const jsonData = pm.response.json();
pm.environment.set("category_id", jsonData.category.id);
```

---

## 🔗 Relacionamentos

- **Produtos**: Uma categoria pode ter vários produtos
- **Contadores**: `activeProducts` e `totalValue` são atualizados automaticamente quando produtos são criados/modificados

---

## ⚠️ Notas Importantes

- **Nomes únicos**: Cada categoria deve ter um nome único
- **Cascade delete**: Produtos são protegidos contra exclusão de categoria
- **Contadores automáticos**: Estatísticas são atualizadas em tempo real
- **Paginação**: Sempre retorna informações de paginação, mesmo com poucos resultados
