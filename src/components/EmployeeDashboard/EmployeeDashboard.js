import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./EmployeeDashboard.css";
import LeaveRequest from "../LeaveRequest/LeaveRequest";

import { FaBell, FaCalendarAlt, FaPowerOff } from 'react-icons/fa';
import { MdOutlineDashboard, MdOutlinePersonOutline, MdOutlineAssignmentInd, MdOutlineEvent,
         MdOutlineFactCheck, MdOutlineCommentBank, MdOutlineEmojiEvents, MdOutlineContactPhone,
         MdOutlineAssignment, MdOutlineDescription, MdOutlineSportsHandball } from 'react-icons/md';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard"); // Default view is 'dashboard'

  useEffect(() => {
    const sessionTimeout = 20 * 60 * 1000; // 20 minutes in milliseconds
    const sessionStart = localStorage.getItem("sessionStart");

    // Check if session has expired
    if (sessionStart && Date.now() - parseInt(sessionStart, 10) > sessionTimeout) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('dashboardData');
      localStorage.removeItem("sessionStart"); // Remove session start time as well
      navigate('/login'); // Redirect to login page if session expired
    } else {
      // If session is valid, extend session by updating the start time
      localStorage.setItem("sessionStart", Date.now()); // Reset session start time
    }

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const dashboard = localStorage.getItem("dashboardData");

    if (!token || !role || !dashboard) {
      navigate("/login");
      return;
    }

    try {
      const parsedDashboardData = JSON.parse(dashboard);
      setUserRole(role);
      setDashboardData(parsedDashboardData);
    } catch (error) {
      console.error("Error parsing dashboard data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const renderAttendance = (attendance) => (
    <div>
      <p>Present: {attendance?.present !== undefined ? attendance.present : "Data not available"}</p>
      <p>Holidays: {attendance?.holidays ?? "Data not available"}</p>
      <p>Other Absence: {attendance?.other_absence ?? "Data not available"}</p>
    </div>
  );

  const handleSidebarClick = (view) => {
    setCurrentView(view);
  };

  if (!dashboardData) {
    return <div>Loading or no data available. Please log in again.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-title">Employee Dashboard</div>
        <div className="icon-buttons">
          <button className="icon-button">
            <FaBell size={24} />
          </button>
          <button className="icon-button">
            <FaCalendarAlt size={24} />
          </button>
          <button className="icon-button" onClick={() => navigate('/login')}>
            <FaPowerOff size={24} />
          </button>
        </div>
      </div>
      
      <div className="dashboard-body">
  <div className="sidebar">
    <div className="user-profile">
      <img src="user-image.jpg" alt="User Profile" className="user-image" />
        <p className="user-name">{dashboardData.name}</p>
        <p className="user-position">{dashboardData.position}</p>
    </div>
        <ul>
          <li className={currentView === "dashboard" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("dashboard")}>
              <MdOutlineDashboard size={22} style={{ marginRight: "8px" }} />Dashboard
            </a>
          </li>
          <li className={currentView === "employeeDetails" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("employeeDetails")}>
              <MdOutlinePersonOutline size={22} style={{ marginRight: "8px" }} />Employee Details
            </a>
          </li>
          <li className={currentView === "addDepartment" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("addDepartment")}>
              <MdOutlineAssignmentInd size={22} style={{ marginRight: "8px" }} />Add Department
            </a>
          </li>
          <li className={currentView === "updateProjects" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("updateProjects")}>
              <MdOutlineAssignmentInd size={22} style={{ marginRight: "8px" }} />Update Projects
            </a>
          </li>
          <li className={currentView === "attendanceMgmt" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("attendanceMgmt")}>
            <MdOutlineFactCheck size={22} style={{ marginRight: "8px" }} />Attendance Mgmt
            </a>
          </li>
          <li className={currentView === "leaveQueries" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("leaveRequest")}>
            <MdOutlineCommentBank size={22} style={{ marginRight: "8px" }} />Leave Queries
            </a>
          </li>
          <li className={currentView === "performance" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("performance")}>
            <MdOutlineEmojiEvents size={22} style={{ marginRight: "8px" }} /> Performance
            </a>
          </li>
          <li className={currentView === "payrollSummary" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("payrollSummary")}>
            <MdOutlineAssignment size={22} style={{ marginRight: "8px" }} />Payroll Summary
            </a>
          </li>
          <li className={currentView === "requestLetter" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("requestLetter")}>
            <MdOutlineDescription size={22} style={{ marginRight: "8px" }} />Request Letter
            </a>
          </li>
          <li className={currentView === "holidayDetails" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("holidayDetails")}>
            <MdOutlineEvent size={22} style={{ marginRight: "8px" }} />Holiday Details
            </a>
          </li>
          <li className={currentView === "teamEvents" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("teamEvents")}>
            <MdOutlineSportsHandball size={22} style={{ marginRight: "8px" }} />Team Events
            </a>
          </li>
          <li className={currentView === "employeeQueries" ? "active" : ""}>
            <a href="#" onClick={() => handleSidebarClick("employeeQueries")}>
            <MdOutlineContactPhone size={22} style={{ marginRight: "8px" }} />Employee Queries
            </a>
          </li>
        </ul>
  </div>
  
        <div className="main-container">
          {currentView === "dashboard" ? (
            <div className="dashboard-grid">
              <div className="card todays-session">
                <h4>Todays Session</h4>
              </div>
              <div className="card attendance">
                <h4>Total Working Days</h4>
                <p>{dashboardData.total_employees}</p>
                {renderAttendance(dashboardData.attendance)}
              </div>
              <div className="card salary-distribution">
                <h4>Employee Salary Breakup</h4>
                <p>Basic: {dashboardData.salary_distribution?.average_salary}</p>
                <p>Bonus: {dashboardData.salary_distribution?.min_salary}</p>
                <p>PF: {dashboardData.salary_distribution?.max_salary}</p>
                <p>Tax: {dashboardData.salary_distribution?.max_salary}</p>
                <p>Other: {dashboardData.salary_distribution?.max_salary}</p>
              </div>
            </div>
          ) : currentView === "employeeDetails" ? (
            <div className="employee-details-container">
            <h2>My Profile</h2>
            </div>
          ) : currentView === "leaveRequest" ? (
            <div className="leave-request-container">
            <LeaveRequest />
            </div>
          ) : currentView === "addDepartment" ? (
            <div className="add-department-container">
              {/* Replace this with actual add department content */}
              <h2>Add Department</h2>
            </div>
          ) : currentView === "employeeQueries" ? (
            <div className="employee-queries-container">
              {/* Replace this with actual add department content */}
              <AdminQuery />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
