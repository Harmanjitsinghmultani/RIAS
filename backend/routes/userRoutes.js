const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Register User
router.post('/register', userController.register);

// Login User
router.post('/login', userController.login);

// Get All Users
router.get('/', authMiddleware, userController.getUsers);
router.get('/notadmin', authMiddleware, userController.getnotadmin);

// Get User by ID
router.get('/user/:id', authMiddleware, userController.getUserById);

// Update User Info
router.put('/user/:id', authMiddleware, userController.updateUserInfo);

// Get User Info (logged-in user)
router.get('/me', authMiddleware, userController.getUserInfo);

// Get All Students
router.get('/students', authMiddleware, userController.getStudents);

router.get('/branches', authMiddleware, userController.getBranches);


// Get All Sections
router.get('/sections', authMiddleware, userController.getSections);

// Get All Semesters
router.get('/semesters', authMiddleware, userController.getSemesters);


router.get('/students/criteria', authMiddleware, userController.getStudentsByCriteria);


// Define route for fetching academic years
router.get('/academic-years', userController.getAcademicYears);


// Route to get user by session and _id
router.get('/session', userController.getSessions);



// Route to get distinct subject names
router.get('/subject-names', userController.getDistinctSubjectNames);


// Route to get distinct subject names
router.get('/course-code', userController.getDistinctcoursecode);

// Route to get distinct subject names
// Route to select electives for a user
router.post('/user/:id/select-elective', userController.selectElective);
router.delete('/user/:id/remove-elective', userController.deleteElective);




module.exports = router; // Corrected module. Exports
