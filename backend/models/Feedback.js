const mongoose = require("mongoose");

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  facultyName: { type: String, required: true },
  courseName: { type: String, required: true },
  branch: { type: String, required: true },
  parentDepartment: { type: String, required: true },
  section: { type: String, required: true },
  semester: { type: String, required: true },
  batch: { type: String, required: true },
  subjectName: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseAbbreviation: { type: String, required: true },
  academicYear: { type: String, required: true },
  type: { type: String, required: true }, // Theory or Practical
  responses: {
    type: Map,
    of: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Add a unique compound index to allow submission once per student/semester/type/subjectName
feedbackSchema.index(
  { studentId: 1, semester: 1, type: 1, subjectName: 1 },
  { unique: true }
);

module.exports = mongoose.model("Feedbacks", feedbackSchema);
