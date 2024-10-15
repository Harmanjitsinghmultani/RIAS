// FacultyTable.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/FacultyRegisterTableView.module.css'; // Import your CSS module

const FacultyTable = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Fetch faculty data
  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/facultyregister/faculty`);

      setFacultyList(response.data);
    } catch (error) {
      displayAlert('Error fetching faculty data');
      console.error(error);
    }
  };

  // Delete faculty
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/facultyregister/faculty/delete/${id}`);

      displayAlert('Faculty deleted successfully');
      fetchFaculty(); // Refresh the faculty list
    } catch (error) {
      displayAlert('Error deleting faculty');
      console.error(error);
    }
  };

  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  useEffect(() => {
    fetchFaculty(); // Fetch data on component mount
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Faculty List</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Faculty Name</th>
            <th>Subject Name</th>
            <th>Course Code</th>
            <th>Branch</th>

            <th>Session</th>
            <th>Parent Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {facultyList.map((faculty) => (
            <tr key={faculty._id}>
              <td>{faculty.facultyName}</td>
              <td>{faculty.subjectName}</td>
              <td>{faculty.courseCode}</td>
              <td>{faculty.branch}</td>

              <td>{faculty.session}</td>
              <td>{faculty.parentDepartment}</td>
              <td>
               <button onClick={() => handleDelete(faculty._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAlert && (
        <div className={styles.alert}>
          <div className={styles.alertContent}>
            <span>{alertMessage}</span>
            <button onClick={closeAlert} className={styles.alertClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyTable;
