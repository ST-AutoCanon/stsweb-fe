import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import * as MdIcons from "react-icons/md";
import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
import AddDepartment from "../AddDepartment/AddDepartment";

import AdminQuery from "../EmployeeQueries/AdminQuery";
import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
import UpdateProject from "../UpdateProjects/ProjectsDashboard";
import LeaveQueries from "../LeaveQueries/Admin";
import LeaveRequest from "../LeaveQueries/LeaveRequest";
import Profile from "../Profile/Profile";
import MyDashboard from "../MyDashboard/MyDashboard";
import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
import Salary_Statement from "../Salary_statement/Salary_Statement";
import PayrollSummary from "../PayrollSummary/PayrollSummary";
import Reimbursement from "../Reimbursement/Reimbursement";
import RbAdmin from "../Reimbursement/RbAdmin";
import RbTeamLead from "../Reimbursement/RbTeamLead";
import Assets from "../Assets/assets";
import Vendors from "../vendors/vendors";
import Chat from "../Chat/ChatPage";
import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";


const Sidebar = ({ setActiveContent }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeItem, setActiveItem] = useState(""); // Track active menu item
  const [showProfile, setShowProfile] = useState(false);
  const employeeId = localStorage.getItem("employeeId");
  const userRole = localStorage.getItem("userRole") || "Employee";
  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const userPosition = dashboardData.position;
  const [activeNav, setActiveNav] = useState("/dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile popup

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
    }
    if (userRole === "Admin") {
      setActiveContent(<MyDashboard />);

      setActiveItem("/dashboard");
    } else {
      setActiveContent(<MyEmpDashboard />);
    }
  }, [setActiveContent, userRole]);

  const handleMenuClick = (item) => {
    setActiveItem(item.path);
    setActiveNav(item.path);
    setShowMobileMenu(false); // Close popup when selecting an item

    switch (item.path) {
      case "/dashboard":
        setActiveContent(
          userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />
        );
        break;
      case "/employeeDetails":
        setActiveContent(<EmployeeDetails />);
        break;
      case "/addDepartment":
        setActiveContent(<AddDepartment />);
        break;
      case "/updateProjects":
        setActiveContent(<UpdateProject />);
        break;
      case "/leaveQueries":
        if (userRole === "Admin") {
          setActiveContent(<LeaveQueries />);
        } else {
          setActiveContent(<LeaveRequest />);
        }
        break;

     case "/Salary_Statement":
  setActiveContent(<SalaryStatementWrapper/>);
  break;


      case "/payrollSummary":
        setActiveContent(<PayrollSummary />);
        break;

      case "/messenger":
        setActiveContent(<Chat />);
        break;

      case "/reimbursement":
        if (userRole === "Admin") {
          setActiveContent(<RbAdmin />);
        } else if (userRole === "Manager") {
          setActiveContent(<RbTeamLead />);
        } else {
          setActiveContent(<Reimbursement />);
        }
        break;

      case "/employeeQueries":
        setActiveContent(
          userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />
        );
        break;
      case "/assets":
        setActiveContent(<Assets />);
        break;
      case "/vendors":
        setActiveContent(<Vendors />);

        break;
        case "/EmployeeLogin":
          setActiveContent(<EmployeeLogin />);
         break;
      default:
        setActiveContent(<p>Content not found for this path.</p>);
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  return (
    <>
      {/* Sidebar (Desktop) */}
      <div className="sidebar">
        {userRole !== "Admin" && (
          <div className="view-profile">
            <span
              onClick={() => setShowProfile(!showProfile)}
              className="view-profile-text"
            >
              View Profile
            </span>
          </div>
        )}
        <ul>
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => {
              const IconComponent =
                MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
              return (
                <li
                  key={index}
                  className={activeItem === item.path ? "active" : ""}
                  onClick={() => handleMenuClick(item)}
                >
                  <span className="icon">
                    <IconComponent />
                  </span>
                  <span className="menu-text">{item.label}</span>
                </li>
              );
            })
          ) : (
            <p className="no-menu">No menu items available</p>
          )}
        </ul>
        {showProfile && (
          <Profile
            employeeId={employeeId}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="bottom-nav">
        <button
          className={activeNav === "/dashboard" ? "active" : ""}
          onClick={() => handleMenuClick({ path: "/dashboard" })}
        >
          <MdIcons.MdHome />
        </button>
        <button
          className={activeNav === "/employeeQueries" ? "active" : ""}
          onClick={() => handleMenuClick({ path: "/employeeQueries" })}
        >
          <MdIcons.MdOutlineContactPhone />
        </button>
        <button
          className={activeNav === "/leaveQueries" ? "active" : ""}
          onClick={() => handleMenuClick({ path: "/leaveQueries" })}
        >
          <MdIcons.MdOutlineCommentBank />
        </button>
        <button
          className={activeNav === "/reimbursement" ? "active" : ""}
          onClick={() => handleMenuClick({ path: "/reimbursement" })}
        >
          <MdIcons.MdCurrencyRupee />
        </button>
        <button
          onClick={() => setShowMobileMenu(true)} // Show popup menu
        >
          <MdIcons.MdMenu />
        </button>
      </div>

      {/* Mobile Sidebar Popup */}
      {showMobileMenu && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-menu"
              onClick={() => setShowMobileMenu(false)}
            >
              ✖
            </button>
            <ul>
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => {
                  const IconComponent =
                    MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
                  return (
                    <li
                      key={index}
                      className={activeItem === item.path ? "active" : ""}
                      onClick={() => handleMenuClick(item)}
                    >
                      <span className="icon">
                        <IconComponent />
                      </span>
                      <span className="menu-text">{item.label}</span>
                    </li>
                  );
                })
              ) : (
                <p className="no-menu">No menu items available</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
