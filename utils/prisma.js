// src/utils/prisma.js
// Membuat satu instance Prisma Client yang digunakan di seluruh aplikasi

const { PrismaClient } = require('@prisma/client');

// Menggunakan singleton pattern agar koneksi database tidak duplikat
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

module.exports = prisma;
