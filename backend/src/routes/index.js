const router = require('express').Router();

const authRoutes = require('./authRoutes');
const beritaRoutes = require('./beritaRoutes');
const galeriRoutes = require('./galeriRoutes');
const dokumenRoutes = require('./dokumenRoutes');
const uploadRoutes = require('./uploadRoutes');

router.use('/auth', authRoutes);
router.use('/berita', beritaRoutes);
router.use('/galeri', galeriRoutes);
router.use('/dokumen', dokumenRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
