import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/FacultyFeedback.module.css";

const FacultyFeedback = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [semestersRes, branchesRes, sectionsRes, subjectsRes, coursesRes, facultiesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/semesters`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/branches`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/sections`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/subject-names`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/course-names`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/faculty-names`),
        ]);

        setSemesters(semestersRes.data);
        setBranches(branchesRes.data);
        setSections(sectionsRes.data);
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
      const params = {
        semester: selectedSemester,
        branch: selectedBranch,
        section: selectedSection,
        subjectName: selectedSubject,
        courseName: selectedCourse,
        facultyName: selectedFaculty,
      };

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/filtered`, { params });

      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setMessage("Failed to load feedbacks.");
      setMessageType("error");
    }
  };

  const handleFilterApply = () => {
    fetchFeedbacks();
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      if (!feedbackId) {
        throw new Error("Invalid feedback ID");
      }

      await axios.delete(`${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/${feedbackId}`);

      setFeedbacks(feedbacks.filter(feedback => feedback._id !== feedbackId));
      setMessage("Feedback deleted successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setMessage("Failed to delete feedback.");
      setMessageType("error");
    }
  };

  return (
    <div style={{ marginTop: '70px', marginLeft: '70px'  }}  className={styles.container}>
      <div className={styles.feedbackCard}>
        <h2>Faculty Feedback</h2>
        <p>Here you can review feedback provided by students.</p>
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}
        <div className={styles.dropdownContainer}>
          {[
            { id: 'semester', label: 'Semester', options: semesters },
            { id: 'branch', label: 'Branch', options: branches },
            { id: 'section', label: 'Section', options: sections },
            { id: 'subject', label: 'Subject', options: subjects },
            { id: 'course', label: 'Course', options: courses },
            { id: 'faculty', label: 'Faculty', options: faculties },
          ].map(({ id, label, options }) => (
            <div key={id} className={styles.dropdownItem}>
              <label htmlFor={id}>{label}:</label>
              <select
                id={id}
                value={eval(`selected${label.replace(/^\w/, c => c.toUpperCase())}`)}
                onChange={(e) => eval(`setSelected${label.replace(/^\w/, c => c.toUpperCase())}`)(e.target.value)}
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
        <button onClick={handleFilterApply} className={styles.filterButton}>Apply Filters</button>
        {feedbacks.length > 0 && (
          <table className={styles.feedbackTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Faculty Name</th>
                <th>Course Name</th>
                <th>Branch</th>
                <th>Section</th>
                <th>Semester</th>
                <th>Subject Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td>{feedback.studentId?.username || 'N/A'}</td>
                  <td>{feedback.facultyName || 'N/A'}</td>
                  <td>{feedback.courseName || 'N/A'}</td>
                  <td>{feedback.branch || 'N/A'}</td>
                  <td>{feedback.section || 'N/A'}</td>
                  <td>{feedback.semester || 'N/A'}</td>
                  <td>{feedback.subjectName || 'N/A'}</td>
                  <td>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteFeedback(feedback._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyFeedback;
