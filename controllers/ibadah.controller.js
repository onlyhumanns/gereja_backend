// src/controllers/ibadah.controller.js
// Controller untuk manajemen jadwal ibadah

const prisma   = require('../utils/prisma');
const response = require('../utils/response');

const ibadahController = {

  // GET ALL - dengan filter bulan/tahun
  async getAll(req, res) {
    try {
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip  = (page - 1) * limit;
      const { bulan, tahun, status } = req.query;

      // Filter berdasarkan bulan dan tahun jika diberikan
      let where = {};
      if (bulan && tahun) {
        const awal  = new Date(tahun, bulan - 1, 1);   // Awal bulan
        const akhir = new Date(tahun, bulan, 0);        // Akhir bulan
        where.tanggal = { gte: awal, lte: akhir };
      }
      if (status) where.status = status;

      const [ibadah, total] = await prisma.$transaction([
        prisma.jadwalIbadah.findMany({
          where,
          skip,
          take: limit,
          orderBy: { tanggal: 'desc' },
        }),
        prisma.jadwalIbadah.count({ where }),
      ]);

      return response.success(res, {
        data: ibadah,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      }, 'Jadwal ibadah berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil jadwal ibadah.', 500);
    }
  },

  // GET BY ID
  async getById(req, res) {
    try {
      const ibadah = await prisma.jadwalIbadah.findUnique({
        where: { id: parseInt(req.params.id) },
      });

      if (!ibadah) return response.error(res, 'Jadwal ibadah tidak ditemukan.', 404);

      return response.success(res, ibadah, 'Detail jadwal ibadah berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil detail jadwal ibadah.', 500);
    }
  },

  // CREATE
  async create(req, res) {
    try {
      const {
        namaIbadah, tanggal, waktuMulai, waktuSelesai,
        lokasi, tema, pengkhotbah, liturgos, pemainMusik, keterangan,
      } = req.body;

      const ibadah = await prisma.jadwalIbadah.create({
        data: {
          namaIbadah,
          tanggal: new Date(tanggal),
          waktuMulai,
          waktuSelesai,
          lokasi,
          tema,
          pengkhotbah,
          liturgos,
          pemainMusik,
          keterangan,
        },
      });

      return response.success(res, ibadah, 'Jadwal ibadah berhasil ditambahkan.', 201);
    } catch (error) {
      return response.error(res, 'Gagal menambahkan jadwal ibadah.', 500);
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const id    = parseInt(req.params.id);
      const exist = await prisma.jadwalIbadah.findUnique({ where: { id } });
      if (!exist) return response.error(res, 'Jadwal ibadah tidak ditemukan.', 404);

      const {
        namaIbadah, tanggal, waktuMulai, waktuSelesai,
        lokasi, tema, pengkhotbah, liturgos, pemainMusik, keterangan, status,
      } = req.body;

      const ibadah = await prisma.jadwalIbadah.update({
        where: { id },
        data: {
          namaIbadah, lokasi, tema, pengkhotbah, liturgos,
          pemainMusik, keterangan, status,
          tanggal: tanggal ? new Date(tanggal) : undefined,
          waktuMulai, waktuSelesai,
        },
      });

      return response.success(res, ibadah, 'Jadwal ibadah berhasil diupdate.');
    } catch (error) {
      return response.error(res, 'Gagal mengupdate jadwal ibadah.', 500);
    }
  },

  // DELETE
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id);
      const exist = await prisma.jadwalIbadah.findUnique({ where: { id } });
      if (!exist) return response.error(res, 'Jadwal ibadah tidak ditemukan.', 404);

      await prisma.jadwalIbadah.delete({ where: { id } });

      return response.successMessage(res, 'Jadwal ibadah berhasil dihapus.');
    } catch (error) {
      return response.error(res, 'Gagal menghapus jadwal ibadah.', 500);
    }
  },
};

module.exports = ibadahController;
