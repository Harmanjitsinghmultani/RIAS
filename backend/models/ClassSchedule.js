// In models/ClassSchedule.js
const mongoose = require('mongoose');

const classScheduleSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  facultyName: { type: String, required: true },
  dayOfWeek: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
});

const ClassSchedule = mongoose.model('ClassSchedule', classScheduleSchema);

module.exports = ClassSchedule;
