# Middlewares

Diretório responsável pelos middlewares da aplicação Express.

## Estrutura

- `authMiddleware.ts` - Middleware de autenticação JWT
- `userValidation.ts` - Middlewares de validação para usuários (express-validator)

## Funcionalidades

### authMiddleware.ts

Middleware para verificar autenticação JWT:

- **Verificação de token**: Valida token JWT no header Authorization
- **Extração de dados**: Adiciona dados do usuário à requisição
- **Tratamento de erros**: Token expirado, inválido ou ausente

### userValidation.ts

Contém validações para:

- **Nome**: Deve ter 2-100 caracteres, apenas letras e espaços
- **Email**: Deve ser um email válido, único no sistema
- **Senha**: Deve ter 6-128 caracteres, conter maiúscula, minúscula e número
- **Contato**: Deve ter 10-20 caracteres, formato de telefone válido

## Uso

```typescript
// Autenticação
import { authenticateToken } from "../middlewares/authMiddleware";

// Na rota protegida
router.get("/profile", authenticateToken, getUserProfile);

// Validação de usuário
import { validateCreateUser } from "../middlewares/userValidation";

// Na rota de cadastro
router.post("/cadastrar", validateCreateUser, createUser);
```
