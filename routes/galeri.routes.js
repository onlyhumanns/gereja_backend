// routes/galeri.routes.js
const express  = require('express');
const router   = express.Router();
const { getGaleriPublik, getAllGaleri, createGaleri, updateGaleri, deleteGaleri } = require('../controllers/galeri.controller');
const { authenticate } = require('../middleware/auth.middleware');
const upload   = require('../middleware/upload.middleware');

// upload.single('foto') = field name di form harus 'foto'
router.get('/publik', getGaleriPublik);
router.get('/',       authenticate, getAllGaleri);
router.post('/',      authenticate, upload.single('foto'), createGaleri);
router.put('/:id',    authenticate, upload.single('foto'), updateGaleri);
router.delete('/:id', authenticate, deleteGaleri);

module.exports = router;
