import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/faculty-timetable.module.css'; // Import CSS module for styling

const TimetableList = () => {
  const [timetables, setTimetables] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(''); // Automatically set to user's branch
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTimetable, setEditTimetable] = useState(null); // State to manage timetable being edited
  const [userBranch, setUserBranch] = useState(''); // Store the user's branch
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

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId"); // Get userId from localStorage or other storage
      const token = localStorage.getItem("token"); // Get token from localStorage or other storage

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserBranch(data.branch); // Set the user's branch
          setSelectedBranch(data.branch); // Set selected branch automatically
        } else if (response.status === 404) {
          setError("Profile not found.");
        } else {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Error fetching profile data. Please try again later.");
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch timetables when branch or other filters change
  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/timetables/criteria`, {
          params: {
            semester: selectedSemester,
            branch: selectedBranch, // Only fetch for the selected (or user's) branch
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

    if (selectedBranch) {
      fetchTimetables(); // Fetch timetables only after the branch is set
    }
  }, [selectedSemester, selectedBranch, selectedSection, selectedBatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/timetables/delete`, {
        params: { id }
      });
      
      setTimetables(timetables.filter(timetable => timetable._id !== id));
    } catch (error) {
      console.error('Error deleting timetable:', error.response ? error.response.data : error.message);
      setError('Error deleting timetable: ' + error.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/timetables/update/${id}`,
        formData
      );
      
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
      <h1 className={styles.title}>Timetable List</h1>

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

        {/* Pre-select the user's branch and disable the branch dropdown */}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className={styles.dropdown}
          disabled={true} // Disable the dropdown for branch selection
        >
          <option value={userBranch}>{userBranch}</option>
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
          <h2>Edit Timetable</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editTimetable._id); }}>
            {/* Edit form fields */}
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleFormChange}
              placeholder="Branch"
            />
            {/* Add other form inputs similarly */}
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
              <th>Parent Department</th>
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
