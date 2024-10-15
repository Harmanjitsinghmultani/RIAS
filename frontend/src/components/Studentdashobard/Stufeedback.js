import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./CSS/Stufeedback.css";

const theoryQuestions = [
  // Add your theory questions here
  "The lecture effectively covered with fundamental concepts and  clear examples, and faculty has command over the subject",
  "Challenging topics were explained with clarity and careful attention",
  "The teacher communicated the lecture effectively",
  "Encouraged students to ask questions to enhance interactivity",
  "Well-prepared lecture with organized structure and course material",
  "Clear and well-organized blackboard writing",
  "Effective use of audio-visual aids",
  "The teacher was readily available for guidance and support outside class hours",
  "CAE questions were discussed in class, and answer sheets were shown",
  "Fair and impartial evaluations helped improve students",
];


const practicalQuestions = [
  "The experiments aligned well with the theory",
  "Faculty demonstrated practicals using machines, equipment, and software",
  "The experiment led to clear conclusions and interpretations",
  "The teacher assisted students in understanding the experiment's outcomes and addressing difficulties",
  "The experimental setup was well-maintained, fully operational, and adequate",
  "The teacher regularly assesses experiments and provides feedback",
  "The lab session effectively clarified students' theoretical knowledge",
  "Practical marks were awarded after each experiment",
  "Students are confident in using concepts and instruments for further studies",
  "Clear, updated, and self-explanatory lab manuals were provided",
];
const FeedbackForm = () => {
  const [profileData, setProfileData] = useState(null);
  const [theoryTimetableData, setTheoryTimetableData] = useState([]);
  const [filteredTheoryTimetable, setFilteredTheoryTimetable] = useState([]);
  const [practicalTimetableData, setPracticalTimetableData] = useState([]);
  const [filteredPracticalTimetable, setFilteredPracticalTimetable] = useState(
    []
  );
  const [responses, setResponses] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate(); // Define useNavigate

  function enableDragging() {
    const card = document.querySelector(".student-dashboard-feedback-card");
    if (card) {
      let isDragging = false;
      let offsetX, offsetY;

      // Mouse down event
      card.addEventListener("mousedown", (e) => {
        if (e.ctrlKey) {
          // Check if Ctrl key is pressed
          isDragging = true;
          offsetX = e.clientX - card.getBoundingClientRect().left;
          offsetY = e.clientY - card.getBoundingClientRect().top;
          card.style.cursor = "grabbing"; // Change cursor to grabbing
          e.preventDefault(); // Prevent default action to avoid any interference
        }
      });

      // Mouse move event
      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          const left = e.clientX - offsetX;
          const top = e.clientY - offsetY;

          // Update card's position
          card.style.left = `${Math.max(0, left)}px`; // Ensure card stays within viewport bounds
          card.style.top = `${Math.max(0, top)}px`; // Ensure card stays within viewport bounds
        }
      });

      // Mouse up event
      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          card.style.cursor = "grab"; // Change cursor back to grab
        }
      });

      // Key up event to reset dragging state if Ctrl is released
      document.addEventListener("keyup", (e) => {
        if (e.key === "Control") {
          isDragging = false;
          card.style.cursor = "grab"; // Change cursor back to grab
        }
      });
    }
  }

  // Initialize dragging functionality
  enableDragging();

  // Define handleLogout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // Use navigate to redirect to login
  };

  const validateForm = () => {
    let errors = {};

    // Validate theory questions
    theoryQuestions.forEach((question, questionIndex) => {
      filteredTheoryTimetable.forEach((item, timetableIndex) => {
        const fieldKey = `theory_${timetableIndex}_${questionIndex}`;
        // Check if the response is undefined or an empty string, not just falsy
        if (responses[fieldKey] === undefined || responses[fieldKey] === "") {
          errors[fieldKey] = "This field is required";
        }
      });
    });

    // Validate practical questions
    practicalQuestions.forEach((question, questionIndex) => {
      filteredPracticalTimetable.forEach((item, timetableIndex) => {
        const fieldKey = `practical_${timetableIndex}_${questionIndex}`;
        // Check if the response is undefined or an empty string, not just falsy
        if (responses[fieldKey] === undefined || responses[fieldKey] === "") {
          errors[fieldKey] = "This field is required";
        }
      });
    });

    setValidationErrors(errors);

    // Return true if there are no validation errors
    return Object.keys(errors).length === 0;
  };

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

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
        setTheoryTimetableData(data.filter((item) => item.type === "Theory"));
        setPracticalTimetableData(
          data.filter((item) => item.type === "Practical")
        );
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching timetable data:", error);
      setError("Error fetching timetable data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchTimetableData();
  }, []);

  useEffect(() => {
    if (profileData) {
      const filterData = (timetable) => {
        return timetable.filter(
          (item) =>
            item.branch === profileData.branch &&
            item.section === profileData.section &&
            item.semester === profileData.semester &&
            (!item.isElective || profileData.electives.includes(item.subjectName))&&
            (!profileData.batch ||
              item.batch === "" ||
              item.batch === "Not Required" ||
              item.batch === profileData.batch)
        );
      };

      setFilteredTheoryTimetable(filterData(theoryTimetableData));
      setFilteredPracticalTimetable(filterData(practicalTimetableData));
    }
  }, [profileData, theoryTimetableData, practicalTimetableData]);

  const handleChange = (event, questionIndex, timetableIndex, type) => {
    const { value } = event.target;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [`${type}_${timetableIndex}_${questionIndex}`]: parseInt(value, 10) || 0,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowConfirmPopup(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmPopup(false);

    // Validate form before submission
    const isValid = validateForm();
    if (!isValid) {
      setError("Please fill in all required fields.");
      setPendingSubmit(false); // Stop the pending state
      return;
    }

    setPendingSubmit(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const studentId = decodedToken.id;

      // Function to generate feedback entries
      const generateFeedbackEntries = (filteredTimetable, questions, type) => {
        return filteredTimetable.map((item, timetableIndex) => ({
          facultyName: item.facultyName,
          courseName: item.subjectName,
          branch: item.branch,
          section: item.section,
          semester: item.semester,
          batch: item.batch,
          subjectName: item.subjectName,
          courseCode: item.courseCode,
          parentDepartment: item.parentDepartment,
          academicYear: item.academicYear,
          courseAbbreviation: item.courseAbbreviation,
          responses: questions.reduce(
            (acc, question, questionIndex) => ({
              ...acc,
              [`${timetableIndex}_${question}`]:
                responses[`${type}_${timetableIndex}_${questionIndex}`] || 0,
            }),
            {}
          ),
        }));
      };

      // Generate entries for both theory and practical
      const theoryFeedbackEntries = generateFeedbackEntries(
        filteredTheoryTimetable,
        theoryQuestions,
        "theory"
      );
      const practicalFeedbackEntries = generateFeedbackEntries(
        filteredPracticalTimetable,
        practicalQuestions,
        "practical"
      );

      // Submit both feedbacks in parallel
      const [theoryResponse, practicalResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/feedback/theory/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            feedbackEntries: theoryFeedbackEntries,
          }),
        }),
        fetch(`${process.env.REACT_APP_API_URL}/api/feedback/practical/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            feedbackEntries: practicalFeedbackEntries,
          }),
        })
      ]);
      

      // Check if any response indicates an error
      if (!theoryResponse.ok) {
        const theoryError = await theoryResponse.json();
        console.error("Theory submission error:", theoryError);
        throw new Error(
          theoryError.message || "Failed to submit theory feedback"
        );
      }

      if (!practicalResponse.ok) {
        const practicalError = await practicalResponse.json();
        console.error("Practical submission error:", practicalError);
        throw new Error(
          practicalError.message || "Failed to submit practical feedback"
        );
      }

      setSuccess("Theory and Practical feedback submitted successfully!");
      setError("");
    } catch (err) {
      console.error("Error:", err); // Log the full error object
      setError(err.message || "Error submitting feedback. Please try again.");
      setSuccess("");
    } finally {
      setPendingSubmit(false); // Stop the pending state after completion
    }
  };

  const cancelSubmit = () => {
    setShowConfirmPopup(false);
  };

  const styles = {
    th: { padding: "10px", border: "1px solid #ddd" },
    td: { padding: "10px", border: "1px solid #ddd" },
    select: { width: "100px" },
  };
  return (
    <div
      style={{ height: "690px" }}
      className="student-dashboard-feedback-card"
    >
      {success && (
        <p className="student-dashboard-success-message">{success}</p>
      )}
      <div className="student-dashboard-feedback-content">
        <h2 className="student-dashboard-feedback-title">RIAS Feedback Form</h2>
        {error && <p className="student-dashboard-error-message">{error}</p>}
        {profileData && (
          <div className="student-dashboard-profile-info">
            <p>
              <strong>Student Name:</strong> {profileData.username}
            </p>
            <p>
              <strong>Branch:</strong> {profileData.branch}
            </p>
            <p>
              <strong>Section:</strong> {profileData.section}
            </p>
            <p>
              <strong>Semester:</strong> {profileData.semester}
            </p>
            <p>
              <strong>Registration Number:</strong>{" "}
              {profileData.registrationNumber}
            </p>
          </div>
        )}
        <table class="horizontal-scale-table">
          <tr>
            <th class="horizontal-scale-th">Scale</th>
            <td class="horizontal-scale-td">4</td>
            <td class="horizontal-scale-td">3</td>
            <td class="horizontal-scale-td">2</td>
            <td class="horizontal-scale-td">1</td>
            <td class="horizontal-scale-td">0</td>
          </tr>
          <tr>
            <th class="horizontal-scale-th">Remark</th>
            <td class="horizontal-scale-td">Excellent</td>
            <td class="horizontal-scale-td">Very Good</td>
            <td class="horizontal-scale-td">Good</td>
            <td class="horizontal-scale-td">Satisfactory</td>
            <td class="horizontal-scale-td">Needs Improvement</td>
          </tr>
        </table>

        {filteredTheoryTimetable.length > 0 && (
          <>
            <h4 className="student-dashboard-timetable-title">
              Theory Timetable
            </h4>
            <table className="student-dashboard-timetable-table">
              <thead>
                <tr>
                  <th className="student-dashboard-timetable-th">S.N.</th>
                  <th className="student-dashboard-timetable-th">Subject</th>
                  <th className="student-dashboard-timetable-th">Faculty</th>
                  <th className="student-dashboard-timetable-th">Type</th>
                  <th className="student-dashboard-timetable-th">
                    Course Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTheoryTimetable.map((item, index) => (
                  <tr key={item._id}>
                    <td className="student-dashboard-timetable-td">
                      {index + 1}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.subjectName}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.facultyName}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.type}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.courseCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="student-dashboard-feedback-form-title">
              Theory Feedback Form
            </h2>
            <form onSubmit={(e) => handleSubmit(e, "theory")}>
              <table className="student-dashboard-feedback-table">
                <thead>
                  <tr>
                    <th className="student-dashboard-feedback-th">S.N.</th>
                    <th className="student-dashboard-feedback-th">
                      Theory Factors
                    </th>
                    {filteredTheoryTimetable.map((item, index) => (
                      <th
                        key={item._id}
                        className="student-dashboard-feedback-th"
                      >
                        {item.courseAbbreviation}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {theoryQuestions.map((question, questionIndex) => (
                    <tr key={questionIndex}>
                      <td className="student-dashboard-feedback-td">
                        {questionIndex + 1}
                      </td>
                      <td className="student-dashboard-feedback-question">
                        {question}
                      </td>
                      {filteredTheoryTimetable.map((item, timetableIndex) => (
                        <td
                          key={`${timetableIndex}_${questionIndex}`}
                          className="student-dashboard-feedback-td"
                        >
                          <select
                            value={
                              responses[
                                `theory_${timetableIndex}_${questionIndex}`
                              ] !== undefined
                                ? responses[
                                    `theory_${timetableIndex}_${questionIndex}`
                                  ]
                                : ""
                            }
                            onChange={(event) =>
                              handleChange(
                                event,
                                questionIndex,
                                timetableIndex,
                                "theory"
                              )
                            }
                            style={{ textAlign: "left" }}
                            className={`student-dashboard-feedback-select ${
                              validationErrors[
                                `theory_${timetableIndex}_${questionIndex}`
                              ]
                                ? "error-border"
                                : ""
                            }`}
                          >
                            <option value="">Select</option>
                            {[0, 1, 2, 3, 4].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </form>
            {success && (
              <p className="student-dashboard-success-message">{success}</p>
            )}
          </>
        )}
        {filteredPracticalTimetable.length > 0 && (
          <>
            <h2 className="student-dashboard-timetable-title">
              Practical Timetable
            </h2>
            <table className="student-dashboard-timetable-table">
              <thead>
                <tr>
                  <th className="student-dashboard-timetable-th">S.N.</th>
                  <th className="student-dashboard-timetable-th">Subject</th>
                  <th className="student-dashboard-timetable-th">Faculty</th>
                  <th className="student-dashboard-timetable-th">Type</th>
                  <th className="student-dashboard-timetable-th">
                    Course Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPracticalTimetable.map((item, index) => (
                  <tr key={item._id}>
                    <td className="student-dashboard-timetable-td">
                      {index + 1}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.subjectName}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.facultyName}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.type}
                    </td>
                    <td className="student-dashboard-timetable-td">
                      {item.courseCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="student-dashboard-feedback-form-title">
              Practical Feedback Form
            </h2>
            <form onSubmit={(e) => handleSubmit(e, "practical")}>
              <table className="student-dashboard-feedback-table">
                <thead>
                  <tr>
                    <th className="student-dashboard-feedback-th">S.N.</th>
                    <th className="student-dashboard-feedback-th">
                      Practical Factors
                    </th>
                    {filteredPracticalTimetable.map((item, index) => (
                      <th
                        key={item._id}
                        className="student-dashboard-feedback-th"
                      >
                        {item.courseAbbreviation}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {practicalQuestions.map((question, questionIndex) => (
                    <tr key={questionIndex}>
                      <td className="student-dashboard-feedback-td">
                        {questionIndex + 1}
                      </td>
                      <td className="student-dashboard-feedback-question">
                        {question}
                      </td>
                      {filteredPracticalTimetable.map(
                        (item, timetableIndex) => (
                          <td
                            key={`${timetableIndex}_${questionIndex}`}
                            className="student-dashboard-feedback-td"
                          >
                            <select
                              value={
                                responses[
                                  `practical_${timetableIndex}_${questionIndex}`
                                ] !== undefined
                                  ? responses[
                                      `practical_${timetableIndex}_${questionIndex}`
                                    ]
                                  : ""
                              }
                              onChange={(event) =>
                                handleChange(
                                  event,
                                  questionIndex,
                                  timetableIndex,
                                  "practical"
                                )
                              }
                              className={`student-dashboard-feedback-select ${
                                validationErrors[
                                  `practical_${timetableIndex}_${questionIndex}`
                                ]
                                  ? "error-border"
                                  : ""
                              }`}
                            >
                              <option value="">Select</option>
                              {[0, 1, 2, 3, 4].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {success && (
                <p className="student-dashboard-success-message">{success}</p>
              )}
            </form>
          </>
        )}
        <div>
          <form onSubmit={handleSubmit}>
            <button type="submit" className="student-dashboard-submit-button">
              Submit Feedback
            </button>
          </form>

          {showConfirmPopup && (
            <>
              <div className="student-dashboard-backdrop"></div>
              <div className="student-dashboard-popup student-dashboard-confirm-popup">
                <p>Are you sure you want to submit the feedback?</p>
                <button onClick={confirmSubmit} disabled={pendingSubmit}>
                  {pendingSubmit ? "Submitting..." : "Confirm"}
                </button>
                <button onClick={cancelSubmit} disabled={pendingSubmit}>
                  Cancel
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="student-dashboard-popup student-dashboard-error-popup">
              <div className="student-dashboard-popup-content">
                <p>{error}</p>
                <button
                  onClick={() => setError("")}
                  className="student-dashboard-popup-button"
                >
                  OK
                </button>
              </div>
            </div>
          )}
          {success && (
            <div className="student-dashboard-popup student-dashboard-success-popup">
              <div className="student-dashboard-popup-content">
                <p>{success}</p>
                <div className="student-dashboard-popup-buttons">
                  <button
                    onClick={() => setSuccess("")}
                    className="student-dashboard-popup-button"
                  >
                    OK
                  </button>
                  <button
                    onClick={handleLogout} // Call handleLogout when clicking Logout
                    className="student-dashboard-popup-button student-dashboard-logout-button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;