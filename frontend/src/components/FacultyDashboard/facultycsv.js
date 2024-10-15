import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/csv.css'; // Ensure this CSS file exists for styling

const FacultyCsv = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadType, setUploadType] = useState('faculty'); // Default upload type
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(''); // Clear previous messages
  };

  const handleUploadTypeChange = (e) => {
    setUploadType(e.target.value);
    setMessage(''); // Clear previous messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target.result; // Read CSV content as string
      console.log("CSV Data to Upload:", csvData); // Log the CSV data
      setIsLoading(true); // Start loading

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/csv/upload-${uploadType}-csv`, { csvData }, {
          headers: {
            'Content-Type': 'application/json', // Sending JSON data
          },
        });

        if (response.status === 201) {
          setMessage(response.data.msg || 'File uploaded successfully');
          setFile(null); // Clear file input after successful upload
        } else {
          setMessage('Unexpected response status');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        const errorMsg = error.response?.data?.message || 'Error uploading file';
        setMessage(errorMsg);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    reader.readAsText(file); // Read the file as text
  };

  return (
    <div className="csv-container">
      <div className="csv-content">
        <h2 className="csv-title">Upload CSV File</h2>
        <select onChange={handleUploadTypeChange} className="csv-select">
          <option value="faculty">Faculty CSV</option>
          <option value="timetable">Timetable CSV</option>
        </select>
        <form onSubmit={handleSubmit} className="csv-form">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv"
            className="csv-input"
          />
          <button type="submit" className="csv-button" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {message && <p className="csv-message">{message}</p>}
      </div>
    </div>
  );
};

export default FacultyCsv;
