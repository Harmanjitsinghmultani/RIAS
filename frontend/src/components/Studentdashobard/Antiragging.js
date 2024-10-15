import React, { useState, useEffect } from 'react';
import './CSS/Anti-Ragging.css'; // Import the CSS file

const AntiRaggingForm = () => {
  const [complaint, setComplaint] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data to get student ID
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
        setStudentId(data._id); // Set student ID from profile data
        setLoading(false);
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Error fetching profile data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData(); // Fetch profile data on component mount
  }, []);

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (complaint.trim() === '') {
      alert('Complaint text is required.');
      return;
    }
    if (!studentId) {
      alert('Student ID is not available.');
      return;
    }
    setShowConfirmModal(true); // Show confirmation modal
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false); // Close confirmation modal
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/antiragging/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complaint, studentId }),
      });

      if (response.ok) {
        setShowSuccessModal(true); // Show success modal
        setComplaint(''); // Clear the form after submission
      } else {
        const errorText = await response.text(); // Get response error text
        console.error('Error submitting complaint:', errorText);
        alert('Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit complaint. Please try again.');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false); // Close confirmation modal without submitting
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error state
  }

  return (
    <div className="anti-container">
      <div className="anti-card">
        <h1 className="anti-heading">Anti-Ragging Complaint Form</h1>
        <p className="anti-disclaimer">
          * All complaints are anonymous and will be handled with strict confidentiality.
          <br></br>*Misuse of this feature will be a punishable offense
        </p>
        <form onSubmit={handleSubmit}>
          <div className="anti-form-group">
            <label htmlFor="complaint" className="anti-label">Your Complaint:</label>
            <textarea
              id="complaint"
              className="anti-textarea"
              rows="5"
              value={complaint}
              onChange={handleComplaintChange}
              required
            />
          </div>
          <div className="anti-button-group">
            <button
              type="submit"
              className="anti-submit-button"
            >
              Submit
            </button>
            <button
              type="button"
              className="anti-cancel-button"
              onClick={() => setComplaint('')} // Clear the form
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="anti-modal-overlay">
            <div className="anti-modal-content">
              <p>Are you sure you want to submit this complaint?</p>
              <div className="anti-button-group">
                <button
                  className="anti-modal-button"
                  onClick={handleConfirmSubmit}
                >
                  Confirm
                </button>
                <button
                  className="anti-modal-button cancel"
                  onClick={handleCancelSubmit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="anti-modal-overlay">
            <div className="anti-modal-content">
              <p>Complaint submitted successfully!</p>
              <button
                className="anti-modal-button"
                onClick={handleCloseSuccessModal}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AntiRaggingForm;
