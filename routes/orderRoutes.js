const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, updatePaymentStatus, cancelOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', (req, res, next) => {
  // Optional auth for order creation
  if (req.headers.authorization) return authMiddleware(req, res, next);
  next();
}, createOrder);

router.get('/', authMiddleware, getUserOrders);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.put('/:id/payment', authMiddleware, adminMiddleware, updatePaymentStatus);
router.delete('/:id', authMiddleware, cancelOrder);

module.exports = router;
