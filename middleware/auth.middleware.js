// src/middleware/auth.middleware.js
const jwt      = require('jsonwebtoken');
const response = require('../utils/response');

const authenticate = (req, res, next) => {
  // Cek ?apikey= di URL dulu, lalu Authorization header
  let token = req.query.apikey;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return response.error(res, 'Akses ditolak. Token tidak ditemukan.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return response.error(res, 'Token tidak valid atau sudah kadaluarsa.', 401);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return response.error(res, 'Akses ditolak. Hanya Admin yang diizinkan.', 403);
  }
  next();
};

module.exports = { authenticate, isAdmin };
