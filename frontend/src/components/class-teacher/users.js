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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/notadmin`, {
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/faculty/approve-user/${userId}`, {}, {
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/faculty/reject-user/${userId}`, {}, {
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
      await Promise.all(
        selectedUsers.map(userId => 
          axios.post(`${process.env.REACT_APP_API_URL}/api/faculty/approve-user/${userId}`, {}, {
            headers: {
              'Authorization': `Bearer ${token}` // Include token in headers
            }
          })
        )
      );
      

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
          <h3 className="userdashboard-heading">Not Approved Users</h3>
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
          <h3 className="userdashboard-heading">Approved Users</h3>
          <table className="userdashboard-table userdashboard-approved-table">
            <thead>
              <tr>
                <th>Username</th>
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
                  <td>{user.username}</td>
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
            <p><strong>Batch:</strong> {selectedUser.batch || 'N/A'}</p>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '400px',
  },
  closeButton: {
    marginTop: '10px',
    backgroundColor: 'red', // Red background color
    color: 'white', // White text color
    border: 'none', // Remove border
    padding: '10px 20px', // Add padding
    borderRadius: '5px', // Rounded corners
    cursor: 'pointer', // Pointer cursor on hover
  }
};

export default Users;
