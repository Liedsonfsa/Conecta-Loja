import { Router } from 'express';
import { createUser } from '../controllers/userController';

const router = Router();

router.post('/cadastrar', createUser);

export default router;