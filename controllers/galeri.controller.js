// controllers/galeri.controller.js
const prisma = require('../utils/prisma');
const supabase = require('../utils/supabase');

const BUCKET = 'galeri'; // nama bucket di Supabase Storage

// Helper: upload buffer ke Supabase Storage, return public URL
const uploadToSupabase = async (file) => {
  const ext = file.originalname.split('.').pop();
  const filename = `galeri_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error('Upload ke Supabase gagal: ' + error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
};

// Helper: hapus file dari Supabase Storage berdasarkan public URL
const deleteFromSupabase = async (imageUrl) => {
  try {
    // Ambil nama file dari URL
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    const filename = parts[parts.length - 1];
    await supabase.storage.from(BUCKET).remove([filename]);
  } catch (e) {
    console.warn('Gagal hapus file dari Supabase:', e.message);
  }
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

    let imageUrl = req.body.imageUrl || null;

    // Kalau ada file upload, kirim ke Supabase
    if (req.file) {
      imageUrl = await uploadToSupabase(req.file);
    }

    if (!judul || !imageUrl) {
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
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT - update galeri
const updateGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, deskripsi, urutan, aktif } = req.body;

    const existing = await prisma.galeri.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Galeri tidak ditemukan.' });
    }

    let imageUrl = req.body.imageUrl || existing.imageUrl;

    // Kalau ada file baru, upload ke Supabase & hapus yang lama
    if (req.file) {
      // Hapus foto lama dari Supabase (kalau bukan URL eksternal)
      if (existing.imageUrl && existing.imageUrl.includes('supabase')) {
        await deleteFromSupabase(existing.imageUrl);
      }
      imageUrl = await uploadToSupabase(req.file);
    }

    const updateData = {
      judul,
      deskripsi: deskripsi || null,
      imageUrl,
      urutan: urutan !== undefined ? Number(urutan) : existing.urutan,
      aktif: aktif !== undefined ? (aktif === 'true' || aktif === true) : existing.aktif,
    };

    const galeri = await prisma.galeri.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({ success: true, data: galeri, message: 'Foto berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
const deleteGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.galeri.findUnique({ where: { id: Number(id) } });

    if (existing && existing.imageUrl && existing.imageUrl.includes('supabase')) {
      await deleteFromSupabase(existing.imageUrl);
    }

    await prisma.galeri.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Foto berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getGaleriPublik, getAllGaleri, createGaleri, updateGaleri, deleteGaleri };
