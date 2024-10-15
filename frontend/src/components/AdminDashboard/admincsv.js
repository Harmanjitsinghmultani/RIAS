import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/csv.css'; // Ensure this CSS file exists for styling

const AdminCsv = () => {
  const [csvData, setCsvData] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target.result); // Set CSV data from file
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csvData) {
      setMessage('Please select a CSV file first');
      return;
    }

    console.log("Uploading CSV Data:", csvData); // Log the CSV data being uploaded

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/csv/upload-csv`, {
        csvData: csvData, // Send CSV data in the request body
      });
      

      if (response.status === 201) {
        setMessage(response.data.msg || 'CSV uploaded successfully');
      } else {
        setMessage('Unexpected response status');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      const errorMsg = error.response?.data?.message || 'Error uploading CSV';
      setMessage(errorMsg);

      // Log the entire error response for better debugging
      console.error('Error Response:', error.response);
      console.error('Error Data:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Headers:', error.response?.headers);
    }
  };

  return (
    <div className="csv-container">
      <div className="csv-content">
        <h2 className="csv-title">Upload Students CSV File</h2>
        <form onSubmit={handleSubmit} className="csv-form">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv"
            className="csv-input"
          />
          <button type="submit" className="csv-button">Upload</button>
        </form>
        {message && <p className="csv-message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminCsv;
