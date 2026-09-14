const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { upload } = require('../config/cloudinary');

// GET /api/users/metadata - Get institutions and careers
router.get('/metadata', usersController.getUserMetadata);

// PUT /api/users/profile - Update user profile (requires auth token and multer for 'profile_picture')
router.put('/profile', verifyToken, upload.single('profile_picture'), usersController.updateProfile);

// PUT /api/users/location - Update user location
router.put('/location', verifyToken, usersController.updateLocation);

module.exports = router;
