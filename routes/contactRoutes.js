const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', submitContact);
router.get('/', authMiddleware, adminMiddleware, getContacts);
router.put('/:id/status', authMiddleware, adminMiddleware, updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

module.exports = router;