const router = require('express').Router();
const dokumenController = require('../controllers/dokumenController');
const authMiddleware = require('../middleware/auth');
const { uploadDocument } = require('../middleware/upload');

// Public — all documents
router.get('/', dokumenController.getAll);
router.get('/:id', dokumenController.getById);

// Protected — admin CRUD
router.post('/', authMiddleware, uploadDocument.single('file'), dokumenController.create);
router.put('/:id', authMiddleware, uploadDocument.single('file'), dokumenController.update);
router.delete('/:id', authMiddleware, dokumenController.delete);

module.exports = router;
