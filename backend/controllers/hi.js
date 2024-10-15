


exports.getFeedbackAnalysisByBranch = async (req, res) => {
  try {
    const { parentDepartment, academicYear } = req.query;

    if (!parentDepartment) {
      return res.status(400).json({ message: "Branch is required" });
    }

    if (!academicYear) {
      return res.status(400).json({ message: "Academic Year is required" });
    }

    // Fetch feedbacks based on both the parentDepartment and academicYear
    const feedbacks = await Feedback.find({ parentDepartment, academicYear });

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedback found for the given parentDepartment and academic year" });
    }

    const facultyAnalysis = {};

    feedbacks.forEach((feedback) => {
      const { studentId, facultyName, courseCode, responses } = feedback;
      if (!responses) return;

      const responsesObj = Object.fromEntries(responses);

      // Convert responses to a scale of 4
      const scores = Object.values(responsesObj).map((score) => parseFloat(score));
      const validScores = scores.filter((score) => !isNaN(score));
      const totalScore = validScores.reduce((acc, score) => acc + score, 0);
      const count = validScores.length;

      if (count === 0) return;

      const averageScore = totalScore / count;

      if (!facultyAnalysis[facultyName]) {
        facultyAnalysis[facultyName] = {
          totalScore: 0,
          count: 0,
          totalQuestions: 0,
          courses: new Set(),
          uniqueStudents: new Set(), // Track unique students per faculty
        };
      }

      facultyAnalysis[facultyName].totalScore += averageScore;
      facultyAnalysis[facultyName].count += 1;
      facultyAnalysis[facultyName].totalQuestions += Object.keys(responsesObj).length;
      facultyAnalysis[facultyName].courses.add(courseCode); // Add courseCode to the set

      facultyAnalysis[facultyName].uniqueStudents.add(studentId); // Track unique studentId per faculty
    });

    // Calculate average score, percentage per faculty, and course count
    const result = Object.keys(facultyAnalysis).map((facultyName) => {
      const facultyData = facultyAnalysis[facultyName];
      const averageScore =
        facultyData.count > 0
          ? (facultyData.totalScore / facultyData.count).toPrecision(4)
          : "0.0000"; // Use .toPrecision(4) to maintain four decimal places
      const averagePercentage =
        facultyData.count > 0
          ? (((facultyData.totalScore / (facultyData.count * 4)) * 100).toPrecision(4))
          : "0.0000"; // Use .toPrecision(4) to maintain four decimal places

      return {
        facultyName,
        studentCount: facultyData.uniqueStudents.size/facultyData.courses.size, // Use the size of the uniqueStudents set
        courseCount: facultyData.courses.size, // Count the number of unique courses
        averageRating: averageScore,
        averagePercentage,
      };
    });

    res.json({ facultyData: result });
  } catch (error) {
    console.error("Error analyzing feedback by parentDepartment and academic year:", error);
    res.status(500).json({ message: "Error analyzing feedback by parentDepartment and academic year", error });
  }
};
