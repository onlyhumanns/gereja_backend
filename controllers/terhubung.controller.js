// controllers/terhubung.controller.js

const prisma   = require('../utils/prisma');
const response = require('../utils/response');

const terhubungController = {

  // POST /api/terhubung — Form publik (tidak perlu auth)
  async create(req, res) {
    try {
      const { namaLengkap, nomorHp, alamat, email, jenisPelayanan, keterangan } = req.body;

      if (!namaLengkap || !nomorHp || !alamat || !jenisPelayanan) {
        return response.error(res, 'Nama lengkap, nomor HP, alamat, dan jenis pelayanan wajib diisi.', 422);
      }

      const data = await prisma.terhubung.create({
        data: { namaLengkap, nomorHp, alamat, email, jenisPelayanan, keterangan },
      });

      return response.success(res, data, 'Pengajuan berhasil dikirim. Kami akan segera menghubungi Anda.', 201);
    } catch (error) {
      console.error('Terhubung create error:', error);
      return response.error(res, 'Gagal mengirim pengajuan.', 500);
    }
  },

  // GET /api/terhubung — Admin: ambil semua data
  async getAll(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = status ? { status } : {};

      const [data, total] = await Promise.all([
        prisma.terhubung.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit),
        }),
        prisma.terhubung.count({ where }),
      ]);

      return response.success(res, { data, total, page: parseInt(page), limit: parseInt(limit) }, 'Data terhubung berhasil diambil.');
    } catch (error) {
      console.error('Terhubung getAll error:', error);
      return response.error(res, 'Gagal mengambil data.', 500);
    }
  },

  // PATCH /api/terhubung/:id/status — Admin: update status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatus = ['Pending', 'Diproses', 'Selesai', 'Ditolak'];
      if (!validStatus.includes(status)) {
        return response.error(res, 'Status tidak valid.', 422);
      }

      const data = await prisma.terhubung.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      return response.success(res, data, 'Status berhasil diperbarui.');
    } catch (error) {
      console.error('Terhubung updateStatus error:', error);
      return response.error(res, 'Gagal memperbarui status.', 500);
    }
  },

  // DELETE /api/terhubung/:id — Admin: hapus data
  async remove(req, res) {
    try {
      const { id } = req.params;

      await prisma.terhubung.delete({ where: { id: parseInt(id) } });

      return response.successMessage(res, 'Data berhasil dihapus.');
    } catch (error) {
      console.error('Terhubung remove error:', error);
      return response.error(res, 'Gagal menghapus data.', 500);
    }
  },
};

module.exports = terhubungController;
