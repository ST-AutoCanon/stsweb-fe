import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import * as MdIcons from "react-icons/md";
import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
import AddDepartment from "../AddDepartment/AddDepartment";

import AdminQuery from "../EmployeeQueries/AdminQuery";
import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
import LeaveQueries from "../LeaveQueries/Admin";
import LeaveRequest from "../LeaveQueries/LeaveRequest";
import Profile from "../Profile/Profile";
import MyDashboard from "../MyDashboard/MyDashboard";
import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";


const Sidebar = ({ setActiveContent }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeItem, setActiveItem] = useState(""); // Track active menu item
  const [showProfile, setShowProfile] = useState(false);
  const employeeId = localStorage.getItem("employeeId");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // Load menu items from local storage
    const storedData = localStorage.getItem("sidebarMenu");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setMenuItems(parsedData || []);
      } catch (error) {
        console.error("Error parsing sidebar menu:", error);
        setMenuItems([]);
      }
    }

    // Set default active content (Dashboard) on first load
    if (setActiveContent) {
      } if (userRole === "Admin") {
        setActiveContent(<MyDashboard />);
        setActiveItem("/dashboard");
      } else {
        setActiveContent(<MyEmpDashboard />);
      }
  }, [setActiveContent, userRole]);

  const handleMenuClick = (item) => {
    setActiveItem(item.path); // Update active menu item

    switch (item.path) {
      case "/dashboard":
        setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
        break;
      case "/employeeDetails":
        setActiveContent(<EmployeeDetails />);
        break;
      case "/addDepartment":
        setActiveContent(<AddDepartment />);
        break;
      case "/leaveQueries":
        if (userRole === "Employee") {
          setActiveContent(<LeaveRequest />);
        } else if (userRole === "Admin") {
          setActiveContent(<LeaveQueries />);
        } else {
          setActiveContent(<p>Not found</p>);
        }
        break;
      case "/employeeQueries":
        setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
        break;
      default:
        setActiveContent(<p>Content not found for this path.</p>);
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="sidebar">
      {/* Conditionally render View Profile if not Admin */}
      {userRole !== "Admin" && (
        <div className="view-profile">
          <span onClick={toggleProfile} className="view-profile-text">
            View Profile
          </span>
        </div>
      )}
      <ul>
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => {
            const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
            return (
              <li
                key={index}
                className={activeItem === item.path ? "active" : ""}
                onClick={() => handleMenuClick(item)}
              >
                <span className="icon"><IconComponent /></span>
                <span className="menu-text">{item.label}</span>
              </li>
            );
          })
        ) : (
          <p className="no-menu">No menu items available</p>
        )}
      </ul>
      {showProfile && (
        <Profile employeeId={employeeId} onClose={toggleProfile} />
      )}
    </div>
  );
};

export default Sidebar;