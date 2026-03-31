const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', submitContact);
router.get('/', authMiddleware, adminMiddleware, getContacts);
router.put('/:id/status', authMiddleware, adminMiddleware, updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
