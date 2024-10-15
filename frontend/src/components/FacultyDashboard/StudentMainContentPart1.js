import React from "react";
import "./CSS/StudentMainContentPart1.css"; // Ensure this path is correct
import StudentClassSchedule from "./StudentClassSchedule.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

// Register the components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

// Data for Feedback Summary Chart
const feedbackData = {
  labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`), // Daily labels for 30 days
  datasets: [
    {
      label: "Feedback Score",
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5) + 1), // Random example data for 30 days
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 5,
    },
  ],
};

// Options for Feedback Summary Chart
const feedbackOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          size: 12, // Adjust font size for legend labels
        },
        color: "#333", // Change legend text color if needed
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `Score: ${tooltipItem.raw}`;
        },
      },
      backgroundColor: "#333", // Tooltip background color
      titleColor: "#fff", // Tooltip title color
      bodyColor: "#fff", // Tooltip body color
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: "rgba(200, 200, 200, 0.2)", // Grid line color
        borderColor: "rgba(200, 200, 200, 0.2)", // Border color for x-axis
      },
      ticks: {
        font: {
          size: 10, // Font size for x-axis ticks
        },
        color: "#fff", // Color for x-axis ticks
      },
      barThickness: 200, // Adjust the thickness of each bar
      categoryPercentage: 20, // Adjust spacing between groups of bars
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(200, 200, 200, 0.2)", // Grid line color
        borderColor: "rgba(200, 200, 200, 0.5)", // Border color for y-axis
      },
      ticks: {
        font: {
          size: 10, // Font size for y-axis ticks
        },
        color: "#fff", // Color for y-axis ticks
      },
    },
  },
};

// Data for Monthly Survey Participation Chart
const surveyData = {
  labels: ["Completed", "Not Completed"], // Status labels
  datasets: [
    {
      data: [70, 30], // Example data
      backgroundColor: ["rgba(255, 215, 0, 0.6)", "rgba(55, 136, 125, 0.6)"],
      borderColor: ["rgba(255, 215, 0, 0.6)", "rgba(55, 136, 125, 0.6)"],
      borderWidth: 1,
    },
  ],
};

// Options for Monthly Survey Participation Chart
const surveyOptions = {
  responsive: true,
};

const StudentMainContentPart1 = () => {
  return (
    <div className="student-main-content-part1">
      <div className="cards-container">
        <div className="card">
          <h2>Upcoming Classes</h2>
          <p>Check your upcoming classes and timetable here.</p>
        </div>
        <div className="card">
          <h2>Daily Feedback</h2>
          <p>Submit your daily feedback on today's lecture.</p>
          <button className="action-button">Submit Feedback</button>
        </div>
        <div className="card">
          <h2>Weekly Feedback</h2>
          <p>Review and submit feedback for this week's lectures.</p>
          <button className="action-button">Feedback</button>
        </div>
        <div className="card">
          <h2>Monthly Survey</h2>
          <p>
            Participate in the monthly survey on teaching methodologies and
            campus issues.
          </p>
          <button className="action-button">Take Survey</button>
        </div>
        <div className="card8">
          <div className="chart-container small-bar-chart">
            <h2>Feedback Summary</h2>
            <Bar data={feedbackData} options={feedbackOptions} />
          </div>
        </div>
        <div className="card4">
          <h2 style={{ color: "#ffffff" }}>Tracker</h2>

          <div className="progress-bar-vertical">
            <span style={{ height: "70%" }}>70%</span> {/* Example progress */}
          </div>
        </div>
        <div className="tt">
          <div className="timetable">
            <h4>
              Today's Upcoming Classes <span> </span><span></span>
              <button className="view-all-button">View Full Timetable</button>
            </h4>
            <br />
            <br />
            <br />
            
              <StudentClassSchedule />
              {/* Other dashboard content */}
           
          </div>
        </div>
      </div>
      <div className="timetable-container">
        <div className="card9">
          <h2>Reward Points Dashboard</h2>
          <div className="points-summary">
            <p>Total Points: 120</p>
            <p>Points Redeemable: 50</p>
          </div>
          <div className="points-history">
            <p>History: Earned 50 points on 01/07/2024</p>
            <p>Redeemed 20 points on 15/07/2024</p>
          </div>
        </div>
        <div className="card3">
          <h2>Monthly Survey Participation</h2>
          <div className="chart-container">
            <Pie data={surveyData} options={surveyOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMainContentPart1;
