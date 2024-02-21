import express from 'express';
import * as Order from '../Controllers/order.js';

const router = express.Router();

router.post('/', Order.createOrder);
router.get('/', Order.getAllOrders);
router.get('/:id', Order.getOrderById);
router.put('/:id', Order.updateOrder);
router.delete('/:id', Order.deleteOrderById);

export default router;