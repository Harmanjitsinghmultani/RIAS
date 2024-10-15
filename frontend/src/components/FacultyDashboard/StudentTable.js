import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/StudentTable.css'; // Import the CSS file

const StudentTable = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    semester: '',
    branch: '',
    section: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [semestersRes, branchesRes, sectionsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/semesters`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/branches`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/sections`),
        ]);

        setSemesters(semestersRes.data || []);
        setBranches(branchesRes.data || []);
        setSections(sectionsRes.data || []);
      } catch (error) {
        console.error('Error fetching options:', error.response ? error.response.data : error.message);
        setError('Failed to load filter options.');
      }
    };

    fetchOptions();
  }, []); // Empty dependency array to run once on component mount

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { semester, branch, section } = filters;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/students/criteria`, {
          params: { semester, branch, section }
        });
        setStudents(response.data || []);
      } catch (error) {
        console.error('Error fetching students:', error.response ? error.response.data : error.message);
        setError('Failed to load students.');
      }
    };

    if (filters.semester || filters.branch || filters.section) {
      fetchStudents();
    }
  }, [filters]); // Depend on filters to trigger re-fetching when filters change

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="student-table-container">
      <h1 className="student-table-title">Student Table</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="filter-container">
        <label>
          Semester:
          <select name="semester" onChange={handleFilterChange} value={filters.semester}>
            
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </label>
        <label>
          Branch:
          <select name="branch" onChange={handleFilterChange} value={filters.branch}>
            
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </label>
        <label>
          Section:
          <select name="section" onChange={handleFilterChange} value={filters.section}>
            
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </label>
      </div>
      <table className="student-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Semester</th>
            <th>Branch</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student._id}>
                <td>{student.username}</td>
                <td>{student.email}</td>
                <td>{student.semester}</td>
                <td>{student.branch}</td>
                <td>{student.section}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
