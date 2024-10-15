// adminAnalysis.js
const express = require('express');
const router = express.Router();
const adminAnalysisController = require('../controllers/adminAnalysis');

router.get('/feedback-analysis', adminAnalysisController.getFeedbackAnalysis);


router.get('/by-same-subject', adminAnalysisController.getFeedbackAnalysisBySubjectAndType);



// adminAnalysis.js
// adminAnalysis.js

router.get('/feedback-analysis-by-branch', adminAnalysisController.getFeedbackAnalysisByBranch);



// Route for same faculty different subjects analysis
router.get('/by-faculty', adminAnalysisController.getFeedbackAnalysisByFaculty);



module.exports = router;