const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get profile
router.get('/profile', authMiddleware, getProfile);

// Route to update profile
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
