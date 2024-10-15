import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/FeedbackStats.module.css"; // Adjust the path as needed
import FeedbackPDF from "./pdf/FeedbackPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

const FeedbackStats = () => {
  const [semesters, setSemesters] = useState([]);
  const [parentDepartments, setBranches] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [showPDFLink, setShowPDFLink] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    semester: sessionStorage.getItem('semester') || "",
    parentDepartment: "",
    academicYear: "",
    subject: "",
    course: "",
    faculty: "",
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [aggregatedData, setAggregatedData] = useState({
    theory: [],
    practical: []
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          semestersRes,
          parentDepartmentsRes,
          academicYearsRes,
          subjectsRes,
          coursesRes,
          facultiesRes,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/semesters`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/parentdepartment`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/academicyear`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/subject-names`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/course-names`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/faculty-names`),
        ]);

        setSemesters(semestersRes.data);
        setBranches(parentDepartmentsRes.data);
        setAcademicYears(academicYearsRes.data);
        setSubjects(subjectsRes.data);
        setCourses(coursesRes.data);
        setFaculties(facultiesRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setMessage("Failed to load options.");
        setMessageType("error");
      }
    };

    fetchOptions();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { semester, parentDepartment, academicYear, subject, course, faculty } = selectedFilters;
      const params = {
        semester,
        parentDepartment,
        academicYear,
        subjectName: subject,
        courseName: course,
        facultyName: faculty,
      };

      const feedbackResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/filtered`,
        { params }
      );
      

      setFeedbacks(feedbackResponse.data);
      aggregateFeedbacks(feedbackResponse.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setMessage("Failed to load feedbacks.");
      setMessageType("error");
    }
  };

  const cleanQuestion = (question) => {
    return question.replace(/^\d+_/, '');
  };

  const calculatePercentage = (score, total = 4) => {
    if (total === 0) return "N/A";
    return ((score / total) * 100).toFixed(0) + "%";
  };

  const calculateAverage = (totalScore, count) => {
    if (count === 0) return "N/A";
    return calculatePercentage(totalScore / count);
  };

  const aggregateFeedbacks = (feedbacks) => {
    if (!Array.isArray(feedbacks)) {
      console.error('Expected feedbacks to be an array.');
      return;
    }
  
    const aggregated = {
      theory: {},
      practical: {}
    };
  
    feedbacks.forEach((feedback) => {
      const { facultyName, subjectName, courseCode, type, time, responses } = feedback;
      const category = type === 'theory' ? 'theory' : 'practical';
  
      if (!aggregated[category][facultyName]) {
        aggregated[category][facultyName] = {
          subjects: new Set(),
          courseCodes: new Set(),
          times: new Set(),
          responses: {},
          totalScore: 0,
          totalPossibleScore: 0,
          count: 0
        };
      }
  
      aggregated[category][facultyName].subjects.add(subjectName);
      aggregated[category][facultyName].courseCodes.add(courseCode);
      aggregated[category][facultyName].times.add(time);
  
      Object.entries(responses).forEach(([question, score]) => {
        const cleanQuestionText = cleanQuestion(question);
        if (!aggregated[category][facultyName].responses[cleanQuestionText]) {
          aggregated[category][facultyName].responses[cleanQuestionText] = {};
        }
        if (!aggregated[category][facultyName].responses[cleanQuestionText][subjectName]) {
          aggregated[category][facultyName].responses[cleanQuestionText][subjectName] = [];
        }
        aggregated[category][facultyName].responses[cleanQuestionText][subjectName].push(score);
  
        // Calculate total score and total possible score (assuming max score is 4 per question)
        aggregated[category][facultyName].totalScore += score;
        aggregated[category][facultyName].totalPossibleScore += 4;
        aggregated[category][facultyName].count += 1;
      });
    });
  
   
  const result = {
    theory: Object.keys(aggregated.theory).map((facultyName) => {
      const facultyData = aggregated.theory[facultyName];
      const subjectNames = Array.from(facultyData.subjects);

      const averageResponses = {};
      Object.entries(facultyData.responses).forEach(([question, subjectScores]) => {
        averageResponses[question] = subjectNames.map((subject) => {
          const scores = subjectScores[subject] || [];
          const total = scores.reduce((sum, score) => sum + score, 0);
          const average = scores.length ? calculatePercentage(total / scores.length) : "N/A";
          return average;
        });
      });

      // Calculate the overall theory average based on total score and total possible score
      const theoryAverage = calculatePercentage(facultyData.totalScore, facultyData.totalPossibleScore);

      return {
        facultyName,
        subjectNames,
        times: Array.from(facultyData.times),
        courseCodes: Array.from(facultyData.courseCodes),
        responses: averageResponses,
        theoryAverage,
        totalScore: facultyData.totalScore, // Keep track of total score for final calculation
        totalPossibleScore: facultyData.totalPossibleScore // Track possible score
      };
    }),
    practical: Object.keys(aggregated.practical).map((facultyName) => {
      const facultyData = aggregated.practical[facultyName];
      const subjectNames = Array.from(facultyData.subjects);

      const averageResponses = {};
      Object.entries(facultyData.responses).forEach(([question, subjectScores]) => {
        averageResponses[question] = subjectNames.map((subject) => {
          const scores = subjectScores[subject] || [];
          const total = scores.reduce((sum, score) => sum + score, 0);
          const average = scores.length ? calculatePercentage(total / scores.length) : "N/A";
          return average;
        });
      });

      // Calculate the overall practical average based on total score and total possible score
      const practicalAverage = calculatePercentage(facultyData.totalScore, facultyData.totalPossibleScore);

      return {
        facultyName,
        subjectNames,
        courseCodes: Array.from(facultyData.courseCodes),
        times: Array.from(facultyData.times),
        responses: averageResponses,
        practicalAverage,
        totalScore: facultyData.totalScore, // Keep track of total score for final calculation
        totalPossibleScore: facultyData.totalPossibleScore // Track possible score
      };
    })
  };

  setAggregatedData(result);
};

  const parsePercentage = (percentageString) => {
    if (percentageString === "N/A") return NaN;
    return parseFloat(percentageString.replace('%', ''));
  };

  const handleFilterChange = (event) => {
    const { id, value } = event.target;
    setSelectedFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleFilterApply = () => {
    fetchFeedbacks();
    setShowPDFLink(true);
  };

  const groupedFeedbackData = () => {
    const groupedData = {};
  
    // Process theory feedback
    aggregatedData.theory.forEach(item => {
      if (!groupedData[item.facultyName]) {
        groupedData[item.facultyName] = { theory: item, practical: [], overallAverage: "N/A", totalScore: 0, totalPossibleScore: 0 };
      } else {
        groupedData[item.facultyName].theory = item;
      }
  
      // Accumulate theory scores
      groupedData[item.facultyName].totalScore += item.totalScore;
      groupedData[item.facultyName].totalPossibleScore += item.totalPossibleScore;
    });
  
    // Process practical feedback
    aggregatedData.practical.forEach(item => {
      if (groupedData[item.facultyName]) {
        groupedData[item.facultyName].practical.push(item);
      } else {
        groupedData[item.facultyName] = { theory: null, practical: [item], overallAverage: "N/A", totalScore: 0, totalPossibleScore: 0 };
      }
  
      // Accumulate practical scores
      groupedData[item.facultyName].totalScore += item.totalScore;
      groupedData[item.facultyName].totalPossibleScore += item.totalPossibleScore;
    });
  
    // Calculate the overall average from combined theory and practical total scores
    Object.keys(groupedData).forEach(facultyName => {
      const data = groupedData[facultyName];
      if (data.totalPossibleScore > 0) {
        groupedData[facultyName].overallAverage = calculatePercentage(data.totalScore, data.totalPossibleScore);
      } else {
        groupedData[facultyName].overallAverage = "N/A";
      }
    });
  
    return groupedData;
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.feedbackCard} ${styles.scrollableContainer}`}>
        <h2>Feedback Statistics</h2>
        <p>Filter and review feedback statistics based on various criteria.</p>

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        <div className={styles.dropdownContainer}>
          {[
            { id: "academicYear", label: "Academic Year", options: academicYears },
            { id: "parentDepartment", label: "Branch", options: parentDepartments },
            { id: "semester", label: "Semester", options: semesters },
            { id: "subject", label: "Subject", options: subjects },
            { id: "course", label: "Course", options: courses },
            { id: "faculty", label: "Faculty", options: faculties },
          ].map(({ id, label, options }) => (
            <div key={id} className={styles.dropdownItem}>
              <label htmlFor={id}>{label}:</label>
              <select
                id={id}
                value={selectedFilters[id] || ""}
                onChange={handleFilterChange}
              >
                <option value="">Select {label}</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleFilterApply} className={styles.filterButton}>
            Apply Filters
          </button>

          {showPDFLink && (
            <div className={styles.pdfLinkContainer}>
              <PDFDownloadLink
                document={<FeedbackPDF data={aggregatedData} />}
                fileName="FeedbackStatistics.pdf"
              >
                {({ loading }) =>
                  loading ? (
                    <button className={styles.pdfButton} disabled>
                      Generating PDF...
                    </button>
                  ) : (
                    <button className={styles.pdfButton}>Download PDF</button>
                  )
                }
              </PDFDownloadLink>
            </div>
          )}
        </div>

        <div className={styles.resultsContainer}>
          {feedbacks.length > 0 ? (
            Object.keys(groupedFeedbackData()).map((facultyName) => {
              const data = groupedFeedbackData()[facultyName];

              return (
                <div key={facultyName} className={styles.questioncard}>
                  {data.theory && (
                    <div className={styles.feedbackSection}>
                      <div>
                        <h2 style={{ display: 'inline', marginRight: '250px' }}>Theory Feedback</h2>
                        <h3 style={{ display: 'inline', marginRight: '80px' }}>Faculty: {facultyName}</h3>
                      </div>

                      <div style={{ marginTop: '20px' }}>
                        <h5 style={{ display: 'inline', marginRight: '80px' }}>Theory Subject: {data.theory.subjectNames.join(", ")}</h5>
                        {data.theory.theoryAverage && (
                          <p style={{ display: 'inline', marginRight: '80px' }}>
                            <strong>Theory Average:</strong> {data.theory.theoryAverage}
                          </p>
                        )}

                        {data.overallAverage && (
                          <p style={{ display: 'inline' }}>
                            <strong>Final Average:</strong> {data.overallAverage}
                          </p>
                        )}
                      </div>

                      <div className={styles.feedbackTable}>
                        <table className={styles.feedbackTable}>
                          <thead>
                            <tr>
                              <th>Question</th>
                              {data.theory.subjectNames.map((subject, index) => (
                                <th key={index}>{subject}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(data.theory.responses).map(([question, responses]) => (
                              <tr key={question}>
                                <td>{question}</td>
                                {responses.map((response, index) => (
                                  <td key={index}>{response}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {data.practical.length > 0 && (
                    <div key={facultyName} className={styles.feedbackSection}>
                      {data.practical.map((practicalFeedback, index) => (
                        <div key={index} className={styles.feedbackTable}>
                          <div>
                            <h2 style={{ display: 'inline', marginRight: '300px' }}>Practical Feedback</h2>
                            <h3 style={{ display: 'inline', marginleft: '80px' }}>Faculty: {facultyName}</h3>
                          </div>

                          <div style={{ marginTop: '30px' }}>
                            <h4 style={{ display: 'inline', marginRight: '80px' }}>Practical Subjects: {practicalFeedback.subjectNames.join(", ")}</h4>

                            {data.practical[0].practicalAverage && (
                              <p style={{ display: 'inline', marginRight: '80px' }}>
                                <strong>Practical Average:</strong> {data.practical[0].practicalAverage}
                              </p>
                            )}
                          </div>

                          <table className={styles.feedbackTable}>
                            <thead>
                              <tr>
                                <th>Question</th>
                                {practicalFeedback.subjectNames.map((subject, index) => (
                                  <th key={index}>{subject}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(practicalFeedback.responses).map(([question, responses]) => (
                                <tr key={question}>
                                  <td>{question}</td>
                                  {responses.map((response, index) => (
                                    <td key={index}>{response}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No feedback data available for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackStats;
