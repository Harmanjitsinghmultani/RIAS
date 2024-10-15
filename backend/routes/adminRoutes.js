const express = require("express");
const router = express.Router();

const { uploadCSV, uploadTimetableCSV, uploadFacultyCSV } = require("../controllers/csvController"); // Import the new controller

// Route for uploading user data via CSV
router.post("/upload-csv", uploadCSV);

// Route for uploading timetable data via CSV
router.post("/upload-timetable-csv", uploadTimetableCSV);

// Route for uploading faculty data via CSV
router.post("/upload-faculty-csv", uploadFacultyCSV);

module.exports = router;
