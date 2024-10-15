const AntiRagging = require('../models/Antiragging');
const User = require('../models/User');

// Submit a new complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { studentId, complaint } = req.body;

    if (!studentId || !complaint) {
      return res.status(400).json({ message: "Student ID and complaint text are required" });
    }

    // Validate if studentId exists and fetch user information
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: "Invalid Student ID" });
    }

    // Create a new anti-ragging complaint with user information
    const newComplaint = new AntiRagging({
      studentId,
      complaint,
      username: student.username,
      email: student.email,
      mobileNumber: student.mobileNumber,
      registrationNumber: student.registrationNumber,
      semester: student.semester,
      branch: student.branch,
      section: student.section,
      rollNumber: student.rollNumber,
      batch: student.batch
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all complaints (admin access only)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await AntiRagging.find().populate('studentId', 'name');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
