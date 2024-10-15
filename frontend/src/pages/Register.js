import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FacultyImage from "../assets/faculty.png";
import StudentImage from "../assets/student.png";
import "../css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    registrationNumber: "",
    semester: "",
    branch: "",
    section: "",
    rollNumber: "",
    password: "",
    role: "",
    batch: "",
    session: "", // Added state for session dropdown
    academicYear: "", // Added state for academicYear dropdown
    electives: [], // Added state for electives
  });

  const navigate = useNavigate();

  const {
    username,
    email,
    mobileNumber,
    registrationNumber,
    semester,
    branch,
    section,
    rollNumber,
    password,
    role,
    batch,
    session,
    academicYear,
    electives, // Destructure electives state
  } = formData;

  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add("body-register-page");

    // Remove class from body when component unmounts
    return () => {
      document.body.classList.remove("body-register-page");
    };
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBatchChange = (e) => {
    setFormData({ ...formData, batch: e.target.value });
  };

  const handleSessionChange = (e) => {
    setFormData({ ...formData, session: e.target.value });
  };

  const handleAcademicYearChange = (e) => {
    setFormData({ ...formData, academicYear: e.target.value });
  };

  const handleElectivesChange = (e) => {
    const selectedElectives = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, electives: selectedElectives });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/register",
        formData
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const selectRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  return (
    <div className="register-container">
      <div className="register-card-container">
        <div className="register-column register-role-column">
          <div className="register-role-card">
            <img
              src={FacultyImage}
              alt="Faculty Role"
              className={`register-role-button ${
                role === "faculty" ? "register-selected-role-button" : ""
              }`}
              onClick={() => selectRole("faculty")}
            />
            <img
              src={StudentImage}
              alt="Student Role"
              className={`register-role-button ${
                role === "student" ? "register-selected-role-button" : ""
              }`}
              onClick={() => selectRole("student")}
            />
          </div>
        </div>

        <div className="register-column register-form-column">
          <div className="register-register-card">
            <div className="register-title">
              <b>Register Page</b>
            </div>
            <div className="register-form-wrapper">
              <form onSubmit={onSubmit}>
                <label htmlFor="email" className="register-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Email"
                  className="register-input"
                />

                <label htmlFor="username" className="register-label">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChange}
                  placeholder="Username"
                  className="register-input"
                />

                <label htmlFor="mobileNumber" className="register-label">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={mobileNumber}
                  onChange={onChange}
                  placeholder="Mobile Number"
                  className="register-input"
                />

                <label htmlFor="registrationNumber" className="register-label">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={registrationNumber}
                  onChange={onChange}
                  placeholder="Registration Number"
                  className="register-input"
                />

                <label htmlFor="semester" className="register-label">
                  Semester
                </label>
                <select
                  name="semester"
                  value={semester}
                  onChange={onChange}
                  className="register-input"
                >
                  <option value="">Select Semester</option>
                  {[...Array(8)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <label htmlFor="session" className="register-label">
                  Session
                </label>
                <select
                  name="session"
                  value={session}
                  onChange={handleSessionChange}
                  className="register-input"
                >
                  <option value="">Select Session</option>
                  <option value="Winter">Winter</option>
                  <option value="Summer">Summer</option>
                </select>

                <label htmlFor="academicYear" className="register-label">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  value={academicYear}
                  onChange={handleAcademicYearChange}
                  className="register-input"
                >
                  <option value="">Select Academic Year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>

                <label htmlFor="electives" className="register-label">
                  Elective Subjects
                </label>
                <select
                  name="electives"
                  value={electives}
                  onChange={handleElectivesChange}
                  className="register-input"
                  multiple
                >
                  <option value="AI">Artificial Intelligence</option>
                  <option value="ML">Machine Learning</option>
                  <option value="DS">Data Science</option>
                  <option value="CyberSec">Cyber Security</option>
                  <option value="IoT">Internet of Things</option>
                </select>

                <label htmlFor="branch" className="register-label">
                  Branch
                </label>
                <select
                  name="branch"
                  value={branch}
                  onChange={onChange}
                  className="register-input"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IOT">IOT</option>
                  <option value="AIML">AIML</option>
                  <option value="AI">AI</option>
                  <option value="DATA SCIENCE">DATA SCIENCE</option>
                  <option value="MECHANICAL">MECHANICAL</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="ELECTRICAL">ELECTRICAL</option>
                  <option value="ETRX">ETRX</option>
                </select>

                <label htmlFor="section" className="register-label">
                  Section
                </label>
                <select
                  name="section"
                  value={section}
                  onChange={onChange}
                  className="register-input"
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>

                <label htmlFor="batch" className="register-label">
                  Practical Batch
                </label>
                <select
                  name="batch"
                  value={batch}
                  onChange={handleBatchChange}
                  className="register-input"
                >
                  <option value="">Select Practical Batch</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>

                <label htmlFor="rollNumber" className="register-label">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={rollNumber}
                  onChange={onChange}
                  placeholder="Roll Number"
                  className="register-input"
                />

                <label htmlFor="password" className="register-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Password"
                  className="register-input"
                />

                <label htmlFor="role" className="register-label">
                  Role
                </label>
                <select
                  name="role"
                  value={role}
                  onChange={onChange}
                  className="register-input"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="class-teacher">Class Teacher</option>
                </select>

                <div className="regbutton">
                  <button type="submit" className="register-button">
                    Register
                  </button>
                </div>
              </form>
            </div>
            <div className="regbutton">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="register-login-button"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
