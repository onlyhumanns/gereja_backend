// routes/terhubung.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/terhubung.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Publik: submit form terhubung
router.post('/', controller.create);

// Admin: kelola data terhubung
router.get('/',             authenticate, controller.getAll);
router.patch('/:id/status', authenticate, controller.updateStatus);
router.delete('/:id',       authenticate, controller.remove);

module.exports = router;
