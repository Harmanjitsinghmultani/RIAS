const express = require('express');
const router = express.Router();
const ClassSchedule = require('../models/ClassSchedule'); // Ensure this path is correct

// POST route to add a class schedule
router.post('/add', async (req, res) => {
  try {
    const { courseName, facultyName, dayOfWeek, startTime, endTime } = req.body;

    // Basic validation
    if (!courseName || !facultyName || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Create a new schedule entry
    const newSchedule = new ClassSchedule({
      courseName,
      facultyName,
      dayOfWeek,
      startTime,
      endTime
    });

    // Save to database
    const savedSchedule = await newSchedule.save();

    // Send success response with data
    res.status(201).json({
      message: 'Class schedule added successfully',
      schedule: savedSchedule
    });
  } catch (error) {
    console.error('Error adding schedule:', error.message);
    res.status(500).json({
      error: 'Error adding class schedule',
      details: error.message
    });
  }
});

// GET route to fetch all class schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await ClassSchedule.find();
    res.status(200).json({
      schedules
    });
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    res.status(500).json({
      error: 'Error fetching class schedules',
      details: error.message
    });
  }
});

module.exports = router; // Ensure module export is correct
