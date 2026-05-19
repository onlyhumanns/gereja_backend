// controllers/dashboard.controller.js

const prisma   = require('../utils/prisma');
const response = require('../utils/response');

const dashboardController = {

  // GET /api/dashboard
  async getSummary(req, res) {
    try {
      const [
        totalPengajuan,
        totalPending,
        totalDiproses,
        totalSelesai,
        totalDitolak,
        dataTerbaru,
      ] = await Promise.all([
        prisma.terhubung.count(),
        prisma.terhubung.count({ where: { status: 'Pending' } }),
        prisma.terhubung.count({ where: { status: 'Diproses' } }),
        prisma.terhubung.count({ where: { status: 'Selesai' } }),
        prisma.terhubung.count({ where: { status: 'Ditolak' } }),
        prisma.terhubung.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      return response.success(res, {
        ringkasan: {
          totalPengajuan,
          totalPending,
          totalDiproses,
          totalSelesai,
          totalDitolak,
        },
        dataTerbaru,
      }, 'Data dashboard berhasil diambil.');
    } catch (error) {
      console.error('Dashboard error:', error);
      return response.error(res, 'Gagal mengambil data dashboard.', 500);
    }
  },
};

module.exports = dashboardController;
