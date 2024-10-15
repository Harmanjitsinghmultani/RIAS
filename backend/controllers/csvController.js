const User = require("../models/User");
const csv = require("csv-parser");

const Timetable = require("../models/Timetable");
const Faculty = require("../models/facultyModel"); // Import the Faculty model
const { Readable } = require("stream"); // Import Readable from the stream module

const fs = require("fs");
const bcryptjs = require("bcryptjs");

const Papa = require("papaparse");

const bcrypt = require('bcrypt'); // Optional, in case you want to hash passwords later

exports.uploadCSV = async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ message: "No CSV data provided." });
    }

    console.log("Received CSV Data:", csvData);

    // Use PapaParse to parse CSV data
    const results = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    if (!results.data.length) {
      return res
        .status(400)
        .json({ message: "No valid data found in the CSV." });
    }

    const expectedHeaders = [
      "username",
      "email",
      "password",
      "role",
      "mobileNumber",
      "registrationNumber",
      "semester",
      "branch",
      "batch",
      "section",
      "rollNumber",
      "academicYear",
      "session",
      "electives" // Optional: Add or remove other fields as needed
    ];

    // Validate CSV headers
    const headers = Object.keys(results.data[0]);
    if (!expectedHeaders.every((header) => headers.includes(header))) {
      return res.status(400).json({ message: "CSV headers do not match expected format." });
    }

    // Process the CSV rows
    const userPromises = results.data.map(async (row) => {
      try {
        const { email, password, ...userData } = row;

        // Check if email and password are present
        if (!email || !password) {
          console.error("Missing email or password:", row);
          return null;
        }

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
          console.log(`User with email ${email} already exists. Skipping.`);
          return null;
        }

        // Check if the password is already hashed by inspecting its format
        let storedPassword;
        const passwordIsHashed = password.startsWith("$2a$") || password.startsWith("$2b$");

        if (passwordIsHashed) {
          // If the password is already hashed, store it as-is
          storedPassword = password;
        } else {
          // Otherwise, store the plaintext password directly (dangerous, but as per request)
          storedPassword = password;
        }

        console.log(`Stored password: ${storedPassword}`);

        // Create and save the new user
        user = new User({
          ...userData,
          email,
          password: storedPassword, // Save the hashed or raw password
        });

        await user.save();
        return user;
      } catch (error) {
        console.error(`Error saving user: ${error.message}`);
        throw error;
      }
    });

    // Wait for all user saving promises to resolve
    const resultsPromises = await Promise.allSettled(userPromises);
    const failed = resultsPromises.filter(
      (result) => result.status === "rejected"
    );
    const succeeded = resultsPromises.filter(
      (result) => result.status === "fulfilled"
    );

    // Return a summary of success and failures
    res.status(201).json({
      msg: `Users registered successfully: ${succeeded.length}, Failed: ${failed.length}`,
    });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};



















































































// Assuming this is part of your controller file
exports.uploadTimetableCSV = async (req, res) => {
  try {
    const { csvData } = req.body; // Get CSV data from request body

    if (!csvData) {
      return res.status(400).json({ message: "No CSV data provided." });
    }

    // Print the CSV data to console for debugging
    console.log("Received CSV Data:", csvData);

    const rows = csvData
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row.length > 0);

    if (rows.length < 2) {
      return res
        .status(400)
        .json({ message: "No valid data found in the CSV." });
    }

    const headers = rows[0].split(",").map((header) => header.trim());
    const results = [];

    // Check if expected headers are present
    const expectedHeaders = [
      "branch",
      "section",
      "semester",
      "batch",
      "facultyName",
      "subjectName",
      "courseCode",
      "type",
      "courseAbbreviation",
      "parentDepartment",
      "academicYear",
      "session",
      "isElective",  // Added isElective field
    ];

    if (!expectedHeaders.every((header) => headers.includes(header))) {
      return res
        .status(400)
        .json({ message: "CSV headers do not match expected format." });
    }

    // Process the data rows
    for (let i = 1; i < rows.length; i++) {
      const data = rows[i].split(",").map((field) => field.trim());
      const timetableData = {};

      expectedHeaders.forEach((header, index) => {
        timetableData[header] = data[index] || ""; // Assign empty string if data is missing
      });

      // Only push valid entries
      if (timetableData.facultyName && timetableData.subjectName) {
        // Convert "isElective" from string to Boolean
        timetableData.isElective = timetableData.isElective.toLowerCase() === "true";

        // Check essential fields
        results.push(timetableData);
      } else {
        console.error("Invalid data row:", timetableData);
      }
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid data found in the CSV." });
    }

    const timetablePromises = results.map(async (row) => {
      try {
        const newTimetable = new Timetable({
          branch: row.branch,
          section: row.section,
          semester: row.semester,
          batch: row.batch,
          facultyName: row.facultyName,
          subjectName: row.subjectName,
          courseCode: row.courseCode,
          type: row.type,
          courseAbbreviation: row.courseAbbreviation,
          parentDepartment: row.parentDepartment,
          academicYear: row.academicYear,
          session: row.session,
          isElective: row.isElective, // Added isElective field
          createdBy: req.user ? req.user._id : null,
        });
        await newTimetable.save();
        return newTimetable;
      } catch (error) {
        console.error(`Error saving timetable data: ${error.message}`);
        throw error;
      }
    });

    await Promise.all(timetablePromises);
    res
      .status(201)
      .json({ msg: "Timetable data uploaded successfully from CSV" });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};









































exports.uploadFacultyCSV = async (req, res) => {
  try {
    const { csvData } = req.body;

    // Log the received CSV data for debugging
    console.log("Received CSV Data:", csvData);

    if (!csvData) {
      return res.status(400).json({ message: "No CSV data provided." });
    }

    const rows = csvData
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row.length > 0);

    if (rows.length < 2) {
      return res
        .status(400)
        .json({ message: "No valid data found in the CSV." });
    }

    const headers = rows[0].split(",").map((header) => header.trim());
    const results = [];

    const expectedHeaders = [
      "facultyName",
      "subjectName",
      "courseCode",
      "branch",
      "session",
      "parentDepartment",
    ];

    // Check if expected headers are present
    if (!expectedHeaders.every((header) => headers.includes(header))) {
      return res
        .status(400)
        .json({ message: "CSV headers do not match expected format." });
    }

    // Process the data rows
    for (let i = 1; i < rows.length; i++) {
      const data = rows[i].split(",").map((field) => field.trim());
      const facultyData = {};

      expectedHeaders.forEach((header, index) => {
        facultyData[header] = data[index] || ""; // Assign empty string if data is missing
      });

      // Only push valid entries
      if (facultyData.facultyName) {
        results.push(facultyData);
      } else {
        console.error("Invalid data row:", facultyData);
      }
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid data found in the CSV." });
    }

    // Create faculty entries in the database
    const facultyPromises = results.map(async (row) => {
      try {
        const newFaculty = new Faculty({
          facultyName: row.facultyName,
          subjectName: row.subjectName,
          courseCode: row.courseCode,
          branch: row.branch,
          session: row.session,
          parentDepartment: row.parentDepartment,
          createdBy: req.user ? req.user._id : null,
        });
        await newFaculty.save();
        return newFaculty;
      } catch (error) {
        console.error(`Error saving faculty data: ${error.message}`);
        throw error; // Rethrow to catch in outer try-catch
      }
    });

    const savedFaculties = await Promise.all(facultyPromises);

    res
      .status(201)
      .json({
        message: "Faculty data uploaded successfully",
        data: savedFaculties,
      });
  } catch (error) {
    console.error("Error in uploadFacultyCSV:", error);

    // Check if the error is a duplicate key error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "Error uploading faculty: Faculty name must be unique.",
          error: error.message,
        });
    }

    // Handle other types of errors
    res.status(500).json({ message: "Server Error", error: error.message }); // Send error message for debugging
  }
};
