import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/user.css'; // Import CSS file for styling

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility
  const token = localStorage.getItem('token'); // Retrieve token from local storage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in headers
          }
        });
        console.log(response.data); // Log data for debugging
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users.');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]); // Add token as a dependency to re-fetch if it changes

  const handleApproveUser = async (userId) => {
    try {
      await axios.post(`http://localhost:4000/api/faculty/approve-user/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}` // Include token in headers
        }
      });

      setUsers(users.map(user => user._id === userId ? { ...user, isApproved: true } : user));
    } catch (error) {
      setError('Error approving user.');
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axios.post(`http://localhost:4000/api/faculty/reject-user/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}` // Include token in headers
        }
      });

      setUsers(users.map(user => user._id === userId ? { ...user, isApproved: false } : user));
    } catch (error) {
      setError('Error rejecting user.');
      console.error('Error rejecting user:', error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => 
        axios.post(`http://localhost:4000/api/faculty/approve-user/${userId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in headers
          }
        })
      ));

      setUsers(users.map(user => selectedUsers.includes(user._id) ? { ...user, isApproved: true } : user));
      setSelectedUsers([]);
    } catch (error) {
      setError('Error approving users.');
      console.error('Error approving users:', error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prevState =>
      prevState.includes(userId)
        ? prevState.filter(id => id !== userId)
        : [...prevState, userId]
    );
  };

  const handleSelectAll = () => {
    // If all not approved users are already selected, deselect them all
    if (selectedUsers.length === notApprovedUsers.length) {
      setSelectedUsers([]);
    } else {
      // Otherwise, select all not approved users
      setSelectedUsers(notApprovedUsers.map(user => user._id));
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedUsers = filteredUsers.filter(user => user.isApproved);
  const notApprovedUsers = filteredUsers.filter(user => !user.isApproved);

  return (
    <div className="userdashboard-container">
      <input
        type="text"
        className="userdashboard-search-bar"
        placeholder="Search by username or email..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <p className="userdashboard-error-message">{error}</p>}

      <div className="userdashboard-table-wrapper">
        <div className="userdashboard-not-approved-table-container userdashboard-table-container">
          <h3 style={{ color: "white" }} className="userdashboard-heading">Not Approved Users</h3>
          <button
            className="userdashboard-select-all-button"
            onClick={handleSelectAll}
          >
            {selectedUsers.length === notApprovedUsers.length ? 'Deselect All' : 'Select All'}
          </button>
          <table className="userdashboard-table userdashboard-not-approved-table">
            <thead>
              <tr>
                <th>Select</th>

                <th>Email</th>
                <th>Role</th>
                <th>Approved</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {notApprovedUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>

                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isApproved ? 'Yes' : 'No'}</td>
                  <td>
                    {!user.isApproved && (
                      <button className="userdashboard-approve-button" onClick={() => handleApproveUser(user._id)}>Approve</button>
                    )}
                  </td>
                  <td>
                    <button className="userdashboard-view-button" onClick={() => handleViewUser(user)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="userdashboard-select-button" onClick={handleBulkApprove}>Approve Selected</button>
        </div>

        <div className="userdashboard-approved-table-container userdashboard-table-container">
          <h3 style={{ color: "white" }} className="userdashboard-heading">Approved Users</h3>
          <table className="userdashboard-table userdashboard-approved-table">
            <thead>
              <tr>
  
                <th>Email</th>
                <th>Role</th>
                <th>Approved</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {approvedUsers.map(user => (
                <tr key={user._id}>

                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isApproved ? 'Yes' : 'No'}</td>
                  <td>
                    {user.isApproved && (
                      <button className="userdashboard-reject-button" onClick={() => handleRejectUser(user._id)}>Not Approve</button>
                    )}
                  </td>
                  <td>
                    <button className="userdashboard-view-button" onClick={() => handleViewUser(user)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isPopupOpen && selectedUser && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.container}>
            <h2>User Details</h2>
            <p><strong>Username:</strong> {selectedUser.username || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
            <p><strong>Mobile Number:</strong> {selectedUser.mobileNumber || 'N/A'}</p>
            <p><strong>Registration Number:</strong> {selectedUser.registrationNumber || 'N/A'}</p>
            <p><strong>Semester:</strong> {selectedUser.semester || 'N/A'}</p>
            <p><strong>Branch:</strong> {selectedUser.branch || 'N/A'}</p>
            <p><strong>Section:</strong> {selectedUser.section || 'N/A'}</p>
            <p><strong>Roll Number:</strong> {selectedUser.rollNumber || 'N/A'}</p>
            <p><strong>Role:</strong> {selectedUser.role || 'N/A'}</p>
            <p><strong>Approved:</strong> {selectedUser.isApproved ? 'Yes' : 'No'}</p>
            <button style={popupStyles.closeButton} onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for the popup
const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker, semi-transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure popup is above other elements
    transition: 'opacity 0.3s ease', // Smooth fade-in effect
  },
  container: {
    backgroundColor: '#f9f9f9', // Light background color with a slight gray tone
    padding: '30px',
    borderRadius: '12px', // Rounded corners for a modern look
    width: '500px', // Wider popup for better readability
    maxWidth: '90%', // Responsive width for smaller screens
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
    transform: 'translateY(-10px)', // Subtle motion effect
    animation: 'popupSlideIn 0.3s ease-out', // Slide-in animation
  },
  closeButton: {
    position: 'absolute', // Absolute positioning for the close button
    top: '15px',
    right: '15px',
    backgroundColor: 'transparent', // Transparent background
    color: '#333', // Neutral, dark color for the close icon
    border: 'none',
    fontSize: '20px', // Larger size for the close button
    cursor: 'pointer',
    transition: 'color 0.2s ease', // Smooth hover effect
  },
  header: {
    fontSize: '24px', // Larger, bolder heading
    fontWeight: 'bold',
    color: '#333', // Dark, neutral text color
    marginBottom: '20px', // Spacing between header and content
    textAlign: 'center', // Centered header for a clean look
  },
  content: {
    fontSize: '16px', // Standard font size for content
    color: '#555', // Softer color for content text
    lineHeight: '1.6', // Improve readability with increased line height
  },
  button: {
    marginTop: '20px',
    backgroundColor: '#4CAF50', // Professional green color for action button
    color: '#fff', // White text
    border: 'none', // Remove default border
    padding: '12px 20px', // Balanced padding for a larger button
    borderRadius: '8px', // Rounded corners for modern design
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500', // Slightly bolded font for action button
    transition: 'background-color 0.3s ease', // Smooth hover transition
  },
  buttonHover: {
    backgroundColor: '#45a049', // Slightly darker green for hover
  }
};

// Add keyframe animation for slide-in effect
const popupAnimation = `
  @keyframes popupSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject keyframe animation into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = popupAnimation;
document.head.appendChild(styleSheet);


export default Users;
