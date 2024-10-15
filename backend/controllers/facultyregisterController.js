// controllers/facultyregisterController.js
const Faculty = require('../models/facultyModel'); // Adjust path if needed

// Create a new faculty
// controllers/facultyregisterController.js
exports.createFaculty = async (req, res) => {
  try {
    const newFaculty = new Faculty(req.body);
    await newFaculty.save();
    res.status(201).json({ message: 'Faculty registered successfully', data: newFaculty });
  } catch (error) {
    console.error(error); // Log error for debugging

    // Check if the error is a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Error registering faculty: Faculty name must be unique.', error: error.message });
    }

    // Handle other types of errors
    res.status(400).json({ message: 'Error registering faculty', error: error.message });
  }
};

// controllers/FacultyController.js


// Get all faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const facultyList = await Faculty.find();
    res.status(200).json(facultyList);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving faculty data', error });
  }
};

// Edit a faculty member
exports.editFaculty = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ message: 'Error updating faculty', error });
  }
};

// Delete a faculty member
exports.deleteFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(id);
    if (!deletedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting faculty', error });
  }
};




// Fetch distinct faculty names
exports.getFacultyNames = async (req, res) => {
  try {
    const facultyNames = await Faculty.distinct('facultyName'); // Use the correct model
    
    if (facultyNames.length === 0) {
      console.log('No faculty names found.');
    }
    
    res.status(200).json(facultyNames); // Return the array of faculty names
  } catch (error) {
    console.error('Error fetching faculty names:', error); // Log error
    res.status(500).json({ error: error.message });
  }
};

// Fetch distinct subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Faculty.distinct('subjectName');
    
    if (subjects.length === 0) {
      console.log('No subjects found.');
    }
    
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct course codes
exports.getCourseCodes = async (req, res) => {
  try {
    const courseCodes = await Faculty.distinct('courseCode');
    
    if (courseCodes.length === 0) {
      console.log('No course codes found.');
    }
    
    res.status(200).json(courseCodes);
  } catch (error) {
    console.error('Error fetching course codes:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await Faculty.distinct('branch');
    
    if (branches.length === 0) {
      console.log('No branches found.');
    }
    
    res.status(200).json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct sections
exports.getSections = async (req, res) => {
  try {
    const sections = await Faculty.distinct('section');
    
    if (sections.length === 0) {
      console.log('No sections found.');
    }
    
    res.status(200).json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch distinct semesters
exports.getSemesters = async (req, res) => {
  try {
    const semesters = await Faculty.distinct('semester');
    
    if (semesters.length === 0) {
      console.log('No semesters found.');
    }
    
    res.status(200).json(semesters);
  } catch (error) {
    console.error('Error fetching semesters:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct batches
exports.getBatches = async (req, res) => {
  try {
    const batches = await Faculty.distinct('batch');
    
    if (batches.length === 0) {
      console.log('No batches found.');
    }
    
    res.status(200).json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct academic years
exports.getAcademicYears = async (req, res) => {
  try {
    const academicYears = await Faculty.distinct('academicYear');
    
    if (academicYears.length === 0) {
      console.log('No academic years found.');
    }
    
    res.status(200).json(academicYears);
  } catch (error) {
    console.error('Error fetching academic years:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct sessions
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Faculty.distinct('session');
    
    if (sessions.length === 0) {
      console.log('No sessions found.');
    }
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct parentDepartments
exports.getRooms = async (req, res) => {
  try {
    const parentDepartments = await Faculty.distinct('parentDepartment');
    
    if (parentDepartments.length === 0) {
      console.log('No parentDepartments found.');
    }
    
    res.status(200).json(parentDepartments);
  } catch (error) {
    console.error('Error fetching parentDepartments:', error);
    res.status(500).json({ error: error.message });
  }
};
// Fetch distinct parent departments
exports.getParentDepartments = async (req, res) => {
  try {
    const parentDepartments = await Faculty.distinct('parentDepartment');
    
    if (parentDepartments.length === 0) {
      console.log('No parent departments found.');
    }
    
    res.status(200).json(parentDepartments);
  } catch (error) {
    console.error('Error fetching parent departments:', error);
    res.status(500).json({ error: error.message });
  }
};
