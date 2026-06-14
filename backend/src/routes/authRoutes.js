const router = require('express').Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
