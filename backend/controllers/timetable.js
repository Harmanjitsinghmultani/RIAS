const User = require("../models/User"); // Adjust the path as needed
const Timetable = require("../models/Timetable");

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update User Info
// Update User Info
exports.updateUserInfo = async (req, res) => {
  const {
    username,
    email,
    mobileNumber,
    registrationNumber,
    semester,
    branch,
    section,
    rollNumber,
    batch,
    day, // Added field
    courseAbbreviation, // Added field
    parentDepartment, // Added field
  } = req.body;

  try {
    const userId = req.user.id;

    // Prepare update data
    const updateData = {
      username,
      email,
      mobileNumber,
      registrationNumber,
      semester,
      branch,
      section,
      batch,
      rollNumber,
      day, // Added field
      courseAbbreviation, // Added field
      parentDepartment, // Added field
    };

    // Update the user information
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get User Info (logged-in user)
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/userController.js

// Get All Branches
exports.getBrasnches = async (req, res) => {
  try {
    // Fetch all unique branches from the User collection
    const branches = await User.distinct("branch");
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Branches
exports.getBranches = async (req, res) => {
  try {
    // Fetch all unique branches from the User collection
    const subjectName = await User.distinct("subjectName");
    res.status(200).json(subjectName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Sections
exports.getSections = async (req, res) => {
  try {
    const sections = await User.distinct("section");
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Semesters
exports.getSemesters = async (req, res) => {
  try {
    const semesters = await User.distinct("semester");
    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Faculty Names
exports.getFacultyName = async (req, res) => {
  try {
    const facultyNames = await Timetable.distinct("facultyName"); // Or use User if that's correct

    if (facultyNames.length === 0) {
      console.log("No faculty names found.");
    }
    res.status(200).json(facultyNames);
  } catch (error) {
    console.error("Error fetching faculty names:", error); // Log error
    res.status(500).json({ error: error.message });
  }
};

// Get Students by Semester, Branch, and Section
exports.getStudentsByCriteria = async (req, res) => {
  const { semester, branch, section } = req.query;

  try {
    const query = {};
    if (semester) query.semester = semester;
    if (branch) query.branch = branch;
    if (section) query.section = section;

    const students = await User.find(query).select("-password");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
