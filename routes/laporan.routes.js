// src/routes/laporan.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/laporan.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/jemaat',  authenticate, controller.laporanJemaat);
router.get('/ibadah',  authenticate, controller.laporanIbadah);

module.exports = router;
