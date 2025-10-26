// Localização: backend/src/routes/profile.ts

import { Router } from 'express';
// Importa as funções do controller
import { getProfile, updateProfile, updatePersonalInfo } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

// Importações para endereços (vamos criar as funções do controller)
import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setAddressAsPrincipal
} from '../controllers/addressController';

const router = Router();

// Define a rota GET /api/profile
router.get('/', authenticateToken, getProfile);

// Define a rota PUT /api/profile
router.put('/', authenticateToken, updateProfile);

// Define a rota PUT /api/profile/personal-info
router.put('/personal-info', authenticateToken, updatePersonalInfo);

// Rotas de endereços
// GET /api/profile/addresses - Buscar todos os endereços do usuário
router.get('/addresses', authenticateToken, getUserAddresses);

// GET /api/profile/addresses/:id - Buscar endereço específico
router.get('/addresses/:id', authenticateToken, getAddressById);

// POST /api/profile/addresses - Criar novo endereço
router.post('/addresses', authenticateToken, createAddress);

// PUT /api/profile/addresses/:id - Atualizar endereço
router.put('/addresses/:id', authenticateToken, updateAddress);

// DELETE /api/profile/addresses/:id - Remover endereço
router.delete('/addresses/:id', authenticateToken, deleteAddress);

// PATCH /api/profile/addresses/:id/principal - Definir endereço como principal
router.patch('/addresses/:id/principal', authenticateToken, setAddressAsPrincipal);

export default router;