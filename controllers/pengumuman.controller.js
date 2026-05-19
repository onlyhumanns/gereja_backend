// controllers/pengumuman.controller.js
const prisma = require('../utils/prisma');

// GET pengumuman publik (aktif, terbaru)
const getPengumumanPublik = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const data = await prisma.pengumuman.findMany({
      where: { aktif: true },
      orderBy: { tanggal: 'desc' },
      take: Number(limit),
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET semua pengumuman (admin)
const getAllPengumuman = async (req, res) => {
  try {
    const data = await prisma.pengumuman.findMany({
      orderBy: { tanggal: 'desc' },
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST tambah pengumuman
const createPengumuman = async (req, res) => {
  try {
    const { judul, isi, tanggal, aktif } = req.body;
    if (!judul || !isi || !tanggal) {
      return res.status(400).json({ success: false, message: 'Judul, isi, dan tanggal wajib diisi.' });
    }
    const data = await prisma.pengumuman.create({
      data: {
        judul,
        isi,
        tanggal: new Date(tanggal),
        aktif: aktif !== undefined ? Boolean(aktif) : true,
      },
    });
    res.status(201).json({ success: true, data, message: 'Pengumuman berhasil ditambahkan.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update pengumuman
const updatePengumuman = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi, tanggal, aktif } = req.body;
    const data = await prisma.pengumuman.update({
      where: { id: Number(id) },
      data: {
        judul,
        isi,
        tanggal: tanggal ? new Date(tanggal) : undefined,
        aktif: aktif !== undefined ? Boolean(aktif) : undefined,
      },
    });
    res.json({ success: true, data, message: 'Pengumuman berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE pengumuman
const deletePengumuman = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pengumuman.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Pengumuman berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPengumumanPublik, getAllPengumuman, createPengumuman, updatePengumuman, deletePengumuman };
