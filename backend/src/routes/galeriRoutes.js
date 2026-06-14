const router = require('express').Router();
const galeriController = require('../controllers/galeriController');
const authMiddleware = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// Public — all gallery items
router.get('/', galeriController.getAll);
router.get('/:id', galeriController.getById);

// Protected — admin CRUD
router.post('/', authMiddleware, uploadImage.single('gambar'), galeriController.create);
router.put('/:id', authMiddleware, uploadImage.single('gambar'), galeriController.update);
router.delete('/:id', authMiddleware, galeriController.delete);

module.exports = router;
