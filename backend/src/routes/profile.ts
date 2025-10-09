// Localização: backend/src/routes/profile.ts

import { Router } from 'express';
// Importa as funções do controller
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Define a rota GET /api/profile
router.get('/', authenticateToken, getProfile);

// Define a rota PUT /api/profile
router.put('/', authenticateToken, updateProfile);

export default router;