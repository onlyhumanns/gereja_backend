// controllers/auth.controller.js
// Controller untuk autentikasi: register & login

const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const prisma   = require('../utils/prisma');
const response = require('../utils/response');

const authController = {

  // ----------------------------------------------------------
  // REGISTER - Daftarkan admin/majelis baru
  // POST /api/auth/register
  // ----------------------------------------------------------
  async register(req, res) {
    try {
      const { nama, email, password, role } = req.body;

      // Validasi field wajib
      if (!nama || !email || !password) {
        return response.error(res, 'Nama, email, dan password wajib diisi.', 400);
      }

      // Validasi panjang password
      if (password.length < 6) {
        return response.error(res, 'Password minimal 6 karakter.', 400);
      }

      // Cek apakah email sudah terdaftar
      const userExist = await prisma.user.findUnique({ where: { email } });
      if (userExist) {
        return response.error(res, 'Email sudah terdaftar.', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user baru ke database
      const user = await prisma.user.create({
        data: {
          nama,
          email,
          password: hashedPassword,
          role: role || 'MAJELIS',
        },
        select: { id: true, nama: true, email: true, role: true, createdAt: true },
      });

      return response.success(res, user, 'Registrasi berhasil!', 201);
    } catch (error) {
      console.error('Register error:', error);
      return response.error(res, 'Gagal melakukan registrasi.', 500);
    }
  },

  // ----------------------------------------------------------
  // LOGIN - Masuk dengan email & password
  // POST /api/auth/login
  // ----------------------------------------------------------
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.error(res, 'Email dan password wajib diisi.', 400);
      }

      // Cari user berdasarkan email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return response.error(res, 'Email atau password salah.', 401);
      }

      // Bandingkan password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return response.error(res, 'Email atau password salah.', 401);
      }

      // Buat JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return response.success(res, {
        token,
        user: { id: user.id, nama: user.nama, email: user.email, role: user.role },
      }, 'Login berhasil!');
    } catch (error) {
      console.error('Login error:', error);
      return response.error(res, 'Gagal melakukan login.', 500);
    }
  },

  // ----------------------------------------------------------
  // GET PROFILE - Ambil data user yang sedang login
  // GET /api/auth/profile
  // ----------------------------------------------------------
  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, nama: true, email: true, role: true, createdAt: true },
      });

      if (!user) return response.error(res, 'User tidak ditemukan.', 404);

      return response.success(res, user, 'Data profil berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil profil.', 500);
    }
  },

  // ----------------------------------------------------------
  // GET USERS - Daftar semua user (hanya Admin)
  // GET /api/auth/users
  // ----------------------------------------------------------
  async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, nama: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });

      return response.success(res, users, 'Daftar user berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil daftar user.', 500);
    }
  },
};

module.exports = authController;
