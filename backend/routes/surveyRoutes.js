const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const surveyController = require("../controllers/surveyController");

// Create Survey
router.post("/create", authMiddleware, surveyController.createSurvey);

module.exports = router; // Correct
