import React, { useState } from 'react';
import axios from 'axios';

const FacultyAddSchedule = () => {
  const [schedule, setSchedule] = useState({
    courseName: '',
    facultyName: '',
    dayOfWeek: '',
    startTime: '',
    endTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/class-schedules/add`, schedule);

      
      // Ensure response data exists and is correctly structured
      if (res && res.data && res.data.data) {
        alert('Class schedule added successfully');
        setSchedule({
          courseName: '',
          facultyName: '',
          dayOfWeek: '',
          startTime: '',
          endTime: ''
        });
      } else {
        console.error('Unexpected response format:', res);
        alert('Unexpected response format');
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
      alert('Error adding schedule');
    }
  };

  return (
    <div className="faculty-add-schedule">
      <h2>Add Class Schedule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={schedule.courseName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="facultyName"
          placeholder="Faculty Name"
          value={schedule.facultyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dayOfWeek"
          placeholder="Day of Week"
          value={schedule.dayOfWeek}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="startTime"
          placeholder="Start Time"
          value={schedule.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="endTime"
          placeholder="End Time"
          value={schedule.endTime}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Schedule</button>
      </form>
    </div>
  );
};

export default FacultyAddSchedule;
