// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const AttendanceController = require("../controllers/attendanceController");

router.post("/attendance", AttendanceController.markAttendance);
router.get("/attendance/:id", AttendanceController.getAttendance);

module.exports = router;
