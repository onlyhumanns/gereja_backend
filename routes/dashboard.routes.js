// src/routes/dashboard.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, controller.getSummary);

module.exports = router;
