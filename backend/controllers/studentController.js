const Student = require('../models/Student');

// Fetch student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id); // Assuming you have authentication middleware setting req.user
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
