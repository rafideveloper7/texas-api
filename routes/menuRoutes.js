const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItemById, getMenuItemsByCategory, getPopularItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const upload = require('../config/multer');

router.get('/', getMenuItems);
router.get('/popular', getPopularItems);
router.get('/:id', getMenuItemById);
router.get('/category/:categoryId', getMenuItemsByCategory);

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createMenuItem);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateMenuItem);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMenuItem);
router.put('/:id/availability', authMiddleware, adminMiddleware, toggleAvailability);

module.exports = router;
