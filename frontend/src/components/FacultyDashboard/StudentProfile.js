import React, { useState, useEffect } from "react";
import StudentImage from "../../assets/student.png";
import "./css/StudentProfile.css";

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    registrationNumber: "",
    semester: "",
    branch: "",
    section: "",
    rollNumber: "",
  });
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Extract user ID from the token
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;

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
        setProfileData(data);
        setFormData({
          name: data.username || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          registrationNumber: data.registrationNumber || "",
          semester: data.semester || "",
          branch: data.branch || "",
          section: data.section || "",
          rollNumber: data.rollNumber || "",
        });
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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
    );
    

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setIsEditing(false);
      } else if (response.status === 404) {
        setError("Profile not found.");
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile. Please try again later.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset formData to profileData
    setFormData({
      name: profileData?.username || "",
      email: profileData?.email || "",
      mobileNumber: profileData?.mobileNumber || "",
      registrationNumber: profileData?.registrationNumber || "",
      semester: profileData?.semester || "",
      branch: profileData?.branch || "",
      section: profileData?.section || "",
      rollNumber: profileData?.rollNumber || "",
    });
  };

  return (
    <div className="profile-container">
      {error && <div className="error">{error}</div>}
      <h2>Faculty Profile</h2>
      <div className="profile-boxes">
        <div className="profile-square">
          <div>
            <strong>Profile Picture:</strong>
            <img src={StudentImage} alt="Profile" className="profile-picture" />
          </div>

          <div className="profile-detail">
            <strong>Name:</strong>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            ) : (
              <span>{profileData ? profileData.username : "Loading..."}</span>
            )}
          </div>

          <div className="profile-detail">
            <strong>Email:</strong>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              <span>{profileData ? profileData.email : "Loading..."}</span>
            )}
          </div>

          <div className="profile-detail">
            <strong>Mobile Number:</strong>
            {isEditing ? (
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            ) : (
              <span>
                {profileData ? profileData.mobileNumber : "Loading..."}
              </span>
            )}
          </div>

          <div className="profile-detail">
            <strong>Registration Number:</strong>
            {isEditing ? (
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            ) : (
              <span>
                {profileData ? profileData.registrationNumber : "Loading..."}
              </span>
            )}
          </div>
        </div>

        <div className="profile-square">
          <div className="profile-detail">
            <strong>Password:</strong>
            <span className="profile-data">
              {profileData ? profileData.password : "Not available"}
            </span>
          </div>
          <div className="profile-detail">
            <strong>Role:</strong>
            <span className="profile-data">
              {profileData ? profileData.role : "Not available"}
            </span>
          </div>
          <div className="profile-detail">
            <strong>Approval Status:</strong>
            <span className="profile-data">
              {profileData
                ? profileData.isApproved
                  ? "Approved"
                  : "Not Approved"
                : "Not available"}
            </span>
          </div>

          <div className="profile-detail">
            <strong>Semester:</strong>
            {isEditing ? (
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              />
            ) : (
              <span>{profileData ? profileData.semester : "Loading..."}</span>
            )}
          </div>

          <div className="profile-detail">
            <strong>Branch:</strong>
            {isEditing ? (
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              />
            ) : (
              <span>{profileData ? profileData.branch : "Loading..."}</span>
            )}
          </div>

          <div className="profile-detail">
            <strong>Section:</strong>
            {isEditing ? (
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
              />
            ) : (
              <span>{profileData ? profileData.section : "Loading..."}</span>
            )}
          </div>

          <div className="profile-detail">
            <strong>Roll Number:</strong>
            {isEditing ? (
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
              />
            ) : (
              <span>{profileData ? profileData.rollNumber : "Loading..."}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        {isEditing ? (
          <>
            <button className="save" onClick={handleSave}>
              Save
            </button>
            <button className="cancel" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
