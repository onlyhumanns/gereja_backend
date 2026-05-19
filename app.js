// app.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve folder uploads sebagai static (akses foto yang diupload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes          = require('./routes/auth.routes');
const terhubungRoutes     = require('./routes/terhubung.routes');
const ibadahRoutes        = require('./routes/ibadah.routes');
const dashboardRoutes     = require('./routes/dashboard.routes');
const galeriRoutes        = require('./routes/galeri.routes');
const pengumumanRoutes    = require('./routes/pengumuman.routes');
const livestreamingRoutes = require('./routes/livestreaming.routes');

app.use('/api/auth',          authRoutes);
app.use('/api/terhubung',     terhubungRoutes);
app.use('/api/ibadah',        ibadahRoutes);
app.use('/api/dashboard',     dashboardRoutes);
app.use('/api/galeri',        galeriRoutes);
app.use('/api/pengumuman',    pengumumanRoutes);
app.use('/api/livestreaming', livestreamingRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Selamat datang di API Sistem Informasi Gereja 🕊️',
    version: '2.0.0',
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    console.log(`📖 Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
