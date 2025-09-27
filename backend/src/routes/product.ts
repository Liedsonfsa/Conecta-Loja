/**
 * Definição das rotas relacionadas a produtos
 *
 * Este arquivo configura as rotas específicas para operações
 * com produtos, como CRUD completo de produtos.
 *
 * Rotas disponíveis:
 * - GET /api/product - Buscar todos os produtos (com paginação e filtros)
 * - GET /api/product/available - Buscar apenas produtos disponíveis
 * - GET /api/product/:id - Buscar produto por ID
 * - POST /api/product - Criar novo produto
 * - PUT /api/product/:id - Atualizar produto
 * - DELETE /api/product/:id - Remover produto
 */
import { Router } from 'express';
import {
  createProduct,
  getProductById,
  getAllProducts,
  getAvailableProducts,
  updateProduct,
  deleteProduct,
  uploadProductImage
} from '../controllers/productController';
import { uploadSingleImage } from '../middlewares/uploadMiddleware';

const router = Router();

/**
 * @route GET /api/product
 * @desc Buscar todos os produtos com paginação e filtros
 * @access Public
 * @query {page?: number, limit?: number, categoryId?: number, available?: boolean, search?: string}
 * @returns {success: boolean, products: object[], pagination: object}
 */
router.get('/', getAllProducts);

/**
 * @route GET /api/product/available
 * @desc Buscar apenas produtos disponíveis
 * @access Public
 * @returns {success: boolean, products: object[]}
 */
router.get('/available', getAvailableProducts);

/**
 * @route GET /api/product/:id
 * @desc Buscar produto por ID
 * @access Public
 * @param {number} id - ID do produto
 * @returns {success: boolean, product: object}
 */
router.get('/:id', getProductById);

/**
 * @route POST /api/product
 * @desc Criar novo produto
 * @access Public (deve ser protegido por autenticação em produção)
 * @body {name: string, description: string, price: number, categoryId: number, available?: boolean, image?: string, discount?: number, discountType?: string}
 * @returns {success: boolean, message: string, product: object}
 */
router.post('/', createProduct);

/**
 * @route PUT /api/product/:id
 * @desc Atualizar produto existente
 * @access Public (deve ser protegido por autenticação em produção)
 * @param {number} id - ID do produto
 * @body {name?: string, description?: string, price?: number, categoryId?: number, available?: boolean, image?: string, discount?: number, discountType?: string}
 * @returns {success: boolean, message: string, product: object}
 */
router.put('/:id', updateProduct);

/**
 * @route DELETE /api/product/:id
 * @desc Remover produto
 * @access Public (deve ser protegido por autenticação em produção)
 * @param {number} id - ID do produto
 * @returns {success: boolean, message: string}
 */
router.delete('/:id', deleteProduct);

/**
 * @route POST /api/product/:id/upload-image
 * @desc Fazer upload de imagem para um produto
 * @access Public (deve ser protegido por autenticação em produção)
 * @param {number} id - ID do produto
 * @body {image: File} - Arquivo de imagem (multipart/form-data)
 * @returns {success: boolean, message: string, product: object, imageUrl: string}
 */
router.post('/:id/upload-image', uploadSingleImage, uploadProductImage);

export default router;
