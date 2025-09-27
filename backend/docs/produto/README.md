# 📦 API de Produtos - Guia de Teste no Postman

Este documento explica como testar todos os endpoints da API de produtos usando o Postman.

## 📋 Configuração Inicial

### URL Base

```
http://localhost:8000/api
```

### Headers Padrão

```
Content-Type: application/json
```

### Pré-requisitos

- Ter pelo menos uma categoria criada (veja `docs/categoria/README.md`)
- Servidor backend rodando na porta 8000

### Ambiente no Postman

Crie um ambiente chamado "Conecta-Loja" com:

- `base_url`: `http://localhost:8000/api`
- `category_id`: ID de uma categoria existente (ex: 1)

---

## 🎯 Endpoints Disponíveis

### 1. 📝 **POST** `/product` - Criar Produto

#### Descrição

Cria um novo produto no sistema.

#### Request

```http
POST {{base_url}}/product
Content-Type: application/json

{
  "name": "Hambúrguer Clássico",
  "description": "Hambúrguer artesanal com queijo, alface e tomate",
  "price": 25.90,
  "categoryId": 1,
  "available": true,
  "image": "https://exemplo.com/hamburger.jpg",
  "discount": 10,
  "discountType": "PERCENTAGE"
}
```

#### Campos Obrigatórios

- `name` (string): Nome do produto
- `description` (string): Descrição do produto
- `price` (number): Preço do produto (maior que 0)
- `categoryId` (number): ID da categoria existente

#### Campos Opcionais

- `available` (boolean): Disponibilidade (padrão: true)
- `image` (string): URL da imagem
- `discount` (number): Valor do desconto
- `discountType` (string): Tipo do desconto ("PERCENTAGE" ou "FIXED_VALUE")

#### Exemplos de Body

**Produto básico:**

```json
{
  "name": "Coca-Cola 350ml",
  "description": "Refrigerante Coca-Cola lata 350ml",
  "price": 5.5,
  "categoryId": 2
}
```

**Produto com desconto percentual:**

```json
{
  "name": "Pizza Margherita",
  "description": "Pizza com molho de tomate, mussarela e manjericão",
  "price": 45.0,
  "categoryId": 1,
  "discount": 15,
  "discountType": "PERCENTAGE"
}
```

**Produto com desconto fixo:**

```json
{
  "name": "Brownie com Sorvete",
  "description": "Brownie de chocolate com bola de sorvete",
  "price": 18.0,
  "categoryId": 3,
  "discount": 3.0,
  "discountType": "FIXED_VALUE",
  "available": true
}
```

**Produto indisponível:**

```json
{
  "name": "Produto Temporariamente Indisponível",
  "description": "Este produto não está disponível no momento",
  "price": 10.0,
  "categoryId": 1,
  "available": false
}
```

#### Resposta de Sucesso (201)

```json
{
  "success": true,
  "message": "Produto criado com sucesso",
  "product": {
    "id": 1,
    "name": "Hambúrguer Clássico",
    "description": "Hambúrguer artesanal com queijo, alface e tomate",
    "price": 25.9,
    "categoryId": 1,
    "available": true,
    "image": "https://exemplo.com/hamburger.jpg",
    "discount": 10,
    "discountType": "PERCENTAGE",
    "createdAt": "2025-09-27T15:30:00.000Z",
    "updatedAt": "2025-09-27T15:30:00.000Z",
    "category": {
      "id": 1,
      "name": "Lanches",
      "activeProducts": 1,
      "totalValue": 25.9,
      "createdAt": "2025-09-27T15:25:00.000Z",
      "updatedAt": "2025-09-27T15:30:00.000Z"
    }
  }
}
```

#### Possíveis Erros

**Campos obrigatórios faltando (400):**

```json
{
  "success": false,
  "error": "Nome do produto é obrigatório",
  "code": "VALIDATION_ERROR"
}
```

**Preço inválido (400):**

```json
{
  "success": false,
  "error": "Preço do produto deve ser um valor positivo",
  "code": "VALIDATION_ERROR"
}
```

**Categoria não encontrada (400):**

```json
{
  "success": false,
  "error": "Categoria não encontrada",
  "code": "VALIDATION_ERROR"
}
```

**Desconto inválido (400):**

```json
{
  "success": false,
  "error": "Desconto percentual não pode exceder 100%",
  "code": "VALIDATION_ERROR"
}
```

---

### 2. 📋 **GET** `/product` - Listar Produtos

#### Descrição

Busca todos os produtos com paginação e filtros avançados.

#### Request

```http
GET {{base_url}}/product
```

#### Parâmetros de Query (opcionais)

- `page` (number): Página atual (padrão: 1)
- `limit` (number): Itens por página (padrão: 10, máximo: 100)
- `categoryId` (number): Filtrar por categoria específica
- `available` (boolean): Apenas produtos disponíveis (`true`/`false`)
- `search` (string): Busca textual em nome e descrição

#### Exemplos

**Listagem simples:**

```http
GET {{base_url}}/product
```

**Com paginação:**

```http
GET {{base_url}}/product?page=1&limit=5
```

**Filtrar por categoria:**

```http
GET {{base_url}}/product?categoryId=1
```

**Apenas disponíveis:**

```http
GET {{base_url}}/product?available=true
```

**Busca textual:**

```http
GET {{base_url}}/product?search=hambúrguer
```

**Combinação completa:**

```http
GET {{base_url}}/product?page=1&limit=10&categoryId=1&available=true&search=artesanal
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Hambúrguer Clássico",
      "description": "Hambúrguer artesanal com queijo, alface e tomate",
      "price": 25.9,
      "categoryId": 1,
      "available": true,
      "image": "https://exemplo.com/hamburger.jpg",
      "discount": 10,
      "discountType": "PERCENTAGE",
      "createdAt": "2025-09-27T15:30:00.000Z",
      "updatedAt": "2025-09-27T15:30:00.000Z",
      "category": {
        "id": 1,
        "name": "Lanches",
        "activeProducts": 3,
        "totalValue": 75.7,
        "createdAt": "2025-09-27T15:25:00.000Z",
        "updatedAt": "2025-09-27T15:30:00.000Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3. 🟢 **GET** `/product/available` - Produtos Disponíveis

#### Descrição

Busca apenas produtos marcados como disponíveis (`available = true`).

#### Request

```http
GET {{base_url}}/product/available
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Hambúrguer Clássico",
      "description": "Hambúrguer artesanal com queijo, alface e tomate",
      "price": 25.9,
      "categoryId": 1,
      "available": true,
      "discount": 10,
      "discountType": "PERCENTAGE",
      "createdAt": "2025-09-27T15:30:00.000Z",
      "updatedAt": "2025-09-27T15:30:00.000Z",
      "category": {
        "id": 1,
        "name": "Lanches",
        "activeProducts": 3,
        "totalValue": 75.7,
        "createdAt": "2025-09-27T15:25:00.000Z",
        "updatedAt": "2025-09-27T15:30:00.000Z"
      }
    }
  ]
}
```

---

### 4. 🔍 **GET** `/product/{id}` - Buscar Produto por ID

#### Descrição

Busca um produto específico pelo ID.

#### Request

```http
GET {{base_url}}/product/1
```

#### Parâmetros da URL

- `id` (number): ID do produto

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Hambúrguer Clássico",
    "description": "Hambúrguer artesanal com queijo, alface e tomate",
    "price": 25.9,
    "categoryId": 1,
    "available": true,
    "image": "https://exemplo.com/hamburger.jpg",
    "discount": 10,
    "discountType": "PERCENTAGE",
    "createdAt": "2025-09-27T15:30:00.000Z",
    "updatedAt": "2025-09-27T15:30:00.000Z",
    "category": {
      "id": 1,
      "name": "Lanches",
      "activeProducts": 3,
      "totalValue": 75.7,
      "createdAt": "2025-09-27T15:25:00.000Z",
      "updatedAt": "2025-09-27T15:30:00.000Z"
    }
  }
}
```

#### Erro - Produto não encontrado (404)

```json
{
  "success": false,
  "error": "Produto não encontrado",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

### 5. ✏️ **PUT** `/product/{id}` - Atualizar Produto

#### Descrição

Atualiza os dados de um produto existente.

#### Request

```http
PUT {{base_url}}/product/1
Content-Type: application/json

{
  "name": "Hambúrguer Clássico Especial",
  "price": 28.90,
  "discount": 5,
  "discountType": "FIXED_VALUE"
}
```

#### Campos Opcionais (todos)

- `name` (string): Novo nome
- `description` (string): Nova descrição
- `price` (number): Novo preço
- `categoryId` (number): Nova categoria
- `available` (boolean): Nova disponibilidade
- `image` (string): Nova URL da imagem
- `discount` (number): Novo valor do desconto
- `discountType` (string): Novo tipo do desconto

#### Exemplos de Body

**Alterar preço e desconto:**

```json
{
  "price": 22.9,
  "discount": 0
}
```

**Alterar categoria:**

```json
{
  "categoryId": 2
}
```

**Tornar indisponível:**

```json
{
  "available": false
}
```

**Atualização completa:**

```json
{
  "name": "Super Hambúrguer",
  "description": "Hambúrguer premium com ingredientes especiais",
  "price": 35.0,
  "categoryId": 1,
  "available": true,
  "image": "https://exemplo.com/super-hamburger.jpg",
  "discount": 20,
  "discountType": "PERCENTAGE"
}
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Produto atualizado com sucesso",
  "product": {
    "id": 1,
    "name": "Hambúrguer Clássico Especial",
    "description": "Hambúrguer artesanal com queijo, alface e tomate",
    "price": 28.9,
    "categoryId": 1,
    "available": true,
    "image": "https://exemplo.com/hamburger.jpg",
    "discount": 5,
    "discountType": "FIXED_VALUE",
    "createdAt": "2025-09-27T15:30:00.000Z",
    "updatedAt": "2025-09-27T15:45:00.000Z",
    "category": {
      "id": 1,
      "name": "Lanches",
      "activeProducts": 3,
      "totalValue": 78.7,
      "createdAt": "2025-09-27T15:25:00.000Z",
      "updatedAt": "2025-09-27T15:45:00.000Z"
    }
  }
}
```

#### Possíveis Erros

**Produto não encontrado (404):**

```json
{
  "success": false,
  "error": "Produto não encontrado",
  "code": "PRODUCT_NOT_FOUND"
}
```

**Categoria não encontrada (400):**

```json
{
  "success": false,
  "error": "Categoria não encontrada",
  "code": "VALIDATION_ERROR"
}
```

---

### 6. 🗑️ **DELETE** `/product/{id}` - Remover Produto

#### Descrição

Remove um produto do sistema.

#### Request

```http
DELETE {{base_url}}/product/1
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Produto removido com sucesso"
}
```

#### Possíveis Erros

**Produto não encontrado (404):**

```json
{
  "success": false,
  "error": "Produto não encontrado",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

## 🎯 Ordem Recomendada de Teste

1. **POST** `/category` - Criar categorias primeiro
2. **POST** `/product` - Criar vários produtos
3. **GET** `/product` - Listar todos os produtos
4. **GET** `/product/available` - Ver apenas disponíveis
5. **GET** `/product/{id}` - Buscar produto específico
6. **PUT** `/product/{id}` - Atualizar produto
7. **GET** `/category/stats` - Ver estatísticas atualizadas
8. **DELETE** `/product/{id}` - Remover produto

---

## 💡 Dicas para Testes no Postman

### 1. **Variáveis de Ambiente**

```javascript
// Após criar produto, salvar ID
const jsonData = pm.response.json();
pm.environment.set("product_id", jsonData.product.id);
pm.environment.set("category_id", jsonData.product.categoryId);
```

### 2. **Tests Automáticos**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Product created successfully", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.eql(true);
  pm.expect(jsonData.product).to.be.an("object");
  pm.expect(jsonData.product.id).to.be.a("number");
});
```

### 3. **Cenários de Teste**

- ✅ Produto válido
- ❌ Produto sem nome
- ❌ Produto com preço negativo
- ❌ Produto com categoria inexistente
- ❌ Desconto percentual > 100%
- ❌ Desconto fixo > preço

---

## 🔗 Relacionamentos e Regras

### **Categoria ↔ Produto**

- Um produto **pertence** a uma categoria (`categoryId`)
- Uma categoria **possui** vários produtos
- Ao alterar `categoryId`, os contadores são atualizados automaticamente

### **Contadores Automáticos**

- `activeProducts`: Número de produtos disponíveis na categoria
- `totalValue`: Soma dos preços de todos os produtos disponíveis

### **Descontos**

- **PERCENTAGE**: `preço_final = preço × (1 - desconto/100)`
- **FIXED_VALUE**: `preço_final = preço - desconto`
- Desconto nunca pode tornar preço negativo

### **Disponibilidade**

- `available = true`: Produto visível no catálogo
- `available = false`: Produto oculto, mas mantido no banco

---

### 7. 📤 **POST** `/product/{id}/upload-image` - Upload de Imagem

#### Descrição

Faz upload de uma imagem para um produto existente. Substitui a imagem anterior se existir.

#### Request (Form-Data)

```http
POST {{base_url}}/product/1/upload-image
Content-Type: multipart/form-data
```

**Body (Form-Data):**

```
image: [arquivo de imagem selecionado]
```

#### Como enviar no Postman:

1. **Method:** POST
2. **Body tab:** form-data
3. **Key:** `image` (File)
4. **Value:** Selecione um arquivo de imagem (.jpg, .jpeg, .png, .webp)

#### Como enviar no Frontend (JavaScript):

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]);

fetch("http://localhost:8000/api/product/1/upload-image", {
  method: "POST",
  body: formData,
});
```

#### Como enviar no Frontend (React):

```jsx
const handleImageUpload = async (productId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`/api/product/${productId}/upload-image`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (result.success) {
    console.log("Imagem enviada:", result.imageUrl);
  }
};
```

#### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Imagem do produto atualizada com sucesso",
  "product": {
    "id": 1,
    "name": "Hambúrguer Clássico",
    "description": "Hambúrguer artesanal com queijo, alface e tomate",
    "price": 25.9,
    "categoryId": 1,
    "available": true,
    "image": "/uploads/products/product-1698765432123-123456789.jpg",
    "discount": 10,
    "discountType": "PERCENTAGE",
    "createdAt": "2025-09-27T15:30:00.000Z",
    "updatedAt": "2025-09-27T16:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Lanches",
      "activeProducts": 1,
      "totalValue": 25.9,
      "createdAt": "2025-09-27T15:25:00.000Z",
      "updatedAt": "2025-09-27T15:30:00.000Z"
    }
  },
  "imageUrl": "http://localhost:8000/uploads/products/product-1698765432123-123456789.jpg"
}
```

#### Possíveis Erros

**Produto não encontrado (404):**

```json
{
  "success": false,
  "error": "Produto não encontrado",
  "code": "PRODUCT_NOT_FOUND"
}
```

**Nenhum arquivo enviado (400):**

```json
{
  "success": false,
  "error": "Nenhuma imagem foi enviada",
  "code": "NO_FILE_UPLOADED"
}
```

**Tipo de arquivo inválido (400):**

```json
{
  "success": false,
  "error": "Apenas imagens são permitidas (jpeg, jpg, png, webp)",
  "code": "INVALID_FILE_TYPE"
}
```

**Arquivo muito grande (400):**

```json
{
  "success": false,
  "error": "Arquivo muito grande. Tamanho máximo: 5MB",
  "code": "FILE_TOO_LARGE"
}
```

---

## 💡 Funcionalidades de Imagem

### **Upload de Arquivos**

- **Tipos aceitos:** .jpg, .jpeg, .png, .webp
- **Tamanho máximo:** 5MB por arquivo
- **Nomes únicos:** Gerados automaticamente (timestamp + random)
- **Substituição:** Remove imagem anterior automaticamente

### **Acesso às Imagens**

- **URL completa:** `http://localhost:8000/uploads/products/{nome-do-arquivo}`
- **Path relativo:** `/uploads/products/{nome-do-arquivo}`
- **Localização física:** `uploads/products/` (na raiz do projeto)
- **Cache:** Arquivos servidos diretamente pelo Express

### **Limpeza Automática**

- **Substituição:** Imagem antiga removida quando nova é enviada
- **Falha:** Arquivo limpo automaticamente se operação falhar
- **Exclusão:** Imagem removida quando produto é excluído

---

## ⚠️ Notas Importantes

- **Categoria obrigatória**: Todo produto deve pertencer a uma categoria existente
- **Preços decimais**: Use ponto (.) como separador decimal
- **Descontos opcionais**: Se não informado, produto não tem desconto
- **Imagens opcionais**: Campo `image` pode ser nulo
- **Paginação**: Sempre retorna metadados de paginação
- **Busca case-insensitive**: A busca não diferencia maiúsculas/minúsculas
- **Upload seguro**: Validações de tipo e tamanho de arquivo
- **Nomes únicos**: Evita conflitos entre arquivos
- **Pasta uploads**: Localizada na raiz do projeto (`./uploads/products/`)
