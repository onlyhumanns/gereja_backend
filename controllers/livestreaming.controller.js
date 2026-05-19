// controllers/livestreaming.controller.js
const prisma = require('../utils/prisma');

// Helper: konversi URL YouTube ke embed URL
const toEmbedUrl = (url) => {
  if (!url) return '';
  // Handle youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Handle youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Handle youtube.com/live/ID
  const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/);
  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`;
  // Jika sudah embed URL, kembalikan apa adanya
  if (url.includes('/embed/')) return url;
  return url;
};

// GET live streaming publik (yang aktif)
const getLivePublik = async (req, res) => {
  try {
    const data = await prisma.liveStreaming.findMany({
      where: { aktif: true },
      orderBy: { createdAt: 'desc' },
      take: 1, // tampilkan 1 yang terbaru/aktif
    });
    const result = data.map(d => ({ ...d, embedUrl: toEmbedUrl(d.youtubeUrl) }));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET semua live streaming (admin)
const getAllLive = async (req, res) => {
  try {
    const data = await prisma.liveStreaming.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const result = data.map(d => ({ ...d, embedUrl: toEmbedUrl(d.youtubeUrl) }));
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST tambah live streaming
const createLive = async (req, res) => {
  try {
    const { judul, youtubeUrl, deskripsi, aktif } = req.body;
    if (!judul || !youtubeUrl) {
      return res.status(400).json({ success: false, message: 'Judul dan URL YouTube wajib diisi.' });
    }
    const data = await prisma.liveStreaming.create({
      data: {
        judul,
        youtubeUrl,
        deskripsi: deskripsi || null,
        aktif: aktif !== undefined ? Boolean(aktif) : true,
      },
    });
    res.status(201).json({ success: true, data: { ...data, embedUrl: toEmbedUrl(data.youtubeUrl) }, message: 'Live streaming berhasil ditambahkan.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update live streaming
const updateLive = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, youtubeUrl, deskripsi, aktif } = req.body;
    const data = await prisma.liveStreaming.update({
      where: { id: Number(id) },
      data: {
        judul,
        youtubeUrl,
        deskripsi: deskripsi || null,
        aktif: aktif !== undefined ? Boolean(aktif) : undefined,
      },
    });
    res.json({ success: true, data: { ...data, embedUrl: toEmbedUrl(data.youtubeUrl) }, message: 'Live streaming berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE live streaming
const deleteLive = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.liveStreaming.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Live streaming berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLivePublik, getAllLive, createLive, updateLive, deleteLive };
