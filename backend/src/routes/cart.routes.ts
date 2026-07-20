import { Router } from 'express';
import { getCart, addToCart, updateCart, deleteCart } from '../controllers/cart.controller';

const router = Router();

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);

export default router;
