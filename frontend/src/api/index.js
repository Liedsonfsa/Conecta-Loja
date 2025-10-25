/**
 * API Services - Conecta-Loja
 *
 * Centraliza todos os serviços de API da aplicação.
 * Importe serviços específicos: import { authService } from '@/api'
 */

// Serviços de autenticação
export { authService } from "./auth";

// Serviços de produtos e categorias
export { productService } from "./products";
export { categoryService } from "./categories";

// Serviços de endereços
export { addressService } from "./addressService";

// Serviços de carrinho
export { cartService } from "./cart";

// Serviços de pedidos
export { orderService } from "./orders";

// Serviços de cargos e funcionários
export { roleService } from "./roles";
export { employeeService } from "./employees";

// Futuramente, adicionar outros serviços:
// export { userService } from './users';
