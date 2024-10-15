const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: true,
    unique: true, // This ensures the facultyName is unique
    trim: true,   // Optionally, trim whitespace from the name
  },
  subjectName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  parentDepartment: {
    type: String,
    required: true,
  }
});

// Add a pre-save hook to handle unique constraint errors
facultySchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    // Handle unique constraint error
    next(new Error('A faculty with this name already exists. Please use a different name.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Faculty', facultySchema);
