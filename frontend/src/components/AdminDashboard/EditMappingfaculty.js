import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './css/faculty-timetable.module.css'; // Import CSS module for styling
import { UserContext } from '../context/UserContext'; // Assuming you have a UserContext to get the logged-in user

const TimetableList = () => {
  const { user } = useContext(UserContext); // Fetch user details from context or wherever you're storing user info
  const [timetables, setTimetables] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(user?.branch || ''); // Pre-select user branch if available
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTimetable, setEditTimetable] = useState(null); // State to manage timetable being edited
  const [formData, setFormData] = useState({
    branch: '',
    section: '',
    semester: '',
    batch: '',
    facultyName: '',
    subjectName: '',
    courseCode: '',
    type: '',
    courseAbbreviation: '',
    parentDepartment: '',
    academicYear: '',
    session: '',
  });

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/timetables/criteria`, {
          params: {
            semester: selectedSemester,
            branch: selectedBranch, // If user is from a specific branch, this will already be set
            section: selectedSection,
            batch: selectedBatch,
          }
        });
        const data = response.data;
        setTimetables(data);

        const uniqueSemesters = [...new Set(data.map(item => item.semester))];
        const uniqueBranches = [...new Set(data.map(item => item.branch))];
        const uniqueSections = [...new Set(data.map(item => item.section))];
        const uniqueBatches = [...new Set(data.map(item => item.batch))];

        setSemesters(uniqueSemesters);
        setBranches(uniqueBranches);
        setSections(uniqueSections);
        setBatches(uniqueBatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timetables:', error.response ? error.response.data : error.message);
        setError('Failed to load timetables.');
        setLoading(false);
      }
    };

    fetchTimetables();
  }, [selectedSemester, selectedBranch, selectedSection, selectedBatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/timetables/delete`, {
        params: { id },
      });
      
      setTimetables(timetables.filter(timetable => timetable._id !== id));
    } catch (error) {
      console.error('Error deleting timetable:', error.response ? error.response.data : error.message);
      setError('Error deleting timetable: ' + error.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/timetables/update/${id}`, formData);

      setTimetables(timetables.map(timetable =>
        timetable._id === id ? response.data : timetable
      ));
      setEditTimetable(null); // Reset editing state
      setFormData({
        branch: '',
        section: '',
        semester: '',
        batch: '',
        facultyName: '',
        subjectName: '',
        courseCode: '',
        type: '',
        courseAbbreviation: '',
        parentDepartment: '',
        academicYear: '',
        session: '',
      }); // Reset form data
    } catch (error) {
      console.error('Error updating timetable:', error.response ? error.response.data : error.message);
      setError('Error updating timetable: ' + error.message);
    }
  };

  const handleEditClick = (timetable) => {
    setEditTimetable(timetable);
    setFormData({
      branch: timetable.branch || '',
      section: timetable.section || '',
      semester: timetable.semester || '',
      batch: timetable.batch || '',
      facultyName: timetable.facultyName || '',
      subjectName: timetable.subjectName || '',
      courseCode: timetable.courseCode || '',
      type: timetable.type || '',
      courseAbbreviation: timetable.courseAbbreviation || '',
      parentDepartment: timetable.parentDepartment || '',
      academicYear: timetable.academicYear || '',
      session: timetable.session || '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mapping List</h1>

      <div className={styles.filters}>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">Select Semester</option>
          {semesters.map((semester, index) => (
            <option key={index} value={semester}>{semester}</option>
          ))}
        </select>

        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">Select Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>{branch}</option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">Select Section</option>
          {sections.map((section, index) => (
            <option key={index} value={section}>{section}</option>
          ))}
        </select>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">Select Batch</option>
          {batches.map((batch, index) => (
            <option key={index} value={batch}>{batch}</option>
          ))}
        </select>
      </div>

      {editTimetable && (
        <div className={styles.editForm}>
          <h2>Edit Mapping</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editTimetable._id); }}>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleFormChange}
              placeholder="Branch"
            />
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleFormChange}
              placeholder="Section"
            />
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleFormChange}
              placeholder="Semester"
            />
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleFormChange}
              placeholder="Batch"
            />
            <input
              type="text"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleFormChange}
              placeholder="Faculty Name"
            />
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleFormChange}
              placeholder="Subject Name"
            />
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleFormChange}
              placeholder="Course Code"
            />
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleFormChange}
              placeholder="Type"
            />
            <input
              type="text"
              name="courseAbbreviation"
              value={formData.courseAbbreviation}
              onChange={handleFormChange}
              placeholder="Time"
            />
            <input
              type="text"
              name="parentDepartment"
              value={formData.parentDepartment}
              onChange={handleFormChange}
              placeholder="Room"
            />
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleFormChange}
              placeholder="Academic Year"
            />
            <input
              type="text"
              name="session"
              value={formData.session}
              onChange={handleFormChange}
              placeholder="Session"
            />
            <button type="submit" className={styles.update}>Update Timetable</button>
            <button type="button" onClick={() => setEditTimetable(null)} className={styles.cancel}>Cancel</button>
          </form>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Branch</th>
              <th>Section</th>
              <th>Semester</th>
              <th>Batch</th>
              <th>Faculty Name</th>
              <th>Subject Name</th>
              <th>Course Code</th>
              <th>Type</th>
              <th>Time</th>
              <th>Room</th>
              <th>Academic Year</th>
              <th>Session</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.length > 0 ? (
              timetables.map((timetable) => (
                <tr key={timetable._id}>
                  <td>{timetable.branch}</td>
                  <td>{timetable.section}</td>
                  <td>{timetable.semester}</td>
                  <td>{timetable.batch}</td>
                  <td>{timetable.facultyName}</td>
                  <td>{timetable.subjectName}</td>
                  <td>{timetable.courseCode}</td>
                  <td>{timetable.type}</td>
                  <td>{timetable.courseAbbreviation}</td>
                  <td>{timetable.parentDepartment}</td>
                  <td>{timetable.academicYear}</td>
                  <td>{timetable.session}</td>
                  <td>
                    <button className={styles.delete} onClick={() => handleDelete(timetable._id)}>Delete</button>
                    <button className={styles.update} onClick={() => handleEditClick(timetable)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13">No timetables found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableList;
