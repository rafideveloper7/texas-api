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

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
