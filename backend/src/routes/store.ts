import { Router } from 'express';
import { listEmployees } from '../controllers/storeControllers';

const router = Router();

router.post('/:lojaId/listar-funcionarios', listEmployees);

export default router;