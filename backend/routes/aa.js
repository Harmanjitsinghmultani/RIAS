const express = require('express');
const router = express.Router();
const antiRaggingController = require('../controllers/Antiragging');

// Route to submit a new complaint
router.post('/submit', antiRaggingController.submitComplaint);

// (Optional) Route to get all complaints, accessible to admin
router.get('/complaints', antiRaggingController.getAllComplaints);

module.exports = router;