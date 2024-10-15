import React, { useState, useEffect } from 'react';
import './CSS/StudentTimetable.css'; // Import the updated CSS file

const StudentTimetable = () => {
  const [profileData, setProfileData] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch student profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Extract user ID from the token
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/user/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Error fetching profile data. Please try again later.');
    }
  };

  // Fetch timetable data
  const fetchTimetableData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/timetables`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTimetableData(data);
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setError('Error fetching timetable data. Please try again later.');
    }
  };

  // Filter timetable data based on profile data
  useEffect(() => {
    if (profileData && timetableData.length > 0) {
      const filtered = timetableData.filter(entry =>
        entry.branch === profileData.branch &&
        entry.section === profileData.section &&
        entry.semester === profileData.semester &&
        (entry.batch === "Not Required" || entry.batch === profileData.batch || entry.batch === "")
      );
      setFilteredTimetable(filtered);
    }
  }, [profileData, timetableData]);

  // Fetch both profile and timetable data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfileData();
        await fetchTimetableData();
        setLoading(false); // Loading is complete
      } catch (error) {
        setLoading(false); // Ensure loading stops even if there's an error
      }
    };
    fetchData();
  }, []);

  return (
    <div className="student-timetable-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <>
          <h2>Student Timetable</h2>
          {filteredTimetable.length > 0 ? (
            <table className="timetable-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Room</th>
                  <th>Faculty</th>
                  <th>Course Code</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimetable.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.type || 'N/A'}</td>
                    <td>{entry.courseAbbreviation || 'N/A'}</td>
                    <td>{entry.subjectName || 'N/A'}</td>
                    <td>{entry.parentDepartment || 'N/A'}</td>
                    <td>{entry.facultyName || 'N/A'}</td>
                    <td>{entry.courseCode || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-timetable-message">No timetable available for the specified criteria.</div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentTimetable;