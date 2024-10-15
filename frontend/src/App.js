import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import FacultyDashboard from "./components/FacultyDashboard/FacultyDashboard";
import StudentMainContentPart1 from "./components/Studentdashobard/StudentMainContentPart1"; // Updated import path
import Timetable from "./components/Studentdashobard/Timetable"; // Updated import path
import Elective from "./components/Studentdashobard/Elective"; // Updated import path
import DashboardLayout from "./components/Studentdashobard/DashboardLayout"; // Updated import path
import DashboardLayoutf from "./components/FacultyDashboard/DashboardLayout"; // Updated import path
import DashboardLayoutc from "./components/class-teacher/DashboardLayout"; // Updated import path
import StudentProfile from "./components/Studentdashobard/StudentProfile"; // Updated import path
import Users from "./components/FacultyDashboard/users"; // Updated import path
import Userclass from "./components/class-teacher/users"; // Updated import path
import Survey from "./components/FacultyDashboard/FacultySurvey";
import Surveyf from "./components/FacultyDashboard/SurveyForm";
import Facultyimetable from "./components/FacultyDashboard/StudentTable";
import Surveystu from "./components/Studentdashobard/Survey";
import Feedback from "./components/Studentdashobard/Stufeedback";
import "./App.css"; // Ensure your CSS file is included
import FacultyAddSchedule from "./components/FacultyDashboard/FacultyAddSchedule";
import FacultyPooostTimetable from "./components/FacultyDashboard/FacultyPostTimetable";
import FacultyFeedback from "./components/FacultyDashboard/FacultyFeedback";
import Antiragging from "./components/Studentdashobard/Antiragging";
import Adashboard from "./components/AdminDashboard/dashboard";
import Afedback from "./components/AdminDashboard/AdminFeedback";
import Stats from "./components/AdminDashboard/FeedbackStats";
import Adminchart from "./components/AdminDashboard/chart";
import Adminusers from "./components/AdminDashboard/users"; // Updated import path
import Samesubject from "./components/AdminDashboard/Samesubjectanalysis"; // Updated import path
import Samefaculty from "./components/AdminDashboard/SameFacultyDifferentSubjectsAnalysis"; // Updated import path
import Deptanalysis from "./components/AdminDashboard/BranchAnalysis"; // Updated import path
import Aaadmincsv from "./components/AdminDashboard/admincsv"; // Updated import path
import Facultycsv from "./components/FacultyDashboard/facultycsv"; // Updated import path
import Facultyprofilee from "./components/FacultyDashboard/StudentProfile"; // Updated import path
import Facultyregister from "./components/FacultyDashboard/FacultyRegister"; // Updated import path
import Stutable from "./components/FacultyDashboard/StudentTable"; // Updated import path
import FacultyPostmapping from "./components/FacultyDashboard/EditMappingfaculty"; // Updated import path
import Profileclass from "./components/class-teacher/StudentProfile"; // Updated import path
import Facultyregiterview from "./components/FacultyDashboard/FacultyregisterTable"; // Updated import path


const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/student-dashboard" />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}-dashboard`} />;
  }

  return children;
};

function App() {
  useEffect(() => {
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      appContainer.style.width = "80%";
      appContainer.style.height = "80%";
      appContainer.style.margin = "0 auto";
      appContainer.style.display = "flex";
      appContainer.style.flexDirection = "column";
      appContainer.style.position = "relative";
      appContainer.style.top = "20px"; // Adjust as needed
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <Routes>
                    <Route path="" element={<Adashboard />} />
                    <Route path="Feedback" element={<Afedback />} />
                    <Route path="Stats" element={<Stats />} />
                    <Route path="adminchart" element={<Adminchart />} />
                    <Route path="adminuser" element={<Adminusers />} />
                    <Route path="samesubject" element={<Samesubject />} />
                    <Route path="samefaculty" element={<Samefaculty />} />
                    <Route
                      path="Department-Analysis"
                      element={<Deptanalysis />}
                    />
                    <Route path="admin-csv" element={<Aaadmincsv />} />
                  </Routes>
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/class-teacher/*"
            element={
              <ProtectedRoute allowedRoles={["class-teacher"]}>
                <DashboardLayoutc>
                  <Routes>
                    <Route path="" element={<Userclass />} />
                    <Route path="users" element={<Userclass />} />
                    <Route path="F-profile" element={<Profileclass />} />
                    {/* Add more routes as needed */}
                  </Routes>
                </DashboardLayoutc>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <DashboardLayoutf>
                  <Routes>
                    <Route path="" element={<Facultyprofilee />} />
                    <Route path="users" element={<Users />} />
                    <Route path="Survey" element={<Survey />} />
                    <Route path="Surveyform" element={<Surveyf />} />
                    <Route path="Feedback" element={<FacultyPostmapping />} />
                    <Route path="F-profile" element={<Facultyprofilee />} />
                    <Route path="faculty-register/F--rege-view" element={<Facultyregiterview />} />

                    <Route
                      path="faculty-register"
                      element={<Facultyregister />}
                    />
                    <Route path="faculty-csv" element={<Facultycsv />} />

                    <Route
                      path="faculty-timetable"
                      element={<FacultyPooostTimetable />}
                    />
                    {/* Add more routes as needed */}
                  </Routes>
                </DashboardLayoutf>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout>
                  <Routes>
                    <Route path="" element={<StudentProfile />} />
                    <Route path="timetable" element={<Timetable />} />{" "}
                    <Route path="elective" element={<Elective />} />{" "}
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="Surveystu" element={<Surveystu />} />
                    <Route path="Feedback" element={<Feedback />} />
                    <Route path="Antiragging" element={<Antiragging />} />
                    
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
