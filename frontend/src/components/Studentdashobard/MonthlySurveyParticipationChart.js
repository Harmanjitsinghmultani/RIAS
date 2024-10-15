import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MonthlySurveyParticipationChart = () => {
  // Example data for the chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Survey Participation',
        data: [65, 59, 80, 81, 56, 55, 40, 75, 60, 63, 70, 85], // Replace with actual data
        backgroundColor: '#4caf50', // Color of bars
        borderColor: '#388e3c', // Border color of bars
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Survey Participation',
      },
    },
  };

  return (
    <div className="monthly-survey-participation-chart">
      <h2>Monthly Survey Participation</h2>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlySurveyParticipationChart;
