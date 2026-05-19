const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/auth.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// POST /api/auth/register  → Daftarkan user baru (tanpa auth, terbuka)
router.post('/register', controller.register);

// POST /api/auth/login     → Login dan dapatkan token
router.post('/login', controller.login);

// GET  /api/auth/profile   → Ambil profil user yang login
router.get('/profile', authenticate, controller.getProfile);

// GET  /api/auth/users     → Daftar semua user (hanya Admin)
router.get('/users', authenticate, isAdmin, controller.getUsers);

module.exports = router;
