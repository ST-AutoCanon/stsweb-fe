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
  const [showCompensationDropdown, setShowCompensationDropdown] =
    useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
  const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [mobileDropdown, setMobileDropdown] = useState({
    compensation: false,
    task: false,
    hrTask: false,
    leave: false,
  });

  const employeeId = localStorage.getItem("employeeId");
  const userRole = localStorage.getItem("userRole") || "Employee";
  const [activeNav, setActiveNav] = useState("/dashboard");

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
      setShowTaskDropdown(false);
      setShowHRTaskDropdown(false);
      setShowLeaveDropdown(false);
    }
  }, [setActiveContent, userRole]);

  const getTaskManagementPath = () => {
    if (userRole === "Supervisor") return "/TaskManagement/supervisor";
    if (userRole === "HR") return "/TaskManagement/hr";
    if (userRole === "Admin") return "/TaskManagement/admin";
    return "/TaskManagement/employee";
  };

  const handleDirectTaskClick = () => {
    const item = { path: "/TaskManagement" };
    let content = null;
    let subOption = null;
    let navPath = "/TaskManagement";

    if (userRole === "Supervisor") {
      content = <TaskManagement />;
      subOption = "supervisor";
      navPath = "/TaskManagement/supervisor";
    } else if (userRole === "HR") {
      content = <TaskManagementHR />;
      subOption = "hr";
      navPath = "/TaskManagement/hr";
    } else if (userRole === "Admin") {
      content = <TaskManagementAdmin />;
      subOption = "admin";
      navPath = "/TaskManagement/admin";
    } else {
      content = <TaskManagementEmployee />;
      subOption = "employee";
      navPath = "/TaskManagement/employee";
    }

    setActiveContent(content);
    setActiveItem(item.path);
    setActiveSubItem(subOption);
    setActiveNav(navPath);
    setShowMobileMenu(false);
    setShowCompensationDropdown(false);
    setShowTaskDropdown(false);
    setShowHRTaskDropdown(false);
    setShowLeaveDropdown(false);
  };

  const handleMenuClick = (item, subOption = null) => {
    setActiveItem(item.path);
    setActiveNav(item.path);
    setShowMobileMenu(false);

    if (item.path === "/compensation" && !subOption) {
      setShowCompensationDropdown((prev) => !prev);
      setShowTaskDropdown(false);
      setShowHRTaskDropdown(false);
      setShowLeaveDropdown(false);
      setActiveSubItem("");
      return;
    }

    if (
      item.path === "/TaskManagement" &&
      !subOption &&
      userRole === "Supervisor"
    ) {
      setShowTaskDropdown((prev) => !prev);
      setShowCompensationDropdown(false);
      setShowHRTaskDropdown(false);
      setShowLeaveDropdown(false);
      setActiveSubItem("");
      return;
    }

    if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
      setShowHRTaskDropdown((prev) => !prev);
      setShowCompensationDropdown(false);
      setShowTaskDropdown(false);
      setShowLeaveDropdown(false);
      setActiveSubItem("");
      return;
    }

    if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
      setShowLeaveDropdown((prev) => !prev);
      setShowCompensationDropdown(false);
      setShowTaskDropdown(false);
      setShowHRTaskDropdown(false);
      setActiveSubItem("");
      return;
    }

    setShowCompensationDropdown(false);
    setShowTaskDropdown(false);
    setShowHRTaskDropdown(false);
    setShowLeaveDropdown(false);
    setActiveSubItem(subOption || "");

    if (item.path === "/TaskManagement" && subOption) {
      let content = null;
      let navPath = "/TaskManagement";

      if (userRole === "Supervisor") {
        if (subOption === "supervisor") {
          content = <TaskManagement />;
          navPath = "/TaskManagement/supervisor";
        } else {
          content = <TaskManagementEmployee />;
          navPath = "/TaskManagement/employee";
        }
      } else if (userRole === "HR") {
        if (subOption === "hr") {
          content = <TaskManagementHR />;
          navPath = "/TaskManagement/hr";
        } else {
          content = <TaskManagementEmployee />;
          navPath = "/TaskManagement/employee";
        }
      } else if (userRole === "Admin") {
        content = <TaskManagementAdmin />;
        navPath = "/TaskManagement/admin";
      } else {
        content = <TaskManagementEmployee />;
        navPath = "/TaskManagement/employee";
      }

      setActiveContent(content);
      setActiveNav(navPath);
      return;
    }

    if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
      switch (subOption) {
        case "employee":
          setActiveContent(<LeaveRequest />);
          break;
        case "admin":
          setActiveContent(<LeaveQueries />);
          break;
        default:
          setActiveContent(<LeaveRequest />);
      }
      return;
    }

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
          setActiveContent(<TaskManagement />);
        } else if (userRole === "HR") {
          setActiveContent(<TaskManagementHR />);
        } else if (userRole === "Admin") {
          setActiveContent(<TaskManagementAdmin />);
        } else {
          setActiveContent(<TaskManagementEmployee />);
        }
        break;
      case "/report":
        setActiveContent(<Report />);
        break;
      case "/TaskManagementAdmin":
        setActiveContent(<TaskManagementAdmin />);
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
        } else if (userRole === "HR") {
          setActiveContent(<LeaveRequest />);
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
        } else if (userRole === "HR") {
          setActiveContent(<ReimbursementHR />);
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

  const toggleMobileDropdown = (key) => {
    setMobileDropdown((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const closeAllMobileDropdowns = () => {
    setMobileDropdown({
      compensation: false,
      task: false,
      hrTask: false,
      leave: false,
    });
  };

  return (
    <>
      <div className="sidebar bg-black text-white min-h-screen w-64 fixed top-0 left-0 flex flex-col">
        {userRole !== "Admin" && (
          <div className="view-profile p-4">
            <span
              onClick={() => setShowProfile(true)}
              className="view-profile-text cursor-pointer hover:text-blue-400"
            >
              View Profile
            </span>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto mt-4">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => {
              const IconComponent =
                MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
              return (
                <li key={index} className="relative">
                  <div
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                      activeItem === item.path && !activeSubItem
                        ? "bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span className="icon mr-3">
                      <IconComponent size={22} />
                    </span>
                    <span className="menu-text flex-1 text-sm">
                      {item.label}
                    </span>
                  </div>

                  {item.path === "/compensation" &&
                    showCompensationDropdown && (
                      <ul className="desktop-submenu">
                        {[
                          {
                            key: "create",
                            label: "Create Compensation",
                            icon: "MdOutlineAddCircleOutline",
                          },
                          {
                            key: "assign",
                            label: "Assign Compensation",
                            icon: "MdOutlineAssignmentInd",
                          },
                          {
                            key: "SalaryBreakupMain",
                            label: "Salary Breakup",
                            icon: "MdOutlineAccountBalance",
                          },
                          {
                            key: "EmployeeTable",
                            label: "Salary Details",
                            icon: "MdOutlineTableChart",
                          },
                        ].map((opt) => {
                          const SubIcon =
                            MdIcons[opt.icon] || MdIcons.MdOutlineDashboard;
                          return (
                            <li
                              key={opt.key}
                              className={`desktop-submenu-item ${
                                activeSubItem === opt.key ? "active" : ""
                              }`}
                              onClick={() => handleMenuClick(item, opt.key)}
                            >
                              <span className="icon">
                                <SubIcon size={20} />
                              </span>
                              <span>{opt.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                  {item.path === "/TaskManagement" &&
                    userRole === "Supervisor" &&
                    showTaskDropdown && (
                      <ul className="desktop-submenu">
                        {[
                          {
                            key: "supervisor",
                            label: "My Task Management",
                            icon: "MdOutlineDashboard",
                          },
                          {
                            key: "employee",
                            label: "Employee Tasks",
                            icon: "MdOutlinePeople",
                          },
                        ].map((opt) => {
                          const SubIcon = MdIcons[opt.icon];
                          return (
                            <li
                              key={opt.key}
                              className={`desktop-submenu-item ${
                                activeSubItem === opt.key ? "active" : ""
                              }`}
                              onClick={() => handleMenuClick(item, opt.key)}
                            >
                              <span className="icon">
                                <SubIcon size={20} />
                              </span>
                              <span>{opt.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                  {item.path === "/TaskManagement" &&
                    userRole === "HR" &&
                    showHRTaskDropdown && (
                      <ul className="desktop-submenu">
                        {[
                          {
                            key: "hr",
                            label: "HR Task Management",
                            icon: "MdOutlineAdminPanelSettings",
                          },
                          {
                            key: "employee",
                            label: "Employee Tasks",
                            icon: "MdOutlinePeople",
                          },
                        ].map((opt) => {
                          const SubIcon = MdIcons[opt.icon];
                          return (
                            <li
                              key={opt.key}
                              className={`desktop-submenu-item ${
                                activeSubItem === opt.key ? "active" : ""
                              }`}
                              onClick={() => handleMenuClick(item, opt.key)}
                            >
                              <span className="icon">
                                <SubIcon size={20} />
                              </span>
                              <span>{opt.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                  {item.path === "/leaveQueries" &&
                    userRole === "HR" &&
                    showLeaveDropdown && (
                      <ul className="desktop-submenu">
                        {[
                          {
                            key: "employee",
                            label: "My Leave Requests",
                            icon: "MdOutlineCalendarToday",
                          },
                          {
                            key: "admin",
                            label: "Admin Leave Queries",
                            icon: "MdOutlineVerifiedUser",
                          },
                        ].map((opt) => {
                          const SubIcon = MdIcons[opt.icon];
                          return (
                            <li
                              key={opt.key}
                              className={`desktop-submenu-item ${
                                activeSubItem === opt.key ? "active" : ""
                              }`}
                              onClick={() => handleMenuClick(item, opt.key)}
                            >
                              <span className="icon">
                                <SubIcon size={20} />
                              </span>
                              <span>{opt.label}</span>
                            </li>
                          );
                        })}
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

      <div className="bottom-nav fixed bottom-0 w-full bg-white text-black flex justify-around py-2 md:hidden z-50">
        <button
          className={`p-2 ${
            activeNav === "/dashboard" ? "text-blue-500" : "text-gray-600"
          }`}
          onClick={() => handleMenuClick({ path: "/dashboard" })}
        >
          <MdIcons.MdHome size={26} />
        </button>
        <button
          className={`p-2 ${
            activeNav === "/employeeQueries" ? "text-blue-500" : "text-gray-600"
          }`}
          onClick={() => handleMenuClick({ path: "/employeeQueries" })}
        >
          <MdIcons.MdOutlineContactPhone size={26} />
        </button>
        <button
          className={`p-2 ${
            activeNav === "/leaveQueries" ? "text-blue-500" : "text-gray-600"
          }`}
          onClick={() => handleMenuClick({ path: "/leaveQueries" })}
        >
          <MdIcons.MdOutlineCommentBank size={26} />
        </button>
        <button
          className={`p-2 ${
            activeNav === "/reimbursement" ? "text-blue-500" : "text-gray-600"
          }`}
          onClick={() => handleMenuClick({ path: "/reimbursement" })}
        >
          <MdIcons.MdCurrencyRupee size={26} />
        </button>
        <button
          className={`p-2 ${
            activeNav === getTaskManagementPath()
              ? "text-blue-500"
              : "text-gray-600"
          }`}
          onClick={handleDirectTaskClick}
        >
          <MdIcons.MdOutlineTask size={26} />
        </button>
        <button
          className="p-2 text-gray-600"
          onClick={() => setShowMobileMenu(true)}
        >
          <MdIcons.MdMenu size={26} />
        </button>
      </div>

      {showMobileMenu && (
        <div
          className="mobile-menu-overlay"
          onClick={() => {
            setShowMobileMenu(false);
            closeAllMobileDropdowns();
          }}
        >
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-header">
              <h2 className="mobile-title">Menu</h2>

              {userRole !== "Admin" && (
                <button
                  className="mobile-profile-btn"
                  onClick={() => {
                    setShowProfile(true);
                    setShowMobileMenu(false);
                  }}
                >
                  View Profile
                </button>
              )}

              <button
                className="mobile-close"
                onClick={() => {
                  setShowMobileMenu(false);
                  closeAllMobileDropdowns();
                }}
              >
                <MdIcons.MdClose size={28} />
              </button>
            </div>

            <ul className="mobile-list">
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => {
                  const IconComponent =
                    MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
                  const hasDropdown =
                    item.path === "/compensation" ||
                    (item.path === "/TaskManagement" &&
                      (userRole === "Supervisor" || userRole === "HR")) ||
                    (item.path === "/leaveQueries" && userRole === "HR");

                  const isOpen =
                    (item.path === "/compensation" &&
                      mobileDropdown.compensation) ||
                    (item.path === "/TaskManagement" &&
                      userRole === "Supervisor" &&
                      mobileDropdown.task) ||
                    (item.path === "/TaskManagement" &&
                      userRole === "HR" &&
                      mobileDropdown.hrTask) ||
                    (item.path === "/leaveQueries" &&
                      userRole === "HR" &&
                      mobileDropdown.leave);

                  return (
                    <li key={index} className="mobile-list-item">
                      <div
                        className={`mobile-item ${
                          activeItem === item.path && !activeSubItem
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          if (hasDropdown) {
                            const key =
                              item.path === "/compensation"
                                ? "compensation"
                                : item.path === "/TaskManagement" &&
                                  userRole === "Supervisor"
                                ? "task"
                                : item.path === "/TaskManagement" &&
                                  userRole === "HR"
                                ? "hrTask"
                                : "leave";
                            toggleMobileDropdown(key);
                            return;
                          }
                          handleMenuClick(item);
                        }}
                      >
                        <span className="mobile-icon">
                          <IconComponent size={22} />
                        </span>
                        <span className="mobile-label">{item.label}</span>
                        {hasDropdown && (
                          <span className="mobile-arrow">
                            {isOpen ? (
                              <MdIcons.MdKeyboardArrowDown />
                            ) : (
                              <MdIcons.MdKeyboardArrowRight />
                            )}
                          </span>
                        )}
                      </div>

                      {/* Submenus */}
                      {item.path === "/compensation" &&
                        mobileDropdown.compensation && (
                          <ul className="mobile-submenu">
                            {[
                              { key: "create", label: "Create Compensation" },
                              { key: "assign", label: "Assign Compensation" },
                              {
                                key: "SalaryBreakupMain",
                                label: "Salary Breakup",
                              },
                              { key: "EmployeeTable", label: "Salary Details" },
                            ].map((opt) => (
                              <li
                                key={opt.key}
                                className={`mobile-submenu-item ${
                                  activeSubItem === opt.key ? "active" : ""
                                }`}
                                onClick={() => {
                                  handleMenuClick(item, opt.key);
                                  closeAllMobileDropdowns();
                                }}
                              >
                                {opt.label}
                              </li>
                            ))}
                          </ul>
                        )}

                      {item.path === "/TaskManagement" &&
                        userRole === "Supervisor" &&
                        mobileDropdown.task && (
                          <ul className="mobile-submenu">
                            <li
                              className={`mobile-submenu-item ${
                                activeSubItem === "supervisor" ? "active" : ""
                              }`}
                              onClick={() => {
                                handleMenuClick(item, "supervisor");
                                closeAllMobileDropdowns();
                              }}
                            >
                              My Task Management
                            </li>
                            <li
                              className={`mobile-submenu-item ${
                                activeSubItem === "employee" ? "active" : ""
                              }`}
                              onClick={() => {
                                handleMenuClick(item, "employee");
                                closeAllMobileDropdowns();
                              }}
                            >
                              Employee Tasks
                            </li>
                          </ul>
                        )}

                      {item.path === "/TaskManagement" &&
                        userRole === "HR" &&
                        mobileDropdown.hrTask && (
                          <ul className="mobile-submenu">
                            <li
                              className={`mobile-submenu-item ${
                                activeSubItem === "hr" ? "active" : ""
                              }`}
                              onClick={() => {
                                handleMenuClick(item, "hr");
                                closeAllMobileDropdowns();
                              }}
                            >
                              HR Task Management
                            </li>
                            <li
                              className={`mobile-submenu-item ${
                                activeSubItem === "employee" ? "active" : ""
                              }`}
                              onClick={() => {
                                handleMenuClick(item, "employee");
                                closeAllMobileDropdowns();
                              }}
                            >
                              Employee Tasks
                            </li>
                          </ul>
                        )}

                      {item.path === "/leaveQueries" &&
                        userRole === "HR" &&
                        mobileDropdown.leave && (
                          <ul className="mobile-submenu">
                            <li
                              className={`mobile-submenu-item ${
                                activeSubItem === "employee" ? "active" : ""
                              }`}
                              onClick={() => {
                                handleMenuClick(item, "employee");
                                closeAllMobileDropdowns();
                              }}
                            >
                              My Leave Requests
                            </li>
                            <li
                              className={`mobile-submenu-item ${
                                activeSubItem === "admin" ? "active" : ""
                              }`}
                              onClick={() => {
                                handleMenuClick(item, "admin");
                                closeAllMobileDropdowns();
                              }}
                            >
                              Admin Leave Queries
                            </li>
                          </ul>
                        )}
                    </li>
                  );
                })
              ) : (
                <p className="mobile-no-items">No menu items available</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {showProfile && (
        <Profile
          employeeId={employeeId}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
