const mongoose = require('mongoose');

const antiRaggingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaint: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  username: { type: String },
  email: { type: String },
  mobileNumber: { type: String },
  registrationNumber: { type: String },
  semester: { type: String },
  branch: { type: String },
  section: { type: String },
  rollNumber: { type: String },
  batch: { type: String }
});

module.exports = mongoose.model('AntiRagging', antiRaggingSchema);
