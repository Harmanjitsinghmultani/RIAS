import React, { useState, useEffect } from "react";
import styles from "./CSS/elective.module.css"; // Import the CSS module

const StudentTimetable = () => {
  const [profileData, setProfileData] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [electives, setElectives] = useState([]); // State for available electives from API
  const [selectedElectives, setSelectedElectives] = useState([]); // State for selected electives
  const [tempSelectedElectives, setTempSelectedElectives] = useState([]); // Temp state for selected electives
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Decode the token to get the user ID
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;

      // Fetch the user profile data
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
        setSelectedElectives(data.electives || []); // Set previously selected electives
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Error fetching profile data. Please try again later.");
    }
  };

  // Fetch timetable data
  const fetchTimetableData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/timetables`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      if (response.ok) {
        const data = await response.json();
        setTimetableData(data);
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      setError("Error fetching timetable data. Please try again later.");
    }
  };

  // Fetch available electives from the API
  const fetchElectives = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const userBranch = profileData?.branch; // Ensure profileData is loaded

      if (!userBranch) return; // Skip if profileData is not loaded yet

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/electives?branch=${userBranch}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      if (response.ok) {
        const data = await response.json();
        setElectives(data); // Set electives as an array of strings
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching electives:", error);
      setError("Error fetching electives. Please try again later.");
    }
  };

  // Handle elective selection
  const handleElectivesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setTempSelectedElectives(selectedOptions);
  };

  // Handle adding selected electives
  const handleAddElectives = async () => {
    const updatedElectives = [...selectedElectives, ...tempSelectedElectives];

    try {
      const token = localStorage.getItem("token");
      const userId = profileData._id;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/user/${userId}/select-elective`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ electives: updatedElectives }), // Send all selected electives as an array
        }
      );
      

      const responseData = await response.json();

      if (response.ok) {
        alert("Electives added successfully!");
        window.location.reload(); // Reload the page after successful addition
      } else {
        throw new Error(`Failed to add electives: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error adding electives:", error);
      setError("Error adding electives. Please try again later.");
    }
  };

  // Handle elective deletion
  const handleElectiveDeletion = async (electiveToRemove) => {
    try {
      const token = localStorage.getItem("token");
      const userId = profileData._id;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/user/${userId}/remove-elective`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ electiveToRemove }), // Send the elective to remove
        }
      );
      

      const responseData = await response.json();

      if (response.ok) {
        alert("Elective removed successfully!");
        window.location.reload(); // Reload the page after successful deletion
      } else {
        throw new Error(`Failed to remove elective: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error removing elective:", error);
      setError("Error removing elective. Please try again later.");
    }
  };

  // Filter timetable data based on profile data and electives
  useEffect(() => {
    if (profileData && timetableData.length > 0) {
      const filtered = timetableData.filter(
        (entry) =>
          entry.branch === profileData.branch &&
          entry.section === profileData.section &&
          entry.semester === profileData.semester &&
          (entry.batch === "Not Required" ||
            entry.batch === profileData.batch ||
            entry.batch === "") &&
          (!entry.isElective ||
            profileData.electives.includes(entry.subjectName))
      );
      setFilteredTimetable(filtered);
    }
  }, [profileData, timetableData]);

  // Fetch both profile, electives, and timetable data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfileData();
        await fetchTimetableData();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch electives after profile is fetched
  useEffect(() => {
    if (profileData) {
      fetchElectives();
    }
  }, [profileData]);

  return (
    <div className={styles.studentTimetableContainer}>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.alertError}>{error}</div>
      ) : (
        <div className={styles.flexContainer}>
          {/* Left side: Selected Electives - 30% */}
          <div className={styles.electiveSection}>
            <h2>Selected Electives</h2>
            <div className={styles.electiveInputSection}>
              <select
                name="electives"
                value={tempSelectedElectives}
                onChange={handleElectivesChange}
                className={styles.registerInput}
              >
                <option value="">Select an Elective</option>
                {electives.map((elective, index) => (
                  <option key={index} value={elective}>
                    {elective}
                  </option>
                ))}
              </select>
              <button
                className={styles.addElectivesButton}
                onClick={handleAddElectives}
              >
                Add
              </button>
            </div>

            {selectedElectives.length > 0 && (
              <table className={styles.electiveTable}>
                <thead>
                  <tr>
                    <th>Elective</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {selectedElectives.map((elective, index) =>
            index !== 0 ? ( // Skip rendering the first row (index 0)
              <tr key={index} className={styles.selectedElectiveItem}>
                <td>{elective}</td>
                <td>
                  <button
                    className={styles.deleteElectiveButton}
                    onClick={() => handleElectiveDeletion(elective)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ) : null // Skip rendering this row
          )}
        </tbody>
      </table>
            )}
          </div>

          {/* Right side: Timetable - 70% */}
          <div className={styles.timetableSection}>
            <h2>Student Timetable</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.combinedTable}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Branch</th>
                    <th>Faculty</th>
                    <th>Course Code</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTimetable.map((entry, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      }
                    >
                      <td>{entry.type || "N/A"}</td>
                      <td>{entry.courseAbbreviation || "N/A"}</td>
                      <td>{entry.subjectName || "N/A"}</td>
                      <td>{entry.parentDepartment || "N/A"}</td>
                      <td>{entry.facultyName || "N/A"}</td>
                      <td>{entry.courseCode || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
