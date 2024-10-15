const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/timetables", authMiddleware, timetableController.createTimetable);
router.get("/timetables", timetableController.getTimetables);

module.exports = router;
