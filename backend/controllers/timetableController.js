const Timetable = require('../models/Timetable');
const User = require("../models/User"); // Import User model if needed

// Create a new timetable
exports.createTimetable = async (req, res) => {
  try {
    // Destructure academicYear and session from req.body
    const { branch, section, semester, batch, facultyName, subjectName, courseCode, type,isElective, courseAbbreviation, parentDepartment, academicYear, session } = req.body;

    // Create a new Timetable instance including academicYear and session
    const newTimetable = new Timetable({
      branch,
      section,
      semester,
      batch,  // Include batch in the creation
      facultyName,
      subjectName,
      courseCode,
      type,
      isElective,
      courseAbbreviation,
      parentDepartment,
      academicYear, // Include academicYear in the creation
      session,      // Include session in the creation
      createdBy: req.user._id // Assuming req.user is set by authentication middleware
    });

    // Save the new timetable to the database
    await newTimetable.save();

    // Send a success response with the created timetable
    res.status(201).json(newTimetable);
  } catch (error) {
    console.error('Error creating timetable:', error);
    res.status(500).json({ message: 'Failed to create timetable' });
  }
};


// Get all timetables based on filters
exports.getTimetables = async (req, res) => {
  try {
    const { branch, section, semester, batch } = req.query; // Include batch in the query
    const query = {};

    if (branch) query.branch = branch;
    if (section) query.section = section;
    if (semester) query.semester = semester;
    if (batch) query.batch = batch; // Add batch filter

    const timetables = await Timetable.find(query);
    res.status(200).json(timetables);
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({ message: 'Failed to fetch timetables' });
  }
};

// Get Timetables by specific criteria (semester, branch, section, batch)
exports.getTimetablesByCriteria = async (req, res) => {
  const { semester, branch, section, batch } = req.query; // Include batch in the query

  try {
    const query = {};
    if (semester) query.semester = semester;
    if (branch) query.branch = branch;
    if (section) query.section = section;
    if (batch) query.batch = batch; // Add batch filter

    const timetables = await Timetable.find(query);
    res.status(200).json(timetables);
  } catch (error) {
    console.error('Error fetching timetables by criteria:', error);
    res.status(500).json({ message: 'Failed to fetch timetables by criteria' });
  }
};














exports.getElectiveSubjects = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Decode the token to get the user ID
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.id;

    // Fetch the user profile to get the branch
    const user = await User.findById(userId).select("branch");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch elective subjects based on the user's branch
    const electives = await Timetable.find({
      isElective: true,
      branch: user.branch // Filter electives by user's branch
    }).select('subjectName');

    // If no electives are found, return an empty array instead of an error
    return res.status(200).json(electives.map(e => e.subjectName));
    
  } catch (error) {
    console.error("Error fetching elective subjects:", error);
    res.status(500).json({ message: "Failed to fetch elective subjects" });
  }
};


















// Get a specific timetable by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching timetable by ID:', error);
    res.status(500).json({ message: 'Failed to fetch timetable' });
  }
};

const mongoose = require('mongoose');

exports.updateTimetable = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { branch, section, semester, batch, facultyName, subjectName, courseCode, type, courseAbbreviation, parentDepartment } = req.body;

    const timetable = await Timetable.findByIdAndUpdate(
      id,
      { branch, section, semester, batch, facultyName, subjectName, courseCode, type, courseAbbreviation, parentDepartment },
      { new: true, runValidators: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error updating timetable:', error);
    res.status(500).json({ message: 'Failed to update timetable' });
  }
};


exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.query.id); // Use req.query.id instead of req.params.id
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable:', error);
    res.status(500).json({ message: 'Failed to delete timetable' });
  }
};







exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().populate("createdBy", "name email"); // Populate createdBy with user fields if needed
    res.status(200).json(timetables);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};





