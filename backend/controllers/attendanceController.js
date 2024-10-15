// controllers/attendanceController.js
const Attendance = require("../models/Attendance"); // Ensure this path is correct

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get attendance by class ID
exports.getAttendanceByClassId = async (req, res) => {
  try {
    const attendance = await Attendance.find({ classId: req.params.classId });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }
    res.json({ message: "Attendance deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
