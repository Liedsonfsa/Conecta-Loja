# API Services - Conecta-Loja

Serviços de API organizados por funcionalidade. Esta pasta contém todos os serviços de comunicação com o backend.

## 📁 Estrutura Atual

```
src/api/
├── index.js      # 📤 Exporta todos os serviços
├── auth.js       # 🔐 Serviços de autenticação (login, cadastro, verificação)
└── README.md     # 📖 Esta documentação
```

## 🔧 Arquivo Atual (index.js)

**Serviços de Autenticação:**

```javascript
import { authService } from "@/api";

// Login
const response = await authService.login(email, password);

// Cadastro
const response = await authService.register(userData);

// Verificar token
const user = await authService.verifyToken();

// Logout
authService.logout();
```

## 🚀 Como Adicionar Novos Serviços

### 1. Criar novo arquivo na pasta `api/`

```bash
# Exemplo: criar arquivo para produtos
touch src/api/products.js
```

### 2. Implementar o serviço

```javascript
// src/api/products.js
import api from "./config"; // se criar config.js separado

export const productService = {
  async getProducts() {
    const response = await api.get("/products");
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post("/products", productData);
    return response.data;
  },
};
```

### 3. Exportar no index.js

```javascript
// src/api/index.js
export { authService } from "./auth";
export { productService } from "./products"; // adicionar nova exportação
```

### 4. Usar nos componentes

```javascript
import { productService } from "@/api";

// Usar o serviço
const products = await productService.getProducts();
```

## 📋 Sugestões de Arquivos Futuros

- **`products.js`** - CRUD de produtos, categorias
- **`orders.js`** - Pedidos, carrinho, checkout
- **`users.js`** - Perfil do usuário, configurações
- **`config.js`** - Configuração base do Axios (separar se crescer muito)

## 🔄 Padrão Recomendado

Cada arquivo deve exportar um objeto com métodos assíncronos:

```javascript
export const nomeService = {
  async metodo1() {
    /* ... */
  },
  async metodo2() {
    /* ... */
  },
};
```

Isso mantém consistência e facilita a importação:

```javascript
import { nomeService } from "@/api";
```
