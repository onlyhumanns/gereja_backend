// routes/livestreaming.routes.js
const express = require('express');
const router  = express.Router();
const { getLivePublik, getAllLive, createLive, updateLive, deleteLive } = require('../controllers/livestreaming.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/publik', getLivePublik);                 // publik
router.get('/',       authenticate, getAllLive);       // admin
router.post('/',      authenticate, createLive);       // admin
router.put('/:id',    authenticate, updateLive);       // admin
router.delete('/:id', authenticate, deleteLive);       // admin

module.exports = router;
