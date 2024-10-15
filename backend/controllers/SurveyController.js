const Survey = require('../models/SurveyModel');
const User = require('../models/User'); // Assuming you need to reference the User model

// Create Survey
exports.createSurvey = async (req, res) => {
  const { title, questions } = req.body;
  const createdBy = req.user.id; // Assuming you use req.user from authentication middleware

  if (!title || !questions) {
    return res.status(400).json({ error: 'Title and questions are required.' });
  }

  try {
    const survey = new Survey({ title, questions, createdBy });
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
