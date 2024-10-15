import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FeedbackPDFsame from "./pdf/FeedbackPDFsame";
import styles from "./css/SameFacultyDifferentSubjectsAnalysis.module.css"; // Adjust the path as needed

const SameFacultyDifferentSubjectsAnalysis = () => {
  const [parentDepartment, setParentDepartment] = useState(""); // Track department
  const [facultyName, setFacultyName] = useState("");
  const [academicYear, setAcademicYear] = useState(""); // Track academic year
  const [analysisData, setAnalysisData] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [departments, setDepartments] = useState([]); // Store available departments
  const [faculties, setFaculties] = useState([]);
  const [academicYears, setAcademicYears] = useState([]); // Store academic years

  // Fetch academic years on load
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/academicyear`
        );
        
        setAcademicYears(response.data);
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setMessage("Failed to load academic years.");
        setMessageType("error");
      }
    };

    fetchAcademicYears();
  }, []);

  // Fetch departments on load
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/parentdepartment`
        );
        
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setMessage("Failed to load departments.");
        setMessageType("error");
      }
    };

    fetchDepartments();
  }, []);

  // Fetch faculties based on selected parent department
  useEffect(() => {
    if (parentDepartment) {
      const fetchFaculties = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/faculty-names/by-parentdepartment`,
            { params: { department: parentDepartment } }
          );
          
          setFaculties(response.data);
        } catch (error) {
          console.error("Error fetching faculties:", error);
          setMessage("Failed to load faculties.");
          setMessageType("error");
        }
      };

      fetchFaculties();
    }
  }, [parentDepartment]);

  const fetchAnalysis = async () => {
    try {
      if (!facultyName || !academicYear) {
        setMessage("Please select both faculty and academic year.");
        setMessageType("error");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/by-faculty`,
        {
          params: { facultyName, academicYear }, // Include academic year in the request
        }
      );
      

      if (response.data && response.data.length > 0) {
        setAnalysisData(response.data);
        setMessage("");
      } else {
        setAnalysisData([]);
        setMessage(
          "No analysis data available for the selected faculty and academic year."
        );
        setMessageType("info");
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      setMessage("Failed to load analysis data.");
      setMessageType("error");
    }
  };

  const handleDepartmentChange = (e) => {
    setParentDepartment(e.target.value); // Set selected department
    setFacultyName(""); // Clear faculty when department changes
  };

  const handleFacultyChange = (e) => {
    setFacultyName(e.target.value);
  };

  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value);
  };

  const handleSearch = () => {
    fetchAnalysis();
  };

  const calculateFinalAveragePercentage = (data) => {
    if (data.length === 0) return 0;
    const totalPercentage = data.reduce(
      (sum, item) => sum + parseFloat(item.averagePercentage),
      0
    );
    return (totalPercentage / data.length).toFixed(2);
  };

  const theoryData = analysisData.filter(
    (data) => data.type.toLowerCase() === "theory"
  );
  const practicalData = analysisData.filter(
    (data) => data.type.toLowerCase() === "practical"
  );

  const finalTheoryAverage = calculateFinalAveragePercentage(theoryData);
  const finalPracticalAverage = calculateFinalAveragePercentage(practicalData);

  const finalOverallAverage = (() => {
    if (theoryData.length > 0 && practicalData.length > 0) {
      return (
        (parseFloat(finalTheoryAverage) + parseFloat(finalPracticalAverage)) /
        2
      ).toFixed(2);
    } else if (theoryData.length > 0) {
      return finalTheoryAverage;
    } else if (practicalData.length > 0) {
      return finalPracticalAverage;
    }
    return "0";
  })();

  return (
    <div className={styles.SameFacultyDifferentSubjectsAnalysi_container}>
      <div className={styles.SameFacultyDifferentSubjectsAnalysi_card}>
        <h2>Same Faculty, Different Subjects Feedback Analysis</h2>
        <p>
          Select a department, faculty, and academic year to analyze feedback
          across subjects.
        </p>
        {message && (
          <div
            className={`${styles.SameFacultyDifferentSubjectsAnalysi_message} ${styles[messageType]}`}
          >
            {message}
          </div>
        )}

        {/* Department, Faculty, and Academic Year Filters */}
        <div
          className={styles.SameFacultyDifferentSubjectsAnalysi_inputcontainer}
        >
          <select
            value={academicYear}
            onChange={handleAcademicYearChange}
            className={
              styles.SameFacultyDifferentSubjectsAnalysi_subjectDropdown
            }
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={parentDepartment}
            onChange={handleDepartmentChange}
            className={
              styles.SameFacultyDifferentSubjectsAnalysi_subjectDropdown
            }
          >
            <option value="">Select Parent Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={facultyName}
            onChange={handleFacultyChange}
            className={
              styles.SameFacultyDifferentSubjectsAnalysi_subjectDropdown
            }
            disabled={!parentDepartment} // Disable if no department selected
          >
            <option value="">Select Faculty</option>
            {faculties.map((faculty, index) => (
              <option key={index} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className={styles.SameFacultyDifferentSubjectsAnalysi_searchButton}
          >
            Search
          </button>
        </div>
        {/* Display analysis data */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div style={{ flex: 1, marginRight: "10px", textAlign: "center" }}>
            <h4>Final Overall Average: {finalOverallAverage}%</h4>
          </div>
          <div style={{ flex: 1, marginRight: "10px", textAlign: "center" }}>
            <h4>Theory Average: {finalTheoryAverage}%</h4>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <h4>Practical Average: {finalPracticalAverage}%</h4>
          </div>
        </div>

        {theoryData.length > 0 && (
          <>
            <h3>Theory Subjects</h3>
            <div
              className={
                styles.SameFacultyDifferentSubjectsAnalysi_analysisTableWrapper
              }
            >
              <table
                className={
                  styles.SameFacultyDifferentSubjectsAnalysi_analysisTable
                }
              >
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Subject Name</th>
                    <th>Branch</th>
                    <th>Type</th>
                    <th>Average Percentage</th>
                    <th>Feedback Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {theoryData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.facultyName}</td>
                      <td>{data.subjectName}</td>
                      <td>{data.branch}</td>
                      <td>{data.type}</td>
                      <td>{data.averagePercentage}%</td>
                      <td>{getFeedbackRemark(data.averagePercentage)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {practicalData.length > 0 && (
          <>
            <h3>Practical Subjects</h3>
            <div
              className={
                styles.SameFacultyDifferentSubjectsAnalysi_analysisTableWrapper
              }
            >
              <table
                className={
                  styles.SameFacultyDifferentSubjectsAnalysi_analysisTable
                }
              >
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Subject Name</th>
                    <th>Branch</th>
                    <th>Type</th>
                    <th>Average Percentage</th>
                    <th>Feedback Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {practicalData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.facultyName}</td>
                      <td>{data.subjectName}</td>
                      <td>{data.branch}</td>
                      <td>{data.type}</td>
                      <td>{data.averagePercentage}%</td>
                      <td>{getFeedbackRemark(data.averagePercentage)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {analysisData.length > 0 && (
          <>
            <PDFDownloadLink
              document={
                <FeedbackPDFsame
                  analysisData={analysisData}
                  facultyName={facultyName}
                  parentDepartment={parentDepartment}
                  academicYear={academicYear}
                />
              }
              fileName="analysis-report.pdf"
            >
              {({ loading }) => (
                <button
                  style={{
                    backgroundColor: "#007bff",
                    border: "none",
                    color: "#fff",
                    padding: "10px 20px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "4px 2px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "background-color 0.3s ease",
                    marginTop: "10px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  }
                >
                  {loading ? "Generating PDF..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </>
        )}
      </div>
    </div>
  );
};

const getFeedbackRemark = (percentage) => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Very Good";
  if (percentage >= 70) return "Good";
  if (percentage >= 60) return "Satisfactory";

  return "Need Improvement";
};

export default SameFacultyDifferentSubjectsAnalysis;
