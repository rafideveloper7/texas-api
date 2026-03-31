const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe, updateProfile, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', authMiddleware, getMe);
router.put('/update', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;