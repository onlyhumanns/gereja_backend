// controllers/galeri.controller.js
const prisma = require('../utils/prisma');
const path = require('path');
const fs   = require('fs');

const getImageUrl = (req) => {
  if (req.file) {
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    return `${baseUrl}/uploads/galeri/${req.file.filename}`;
  }
  return req.body.imageUrl || null;
};

// GET publik
const getGaleriPublik = async (req, res) => {
  try {
    const galeri = await prisma.galeri.findMany({
      where: { aktif: true },
      orderBy: { urutan: 'asc' },
    });
    res.json({ success: true, data: galeri });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET admin
const getAllGaleri = async (req, res) => {
  try {
    const galeri = await prisma.galeri.findMany({
      orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: galeri });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST - tambah galeri
const createGaleri = async (req, res) => {
  try {
    const { judul, deskripsi, urutan, aktif } = req.body;
    const imageUrl = getImageUrl(req);
    if (!judul || !imageUrl) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Judul dan gambar wajib diisi.' });
    }
    const galeri = await prisma.galeri.create({
      data: {
        judul,
        deskripsi: deskripsi || null,
        imageUrl,
        urutan: urutan !== undefined ? Number(urutan) : 0,
        aktif: aktif !== undefined ? (aktif === 'true' || aktif === true) : true,
      },
    });
    res.status(201).json({ success: true, data: galeri, message: 'Foto berhasil ditambahkan.' });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT - update galeri
const updateGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, deskripsi, urutan, aktif } = req.body;
    const existing = await prisma.galeri.findUnique({ where: { id: Number(id) } });
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      if (existing && existing.imageUrl && existing.imageUrl.includes('/uploads/galeri/')) {
        const oldPath = path.join(__dirname, '..', 'uploads', 'galeri', path.basename(existing.imageUrl));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      imageUrl = `${baseUrl}/uploads/galeri/${req.file.filename}`;
    }
    const updateData = {
      judul,
      deskripsi: deskripsi || null,
      urutan: urutan !== undefined ? Number(urutan) : undefined,
      aktif: aktif !== undefined ? (aktif === 'true' || aktif === true) : undefined,
    };
    if (imageUrl) updateData.imageUrl = imageUrl;
    const galeri = await prisma.galeri.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json({ success: true, data: galeri, message: 'Foto berhasil diperbarui.' });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
const deleteGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.galeri.findUnique({ where: { id: Number(id) } });
    if (existing && existing.imageUrl && existing.imageUrl.includes('/uploads/galeri/')) {
      const filePath = path.join(__dirname, '..', 'uploads', 'galeri', path.basename(existing.imageUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await prisma.galeri.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Foto berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getGaleriPublik, getAllGaleri, createGaleri, updateGaleri, deleteGaleri };
