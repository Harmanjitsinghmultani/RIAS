const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Import and use routes
const authRoutes = require("./routes/authRoutes");
const classSchedulesRoutes = require("./routes/classSchedules");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const facultytt = require("./routes/facultytimetable");
const feedbackRoutes = require("./routes/feedbackRoutes");
const antiRaggingRoutes = require("./routes/aa");
const adminchart = require("./routes/adminAnalysis");
const csv = require("./routes/adminRoutes");
const facultyregisterRoutes = require("./routes/facultyregisterRoutes");

app.use("/api", authRoutes); // Authentication routes
app.use("/api/class-schedules", classSchedulesRoutes); // Class schedules routes
app.use("/api/users", userRoutes); // User routes (renamed for clarity)
app.use("/api/students", studentRoutes); // Student routes
app.use("/api/faculty", facultyRoutes); // Faculty routes
app.use("/api/surveys", surveyRoutes); // Surveys routes
app.use("/api", timetableRoutes); // Update route prefix as needed
app.use("/api", facultytt);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/antiragging", antiRaggingRoutes);
app.use("/api/admin", adminchart);
app.use("/api/csv", csv);
app.use("/api/facultyregister", facultyregisterRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
