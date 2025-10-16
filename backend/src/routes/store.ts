// Localização: backend/src/routes/store.ts

import { Router } from 'express';
// 1. CORREÇÃO: Importando do arquivo com o nome correto 'storeControllers.ts'
import {
    listEmployees,
    deleteEmployee,
    getStoreConfig,
    updateStoreConfig
} from '../controllers/storeControllers'; // Note o "s" no final de storeControllers

// 2. IMPORTE OS MIDDLEWARES DE SEGURANÇA E UPLOAD
import { authenticateToken, adminOnly } from '../middlewares/authMiddleware';
import upload from '../config/multer';

const router = Router();

// --- ROTAS DE PERSONALIZAÇÃO DA LOJA ---

/**
 * @route GET /api/store/public-config
 * @desc Rota pública para a vitrine do cliente buscar a aparência da loja.
 * @access Public
 */
router.get('/public-config', getStoreConfig);

/**
 * @route GET /api/store/config
 * @desc Rota protegida para o painel do admin buscar os dados para edição.
 * @access Admin
 */
router.get('/config', authenticateToken, adminOnly, getStoreConfig);

/**
 * @route PUT /api/store/config
 * @desc Rota protegida para o admin salvar as alterações (incluindo imagens).
 * @access Admin
 */
router.put(
    '/config',
    authenticateToken,
    adminOnly,
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 }
    ]),
    updateStoreConfig
);


// --- ROTAS DE FUNCIONÁRIOS (AGORA PROTEGIDAS) ---

/**
 * @route GET /api/store/:lojaId/listar-funcionarios
 * @desc Lista todos os funcionários de uma loja específica.
 * @access Admin
 */
// 3. MELHORIA: Adicionada proteção a esta rota
router.get('/:lojaId/listar-funcionarios', authenticateToken, adminOnly, listEmployees);

/**
 * @route DELETE /api/store/deletar-funcionario/:id
 * @desc Deleta um funcionário pelo ID.
 * @access Admin
 */
// 4. MELHORIA: Adicionada proteção a esta rota
router.delete('/deletar-funcionario/:id', authenticateToken, adminOnly, deleteEmployee);

export default router;