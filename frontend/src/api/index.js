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

// Serviços de cargos e funcionários
export { roleService } from "./roles";
export { employeeService } from "./employees";

// Futuramente, adicionar outros serviços:
// export { orderService } from './orders';
// export { userService } from './users';
