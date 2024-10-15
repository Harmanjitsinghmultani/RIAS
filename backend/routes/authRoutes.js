const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const { uploadCSV } = require("../controllers/csvController");

// Route to register a user
router.post("/register", register);

// Route to login a user
router.post("/login", login);

// Route to upload CSV file
router.post('/api/upload-csv', uploadCSV); // Directly call the uploadCSV controller

module.exports = router;
