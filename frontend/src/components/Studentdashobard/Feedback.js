import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formValues, setFormValues] = useState({
    sub: 'ACA',
    teachername: 'Sudeep Sharma',
    f1: '2',
    f2: '2',
    f3: '2',
    f4: '2',
    f5: '2',
    f6: '2',
    f7: '2',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
    console.log(formValues);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
    },
    card: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    heading: {
      color: '#333',
      marginBottom: '15px',
    },
    formGroup: {
      marginBottom: '20px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#555',
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginBottom: '10px',
    },
    rangeGroup: {
      marginBottom: '20px',
    },
    rangeLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    rangeInput: {
      width: '100%',
      margin: '10px 0',
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    submitButtonHover: {
      backgroundColor: '#0056b3',
    },
  };

  const rangeLabels = ['Bad', 'Average', 'Good', 'Very Good', 'Excellent'];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Student Feedback</h1>
        <h5 style={styles.heading}>Please provide your feedback below:</h5>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="sub">Subject</label>
            <select name="sub" value={formValues.sub} onChange={handleChange} style={styles.select}>
              <option value="ACA">ACA</option>
              <option value="PPL">PPL</option>
              <option value="SEPM">SEPM</option>
              <option value="CN">CN</option>
              <option value="IOT">IOT</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="teachername">Teacher Name</label>
            <select name="teachername" value={formValues.teachername} onChange={handleChange} style={styles.select}>
              <option value="Sudeep Sharma">Sudeep Sharma</option>
              <option value="Abhilasa Panday">Abhilasa Panday</option>
              <option value="Prakriti Kapoor">Prakriti Kapoor</option>
              <option value="Malika Roy">Malika Roy</option>
              <option value="Amresh Singh">Amresh Singh</option>
            </select>
          </div>
          {['Personality', 'Subjective Knowledge', 'Attitude towards college property', 'Amount of knowledge you get', 'Punctuality in coming class', 'His/Her capability of controlling Mass', 'Way of Teaching'].map((question, index) => (
            <div style={styles.rangeGroup} key={index}>
              <b>{question}</b>
              <div style={styles.rangeLabel}>
                <span>0</span>
                <span>4</span>
              </div>
              <input
                type="range"
                name={`f${index + 1}`}
                min="0"
                max="4"
                step="1"
                value={formValues[`f${index + 1}`]}
                onChange={handleChange}
                style={styles.rangeInput}
              />
              <output>{rangeLabels[formValues[`f${index + 1}`]]}</output>
            </div>
          ))}
          <button
            type="submit"
            style={styles.submitButton}
            onMouseOver={e => e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor}
            onMouseOut={e => e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
