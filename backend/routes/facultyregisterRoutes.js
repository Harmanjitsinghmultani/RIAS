// routes/facultyregisterRoutes.js
const express = require('express');
const router = express.Router();
const facultyregisterController = require('../controllers/facultyregisterController');

// Register faculty
router.post('/create/faculty', facultyregisterController.createFaculty);

// Fetch all faculty names
router.get('/facultyname', facultyregisterController.getFacultyNames);

// Fetch distinct subjects
router.get('/subjects', facultyregisterController.getSubjects);

// Fetch distinct course codes
router.get('/coursecodes', facultyregisterController.getCourseCodes);

// Fetch distinct branches
router.get('/branches', facultyregisterController.getBranches);

// Fetch distinct sections
router.get('/sections', facultyregisterController.getSections);

// Fetch distinct semesters
router.get('/semesters', facultyregisterController.getSemesters);

// Fetch distinct batches
router.get('/batches', facultyregisterController.getBatches);

// Fetch distinct academic years
router.get('/academicyears', facultyregisterController.getAcademicYears);

// Fetch distinct sessions
router.get('/sessions', facultyregisterController.getSessions);

// Fetch distinct rooms
router.get('/rooms', facultyregisterController.getRooms);

// Fetch distinct parent departments
router.get('/parentdepartments', facultyregisterController.getParentDepartments);





// Routes for faculty management
router.get('/faculty', facultyregisterController.getAllFaculty);
router.put('/faculty/edit/:id', facultyregisterController.editFaculty);
router.delete('/faculty/delete/:id', facultyregisterController.deleteFaculty);

module.exports = router;
