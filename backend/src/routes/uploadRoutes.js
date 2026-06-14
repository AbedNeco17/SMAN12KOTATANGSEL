const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const { sendSuccess, sendError } = require('../utils/helpers');

router.post('/', authMiddleware, uploadImage.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'File wajib diupload', 400);
    }

    sendSuccess(res, {
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    }, 'File berhasil diupload', 201);
  } catch (error) {
    console.error('Upload error:', error.message);
    sendError(res, 'Gagal mengupload file');
  }
});

module.exports = router;
