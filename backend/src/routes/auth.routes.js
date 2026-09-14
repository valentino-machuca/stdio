const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Example of a protected route to get current user info
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

module.exports = router;
