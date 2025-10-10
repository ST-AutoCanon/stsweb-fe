import React, { useState, useEffect, useContext } from "react";
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
import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
import PayrollSummary from "../PayrollSummary/PayrollSummary";
import Reimbursement from "../Reimbursement/Reimbursement";
import RbAdmin from "../Reimbursement/RbAdmin";
import RbTeamLead from "../Reimbursement/RbTeamLead";
import Assets from "../Assets/assets";
import Vendors from "../vendors/vendors";
import Chat from "../Chat/ChatPage";
import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
import LetterHead from "../letterHead/letterhead";
import NoteDashboard from "../Notes/NoteDashboard";
import CreateCompensation from "../Compensation/createCompensation";
import AssignCompensation from "../Compensation/assignCompensation";
import OvertimeDetails from "../Compensation/OvertimeDetails";
import { ContentContext } from "./Context";
import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
import OvertimeSummary from "../Compensation/overtimeSupervisor";
import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";

import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
import TaskManagement from "../TaskManagement/TaskManagement";
import Report from "../Report/ReportPanel";

const Sidebar = () => {
  const { setActiveContent } = useContext(ContentContext);
  const [menuItems, setMenuItems] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [activeSubItem, setActiveSubItem] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showCompensationDropdown, setShowCompensationDropdown] =
    useState(false);
  const employeeId = localStorage.getItem("employeeId");
  const userRole = localStorage.getItem("userRole") || "Employee";
  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const userPosition = dashboardData.position;
  const [activeNav, setActiveNav] = useState("/dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
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

    if (setActiveContent) {
      if (userRole === "Admin") {
        setActiveContent(<MyDashboard />);
        setActiveItem("/dashboard");
      } else {
        setActiveContent(<MyEmpDashboard />);
      }
      setActiveSubItem("");
      setShowCompensationDropdown(false);
    }
  }, [setActiveContent, userRole]);

  const handleMenuClick = (item, subOption = null) => {
    console.log("Menu clicked:", item.path, "Sub-option:", subOption); // Debug log
    setActiveItem(item.path);
    setActiveNav(item.path);
    setShowMobileMenu(false);

    if (item.path === "/compensation" && !subOption) {
      setShowCompensationDropdown((prev) => !prev);
      setActiveSubItem("");
      return;
    }

    setShowCompensationDropdown(subOption ? true : false);
    setActiveSubItem(subOption || "");

    switch (item.path) {
      case "/dashboard":
        setActiveContent(
          userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />
        );
        break;

      case "/Task":
        setActiveContent(<TaskManagementEmployee />);
        break;

      case "/TaskManagementEmployee":
        setActiveContent(<TaskManagementEmployee />);
        break;

      case "/TaskManagement":
        if (userRole === "Supervisor") {
          setActiveContent(<TaskManagement />); // Supervisor view
        } else {
          setActiveContent(<TaskManagementEmployee />); // fallback for Employee
        }
        break;
      case "/report":
        setActiveContent(<Report />);
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
        setActiveContent(<SalaryStatementWrapper />);
        break;
      case "/letterHead":
        setActiveContent(<LetterHead />);
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
      case "/notes":
        setActiveContent(<NoteDashboard />);
        break;
      case "/EmployeeLogin":
        setActiveContent(<EmployeeLogin />);
        break;
      case "/Overtime":
        setActiveContent(<OvertimeDetails />);
        break;
      case "/OvertimeSummary":
        setActiveContent(<OvertimeSummary />);
        break;
      case "/compensation":
  switch (subOption) {
    case "create":
      setActiveContent(<CreateCompensation />);
      break;
    case "assign":
      setActiveContent(<AssignCompensation />);
      break;
    case "SalaryBreakupMain":
      setActiveContent(<SalaryBreakupMain />);
      break;
    case "EmployeeTable":
  setActiveContent(<SalaryDetails />); // UPDATED: Render standalone SalaryDetails (fetches own data, no wrapper)
  break;
    default:
      setActiveContent(<p>Please select a compensation option.</p>);
  }
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
      <div className="sidebar bg-gray-800 text-white min-h-screen w-64 fixed">
        {userRole !== "Admin" && (
          <div className="view-profile p-4">
            <span
              onClick={() => setShowProfile(!showProfile)}
              className="view-profile-text cursor-pointer hover:text-blue-400"
            >
              View Profile
            </span>
          </div>
        )}
        <ul className="mt-4">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => {
              const IconComponent =
                MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
              return (
                <li key={index} className="relative">
                  <div
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
                      activeItem === item.path && !activeSubItem
                        ? "bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span className="icon mr-2">
                      <IconComponent size={24} />
                    </span>
                    <span className="menu-text flex-1">{item.label}</span>
                  </div>
                  {item.path === "/compensation" &&
                    showCompensationDropdown && (
                      <ul className="ml-8 bg-gray-900 rounded-md">
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "create" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "create")}
                        >
                          Create Compensation
                        </li>
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "assign" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "assign")}
                        >
                          Assign Compensation
                        </li>
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "SalaryBreakupMain"
                              ? "bg-gray-700"
                              : ""
                          }`}
                          onClick={() =>
                            handleMenuClick(item, "SalaryBreakupMain")
                          }
                        >
                          Salary Breakup
                        </li>
                  <li
  className={`p-2 cursor-pointer hover:bg-gray-700 ${
    activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
  }`}
  onClick={() => handleMenuClick(item, "EmployeeTable")}
>
  Salary Details
</li>


                      </ul>
                    )}
                </li>
              );
            })
          ) : (
            <p className="no-menu p-4">No menu items available</p>
          )}
        </ul>
        {showProfile && (
          <Profile
            employeeId={employeeId}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>

      <div className="bottom-nav fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2 md:hidden">
        <button
          className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
          onClick={() => handleMenuClick({ path: "/dashboard" })}
        >
          <MdIcons.MdHome size={24} />
        </button>
        <button
          className={`p-2 ${
            activeNav === "/employeeQueries" ? "text-blue-400" : ""
          }`}
          onClick={() => handleMenuClick({ path: "/employeeQueries" })}
        >
          <MdIcons.MdOutlineContactPhone size={24} />
        </button>
        <button
          className={`p-2 ${
            activeNav === "/leaveQueries" ? "text-blue-400" : ""
          }`}
          onClick={() => handleMenuClick({ path: "/leaveQueries" })}
        >
          <MdIcons.MdOutlineCommentBank size={24} />
        </button>
        <button
          className={`p-2 ${
            activeNav === "/reimbursement" ? "text-blue-400" : ""
          }`}
          onClick={() => handleMenuClick({ path: "/reimbursement" })}
        >
          <MdIcons.MdCurrencyRupee size={24} />
        </button>
        <button className="p-2" onClick={() => setShowMobileMenu(true)}>
          <MdIcons.MdMenu size={24} />
        </button>
      </div>

      {showMobileMenu && (
        <div
          className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-end"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="mobile-menu bg-gray-800 text-white w-64 h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-menu text-xl mb-4"
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
                    <li key={index} className="relative">
                      <div
                        className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
                          activeItem === item.path && !activeSubItem
                            ? "bg-gray-700"
                            : ""
                        }`}
                        onClick={() => handleMenuClick(item)}
                      >
                        <span className="icon mr-2">
                          <IconComponent size={24} />
                        </span>
                        <span className="menu-text flex-1">{item.label}</span>
                      </div>
                      {item.path === "/compensation" &&
                        showCompensationDropdown && (
                          <ul className="ml-8 bg-gray-900 rounded-md">
                            <li
                              className={`p-2 cursor-pointer hover:bg-gray-700 ${
                                activeSubItem === "create" ? "bg-gray-700" : ""
                              }`}
                              onClick={() => handleMenuClick(item, "create")}
                            >
                              Create Compensation
                            </li>
                            <li
                              className={`p-2 cursor-pointer hover:bg-gray-700 ${
                                activeSubItem === "assign" ? "bg-gray-700" : ""
                              }`}
                              onClick={() => handleMenuClick(item, "assign")}
                            >
                              Assign Compensation
                            </li>
                            <li
                              className={`p-2 cursor-pointer hover:bg-gray-700 ${
                                activeSubItem === "SalaryBreakupMain"
                                  ? "bg-gray-700"
                                  : ""
                              }`}
                              onClick={() =>
                                handleMenuClick(item, "SalaryBreakupMain")
                              }
                            >
                              Salary Breakup
                            </li>
                          </ul>
                        )}
                    </li>
                  );
                })
              ) : (
                <p className="no-menu p-2">No menu items available</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
