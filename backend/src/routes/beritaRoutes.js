const router = require('express').Router();
const beritaController = require('../controllers/beritaController');
const authMiddleware = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// Public — published berita only
router.get('/public', beritaController.getPublished);

// Protected — admin CRUD
router.get('/', authMiddleware, beritaController.getAll);
router.get('/:id', beritaController.getById);
router.post('/', authMiddleware, uploadImage.single('thumbnail'), beritaController.create);
router.put('/:id', authMiddleware, uploadImage.single('thumbnail'), beritaController.update);
router.delete('/:id', authMiddleware, beritaController.delete);

module.exports = router;
