

import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import * as MdIcons from "react-icons/md"; // Import all Material icons dynamically
import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
import AddDepartment from "../AddDepartment/AddDepartment";
import LeaveQueries from "../LeaveQueries/Admin";
import LeaveRequest from "../LeaveQueries/LeaveRequest";
import MyDashboard from "../MyDashboard/MyDashboard";

const Sidebar = ({ setActiveContent }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeItem, setActiveItem] = useState(""); // Track active menu item

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
    const userRole = localStorage.getItem("userRole");
    if (userRole === "Employee") {
      setActiveContent(<LeaveRequest />);
      setActiveItem("/dashboard");
    } else if (userRole === "Admin") {
      setActiveContent(<MyDashboard />);
      setActiveItem("/dashboard");
    } else {
      setActiveContent(<p>Access Denied</p>);
    }
  }, [setActiveContent]);

  const handleMenuClick = (item) => {
    setActiveItem(item.path); // Update active menu item

    const userRole = localStorage.getItem("userRole");
    switch (item.path) {
      case "/dashboard":
        setActiveContent(userRole === "Employee" ? <LeaveRequest /> : <MyDashboard />);
        break;
      case "/employeeDetails":
        setActiveContent(<EmployeeDetails />);
        break;
      case "/addDepartment":
        setActiveContent(<AddDepartment />);
        break;
      case "/leaveQueries":
        setActiveContent(userRole === "Employee" ? <LeaveRequest /> : <LeaveQueries />);
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
    </div>
  );
};

export default Sidebar;
