import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer"; // For PDF download
import PdfBranchAnalysis from "./pdf/PdfBranchAnalysis"; // Import the PdfBranchAnalysis component
import styles from "./css/BranchAnalysis.module.css"; // Adjust the path as needed

const BranchAnalysis = () => {
  const [parentDepartment, setBranch] = useState(
    sessionStorage.getItem("parentDepartment") || ""
  );
  const [academicYear, setAcademicYear] = useState(
    sessionStorage.getItem("academicYear") || ""
  );
  const [analysisData, setAnalysisData] = useState(
    JSON.parse(sessionStorage.getItem("analysisData")) || []
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [parentDepartmentes, setBranches] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/parentDepartment`
        );
        
        setBranches(response.data);
        sessionStorage.setItem(
          "parentDepartmentes",
          JSON.stringify(response.data)
        ); // Cache parentDepartmentes data
      } catch (error) {
        console.error("Error fetching parentDepartmentes:", error);
        setMessage("Failed to load parentDepartmentes.");
        setMessageType("error");
      }
    };

    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/academicyear`
        );
        
        setAcademicYears(response.data);
        sessionStorage.setItem("academicYears", JSON.stringify(response.data)); // Cache academic years data
      } catch (error) {
        console.error("Error fetching academic years:", error);
        setMessage("Failed to load academic years.");
        setMessageType("error");
      }
    };

    const cachedBranches = sessionStorage.getItem("parentDepartmentes");
    const cachedAcademicYears = sessionStorage.getItem("academicYears");

    if (cachedBranches) {
      setBranches(JSON.parse(cachedBranches));
    } else {
      fetchBranches();
    }

    if (cachedAcademicYears) {
      setAcademicYears(JSON.parse(cachedAcademicYears));
    } else {
      fetchAcademicYears();
    }

    const intervalId = setInterval(() => {
      fetchBranches(); // Fetch new parentDepartmentes every 10 seconds
      fetchAcademicYears(); // Fetch academic years every 10 seconds
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("parentDepartment", parentDepartment);
    sessionStorage.setItem("academicYear", academicYear);
    sessionStorage.setItem("analysisData", JSON.stringify(analysisData));
  }, [parentDepartment, academicYear, analysisData]);

  const fetchAnalysis = async () => {
    try {
      if (!parentDepartment || !academicYear) {
        setMessage("Please select a parentDepartment and academic year.");
        setMessageType("error");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/feedback-analysis-by-branch`,
        {
          params: { parentDepartment, academicYear },
        }
      );
      

      if (response.data && response.data.facultyData.length > 0) {
        setAnalysisData(response.data.facultyData);
        setMessage("");
      } else {
        setAnalysisData([]);
        setMessage(
          "No analysis data available for the selected parentDepartment and academic year."
        );
        setMessageType("info");
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      setMessage("Failed to load analysis data.");
      setMessageType("error");
    }
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value);
  };

  const handleSearch = () => {
    fetchAnalysis();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("parentDepartment");
    sessionStorage.removeItem("academicYear");
    sessionStorage.removeItem("analysisData");
    sessionStorage.removeItem("parentDepartmentes");
    sessionStorage.removeItem("academicYears");
    // Implement your logout logic here
  };

  return (
    <div className={styles.BranchAnalysis_container}>
      <div className={styles.BranchAnalysis_card}>
        <h2>Branch Feedback Analysis</h2>
        <p>
          Select a parentDepartment and academic year to analyze feedback across
          faculty members.
        </p>
        {message && (
          <div
            className={`${styles.BranchAnalysis_message} ${styles[messageType]}`}
          >
            {message}
          </div>
        )}
        <div className={styles.BranchAnalysis_inputcontainer}>
          <select
            value={parentDepartment}
            onChange={handleBranchChange}
            className={styles.BranchAnalysis_branchDropdown}
          >
            <option value="">Select Branch</option>
            {parentDepartmentes.map((br, index) => (
              <option key={index} value={br}>
                {br}
              </option>
            ))}
          </select>

          <select
            value={academicYear}
            onChange={handleAcademicYearChange}
            className={styles.BranchAnalysis_branchDropdown}
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className={styles.BranchAnalysis_searchButton}
          >
            Search
          </button>

          {analysisData.length > 0 && (
            <PDFDownloadLink
              document={
                <PdfBranchAnalysis
                  analysisData={analysisData}
                  parentDepartment={parentDepartment}
                />
              }
              fileName="Branch_Analysis_Report.pdf"
              className={styles.BranchAnalysis_pdfButton}
            >
              {({ loading }) => (loading ? "Loading PDF..." : "Download PDF")}
            </PDFDownloadLink>
          )}
        </div>

        {analysisData.length > 0 ? (
          <div className={styles.BranchAnalysis_analysisTableWrapper}>
            <table
              id="analysisTable"
              className={styles.BranchAnalysis_analysisTable}
            >
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Course Count</th>
                  <th>Student Count</th>

                  <th>Average Percentage</th>
                  <th>Feedback Remark</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.facultyName}</td>
                    <td>{data.courseCount}</td>
                    <td>{data.studentCount}</td>

                    <td>
                      {data.averagePercentage !== "0.00"
                        ? data.averagePercentage
                        : "0%"}
                    </td>
                    <td>
                      {data.averagePercentage >= 90
                        ? "Excellent"
                        : data.averagePercentage >= 80
                        ? "Very Good"
                        : data.averagePercentage >= 70
                        ? "Good"
                        : data.averagePercentage >= 60
                        ? "Satisfactory"
                        : "Need Improvement"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          messageType !== "error" && (
            <p>
              No analysis data available for the selected parentDepartment and
              academic year.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default BranchAnalysis;
