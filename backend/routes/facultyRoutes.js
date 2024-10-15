const express = require('express');
const router = express.Router();
const { getUnapprovedUsers, approveUser, rejectUser } = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure only authorized users can access

// Get all unapproved users
router.get('/unapproved-users', authMiddleware, getUnapprovedUsers);

// Approve user route
router.post('/approve-user/:userId', authMiddleware, approveUser);

// Reject user route
router.post('/reject-user/:userId', authMiddleware, rejectUser);

module.exports = router; // Corrected export syntax
