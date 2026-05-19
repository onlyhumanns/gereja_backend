// src/controllers/laporan.controller.js
// Controller untuk laporan data jemaat

const prisma   = require('../utils/prisma');
const response = require('../utils/response');

const laporanController = {

  // GET /api/laporan/jemaat
  // Laporan lengkap jemaat dengan berbagai filter
  async laporanJemaat(req, res) {
    try {
      const {
        statusJemaat,
        jenisKelamin,
        statusPernikahan,
        pendidikan,
        kkId,
        tanggalLahirDari,
        tanggalLahirSampai,
      } = req.query;

      // Bangun kondisi filter secara dinamis
      const where = {
        AND: [
          statusJemaat    ? { statusJemaat }    : {},
          jenisKelamin    ? { jenisKelamin }    : {},
          statusPernikahan ? { statusPernikahan } : {},
          pendidikan      ? { pendidikan }      : {},
          kkId            ? { kkId: parseInt(kkId) } : {},
          tanggalLahirDari || tanggalLahirSampai ? {
            tanggalLahir: {
              gte: tanggalLahirDari ? new Date(tanggalLahirDari) : undefined,
              lte: tanggalLahirSampai ? new Date(tanggalLahirSampai) : undefined,
            },
          } : {},
        ],
      };

      const jemaat = await prisma.jemaat.findMany({
        where,
        orderBy: { namaLengkap: 'asc' },
        include: {
          kepalaKeluarga: {
            select: { nomorKK: true, alamat: true, kota: true },
          },
        },
      });

      return response.success(res, {
        total: jemaat.length,
        data: jemaat,
        filterDigunakan: req.query,
      }, 'Laporan jemaat berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil laporan jemaat.', 500);
    }
  },

  // GET /api/laporan/ibadah
  // Laporan jadwal ibadah per periode
  async laporanIbadah(req, res) {
    try {
      const { bulan, tahun } = req.query;

      let where = {};
      if (bulan && tahun) {
        where.tanggal = {
          gte: new Date(tahun, bulan - 1, 1),
          lte: new Date(tahun, bulan, 0),
        };
      }

      const ibadah = await prisma.jadwalIbadah.findMany({
        where,
        orderBy: { tanggal: 'asc' },
      });

      return response.success(res, {
        total: ibadah.length,
        data: ibadah,
      }, 'Laporan ibadah berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil laporan ibadah.', 500);
    }
  },
};

module.exports = laporanController;
