const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Register User
router.post('/registerss', userController.register);

// Login User
router.post('/login', userController.login);

// Get All Users
router.get('/', authMiddleware, userController.getUsers);

// Get User by ID
router.get('/user/:id', authMiddleware, userController.getUserById);

// Update User Info
router.put('/user/:id', authMiddleware, userController.updateUserInfo);

// Get User Info (logged-in user)
router.get('/me', authMiddleware, userController.getUserInfo);

// Get All Students
router.get('/students', authMiddleware, userController.getStudents);

module.exports = router; // Corrected module. Exports
