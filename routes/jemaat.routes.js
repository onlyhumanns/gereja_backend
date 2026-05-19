// src/routes/jemaat.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/jemaat.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Semua route jemaat butuh autentikasi
// GET    /api/jemaat          → Daftar semua jemaat (dengan pagination & search)
// GET    /api/jemaat/:id      → Detail satu jemaat
// POST   /api/jemaat          → Tambah jemaat baru
// PUT    /api/jemaat/:id      → Update data jemaat
// DELETE /api/jemaat/:id      → Hapus jemaat (hanya Admin)

router.get('/',     authenticate, controller.getAll);
router.get('/:id',  authenticate, controller.getById);
router.post('/',    authenticate, controller.create);
router.put('/:id',  authenticate, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.remove);

module.exports = router;
