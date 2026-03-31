const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const upload = require('../config/multer');

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createCategory);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;