const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  section: { type: String, required: true },
  semester: { type: String, required: true },
  batch: { type: String },
  timetable: { type: String, required: false },
  facultyName: { type: String, required: true },
  subjectName: { type: String, required: true },
  courseCode: { type: String, required: true },
  type: { type: String, required: true }, // Theory or Practical
  courseAbbreviation: { type: String, required: true },
  parentDepartment: { type: String, required: true },
  academicYear: { type: String, required: true }, // Added academic year
  session: { type: String, required: true }, // Added session
  isElective: { type: Boolean, default: false }, // Added elective flag
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timetable", timetableSchema);
