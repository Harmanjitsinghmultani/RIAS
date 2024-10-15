const express = require("express");
const router = express.Router();
const {
  getTimetablesByCriteria,
  getElectiveSubjects
} = require("../controllers/timetableController");
const {
  getTimetableById,
  deleteTimetable,
  updateTimetable,
} = require("../controllers/timetableController");
const {
  getUserById,
  updateUserInfo,
  getUserInfo,
  getStudents,
  getBranches,
  getSections,
  getSemesters,
  getStudentsByCriteria,
} = require("../controllers/userController"); // Ensure path is correct
const { getFacultyName } = require("../controllers/timetable");

// Routes
router.get("/user/:id", getUserById);
router.put("/user/update", updateUserInfo); // Ensure this route has authentication middleware
router.get("/user/info", getUserInfo); // Ensure this route has authentication middleware
router.get("/students", getStudents);
router.get("/branches", getBranches);
router.get("/sections", getSections);
router.get("/semesters", getSemesters);
router.get("/facultyname", getFacultyName);
router.get("/students/criteria", getStudentsByCriteria);
router.get("/timetables/criteria", getTimetablesByCriteria);
router.get("/electives", getElectiveSubjects);
router.delete("/timetables/delete", deleteTimetable);
router.put("/timetables/update/:id", updateTimetable);

router.get("/timetables/all", getTimetableById);

module.exports = router; // Fixed the export statement
