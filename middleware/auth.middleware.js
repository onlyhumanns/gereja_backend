// src/middleware/auth.middleware.js
// Middleware untuk memverifikasi JWT Token

const jwt      = require('jsonwebtoken');
const response = require('../utils/response');

// ============================================================
// MIDDLEWARE: Verifikasi token JWT
// Cara pakai: tambahkan 'authenticate' sebelum handler route
// Contoh: router.get('/data', authenticate, controller.getData)
// ============================================================
const authenticate = (req, res, next) => {
  // Ambil token dari header Authorization
  // Format header: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.error(res, 'Akses ditolak. Token tidak ditemukan.', 401);
  }

  const token = authHeader.split(' ')[1]; // Ambil bagian token saja

  try {
    // Verifikasi token dengan secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data user di req.user agar bisa diakses controller
    req.user = decoded;
    next(); // Lanjut ke handler berikutnya
  } catch (error) {
    return response.error(res, 'Token tidak valid atau sudah kadaluarsa.', 401);
  }
};

// ============================================================
// MIDDLEWARE: Batasi akses hanya untuk ADMIN
// Cara pakai: tambahkan setelah 'authenticate'
// Contoh: router.delete('/user/:id', authenticate, isAdmin, controller.delete)
// ============================================================
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return response.error(res, 'Akses ditolak. Hanya Admin yang diizinkan.', 403);
  }
  next();
};

module.exports = { authenticate, isAdmin };
