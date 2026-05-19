// src/controllers/jemaat.controller.js
// Controller lengkap untuk manajemen data jemaat (CRUD)

const prisma   = require('../utils/prisma');
const response = require('../utils/response');

const jemaatController = {

  // ----------------------------------------------------------
  // GET ALL - Ambil semua data jemaat (dengan pagination & search)
  // GET /api/jemaat?page=1&limit=10&search=nama
  // ----------------------------------------------------------
  async getAll(req, res) {
    try {
      // Ambil parameter dari query string
      const page   = parseInt(req.query.page)   || 1;
      const limit  = parseInt(req.query.limit)  || 10;
      const search = req.query.search || '';
      const status = req.query.status || undefined;

      const skip = (page - 1) * limit; // Hitung offset untuk pagination

      // Kondisi filter pencarian
      const where = {
        AND: [
          // Filter berdasarkan nama (pencarian)
          search ? {
            namaLengkap: { contains: search }
          } : {},
          // Filter berdasarkan status jemaat
          status ? { statusJemaat: status } : {},
        ],
      };

      // Jalankan dua query sekaligus: ambil data + hitung total
      const [jemaat, total] = await prisma.$transaction([
        prisma.jemaat.findMany({
          where,
          skip,
          take: limit,
          orderBy: { namaLengkap: 'asc' },
          include: {
            kepalaKeluarga: { // Sertakan data KK
              select: { nomorKK: true, alamat: true, kota: true },
            },
          },
        }),
        prisma.jemaat.count({ where }),
      ]);

      return response.success(res, {
        data: jemaat,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }, 'Data jemaat berhasil diambil.');
    } catch (error) {
      console.error('getAll jemaat error:', error);
      return response.error(res, 'Gagal mengambil data jemaat.', 500);
    }
  },

  // ----------------------------------------------------------
  // GET BY ID - Ambil detail satu jemaat
  // GET /api/jemaat/:id
  // ----------------------------------------------------------
  async getById(req, res) {
    try {
      const { id } = req.params;

      const jemaat = await prisma.jemaat.findUnique({
        where: { id: parseInt(id) },
        include: {
          kepalaKeluarga: true, // Sertakan semua data KK
        },
      });

      if (!jemaat) {
        return response.error(res, 'Data jemaat tidak ditemukan.', 404);
      }

      return response.success(res, jemaat, 'Detail jemaat berhasil diambil.');
    } catch (error) {
      return response.error(res, 'Gagal mengambil detail jemaat.', 500);
    }
  },

  // ----------------------------------------------------------
  // CREATE - Tambah data jemaat baru
  // POST /api/jemaat
  // ----------------------------------------------------------
  async create(req, res) {
    try {
      const {
        nomorJemaat, namaLengkap, tempatLahir, tanggalLahir,
        jenisKelamin, statusPernikahan, pekerjaan, pendidikan,
        nomorTelepon, email, statusJemaat, tanggalBaptis,
        tanggalSidi, keterangan, kkId,
      } = req.body;

      // Cek apakah nomor jemaat sudah ada
      const existing = await prisma.jemaat.findUnique({ where: { nomorJemaat } });
      if (existing) {
        return response.error(res, 'Nomor jemaat sudah terdaftar.', 409);
      }

      const jemaat = await prisma.jemaat.create({
        data: {
          nomorJemaat,
          namaLengkap,
          tempatLahir,
          tanggalLahir: new Date(tanggalLahir), // Konversi string ke Date
          jenisKelamin,
          statusPernikahan: statusPernikahan || 'BELUM_MENIKAH',
          pekerjaan,
          pendidikan,
          nomorTelepon,
          email,
          statusJemaat: statusJemaat || 'AKTIF',
          tanggalBaptis: tanggalBaptis ? new Date(tanggalBaptis) : null,
          tanggalSidi: tanggalSidi ? new Date(tanggalSidi) : null,
          keterangan,
          kkId: kkId ? parseInt(kkId) : null,
        },
      });

      return response.success(res, jemaat, 'Data jemaat berhasil ditambahkan.', 201);
    } catch (error) {
      console.error('create jemaat error:', error);
      return response.error(res, 'Gagal menambahkan data jemaat.', 500);
    }
  },

  // ----------------------------------------------------------
  // UPDATE - Update data jemaat
  // PUT /api/jemaat/:id
  // ----------------------------------------------------------
  async update(req, res) {
    try {
      const { id } = req.params;

      // Cek apakah data jemaat ada
      const exist = await prisma.jemaat.findUnique({ where: { id: parseInt(id) } });
      if (!exist) {
        return response.error(res, 'Data jemaat tidak ditemukan.', 404);
      }

      const {
        namaLengkap, tempatLahir, tanggalLahir, jenisKelamin,
        statusPernikahan, pekerjaan, pendidikan, nomorTelepon,
        email, statusJemaat, tanggalBaptis, tanggalSidi, keterangan, kkId,
      } = req.body;

      const jemaat = await prisma.jemaat.update({
        where: { id: parseInt(id) },
        data: {
          namaLengkap,
          tempatLahir,
          tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
          jenisKelamin,
          statusPernikahan,
          pekerjaan,
          pendidikan,
          nomorTelepon,
          email,
          statusJemaat,
          tanggalBaptis: tanggalBaptis ? new Date(tanggalBaptis) : undefined,
          tanggalSidi: tanggalSidi ? new Date(tanggalSidi) : undefined,
          keterangan,
          kkId: kkId ? parseInt(kkId) : undefined,
        },
      });

      return response.success(res, jemaat, 'Data jemaat berhasil diupdate.');
    } catch (error) {
      console.error('update jemaat error:', error);
      return response.error(res, 'Gagal mengupdate data jemaat.', 500);
    }
  },

  // ----------------------------------------------------------
  // DELETE - Hapus data jemaat
  // DELETE /api/jemaat/:id
  // ----------------------------------------------------------
  async remove(req, res) {
    try {
      const { id } = req.params;

      const exist = await prisma.jemaat.findUnique({ where: { id: parseInt(id) } });
      if (!exist) {
        return response.error(res, 'Data jemaat tidak ditemukan.', 404);
      }

      await prisma.jemaat.delete({ where: { id: parseInt(id) } });

      return response.successMessage(res, 'Data jemaat berhasil dihapus.');
    } catch (error) {
      return response.error(res, 'Gagal menghapus data jemaat.', 500);
    }
  },
};

module.exports = jemaatController;
