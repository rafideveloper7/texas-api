const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, getAllReservations, updateReservation, cancelReservation, checkAvailability } = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', createReservation);
router.get('/availability', checkAvailability);
router.get('/', authMiddleware, getUserReservations);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllReservations);
router.put('/:id', authMiddleware, updateReservation);
router.delete('/:id', authMiddleware, cancelReservation);

module.exports = router;
