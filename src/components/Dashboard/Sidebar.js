

import React, { useState, useEffect, useContext } from "react";
import "./Sidebar.css";
import * as MdIcons from "react-icons/md";
import axios from "axios";

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
import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
import TaskManagement from "../TaskManagement/TaskManagement";
import Report from "../Report/ReportPanel";
import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";

const Sidebar = () => {
  const { setActiveContent } = useContext(ContentContext);
  const [menuItems, setMenuItems] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [activeSubItem, setActiveSubItem] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [mobileDropdown, setMobileDropdown] = useState({
    compensation: false,
    task: false,
    leave: false,
  });

  // Get employeeId reliably
  let employeeId = localStorage.getItem("employeeId");
  if (!employeeId) {
    const dashboardData = localStorage.getItem("dashboardData");
    if (dashboardData) {
      try {
        const parsed = JSON.parse(dashboardData);
        employeeId = parsed.employeeId || parsed.EmployeeId || parsed.id;
      } catch (e) {
        console.log("dashboardData not valid JSON");
      }
    }
  }

  const userRole = localStorage.getItem("userRole") || "Employee";
  const [activeNav, setActiveNav] = useState("/dashboard");
  const [hasSubordinates, setHasSubordinates] = useState(false);

  // Check if user has subordinates
  useEffect(() => {
    if (!employeeId) return;

    const fetchStatus = async () => {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/subordinate/status`,
          {
            withCredentials: true,
            headers: { "x-employee-id": employeeId },
          }
        );
        setHasSubordinates(resp.data.hasSubordinates === true);
      } catch (err) {
        console.error("Failed to fetch subordinate status", err);
        setHasSubordinates(false);
      }
    };

    fetchStatus();
  }, [employeeId]);

  // Load menu and default content
  useEffect(() => {
    const stored = localStorage.getItem("sidebarMenu");
    if (stored) {
      try {
        setMenuItems(JSON.parse(stored));
      } catch (e) {
        setMenuItems([]);
      }
    }

    setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
    setActiveItem("/dashboard");
  }, [setActiveContent, userRole]);

  const isAdmin = userRole === "Admin";
  const isHR = userRole === "HR";
  const isSupervisorRole = userRole === "Supervisor" || userRole === "Manager";
  const canSeeMyTaskManagement = isSupervisorRole || hasSubordinates;

  const handleMenuClick = (item, subOption = null) => {
    setActiveItem(item.path);
    setActiveNav(item.path);
    setShowMobileMenu(false);

    // Toggle dropdowns
    if (item.path === "/compensation" && !subOption) {
      setShowCompensationDropdown(p => !p);
      setShowTaskDropdown(false);
      setShowLeaveDropdown(false);
      setActiveSubItem("");
      return;
    }

    if (item.path === "/TaskManagement" && !subOption) {
      setShowTaskDropdown(p => !p);
      setShowCompensationDropdown(false);
      setShowLeaveDropdown(false);
      setActiveSubItem("");
      return;
    }

    if (item.path === "/leaveQueries" && !subOption && isHR) {
      setShowLeaveDropdown(p => !p);
      setShowCompensationDropdown(false);
      setShowTaskDropdown(false);
      setActiveSubItem("");
      return;
    }

    setShowCompensationDropdown(false);
    setShowTaskDropdown(false);
    setShowLeaveDropdown(false);
    setActiveSubItem(subOption || "");

    // Task Management sub-options
    if (item.path === "/TaskManagement" && subOption) {
      if (subOption === "admin" && isAdmin) {
        setActiveContent(<TaskManagementAdmin />);
      } else if (subOption === "hr" && isHR) {
        setActiveContent(<TaskManagementHR />);
      } else if (subOption === "supervisor" && canSeeMyTaskManagement) {
        setActiveContent(<TaskManagement />);
      } else {
        setActiveContent(<TaskManagementEmployee />);
      }
      return;
    }

    // ALL ORIGINAL MENU ITEMS — fully restored
    switch (item.path) {
      case "/dashboard":
        setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
        break;
      case "/Task":
      case "/TaskManagementEmployee":
        setActiveContent(<TaskManagementEmployee />);
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
        setActiveContent(userRole === "Admin" ? <LeaveQueries /> : <LeaveRequest />);
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
        if (userRole === "Admin") setActiveContent(<RbAdmin />);
        else if (userRole === "Manager") setActiveContent(<RbTeamLead />);
        else if (userRole === "HR") setActiveContent(<ReimbursementHR />);
        else setActiveContent(<Reimbursement />);
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
      <div className="sidebar bg-black text-white min-h-screen w-64 fixed top-0 left-0 flex flex-col">
        {userRole !== "Admin" && (
          <div className="view-profile p-4">
            <span onClick={() => setShowProfile(true)} className="cursor-pointer hover:text-blue-400">
              View Profile
            </span>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto mt-4">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => {
              const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;

              return (
                <li key={index} className="relative">
                  <div
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                      activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span className="icon mr-3"><IconComponent size={22} /></span>
                    <span className="menu-text flex-1 text-sm">{item.label}</span>
                  </div>

                  {/* Compensation */}
                  {item.path === "/compensation" && showCompensationDropdown && (
                    <ul className="desktop-submenu">
                      {[
                        { key: "create", label: "Create Compensation", icon: "MdOutlineAddCircleOutline" },
                        { key: "assign", label: "Assign Compensation", icon: "MdOutlineAssignmentInd" },
                        { key: "SalaryBreakupMain", label: "Salary Breakup", icon: "MdOutlineAccountBalance" },
                        { key: "EmployeeTable", label: "Salary Details", icon: "MdOutlineTableChart" },
                      ].map((opt) => {
                        const SubIcon = MdIcons[opt.icon] || MdIcons.MdOutlineDashboard;
                        return (
                          <li
                            key={opt.key}
                            className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
                            onClick={() => handleMenuClick(item, opt.key)}
                          >
                            <span className="icon"><SubIcon size={20} /></span>
                            <span>{opt.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* TASK MANAGEMENT — Admin & HR unchanged, others get hierarchy support */}
                  {item.path === "/TaskManagement" && showTaskDropdown && (
                    <ul className="desktop-submenu">
                      {/* Admin sees only Admin panel */}
                      {isAdmin && (
                        <li
                          className={`desktop-submenu-item ${activeSubItem === "admin" ? "active" : ""}`}
                          onClick={() => handleMenuClick(item, "admin")}
                        >
                          <span className="icon"><MdIcons.MdOutlineAdminPanelSettings size={20} /></span>
                          <span>Task Management Admin</span>
                        </li>
                      )}

                      {/* HR sees HR + Employee Tasks */}
                      {isHR && (
                        <>
                          <li
                            className={`desktop-submenu-item ${activeSubItem === "hr" ? "active" : ""}`}
                            onClick={() => handleMenuClick(item, "hr")}
                          >
                            <span className="icon"><MdIcons.MdOutlineAdminPanelSettings size={20} /></span>
                            <span>HR Task Management</span>
                          </li>
                          <li
                            className={`desktop-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
                            onClick={() => handleMenuClick(item, "employee")}
                          >
                            <span className="icon"><MdIcons.MdOutlinePeople size={20} /></span>
                            <span>Employee Tasks</span>
                          </li>
                        </>
                      )}

                      {/* Non-Admin/HR: My Task Management if qualified + Employee Tasks */}
                      {!isAdmin && !isHR && (
                        <>
                          {canSeeMyTaskManagement && (
                            <li
                              className={`desktop-submenu-item ${activeSubItem === "supervisor" ? "active" : ""}`}
                              onClick={() => handleMenuClick(item, "supervisor")}
                            >
                              <span className="icon"><MdIcons.MdOutlineDashboard size={20} /></span>
                              <span>My Task Management</span>
                            </li>
                          )}
                          <li
                            className={`desktop-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
                            onClick={() => handleMenuClick(item, "employee")}
                          >
                            <span className="icon"><MdIcons.MdOutlinePeople size={20} /></span>
                            <span>Employee Tasks</span>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </li>
              );
            })
          ) : (
            <p className="p-4 text-gray-400 text-sm">No menu items available</p>
          )}
        </ul>
      </div>

      {showProfile && <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Sidebar;