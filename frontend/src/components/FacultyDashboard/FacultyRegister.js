import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./css/FacultyRegister.module.css"; // Import the CSS Module

const FacultyRegister = () => {
  const [formData, setFormData] = useState({
    facultyName: "",
    subjectName: "",
    courseCode: "",
    branch: "",
    semester: "",
    academicYear: "",
    session: "",
    parentDepartment: "",
  });

  const [csvFile, setCsvFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/facultyregister/create/faculty`,
        formData
      );
      displayAlert("Faculty registered successfully");
    } catch (error) {
      console.error(error);
      displayAlert("Error registering faculty");
    }
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("F--rege-view");
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      displayAlert("Please select a CSV file to upload.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvData = event.target.result;

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/csv/upload-faculty-csv`,
          { csvData },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          displayAlert("Faculty data uploaded successfully from CSV");
        } else {
          displayAlert("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Error message:", error.message);
        displayAlert("Error uploading faculty data from CSV.");
      }
    };

    reader.onerror = () => {
      displayAlert("Error reading the CSV file.");
    };

    reader.readAsText(csvFile);
  };

  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.header}>Register Faculty</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.partition}>
          <div className={styles.field}>
            <label className={styles.label}>Faculty Name:</label>
            <input
              type="text"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Subject Name:</label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Course Code:</label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Branch:</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.partition}>
          <div className={styles.field}>
            <label className={styles.label}>Semester:</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Academic Year:</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Session:</label>
            <input
              type="text"
              name="session"
              value={formData.session}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Parent Department:</label>
            <input
              type="text"
              name="parentDepartment"
              value={formData.parentDepartment}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>
      </form>
      <button onClick={handleSubmit} className={styles.submit}>
        Register
      </button>
      <button onClick={handleNavigate} className={styles.submit}>
        View Registered Faculty
      </button>

      <h2 className={styles.header}>Upload Faculty CSV</h2>
      <form
        style={{ marginLeft: "400px" }}
        onSubmit={handleCsvUpload}
        className={styles.form}
      >
        <div className={styles.field}>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitt}>
          Upload CSV
        </button>
      </form>

      {showAlert && (
        <div className={styles.alert}>
          <div className={styles.alertContent}>
            <span>{alertMessage}</span>
            <button onClick={closeAlert} className={styles.alertClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyRegister;
