// src/controllers/kk.controller.js
// Controller untuk manajemen data Kepala Keluarga (KK)

const prisma   = require('../utils/prisma');
const response = require('../utils/response');

const kkController = {

  // GET ALL - Ambil semua data KK
  async getAll(req, res) {
    try {
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip  = (page - 1) * limit;

      const where = search ? {
        OR: [
          { nomorKK: { contains: search } },
          { kota:    { contains: search } },
        ],
      } : {};

      const [kkList, total] = await prisma.$transaction([
        prisma.kepalaKeluarga.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { jemaat: true } }, // Hitung jumlah anggota
          },
        }),
        prisma.kepalaKeluarga.count({ where }),
      ]);

      return response.success(res, {
        data: kkList,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      }, 'Data KK berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil data KK.', 500);
    }
  },

  // GET BY ID - Termasuk semua anggota jemaat dalam KK tersebut
  async getById(req, res) {
    try {
      const kk = await prisma.kepalaKeluarga.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          jemaat: { // Sertakan daftar anggota
            orderBy: { namaLengkap: 'asc' },
          },
        },
      });

      if (!kk) return response.error(res, 'Data KK tidak ditemukan.', 404);

      return response.success(res, kk, 'Detail KK berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil detail KK.', 500);
    }
  },

  // CREATE - Tambah KK baru
  async create(req, res) {
    try {
      const { nomorKK, alamat, rt, rw, kelurahan, kecamatan, kota } = req.body;

      const exist = await prisma.kepalaKeluarga.findUnique({ where: { nomorKK } });
      if (exist) return response.error(res, 'Nomor KK sudah terdaftar.', 409);

      const kk = await prisma.kepalaKeluarga.create({
        data: { nomorKK, alamat, rt, rw, kelurahan, kecamatan, kota },
      });

      return response.success(res, kk, 'Data KK berhasil ditambahkan.', 201);
    } catch (error) {
      return response.error(res, 'Gagal menambahkan data KK.', 500);
    }
  },

  // UPDATE - Edit data KK
  async update(req, res) {
    try {
      const id   = parseInt(req.params.id);
      const exist = await prisma.kepalaKeluarga.findUnique({ where: { id } });
      if (!exist) return response.error(res, 'Data KK tidak ditemukan.', 404);

      const { alamat, rt, rw, kelurahan, kecamatan, kota } = req.body;

      const kk = await prisma.kepalaKeluarga.update({
        where: { id },
        data: { alamat, rt, rw, kelurahan, kecamatan, kota },
      });

      return response.success(res, kk, 'Data KK berhasil diupdate.');
    } catch (error) {
      return response.error(res, 'Gagal mengupdate data KK.', 500);
    }
  },

  // DELETE - Hapus data KK
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id);
      const exist = await prisma.kepalaKeluarga.findUnique({ where: { id } });
      if (!exist) return response.error(res, 'Data KK tidak ditemukan.', 404);

      await prisma.kepalaKeluarga.delete({ where: { id } });

      return response.successMessage(res, 'Data KK berhasil dihapus.');
    } catch (error) {
      return response.error(res, 'Gagal menghapus data KK.', 500);
    }
  },
};

module.exports = kkController;
