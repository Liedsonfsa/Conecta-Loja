# Middlewares

Diretório responsável pelos middlewares da aplicação Express.

## Estrutura

- `userValidation.ts` - Middlewares de validação para usuários (express-validator)

## Funcionalidades

### userValidation.ts

Contém validações para:

- **Nome**: Deve ter 2-100 caracteres, apenas letras e espaços
- **Email**: Deve ser um email válido, único no sistema
- **Senha**: Deve ter 6-128 caracteres, conter maiúscula, minúscula e número
- **Contato**: Deve ter 10-20 caracteres, formato de telefone válido

## Uso

```typescript
import { validateCreateUser } from "../middlewares/userValidation";

// Na rota
router.post("/cadastrar", validateCreateUser, createUser);
```
