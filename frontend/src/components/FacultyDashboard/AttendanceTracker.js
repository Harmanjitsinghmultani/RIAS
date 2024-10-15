// src/components/Faculty/AttendanceTracker.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceTracker = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    // Fetch students list
    axios.get('/api/users').then(response => setStudents(response.data));
  }, []);

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const submitAttendance = () => {
    axios.post('/api/attendance', { attendance }).then(response => {
      // Handle success
    }).catch(error => {
      // Handle error
    });
  };

  return (
    <div>
      <h1>Attendance Tracker</h1>
      <ul>
        {students.map(student => (
          <li key={student._id}>
            {student.name}
            <input 
              type="checkbox" 
              checked={attendance[student._id] || false}
              onChange={e => handleAttendanceChange(student._id, e.target.checked)} 
            />
          </li>
        ))}
      </ul>
      <button onClick={submitAttendance}>Submit Attendance</button>
    </div>
  );
};

export default AttendanceTracker;
