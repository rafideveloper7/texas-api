const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/stats', authMiddleware, adminMiddleware, getStats);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
