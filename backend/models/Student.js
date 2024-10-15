// models/Student.js

const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: [
    {
      type: String, // or a more complex structure based on your feedback form
      date: { type: Date, default: Date.now },
    },
  ],
  // other fields
});

module.exports = mongoose.model("Student", StudentSchema);
