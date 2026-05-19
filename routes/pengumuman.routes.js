// routes/pengumuman.routes.js
const express = require('express');
const router  = express.Router();
const { getPengumumanPublik, getAllPengumuman, createPengumuman, updatePengumuman, deletePengumuman } = require('../controllers/pengumuman.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/publik', getPengumumanPublik);               // publik
router.get('/',       authenticate, getAllPengumuman);     // admin
router.post('/',      authenticate, createPengumuman);     // admin
router.put('/:id',    authenticate, updatePengumuman);     // admin
router.delete('/:id', authenticate, deletePengumuman);     // admin

module.exports = router;
