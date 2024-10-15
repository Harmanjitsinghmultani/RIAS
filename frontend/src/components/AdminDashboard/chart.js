import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import ReactToPrint from "react-to-print";
import Chart from "chart.js/auto";
import "./css/chart.css";

const FeedbackStats = () => {
  const [semesters, setSemesters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [types, setTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({
    semester: "",
    branch: "",
    type: "",
    subject: "",
    course: "",
    faculty: "",
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const componentRef = useRef();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          semestersRes,
          branchesRes,
          typesRes,
          subjectsRes,
          coursesRes,
          facultiesRes,
        ] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/semesters`
          ),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/branches`
          ),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/types`
          ),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/subject-names`
          ),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/course-names`
          ),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/faculty-names`
          ),
        ]);

        setSemesters(semestersRes.data);
        setBranches(branchesRes.data);
        setTypes(typesRes.data);
        setSubjects(subjectsRes.data);
        setCourses(coursesRes.data);
        setFaculties(facultiesRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setMessage("Failed to load options.");
        setMessageType("error");
      }
    };

    fetchOptions();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const { semester, branch, type, subject, course, faculty } =
        selectedFilters;
      const params = {
        semester,
        branch,
        type,
        subjectName: subject,
        courseName: course,
        facultyName: faculty,
      };

      const feedbackResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/filtered`,
        { params }
      );

      const analysisResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/feedback/feedbacks/analysis`,
        { params }
      );

      setFeedbacks(feedbackResponse.data);
      setAnalysisData(analysisResponse.data);
      updateChartData(analysisResponse.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setMessage("Failed to load feedbacks.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFilterApply = () => {
    fetchFeedbacks();
  };

  const allDropdownsSelected = () => {
    return Object.values(selectedFilters).every((value) => value);
  };

  const removePrefix = (text) => {
    return text.startsWith("0_") ? text.substring(2) : text;
  };

  const convertAnalysisData = (data) => {
    if (!data)
      return {
        averageScore: "N/A",
        goodFeedbackPercentage: "N/A",
        badFeedbackPercentage: "N/A",
        questionAverages: {},
      };

    const totalFeedbacks = data.totalFeedbacks || 0;
    const goodFeedbacks = data.goodFeedbacks || 0;
    const badFeedbacks = data.badFeedbacks || 0;

    return {
      averageScore: data.averageScore || "N/A",
      goodFeedbackPercentage:
        totalFeedbacks > 0
          ? ((goodFeedbacks / totalFeedbacks) * 100).toFixed(2) + "%"
          : "N/A",
      badFeedbackPercentage:
        totalFeedbacks > 0
          ? ((badFeedbacks / totalFeedbacks) * 100).toFixed(2) + "%"
          : "N/A",
      questionAverages: data.questionAverages || {},
    };
  };

  const updateChartData = (data) => {
    if (!data || !data.questionAverages) return;

    const labels = Object.keys(data.questionAverages);
    const averages = labels.map(
      (label) => parseInt(data.questionAverages[label]) || 0
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Feedback Scores",
          data: averages,
          backgroundColor: " rgb(0, 0, 139)", // Strong red
          borderColor: "rgb(255, 255, 255)", // Stronger red
          borderWidth: 2, // Thicker border
        },
      ],
    });
  };

  const formattedAnalysisData = convertAnalysisData(analysisData);
  const chartOptions = {
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "rgb(75, 0, 130)", // Color for x-axis ticks
          callback: (value) => {
            if (value >= 0 && value <= 10) {
              return value;
            }
            return "";
          },
          stepSize: 1, // Ensure the ticks are spaced by 1
        },
        grid: {
          color: "rgb(75, 0, 130)", // Light grid lines color
          borderColor: "rgb(75, 0, 130)", // Color for x-axis border line
          borderWidth: 2, // Increase the thickness of the x-axis border line
        },
        min: 0,
        max: 10,
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgb(75, 0, 130)", // Color for y-axis ticks
        },
        grid: {
          color: "rgb(75, 0, 130)", // Light grid lines color
          borderColor: "#4B9CD3", // Color for y-axis border line
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgb(255, 255, 255)", // Slightly darker background
        titleColor: "rgb(0,0,0)",
        bodyColor: "#fff",
        borderColor: "rgba(255, 99, 132, 0.8)", // Border color for tooltip
        borderWidth: 1, // Border width of the tooltip
      },
      legend: {
        labels: {
          color: "rgb(0, 0, 0)", // Color for legend labels
          font: {
            size: 14, // Font size for legend
          },
        },
        position: "top", // Position of the legend
        align: "start", // Align legend items to start
      },
    },
    elements: {
      bar: {
        borderWidth: 4, // Increase the thickness of the bar border
        borderColor: "rgb(255, 192, 0)", // Bar border color
      },
      line: {
        borderWidth: 2, // Line width
        borderColor: "#FFCE56", // Line color
      },
    },
    responsive: true, // Make chart responsive
    maintainAspectRatio: false, // Allow chart to adapt to container size
  };
  const pieChartOptions = {
    plugins: {
      tooltip: {
        backgroundColor: "rgb(255, 255, 255)", // Slightly darker background
        titleColor: "rgb(0, 0, 0)",
        bodyColor: "rgb(0, 0, 0)",
        borderColor: "rgba(255, 99, 132, 0.8)", // Border color for tooltip
        borderWidth: 1, // Border width of the tooltip
      },
      legend: {
        display: true, // Show the legend
        position: "left", // Position the legend on the left
        labels: {
          generateLabels: function (chart) {
            // Generate labels with prefix starting from 1
            const originalLabels = chart.data.labels || [];
            return originalLabels.map((label, index) => ({
              text: `${index + 1}`, // Prefix with numbers 1, 2, 3, etc.
              fillStyle: chart.data.datasets[0].backgroundColor[index],
              strokeStyle: chart.data.datasets[0].borderColor[index],
              lineWidth: 1,
              hidden: !chart.isDatasetVisible(0),
              index: index,
            }));
          },
          font: {
            size: 10, // Reduce font size of legend labels
          },
          padding: 20, // Adjust padding around the legend items
        },
      },
      align: "start", // Align legend items to start
      datalabels: {
        display: true, // Show data labels
        color: "#fff", // Color of the data labels
        font: {
          weight: "bold", // Font weight of the data labels
        },
        formatter: (value) => {
          // Format data label (e.g., add a '%' sign)
          return `${value}%`;
        },
      },
    },
    responsive: true, // Make chart responsive
    maintainAspectRatio: false, // Allow chart to adapt to container size,
    // Add the gridLines configuration to set the grid color to black
    scales: {
      xAxes: [
        {
          gridLines: {
            color: "black", // Set grid color to black
            display: true, // Ensure grid lines are displayed (optional)
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            color: "black", // Set grid color to black
            display: true, // Ensure grid lines are displayed (optional)
          },
        },
      ],
    },
  };

  const getXAxisNote = () => {
    if (selectedFilters.type === "theory") {
      return "X-axis represents theory-related feedback.";
    } else if (selectedFilters.type === "practical") {
      return "X-axis represents practical-related feedback.";
    }
    return "";
  };

  return (
    <div
      style={{ marginTop: "70px", marginLeft: "70px" }}
      className="chartContainer"
    >
      <div className="chartFeedbackCard" ref={componentRef}>
        <h2>Feedback Statistics</h2>
        <p>Filter and review feedback statistics based on various criteria.</p>
        {message && (
          <div className={`chartMessage ${messageType}`}>{message}</div>
        )}
        <div className="chartDropdownContainer">
          {[
            { id: "semester", label: "Semester", options: semesters },
            { id: "branch", label: "Branch", options: branches },
            { id: "type", label: "Type", options: types },
            { id: "subject", label: "Subject", options: subjects },
            { id: "course", label: "Course", options: courses },
            { id: "faculty", label: "Faculty", options: faculties },
          ].map(({ id, label, options }) => (
            <div key={id} className="chartDropdownItem">
              <label htmlFor={id}>{label}:</label>
              <select
                id={id}
                value={selectedFilters[id] || ""}
                onChange={handleFilterChange}
              >
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            onClick={handleFilterApply}
            disabled={!allDropdownsSelected()}
            className="filterButton"
          >
            Apply Filters
          </button>
        </div>
        {loading && <div>Loading...</div>}
        {!loading && (
          <div className="chartChartContainer">
            <div className="chartChartWrapper">
              <div className="chartChartTitle">Bar Chart</div>
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="chartChartWrapper">
              <div className="chartChartTitle">Line Chart</div>
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="chartChartWrapper">
              <div className="chartChartTitle">Pie Chart</div>
              <Pie data={chartData} options={pieChartOptions} />
            </div>

            {feedbacks.length > 0 && (
              <div
                style={{
                  fontSize: "14px",
                  marginTop: "0px",
                  marginBottom: "20px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  width: "660px",
                  height: "200px",
                  overflow: "auto",
                }}
                className="chartAnalysisContainer"
              >
                <div className="chartChartNote">{getXAxisNote()}</div>
                {Object.keys(formattedAnalysisData.questionAverages).length >
                  0 && (
                  <ul style={{ padding: 0, margin: 0 }}>
                    {Object.entries(formattedAnalysisData.questionAverages).map(
                      ([question, avg]) => (
                        <li key={question}>
                          {removePrefix(question)}: {avg}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <ReactToPrint
        trigger={() => <button>Print</button>}
        content={() => componentRef.current}
      />
    </div>
  );
};

export default FeedbackStats;
