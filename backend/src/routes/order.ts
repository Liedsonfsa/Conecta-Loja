import { Router } from 'express';
import {
  getUserOrders  
} from '../controllers/orderController';

const router = Router();

router.get('/', getUserOrders);

export default router;