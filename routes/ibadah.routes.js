// src/routes/ibadah.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/ibadah.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

router.get('/',      authenticate, controller.getAll);
router.get('/:id',   authenticate, controller.getById);
router.post('/',     authenticate, controller.create);
router.put('/:id',   authenticate, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.remove);

module.exports = router;
