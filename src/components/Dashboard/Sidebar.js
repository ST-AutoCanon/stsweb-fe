import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import * as MdIcons from "react-icons/md";
import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
import AddDepartment from "../AddDepartment/AddDepartment";
import AdminQuery from "../EmployeeQueries/AdminQuery";
import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// import MyDashboard from "../MyDashboard/MyDashboard";
// import UpdateProjects from "../UpdateProjects/UpdateProjects";
// import AttendanceMgmt from "../AttendanceMgmt/AttendanceMgmt";
import LeaveQueries from "../LeaveQueries/Admin";
import LeaveRequest from "../LeaveQueries/LeaveRequest";
// import Performance from "../Performance/Performance";
// import PayrollSummary from "../PayrollSummary/PayrollSummary";
// import RequestLetter from "../RequestLetter/RequestLetter";
// import HolidayDetails from "../HolidayDetails/HolidayDetails";
// import TeamEvents from "../TeamEvents/TeamEvents";

const Sidebar = ({ setActiveContent }) => {
  const [menuItems, setMenuItems] = useState([]); // Default empty array

  useEffect(() => {
    const storedData = localStorage.getItem("sidebarMenu");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setMenuItems(parsedData || []); // FIXED: No need for .sidebarMenu
      } catch (error) {
        console.error("Error parsing sidebar menu:", error);
        setMenuItems([]); // Fallback to empty array
      }
    }
  }, []);

  const handleMenuClick = (item) => {
    const userRole = localStorage.getItem("userRole") || "Role";
    // Dynamically map path to content
    switch (item.path) {
      case "/dashboard":
        setActiveContent(<p>Welcome to the Dashboard!</p>);
        break;
      case "/employeeDetails":
        setActiveContent(<EmployeeDetails />);
        break;
      case "/addDepartment":
        setActiveContent(<AddDepartment />);
        break;
      case "/updateProjects":
        setActiveContent(<p>Update Projects content goes here.</p>);
        break;
      case "/attendanceMgmt":
        setActiveContent(<p>Attendance Management content goes here.</p>);
        break;
        case "/leaveQueries":
          // Display LeaveRequest for employees and LeaveQueries for admins
          if (userRole === "Employee") {
            setActiveContent(<LeaveRequest />);
          } else if (userRole === "Admin") {
            setActiveContent(<LeaveQueries />);
          } else {
            setActiveContent(<p>Not found</p>);
          }
          break;
      case "/performance":
        setActiveContent(<p>Performance content goes here.</p>);
        break;
      case "/payrollSummary":
        setActiveContent(<p>Payroll Summary content goes here.</p>);
        break;
      case "/requestLetter":
        setActiveContent(<p>Request Letter content goes here.</p>);
        break;
      case "/holidayDetails":
        setActiveContent(<p>Holiday Details content goes here.</p>);
        break;
      case "/teamEvents":
        setActiveContent(<p>Team Events content goes here.</p>);
        break;
        case "/employeeQueries":
          if (userRole === "Admin") {
            setActiveContent(<AdminQuery />);
          } else {
            setActiveContent(<EmployeeQuery />);
          }
          break;
      default:
        setActiveContent(<p>Content not found for this path.</p>);
    }
  };

  return (
    <div className="sidebar">
      <ul>
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => {
            const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard; // Default icon
            return (
              <li key={index} onClick={() => handleMenuClick(item)}>
                <span className="icon"><IconComponent /></span>
                <span className="menu-text">{item.label}</span>
              </li>
            );
          })
        ) : (
          <p className="no-menu">No menu items available</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
