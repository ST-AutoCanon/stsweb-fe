
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
import ReimbursementHR from "../Reimbursement/ReimbursementHR";
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
import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
import TaskManagement from "../TaskManagement/TaskManagement";
import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";
import Report from "../Report/ReportPanel";

const Sidebar = () => {
  const { setActiveContent } = useContext(ContentContext);
  const [menuItems, setMenuItems] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [activeSubItem, setActiveSubItem] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
  const [showTaskChoice, setShowTaskChoice] = useState(false);
  const [showHRChoice, setShowHRChoice] = useState(false);
  const [hrChoiceType, setHrChoiceType] = useState("");
  const employeeId = localStorage.getItem("employeeId");
  const userRole = localStorage.getItem("userRole") || "Employee";
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
  const [activeNav, setActiveNav] = useState("/dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("sidebarMenu");
    if (storedData) {
      try {
        setMenuItems(JSON.parse(storedData) || []);
      } catch (error) {
        console.error("Error parsing sidebar menu:", error);
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
    console.log("Menu clicked:", item.path, "Sub-option:", subOption);
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
        if (userRole === "HR") {
          setHrChoiceType("dashboard");
          setShowHRChoice(true);
        } else {
          setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
        }
        break;

      case "/TaskManagement":
        if (userRole === "Supervisor") {
          setShowTaskChoice(true);
        } else if (userRole === "HR") {
          setHrChoiceType("task");
          setShowHRChoice(true);
        } else if (userRole === "Admin") {
          setActiveContent(<TaskManagementAdmin />);
        } else {
          setActiveContent(<TaskManagementEmployee />);
        }
        break;

      case "/leaveQueries":
        if (userRole === "Admin") {
          setActiveContent(<LeaveQueries />);
        } else if (userRole === "HR") {
          setHrChoiceType("leave");
          setShowHRChoice(true);
        } else {
          setActiveContent(<LeaveRequest />);
        }
        break;

      case "/reimbursement":
        if (userRole === "Admin") {
          setActiveContent(<RbAdmin />);
        } else if (userRole === "Manager") {
          setActiveContent(<RbTeamLead />);
        } else if (userRole === "HR") {
          setHrChoiceType("reimbursement");
          setShowHRChoice(true);
        } else {
          setActiveContent(<Reimbursement />);
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

      case "/employeeQueries":
        setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
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
            setActiveContent(<SalaryDetails />);
            break;
          default:
            setActiveContent(<p>Please select a compensation option.</p>);
        }
        break;

      default:
        setActiveContent(<p>Content not found for this path.</p>);
    }
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
              const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
              return (
                <li key={index} className="relative">
                  <div
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
                      activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span className="icon mr-2">
                      <IconComponent size={24} />
                    </span>
                    <span className="menu-text flex-1">{item.label}</span>
                  </div>

                  {item.path === "/compensation" && showCompensationDropdown && (
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
                          activeSubItem === "SalaryBreakupMain" ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleMenuClick(item, "SalaryBreakupMain")}
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
          <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />
        )}
      </div>

      {/* ✅ HR Choice Popup */}
      {showHRChoice && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeading}>Choose View</h3>
            <p>Select which view you want to open for this section.</p>
            <div>
              <button
                style={{ ...styles.button, backgroundColor: "#007bff", color: "white" }}
                onClick={() => {
                  if (hrChoiceType === "dashboard") setActiveContent(<MyDashboard />);
                  else if (hrChoiceType === "task") setActiveContent(<TaskManagementHR />);
                  else if (hrChoiceType === "leave") setActiveContent(<LeaveQueries />);
                  else if (hrChoiceType === "reimbursement") setActiveContent(<ReimbursementHR />);
                  setShowHRChoice(false);
                }}
              >
                Admin View
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#28a745", color: "white" }}
                onClick={() => {
                  if (hrChoiceType === "dashboard") setActiveContent(<MyEmpDashboard />);
                  else if (hrChoiceType === "task") setActiveContent(<TaskManagementEmployee />);
                  else if (hrChoiceType === "leave") setActiveContent(<LeaveRequest />);
                  else if (hrChoiceType === "reimbursement") setActiveContent(<Reimbursement />);
                  setShowHRChoice(false);
                }}
              >
                Employee View
              </button>
            </div>
            <button style={styles.button} onClick={() => setShowHRChoice(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    color: "black",
    border: "3px solid green",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    width: "320px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  modalHeading: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
};

export default Sidebar;
