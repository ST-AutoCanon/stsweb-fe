// // // import React, { useState, useEffect, useContext } from "react";
// // // import "./Sidebar.css";
// // // import * as MdIcons from "react-icons/md";
// // // import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// // // import AddDepartment from "../AddDepartment/AddDepartment";
// // // import AdminQuery from "../EmployeeQueries/AdminQuery";
// // // import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// // // import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// // // import LeaveQueries from "../LeaveQueries/Admin";
// // // import LeaveRequest from "../LeaveQueries/LeaveRequest";
// // // import Profile from "../Profile/Profile";
// // // import MyDashboard from "../MyDashboard/MyDashboard";
// // // import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// // // import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// // // import PayrollSummary from "../PayrollSummary/PayrollSummary";
// // // import Reimbursement from "../Reimbursement/Reimbursement";
// // // import RbAdmin from "../Reimbursement/RbAdmin";
// // // import RbTeamLead from "../Reimbursement/RbTeamLead";
// // // import Assets from "../Assets/assets";
// // // import Vendors from "../vendors/vendors";
// // // import Chat from "../Chat/ChatPage";
// // // import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// // // import LetterHead from "../letterHead/letterhead";
// // // import NoteDashboard from "../Notes/NoteDashboard";
// // // import CreateCompensation from "../Compensation/createCompensation";
// // // import AssignCompensation from "../Compensation/assignCompensation";
// // // import OvertimeDetails from "../Compensation/OvertimeDetails";
// // // import { ContentContext } from "./Context";
// // // import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// // // import OvertimeSummary from "../Compensation/overtimeSupervisor";
// // // import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";

// // // import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// // // import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// // // import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// // // import TaskManagement from "../TaskManagement/TaskManagement";
// // // import Report from "../Report/ReportPanel";
// // // import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// // // const Sidebar = () => {
// // //   const { setActiveContent } = useContext(ContentContext);
// // //   const [menuItems, setMenuItems] = useState([]);
// // //   const [activeItem, setActiveItem] = useState("");
// // //   const [activeSubItem, setActiveSubItem] = useState("");
// // //   const [showProfile, setShowProfile] = useState(false);
// // //   const [showCompensationDropdown, setShowCompensationDropdown] =
// // //     useState(false);
// // //   const employeeId = localStorage.getItem("employeeId");
// // //   const userRole = localStorage.getItem("userRole") || "Employee";
// // //   const dashboardData = JSON.parse(
// // //     localStorage.getItem("dashboardData") || "{}"
// // //   );
// // //   const userPosition = dashboardData.position;
// // //   const [activeNav, setActiveNav] = useState("/dashboard");
// // //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// // //   useEffect(() => {
// // //     const storedData = localStorage.getItem("sidebarMenu");
// // //     if (storedData) {
// // //       try {
// // //         const parsedData = JSON.parse(storedData);
// // //         setMenuItems(parsedData || []);
// // //       } catch (error) {
// // //         console.error("Error parsing sidebar menu:", error);
// // //         setMenuItems([]);
// // //       }
// // //     }

// // //     if (setActiveContent) {
// // //       if (userRole === "Admin") {
// // //         setActiveContent(<MyDashboard />);
// // //         setActiveItem("/dashboard");
// // //       } else {
// // //         setActiveContent(<MyEmpDashboard />);
// // //       }
// // //       setActiveSubItem("");
// // //       setShowCompensationDropdown(false);
// // //     }
// // //   }, [setActiveContent, userRole]);

// // //   const handleMenuClick = (item, subOption = null) => {
// // //     console.log("Menu clicked:", item.path, "Sub-option:", subOption); // Debug log
// // //     setActiveItem(item.path);
// // //     setActiveNav(item.path);
// // //     setShowMobileMenu(false);

// // //     if (item.path === "/compensation" && !subOption) {
// // //       setShowCompensationDropdown((prev) => !prev);
// // //       setActiveSubItem("");
// // //       return;
// // //     }

// // //     setShowCompensationDropdown(subOption ? true : false);
// // //     setActiveSubItem(subOption || "");

// // //     switch (item.path) {
// // //       case "/dashboard":
// // //         setActiveContent(
// // //           userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />
// // //         );
// // //         break;

// // //       case "/Task":
// // //         setActiveContent(<TaskManagementEmployee />);
// // //         break;

// // //       case "/TaskManagementEmployee":
// // //         setActiveContent(<TaskManagementEmployee />);
// // //         break;

// // //       case "/TaskManagement":
// // //         if (userRole === "Supervisor") {
// // //           setActiveContent(<TaskManagement />); // Supervisor view
// // //         } else {
// // //           setActiveContent(<TaskManagementEmployee />); // fallback for Employee
// // //         }
// // //         break;
// // //       case "/report":
// // //         setActiveContent(<Report />);
// // //         break;
// // // case "/TaskManagementAdmin":
// // //         setActiveContent(<TaskManagementAdmin/>);
// // //         break;
// // //       case "/employeeDetails":
// // //         setActiveContent(<EmployeeDetails />);
// // //         break;
// // //       case "/addDepartment":
// // //         setActiveContent(<AddDepartment />);
// // //         break;
// // //       case "/updateProjects":
// // //         setActiveContent(<UpdateProject />);
// // //         break;
// // //       case "/leaveQueries":
// // //         if (userRole === "Admin") {
// // //           setActiveContent(<LeaveQueries />);
// // //         } else {
// // //           setActiveContent(<LeaveRequest />);
// // //         }
// // //         break;
// // //       case "/Salary_Statement":
// // //         setActiveContent(<SalaryStatementWrapper />);
// // //         break;
// // //       case "/letterHead":
// // //         setActiveContent(<LetterHead />);
// // //         break;
// // //       case "/payrollSummary":
// // //         setActiveContent(<PayrollSummary />);
// // //         break;
// // //       case "/messenger":
// // //         setActiveContent(<Chat />);
// // //         break;
// // //       case "/reimbursement":
// // //         if (userRole === "Admin") {
// // //           setActiveContent(<RbAdmin />);
// // //         } else if (userRole === "Manager") {
// // //           setActiveContent(<RbTeamLead />);
// // //         } else {
// // //           setActiveContent(<Reimbursement />);
// // //         }
// // //         break;

// // //       case "/employeeQueries":
// // //         setActiveContent(
// // //           userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />
// // //         );
// // //         break;
// // //       case "/assets":
// // //         setActiveContent(<Assets />);
// // //         break;
// // //       case "/vendors":
// // //         setActiveContent(<Vendors />);
// // //         break;
// // //       case "/notes":
// // //         setActiveContent(<NoteDashboard />);
// // //         break;
// // //       case "/EmployeeLogin":
// // //         setActiveContent(<EmployeeLogin />);
// // //         break;
// // //       case "/Overtime":
// // //         setActiveContent(<OvertimeDetails />);
// // //         break;
// // //       case "/OvertimeSummary":
// // //         setActiveContent(<OvertimeSummary />);
// // //         break;
// // //       case "/compensation":
// // //   switch (subOption) {
// // //     case "create":
// // //       setActiveContent(<CreateCompensation />);
// // //       break;
// // //     case "assign":
// // //       setActiveContent(<AssignCompensation />);
// // //       break;
// // //     case "SalaryBreakupMain":
// // //       setActiveContent(<SalaryBreakupMain />);
// // //       break;
// // //     case "EmployeeTable":
// // //   setActiveContent(<SalaryDetails />); // UPDATED: Render standalone SalaryDetails (fetches own data, no wrapper)
// // //   break;
// // //     default:
// // //       setActiveContent(<p>Please select a compensation option.</p>);
// // //   }
// // //   break;

            

          

// // //       default:
// // //         setActiveContent(<p>Content not found for this path.</p>);
// // //     }
// // //   };

// // //   const toggleProfile = () => {
// // //     setShowProfile(!showProfile);
// // //   };

// // //   return (
// // //     <>
// // //       <div className="sidebar bg-gray-800 text-white min-h-screen w-64 fixed">
// // //         {userRole !== "Admin" && (
// // //           <div className="view-profile p-4">
// // //             <span
// // //               onClick={() => setShowProfile(!showProfile)}
// // //               className="view-profile-text cursor-pointer hover:text-blue-400"
// // //             >
// // //               View Profile
// // //             </span>
// // //           </div>
// // //         )}
// // //         <ul className="mt-4">
// // //           {menuItems.length > 0 ? (
// // //             menuItems.map((item, index) => {
// // //               const IconComponent =
// // //                 MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// // //               return (
// // //                 <li key={index} className="relative">
// // //                   <div
// // //                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
// // //                       activeItem === item.path && !activeSubItem
// // //                         ? "bg-gray-700"
// // //                         : ""
// // //                     }`}
// // //                     onClick={() => handleMenuClick(item)}
// // //                   >
// // //                     <span className="icon mr-2">
// // //                       <IconComponent size={24} />
// // //                     </span>
// // //                     <span className="menu-text flex-1">{item.label}</span>
// // //                   </div>
// // //                   {item.path === "/compensation" &&
// // //                     showCompensationDropdown && (
// // //                       <ul className="ml-8 bg-gray-900 rounded-md">
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "create" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "create")}
// // //                         >
// // //                           Create Compensation
// // //                         </li>
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "assign" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "assign")}
// // //                         >
// // //                           Assign Compensation
// // //                         </li>
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "SalaryBreakupMain"
// // //                               ? "bg-gray-700"
// // //                               : ""
// // //                           }`}
// // //                           onClick={() =>
// // //                             handleMenuClick(item, "SalaryBreakupMain")
// // //                           }
// // //                         >
// // //                           Salary Breakup
// // //                         </li>
// // //                   <li
// // //   className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //     activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
// // //   }`}
// // //   onClick={() => handleMenuClick(item, "EmployeeTable")}
// // // >
// // //   Salary Details
// // // </li>


// // //                       </ul>
// // //                     )}
// // //                 </li>
// // //               );
// // //             })
// // //           ) : (
// // //             <p className="no-menu p-4">No menu items available</p>
// // //           )}
// // //         </ul>
// // //         {showProfile && (
// // //           <Profile
// // //             employeeId={employeeId}
// // //             onClose={() => setShowProfile(false)}
// // //           />
// // //         )}
// // //       </div>

// // //       <div className="bottom-nav fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2 md:hidden">
// // //         <button
// // //           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
// // //           onClick={() => handleMenuClick({ path: "/dashboard" })}
// // //         >
// // //           <MdIcons.MdHome size={24} />
// // //         </button>
// // //         <button
// // //           className={`p-2 ${
// // //             activeNav === "/employeeQueries" ? "text-blue-400" : ""
// // //           }`}
// // //           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
// // //         >
// // //           <MdIcons.MdOutlineContactPhone size={24} />
// // //         </button>
// // //         <button
// // //           className={`p-2 ${
// // //             activeNav === "/leaveQueries" ? "text-blue-400" : ""
// // //           }`}
// // //           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
// // //         >
// // //           <MdIcons.MdOutlineCommentBank size={24} />
// // //         </button>
// // //         <button
// // //           className={`p-2 ${
// // //             activeNav === "/reimbursement" ? "text-blue-400" : ""
// // //           }`}
// // //           onClick={() => handleMenuClick({ path: "/reimbursement" })}
// // //         >
// // //           <MdIcons.MdCurrencyRupee size={24} />
// // //         </button>
// // //         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
// // //           <MdIcons.MdMenu size={24} />
// // //         </button>
// // //       </div>

// // //       {showMobileMenu && (
// // //         <div
// // //           className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-end"
// // //           onClick={() => setShowMobileMenu(false)}
// // //         >
// // //           <div
// // //             className="mobile-menu bg-gray-800 text-white w-64 h-full p-4"
// // //             onClick={(e) => e.stopPropagation()}
// // //           >
// // //             <button
// // //               className="close-menu text-xl mb-4"
// // //               onClick={() => setShowMobileMenu(false)}
// // //             >
// // //               ✖
// // //             </button>
// // //             <ul>
// // //               {menuItems.length > 0 ? (
// // //                 menuItems.map((item, index) => {
// // //                   const IconComponent =
// // //                     MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// // //                   return (
// // //                     <li key={index} className="relative">
// // //                       <div
// // //                         className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
// // //                           activeItem === item.path && !activeSubItem
// // //                             ? "bg-gray-700"
// // //                             : ""
// // //                         }`}
// // //                         onClick={() => handleMenuClick(item)}
// // //                       >
// // //                         <span className="icon mr-2">
// // //                           <IconComponent size={24} />
// // //                         </span>
// // //                         <span className="menu-text flex-1">{item.label}</span>
// // //                       </div>
// // //                       {item.path === "/compensation" &&
// // //                         showCompensationDropdown && (
// // //                           <ul className="ml-8 bg-gray-900 rounded-md">
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "create" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "create")}
// // //                             >
// // //                               Create Compensation
// // //                             </li>
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "assign" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "assign")}
// // //                             >
// // //                               Assign Compensation
// // //                             </li>
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "SalaryBreakupMain"
// // //                                   ? "bg-gray-700"
// // //                                   : ""
// // //                               }`}
// // //                               onClick={() =>
// // //                                 handleMenuClick(item, "SalaryBreakupMain")
// // //                               }
// // //                             >
// // //                               Salary Breakup
// // //                             </li>
// // //                           </ul>
// // //                         )}
// // //                     </li>
// // //                   );
// // //                 })
// // //               ) : (
// // //                 <p className="no-menu p-2">No menu items available</p>
// // //               )}
// // //             </ul>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // export default Sidebar;

// // import React, { useState, useEffect, useContext } from "react";
// // import "./Sidebar.css";
// // import * as MdIcons from "react-icons/md";
// // import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// // import AddDepartment from "../AddDepartment/AddDepartment";
// // import AdminQuery from "../EmployeeQueries/AdminQuery";
// // import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// // import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// // import LeaveQueries from "../LeaveQueries/Admin";
// // import LeaveRequest from "../LeaveQueries/LeaveRequest";
// // import Profile from "../Profile/Profile";
// // import MyDashboard from "../MyDashboard/MyDashboard";
// // import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// // import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// // import PayrollSummary from "../PayrollSummary/PayrollSummary";
// // import Reimbursement from "../Reimbursement/Reimbursement";
// // import RbAdmin from "../Reimbursement/RbAdmin";
// // import RbTeamLead from "../Reimbursement/RbTeamLead";
// // import Assets from "../Assets/assets";
// // import Vendors from "../vendors/vendors";
// // import Chat from "../Chat/ChatPage";
// // import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// // import LetterHead from "../letterHead/letterhead";
// // import NoteDashboard from "../Notes/NoteDashboard";
// // import CreateCompensation from "../Compensation/createCompensation";
// // import AssignCompensation from "../Compensation/assignCompensation";
// // import OvertimeDetails from "../Compensation/OvertimeDetails";
// // import { ContentContext } from "./Context";
// // import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// // import OvertimeSummary from "../Compensation/overtimeSupervisor";
// // import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// // import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// // import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// // import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// // import TaskManagement from "../TaskManagement/TaskManagement";
// // import Report from "../Report/ReportPanel";
// // import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";

// // const Sidebar = () => {
// //   const { setActiveContent } = useContext(ContentContext);
// //   const [menuItems, setMenuItems] = useState([]);
// //   const [activeItem, setActiveItem] = useState("");
// //   const [activeSubItem, setActiveSubItem] = useState("");
// //   const [showProfile, setShowProfile] = useState(false);
// //   const [showCompensationDropdown, setShowCompensationDropdown] =
// //     useState(false);
// //   const [showTaskDropdown, setShowTaskDropdown] = useState(false); // NEW: Task dropdown state
// //   const employeeId = localStorage.getItem("employeeId");
// //   const userRole = localStorage.getItem("userRole") || "Employee";
// //   const dashboardData = JSON.parse(
// //     localStorage.getItem("dashboardData") || "{}"
// //   );
// //   const userPosition = dashboardData.position;
// //   const [activeNav, setActiveNav] = useState("/dashboard");
// //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// //   useEffect(() => {
// //     const storedData = localStorage.getItem("sidebarMenu");
// //     if (storedData) {
// //       try {
// //         const parsedData = JSON.parse(storedData);
// //         setMenuItems(parsedData || []);
// //       } catch (error) {
// //         console.error("Error parsing sidebar menu:", error);
// //         setMenuItems([]);
// //       }
// //     }
// //     if (setActiveContent) {
// //       if (userRole === "Admin") {
// //         setActiveContent(<MyDashboard />);
// //         setActiveItem("/dashboard");
// //       } else {
// //         setActiveContent(<MyEmpDashboard />);
// //       }
// //       setActiveSubItem("");
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false); // Close task dropdown on load
// //     }
// //   }, [setActiveContent, userRole]);

// //   const handleMenuClick = (item, subOption = null) => {
// //     console.log("Menu clicked:", item.path, "Sub-option:", subOption);
// //     setActiveItem(item.path);
// //     setActiveNav(item.path);
// //     setShowMobileMenu(false);

// //     // Handle Compensation Dropdown
// //     if (item.path === "/compensation" && !subOption) {
// //       setShowCompensationDropdown((prev) => !prev);
// //       setShowTaskDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     // Handle Task Dropdown (only for Supervisor)
// //     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
// //       setShowTaskDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     // Close all dropdowns when selecting sub-option
// //     setShowCompensationDropdown(false);
// //     setShowTaskDropdown(false);
// //     setActiveSubItem(subOption || "");

// //     // Handle Task Management Sub-options
// //     if (item.path === "/TaskManagement" && subOption) {
// //       switch (subOption) {
// //         case "supervisor":
// //           setActiveContent(<TaskManagement />);
// //           break;
// //         case "employee":
// //           setActiveContent(<TaskManagementEmployee />);
// //           break;
// //         default:
// //           setActiveContent(<TaskManagementEmployee />);
// //       }
// //       return;
// //     }

// //     switch (item.path) {
// //       case "/dashboard":
// //         setActiveContent(
// //           userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />
// //         );
// //         break;
// //       case "/Task":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagementEmployee":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagement":
// //         if (userRole === "Supervisor") {
// //           setActiveContent(<TaskManagement />);
// //         } else {
// //           setActiveContent(<TaskManagementEmployee />);
// //         }
// //         break;
// //       case "/report":
// //         setActiveContent(<Report />);
// //         break;
// //       case "/TaskManagementAdmin":
// //         setActiveContent(<TaskManagementAdmin />);
// //         break;
// //       case "/employeeDetails":
// //         setActiveContent(<EmployeeDetails />);
// //         break;
// //       case "/addDepartment":
// //         setActiveContent(<AddDepartment />);
// //         break;
// //       case "/updateProjects":
// //         setActiveContent(<UpdateProject />);
// //         break;
// //       case "/leaveQueries":
// //         if (userRole === "Admin") {
// //           setActiveContent(<LeaveQueries />);
// //         } else {
// //           setActiveContent(<LeaveRequest />);
// //         }
// //         break;
// //       case "/Salary_Statement":
// //         setActiveContent(<SalaryStatementWrapper />);
// //         break;
// //       case "/letterHead":
// //         setActiveContent(<LetterHead />);
// //         break;
// //       case "/payrollSummary":
// //         setActiveContent(<PayrollSummary />);
// //         break;
// //       case "/messenger":
// //         setActiveContent(<Chat />);
// //         break;
// //       case "/reimbursement":
// //         if (userRole === "Admin") {
// //           setActiveContent(<RbAdmin />);
// //         } else if (userRole === "Manager") {
// //           setActiveContent(<RbTeamLead />);
// //         } else {
// //           setActiveContent(<Reimbursement />);
// //         }
// //         break;
// //       case "/employeeQueries":
// //         setActiveContent(
// //           userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />
// //         );
// //         break;
// //       case "/assets":
// //         setActiveContent(<Assets />);
// //         break;
// //       case "/vendors":
// //         setActiveContent(<Vendors />);
// //         break;
// //       case "/notes":
// //         setActiveContent(<NoteDashboard />);
// //         break;
// //       case "/EmployeeLogin":
// //         setActiveContent(<EmployeeLogin />);
// //         break;
// //       case "/Overtime":
// //         setActiveContent(<OvertimeDetails />);
// //         break;
// //       case "/OvertimeSummary":
// //         setActiveContent(<OvertimeSummary />);
// //         break;
// //       case "/compensation":
// //         switch (subOption) {
// //           case "create":
// //             setActiveContent(<CreateCompensation />);
// //             break;
// //           case "assign":
// //             setActiveContent(<AssignCompensation />);
// //             break;
// //           case "SalaryBreakupMain":
// //             setActiveContent(<SalaryBreakupMain />);
// //             break;
// //           case "EmployeeTable":
// //             setActiveContent(<SalaryDetails />);
// //             break;
// //           default:
// //             setActiveContent(<p>Please select a compensation option.</p>);
// //         }
// //         break;

// //       default:
// //         setActiveContent(<p>Content not found for this path.</p>);
// //     }
// //   };

// //   const toggleProfile = () => {
// //     setShowProfile(!showProfile);
// //   };

// //   return (
// //     <>
// //       <div className="sidebar bg-gray-800 text-white min-h-screen w-64 fixed">
// //         {userRole !== "Admin" && (
// //           <div className="view-profile p-4">
// //             <span
// //               onClick={() => setShowProfile(!showProfile)}
// //               className="view-profile-text cursor-pointer hover:text-blue-400"
// //             >
// //               View Profile
// //             </span>
// //           </div>
// //         )}
// //         <ul className="mt-4">
// //           {menuItems.length > 0 ? (
// //             menuItems.map((item, index) => {
// //               const IconComponent =
// //                 MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //               return (
// //                 <li key={index} className="relative">
// //                   <div
// //                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
// //                       activeItem === item.path && !activeSubItem
// //                         ? "bg-gray-700"
// //                         : ""
// //                     }`}
// //                     onClick={() => handleMenuClick(item)}
// //                   >
// //                     <span className="icon mr-2">
// //                       <IconComponent size={24} />
// //                     </span>
// //                     <span className="menu-text flex-1">{item.label}</span>
// //                   </div>

// //                   {/* Compensation Dropdown */}
// //                   {item.path === "/compensation" &&
// //                     showCompensationDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "create" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "create")}
// //                         >
// //                           Create Compensation
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "assign" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "assign")}
// //                         >
// //                           Assign Compensation
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "SalaryBreakupMain"
// //                               ? "bg-gray-700"
// //                               : ""
// //                           }`}
// //                           onClick={() =>
// //                             handleMenuClick(item, "SalaryBreakupMain")
// //                           }
// //                         >
// //                           Salary Breakup
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "EmployeeTable")}
// //                         >
// //                           Salary Details
// //                         </li>
// //                       </ul>
// //                     )}

// //                   {/* Task Management Dropdown (Only for Supervisor) */}
// //                   {item.path === "/TaskManagement" &&
// //                     userRole === "Supervisor" &&
// //                     showTaskDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "supervisor" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "supervisor")}
// //                         >
// //                           My Task Management
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "employee")}
// //                         >
// //                           Employee Tasks
// //                         </li>
// //                       </ul>
// //                     )}
// //                 </li>
// //               );
// //             })
// //           ) : (
// //             <p className="no-menu p-4">No menu items available</p>
// //           )}
// //         </ul>
// //         {showProfile && (
// //           <Profile
// //             employeeId={employeeId}
// //             onClose={() => setShowProfile(false)}
// //           />
// //         )}
// //       </div>

// //       {/* Bottom Navigation */}
// //       <div className="bottom-nav fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2 md:hidden">
// //         <button
// //           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/dashboard" })}
// //         >
// //           <MdIcons.MdHome size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${
// //             activeNav === "/employeeQueries" ? "text-blue-400" : ""
// //           }`}
// //           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
// //         >
// //           <MdIcons.MdOutlineContactPhone size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${
// //             activeNav === "/leaveQueries" ? "text-blue-400" : ""
// //           }`}
// //           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
// //         >
// //           <MdIcons.MdOutlineCommentBank size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${
// //             activeNav === "/reimbursement" ? "text-blue-400" : ""
// //           }`}
// //           onClick={() => handleMenuClick({ path: "/reimbursement" })}
// //         >
// //           <MdIcons.MdCurrencyRupee size={24} />
// //         </button>
// //         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
// //           <MdIcons.MdMenu size={24} />
// //         </button>
// //       </div>

// //       {/* Mobile Menu */}
// //       {showMobileMenu && (
// //         <div
// //           className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-end"
// //           onClick={() => setShowMobileMenu(false)}
// //         >
// //           <div
// //             className="mobile-menu bg-gray-800 text-white w-64 h-full p-4"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <button
// //               className="close-menu text-xl mb-4"
// //               onClick={() => setShowMobileMenu(false)}
// //             >
// //               X
// //             </button>
// //             <ul>
// //               {menuItems.length > 0 ? (
// //                 menuItems.map((item, index) => {
// //                   const IconComponent =
// //                     MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //                   return (
// //                     <li key={index} className="relative">
// //                       <div
// //                         className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeItem === item.path && !activeSubItem
// //                             ? "bg-gray-700"
// //                             : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item)}
// //                       >
// //                         <span className="icon mr-2">
// //                           <IconComponent size={24} />
// //                         </span>
// //                         <span className="menu-text flex-1">{item.label}</span>
// //                       </div>

// //                       {/* Compensation Dropdown in Mobile */}
// //                       {item.path === "/compensation" &&
// //                         showCompensationDropdown && (
// //                           <ul className="ml-8 bg-gray-900 rounded-md">
// //                             <li
// //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                                 activeSubItem === "create" ? "bg-gray-700" : ""
// //                               }`}
// //                               onClick={() => handleMenuClick(item, "create")}
// //                             >
// //                               Create Compensation
// //                             </li>
// //                             <li
// //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                                 activeSubItem === "assign" ? "bg-gray-700" : ""
// //                               }`}
// //                               onClick={() => handleMenuClick(item, "assign")}
// //                             >
// //                               Assign Compensation
// //                             </li>
// //                             <li
// //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                                 activeSubItem === "SalaryBreakupMain"
// //                                   ? "bg-gray-700"
// //                                   : ""
// //                               }`}
// //                               onClick={() =>
// //                                 handleMenuClick(item, "SalaryBreakupMain")
// //                               }
// //                             >
// //                               Salary Breakup
// //                             </li>
// //                           </ul>
// //                         )}

// //                       {/* Task Dropdown in Mobile (Supervisor Only) */}
// //                       {item.path === "/TaskManagement" &&
// //                         userRole === "Supervisor" &&
// //                         showTaskDropdown && (
// //                           <ul className="ml-8 bg-gray-900 rounded-md">
// //                             <li
// //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                                 activeSubItem === "supervisor" ? "bg-gray-700" : ""
// //                               }`}
// //                               onClick={() => handleMenuClick(item, "supervisor")}
// //                             >
// //                               My Task Management
// //                             </li>
// //                             <li
// //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                                 activeSubItem === "employee" ? "bg-gray-700" : ""
// //                               }`}
// //                               onClick={() => handleMenuClick(item, "employee")}
// //                             >
// //                               Employee Tasks
// //                             </li>
// //                           </ul>
// //                         )}
// //                     </li>
// //                   );
// //                 })
// //               ) : (
// //                 <p className="no-menu p-2">No menu items available</p>
// //               )}
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Sidebar;

// import React, { useState, useEffect, useContext } from "react";
// import "./Sidebar.css";
// import * as MdIcons from "react-icons/md";
// import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// import AddDepartment from "../AddDepartment/AddDepartment";
// import AdminQuery from "../EmployeeQueries/AdminQuery";
// import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// import LeaveQueries from "../LeaveQueries/Admin";
// import LeaveRequest from "../LeaveQueries/LeaveRequest";
// import Profile from "../Profile/Profile";
// import MyDashboard from "../MyDashboard/MyDashboard";
// import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// import PayrollSummary from "../PayrollSummary/PayrollSummary";
// import Reimbursement from "../Reimbursement/Reimbursement";
// import RbAdmin from "../Reimbursement/RbAdmin";
// import RbTeamLead from "../Reimbursement/RbTeamLead";
// import Assets from "../Assets/assets";
// import Vendors from "../vendors/vendors";
// import Chat from "../Chat/ChatPage";
// import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// import LetterHead from "../letterHead/letterhead";
// import NoteDashboard from "../Notes/NoteDashboard";
// import CreateCompensation from "../Compensation/createCompensation";
// import AssignCompensation from "../Compensation/assignCompensation";
// import OvertimeDetails from "../Compensation/OvertimeDetails";
// import { ContentContext } from "./Context";
// import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// import OvertimeSummary from "../Compensation/overtimeSupervisor";
// import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// import TaskManagement from "../TaskManagement/TaskManagement";
// import Report from "../Report/ReportPanel";
// import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// import TaskManagementHR from "../TaskManagementHR/TaskManagementHR"; // NEW: HR Task Management
// import ReimbursementHR from "../Reimbursement/ReimbursementHR";
// const Sidebar = () => {
//   const { setActiveContent } = useContext(ContentContext);
//   const [menuItems, setMenuItems] = useState([]);
//   const [activeItem, setActiveItem] = useState("");
//   const [activeSubItem, setActiveSubItem] = useState("");
//   const [showProfile, setShowProfile] = useState(false);
//   const [showCompensationDropdown, setShowCompensationDropdown] =
//     useState(false);
//   const [showTaskDropdown, setShowTaskDropdown] = useState(false); // For Supervisor
//   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false); // NEW: For HR
//   const employeeId = localStorage.getItem("employeeId");
//   const userRole = localStorage.getItem("userRole") || "Employee";
//   const dashboardData = JSON.parse(
//     localStorage.getItem("dashboardData") || "{}"
//   );
//   const userPosition = dashboardData.position;
//   const [activeNav, setActiveNav] = useState("/dashboard");
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   useEffect(() => {
//     const storedData = localStorage.getItem("sidebarMenu");
//     if (storedData) {
//       try {
//         const parsedData = JSON.parse(storedData);
//         setMenuItems(parsedData || []);
//       } catch (error) {
//         console.error("Error parsing sidebar menu:", error);
//         setMenuItems([]);
//       }
//     }
//     if (setActiveContent) {
//       if (userRole === "Admin") {
//         setActiveContent(<MyDashboard />);
//         setActiveItem("/dashboard");
//       } else {
//         setActiveContent(<MyEmpDashboard />);
//       }
//       setActiveSubItem("");
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false); // Reset HR dropdown
//     }
//   }, [setActiveContent, userRole]);

//   const handleMenuClick = (item, subOption = null) => {
//     console.log("Menu clicked:", item.path, "Sub-option:", subOption);
//     setActiveItem(item.path);
//     setActiveNav(item.path);
//     setShowMobileMenu(false);

//     // Compensation Dropdown
//     if (item.path === "/compensation" && !subOption) {
//       setShowCompensationDropdown((prev) => !prev);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     // Supervisor Task Dropdown
//     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
//       setShowTaskDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowHRTaskDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     // HR Task Dropdown
//     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
//       setShowHRTaskDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     // Close all dropdowns on sub-option click
//     setShowCompensationDropdown(false);
//     setShowTaskDropdown(false);
//     setShowHRTaskDropdown(false);
//     setActiveSubItem(subOption || "");

//     // Handle Task Management Sub-options
//     if (item.path === "/TaskManagement" && subOption) {
//       if (userRole === "Supervisor") {
//         switch (subOption) {
//           case "supervisor":
//             setActiveContent(<TaskManagement />);
//             break;
//           case "employee":
//             setActiveContent(<TaskManagementEmployee />);
//             break;
//           default:
//             setActiveContent(<TaskManagementEmployee />);
//         }
//       } else if (userRole === "HR") {
//         switch (subOption) {
//           case "hr":
//             setActiveContent(<TaskManagementHR />);
//             break;
//           case "employee":
//             setActiveContent(<TaskManagementEmployee />);
//             break;
//           default:
//             setActiveContent(<TaskManagementEmployee />);
//         }
//       }
//       return;
//     }

//     switch (item.path) {
//       case "/dashboard":
//         setActiveContent(
//           userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />
//         );
//         break;
//       case "/Task":
//         setActiveContent(<TaskManagementEmployee />);
//         break;
//       case "/TaskManagementEmployee":
//         setActiveContent(<TaskManagementEmployee />);
//         break;
//       case "/TaskManagement":
//         if (userRole === "Supervisor") {
//           setActiveContent(<TaskManagement />);
//         } else if (userRole === "HR") {
//           setActiveContent(<TaskManagementHR />);
//           } else if (userRole === "Admin") {
//           setActiveContent(<TaskManagementAdmin />);
//         } else {
//           setActiveContent(<TaskManagementEmployee />);
//         }
//         break;
//       case "/report":
//         setActiveContent(<Report />);
//         break;
//       case "/TaskManagementAdmin":
//         setActiveContent(<TaskManagementAdmin />);
//         break;
//       case "/employeeDetails":
//         setActiveContent(<EmployeeDetails />);
//         break;
//       case "/addDepartment":
//         setActiveContent(<AddDepartment />);
//         break;
//       case "/updateProjects":
//         setActiveContent(<UpdateProject />);
//         break;
//       case "/leaveQueries":
//         if (userRole === "Admin") {
//           setActiveContent(<LeaveQueries />);
//         } else {
//           setActiveContent(<LeaveRequest />);
//         }
//         break;
//       case "/Salary_Statement":
//         setActiveContent(<SalaryStatementWrapper />);
//         break;
//       case "/letterHead":
//         setActiveContent(<LetterHead />);
//         break;
//       case "/payrollSummary":
//         setActiveContent(<PayrollSummary />);
//         break;
//       case "/messenger":
//         setActiveContent(<Chat />);
//         break;
//       case "/reimbursement":
//         if (userRole === "Admin") {
//           setActiveContent(<RbAdmin />);
//         } else if (userRole === "Manager") {
//           setActiveContent(<RbTeamLead />);
//         }
//           else if (userRole === "HR") {
//           setActiveContent(<ReimbursementHR />);
//         } else {
//           setActiveContent(<Reimbursement />);
//         }
//         break;
//       case "/employeeQueries":
//         setActiveContent(
//           userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />
//         );
//         break;
//       case "/assets":
//         setActiveContent(<Assets />);
//         break;
//       case "/vendors":
//         setActiveContent(<Vendors />);
//         break;
//       case "/notes":
//         setActiveContent(<NoteDashboard />);
//         break;
//       case "/EmployeeLogin":
//         setActiveContent(<EmployeeLogin />);
//         break;
//       case "/Overtime":
//         setActiveContent(<OvertimeDetails />);
//         break;
//       case "/OvertimeSummary":
//         setActiveContent(<OvertimeSummary />);
//         break;
//       case "/compensation":
//         switch (subOption) {
//           case "create":
//             setActiveContent(<CreateCompensation />);
//             break;
//           case "assign":
//             setActiveContent(<AssignCompensation />);
//             break;
//           case "SalaryBreakupMain":
//             setActiveContent(<SalaryBreakupMain />);
//             break;
//           case "EmployeeTable":
//             setActiveContent(<SalaryDetails />);
//             break;
//           default:
//             setActiveContent(<p>Please select a compensation option.</p>);
//         }
//         break;

//       default:
//         setActiveContent(<p>Content not found for this path.</p>);
//     }
//   };

//   const toggleProfile = () => {
//     setShowProfile(!showProfile);
//   };

//   return (
//     <>
//       <div className="sidebar bg-gray-800 text-white min-h-screen w-64 fixed">
//         {userRole !== "Admin" && (
//           <div className="view-profile p-4">
//             <span
//               onClick={() => setShowProfile(!showProfile)}
//               className="view-profile-text cursor-pointer hover:text-blue-400"
//             >
//               View Profile
//             </span>
//           </div>
//         )}
//         <ul className="mt-4">
//           {menuItems.length > 0 ? (
//             menuItems.map((item, index) => {
//               const IconComponent =
//                 MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
//               return (
//                 <li key={index} className="relative">
//                   <div
//                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
//                       activeItem === item.path && !activeSubItem
//                         ? "bg-gray-700"
//                         : ""
//                     }`}
//                     onClick={() => handleMenuClick(item)}
//                   >
//                     <span className="icon mr-2">
//                       <IconComponent size={24} />
//                     </span>
//                     <span className="menu-text flex-1">{item.label}</span>
//                   </div>

//                   {/* Compensation Dropdown */}
//                   {item.path === "/compensation" &&
//                     showCompensationDropdown && (
//                       <ul className="ml-8 bg-gray-900 rounded-md">
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "create" ? "bg-gray-700" : ""
//                           }`}
//                           onClick={() => handleMenuClick(item, "create")}
//                         >
//                           Create Compensation
//                         </li>
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "assign" ? "bg-gray-700" : ""
//                           }`}
//                           onClick={() => handleMenuClick(item, "assign")}
//                         >
//                           Assign Compensation
//                         </li>
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "SalaryBreakupMain"
//                               ? "bg-gray-700"
//                               : ""
//                           }`}
//                           onClick={() =>
//                             handleMenuClick(item, "SalaryBreakupMain")
//                           }
//                         >
//                           Salary Breakup
//                         </li>
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
//                           }`}
//                           onClick={() => handleMenuClick(item, "EmployeeTable")}
//                         >
//                           Salary Details
//                         </li>
//                       </ul>
//                     )}

//                   {/* Supervisor Task Dropdown */}
//                   {item.path === "/TaskManagement" &&
//                     userRole === "Supervisor" &&
//                     showTaskDropdown && (
//                       <ul className="ml-8 bg-gray-900 rounded-md">
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "supervisor" ? "bg-gray-700" : ""
//                           }`}
//                           onClick={() => handleMenuClick(item, "supervisor")}
//                         >
//                           My Task Management
//                         </li>
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "employee" ? "bg-gray-700" : ""
//                           }`}
//                           onClick={() => handleMenuClick(item, "employee")}
//                         >
//                           Employee Tasks
//                         </li>
//                       </ul>
//                     )}

//                   {/* HR Task Dropdown */}
//                   {item.path === "/TaskManagement" &&
//                     userRole === "HR" &&
//                     showHRTaskDropdown && (
//                       <ul className="ml-8 bg-gray-900 rounded-md">
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "hr" ? "bg-gray-700" : ""
//                           }`}
//                           onClick={() => handleMenuClick(item, "hr")}
//                         >
//                           HR Task Management
//                         </li>
//                         <li
//                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                             activeSubItem === "employee" ? "bg-gray-700" : ""
//                           }`}
//                           onClick={() => handleMenuClick(item, "employee")}
//                         >
//                           Employee Tasks
//                         </li>
//                       </ul>
//                     )}
//                 </li>
//               );
//             })
//           ) : (
//             <p className="no-menu p-4">No menu items available</p>
//           )}
//         </ul>
//         {showProfile && (
//           <Profile
//             employeeId={employeeId}
//             onClose={() => setShowProfile(false)}
//           />
//         )}
//       </div>

//       {/* Bottom Navigation */}
//       <div className="bottom-nav fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2 md:hidden">
//         <button
//           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/dashboard" })}
//         >
//           <MdIcons.MdHome size={24} />
//         </button>
//         <button
//           className={`p-2 ${
//             activeNav === "/employeeQueries" ? "text-blue-400" : ""
//           }`}
//           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
//         >
//           <MdIcons.MdOutlineContactPhone size={24} />
//         </button>
//         <button
//           className={`p-2 ${
//             activeNav === "/leaveQueries" ? "text-blue-400" : ""
//           }`}
//           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
//         >
//           <MdIcons.MdOutlineCommentBank size={24} />
//         </button>
//         <button
//           className={`p-2 ${
//             activeNav === "/reimbursement" ? "text-blue-400" : ""
//           }`}
//           onClick={() => handleMenuClick({ path: "/reimbursement" })}
//         >
//           <MdIcons.MdCurrencyRupee size={24} />
//         </button>
//         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
//           <MdIcons.MdMenu size={24} />
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {showMobileMenu && (
//         <div
//           className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-end"
//           onClick={() => setShowMobileMenu(false)}
//         >
//           <div
//             className="mobile-menu bg-gray-800 text-white w-64 h-full p-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="close-menu text-xl mb-4"
//               onClick={() => setShowMobileMenu(false)}
//             >
//               X
//             </button>
//             <ul>
//               {menuItems.length > 0 ? (
//                 menuItems.map((item, index) => {
//                   const IconComponent =
//                     MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
//                   return (
//                     <li key={index} className="relative">
//                       <div
//                         className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
//                           activeItem === item.path && !activeSubItem
//                             ? "bg-gray-700"
//                             : ""
//                         }`}
//                         onClick={() => handleMenuClick(item)}
//                       >
//                         <span className="icon mr-2">
//                           <IconComponent size={24} />
//                         </span>
//                         <span className="menu-text flex-1">{item.label}</span>
//                       </div>

//                       {/* Compensation Dropdown in Mobile */}
//                       {item.path === "/compensation" &&
//                         showCompensationDropdown && (
//                           <ul className="ml-8 bg-gray-900 rounded-md">
//                             <li
//                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                                 activeSubItem === "create" ? "bg-gray-700" : ""
//                               }`}
//                               onClick={() => handleMenuClick(item, "create")}
//                             >
//                               Create Compensation
//                             </li>
//                             <li
//                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                                 activeSubItem === "assign" ? "bg-gray-700" : ""
//                               }`}
//                               onClick={() => handleMenuClick(item, "assign")}
//                             >
//                               Assign Compensation
//                             </li>
//                             <li
//                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                                 activeSubItem === "SalaryBreakupMain"
//                                   ? "bg-gray-700"
//                                   : ""
//                               }`}
//                               onClick={() =>
//                                 handleMenuClick(item, "SalaryBreakupMain")
//                               }
//                             >
//                               Salary Breakup
//                             </li>
//                           </ul>
//                         )}

//                       {/* Supervisor Task Dropdown in Mobile */}
//                       {item.path === "/TaskManagement" &&
//                         userRole === "Supervisor" &&
//                         showTaskDropdown && (
//                           <ul className="ml-8 bg-gray-900 rounded-md">
//                             <li
//                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                                 activeSubItem === "supervisor" ? "bg-gray-700" : ""
//                               }`}
//                               onClick={() => handleMenuClick(item, "supervisor")}
//                             >
//                               My Task Management
//                             </li>
//                             <li
//                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                                 activeSubItem === "employee" ? "bg-gray-700" : ""
//                               }`}
//                               onClick={() => handleMenuClick(item, "employee")}
//                             >
//                               Employee Tasks
//                             </li>
//                           </ul>
//                         )}

//                       {/* HR Task Dropdown in Mobile */}
//                       {item.path === "/TaskManagement" &&
//                         userRole === "HR" &&
//                         showHRTaskDropdown && (
//                           <ul className="ml-8 bg-gray-900 rounded-md">
//                             <li
//                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                                 activeSubItem === "hr" ? "bg-gray-700" : ""
//                               }`}
//                               onClick={() => handleMenuClick(item, "hr")}
//                             >
//                               HR Task Management
//                             </li>
//                             <li
//                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
//                                 activeSubItem === "employee" ? "bg-gray-700" : ""
//                               }`}
//                               onClick={() => handleMenuClick(item, "employee")}
//                             >
//                               Employee Tasks
//                             </li>
//                           </ul>
//                         )}
//                     </li>
//                   );
//                 })
//               ) : (
//                 <p className="no-menu p-2">No menu items available</p>
//               )}
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;

// // // // import React, { useState, useEffect, useContext } from "react";
// // // // import "./Sidebar.css";
// // // // import * as MdIcons from "react-icons/md";
// // // // import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// // // // import AddDepartment from "../AddDepartment/AddDepartment";
// // // // import AdminQuery from "../EmployeeQueries/AdminQuery";
// // // // import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// // // // import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// // // // import LeaveQueries from "../LeaveQueries/Admin";
// // // // import LeaveRequest from "../LeaveQueries/LeaveRequest";
// // // // import Profile from "../Profile/Profile";
// // // // import MyDashboard from "../MyDashboard/MyDashboard";
// // // // import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// // // // import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// // // // import PayrollSummary from "../PayrollSummary/PayrollSummary";
// // // // import Reimbursement from "../Reimbursement/Reimbursement";
// // // // import RbAdmin from "../Reimbursement/RbAdmin";
// // // // import RbTeamLead from "../Reimbursement/RbTeamLead";
// // // // import Assets from "../Assets/assets";
// // // // import Vendors from "../vendors/vendors";
// // // // import Chat from "../Chat/ChatPage";
// // // // import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// // // // import LetterHead from "../letterHead/letterhead";
// // // // import NoteDashboard from "../Notes/NoteDashboard";
// // // // import CreateCompensation from "../Compensation/createCompensation";
// // // // import AssignCompensation from "../Compensation/assignCompensation";
// // // // import OvertimeDetails from "../Compensation/OvertimeDetails";
// // // // import { ContentContext } from "./Context";
// // // // import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// // // // import OvertimeSummary from "../Compensation/overtimeSupervisor";
// // // // import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// // // // import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// // // // import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// // // // import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// // // // import TaskManagement from "../TaskManagement/TaskManagement";
// // // // import Report from "../Report/ReportPanel";
// // // // import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// // // // import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";
// // // // import ReimbursementHR from "../Reimbursement/ReimbursementHR";

// // // // const Sidebar = () => {
// // // //   const { setActiveContent } = useContext(ContentContext);
// // // //   const [menuItems, setMenuItems] = useState([]);
// // // //   const [activeItem, setActiveItem] = useState("");
// // // //   const [activeSubItem, setActiveSubItem] = useState("");
// // // //   const [showProfile, setShowProfile] = useState(false);
// // // //   const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
// // // //   const [showTaskDropdown, setShowTaskDropdown] = useState(false);
// // // //   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
// // // //   const [showLeaveDropdown, setShowLeaveDropdown] = useState(false); // NEW: For HR Leave

// // // //   const employeeId = localStorage.getItem("employeeId");
// // // //   const userRole = localStorage.getItem("userRole") || "Employee";
// // // //   const dashboardData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
// // // //   const userPosition = dashboardData.position;
// // // //   const [activeNav, setActiveNav] = useState("/dashboard");
// // // //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// // // //   useEffect(() => {
// // // //     const storedData = localStorage.getItem("sidebarMenu");
// // // //     if (storedData) {
// // // //       try {
// // // //         const parsedData = JSON.parse(storedData);
// // // //         setMenuItems(parsedData || []);
// // // //       } catch (error) {
// // // //         console.error("Error parsing sidebar menu:", error);
// // // //         setMenuItems([]);
// // // //       }
// // // //     }
// // // //     if (setActiveContent) {
// // // //       if (userRole === "Admin") {
// // // //         setActiveContent(<MyDashboard />);
// // // //         setActiveItem("/dashboard");
// // // //       } else {
// // // //         setActiveContent(<MyEmpDashboard />);
// // // //       }
// // // //       setActiveSubItem("");
// // // //       setShowCompensationDropdown(false);
// // // //       setShowTaskDropdown(false);
// // // //       setShowHRTaskDropdown(false);
// // // //       setShowLeaveDropdown(false); // Reset leave dropdown
// // // //     }
// // // //   }, [setActiveContent, userRole]);

// // // //   const handleMenuClick = (item, subOption = null) => {
// // // //     console.log("Menu clicked:", item.path, "Sub-option:", subOption);
// // // //     setActiveItem(item.path);
// // // //     setActiveNav(item.path);
// // // //     setShowMobileMenu(false);

// // // //     // Compensation Dropdown
// // // //     if (item.path === "/compensation" && !subOption) {
// // // //       setShowCompensationDropdown((prev) => !prev);
// // // //       setShowTaskDropdown(false);
// // // //       setShowHRTaskDropdown(false);
// // // //       setShowLeaveDropdown(false);
// // // //       setActiveSubItem("");
// // // //       return;
// // // //     }

// // // //     // Supervisor Task Dropdown
// // // //     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
// // // //       setShowTaskDropdown((prev) => !prev);
// // // //       setShowCompensationDropdown(false);
// // // //       setShowHRTaskDropdown(false);
// // // //       setShowLeaveDropdown(false);
// // // //       setActiveSubItem("");
// // // //       return;
// // // //     }

// // // //     // HR Task Dropdown
// // // //     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
// // // //       setShowHRTaskDropdown((prev) => !prev);
// // // //       setShowCompensationDropdown(false);
// // // //       setShowTaskDropdown(false);
// // // //       setShowLeaveDropdown(false);
// // // //       setActiveSubItem("");
// // // //       return;
// // // //     }

// // // //     // HR Leave Dropdown
// // // //     if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
// // // //       setShowLeaveDropdown((prev) => !prev);
// // // //       setShowCompensationDropdown(false);
// // // //       setShowTaskDropdown(false);
// // // //       setShowHRTaskDropdown(false);
// // // //       setActiveSubItem("");
// // // //       return;
// // // //     }

// // // //     // Close all dropdowns on sub-option click
// // // //     setShowCompensationDropdown(false);
// // // //     setShowTaskDropdown(false);
// // // //     setShowHRTaskDropdown(false);
// // // //     setShowLeaveDropdown(false);
// // // //     setActiveSubItem(subOption || "");

// // // //     // Handle Task Management Sub-options
// // // //     if (item.path === "/TaskManagement" && subOption) {
// // // //       if (userRole === "Supervisor") {
// // // //         switch (subOption) {
// // // //           case "supervisor":
// // // //             setActiveContent(<TaskManagement />);
// // // //             break;
// // // //           case "employee":
// // // //             setActiveContent(<TaskManagementEmployee />);
// // // //             break;
// // // //           default:
// // // //             setActiveContent(<TaskManagementEmployee />);
// // // //         }
// // // //       } else if (userRole === "HR") {
// // // //         switch (subOption) {
// // // //           case "hr":
// // // //             setActiveContent(<TaskManagementHR />);
// // // //             break;
// // // //           case "employee":
// // // //             setActiveContent(<TaskManagementEmployee />);
// // // //             break;
// // // //           default:
// // // //             setActiveContent(<TaskManagementEmployee />);
// // // //         }
// // // //       }
// // // //       return;
// // // //     }

// // // //     // Handle Leave Sub-options (HR only)
// // // //     if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
// // // //       switch (subOption) {
// // // //         case "employee":
// // // //           setActiveContent(<LeaveRequest />);
// // // //           break;
// // // //         case "admin":
// // // //           setActiveContent(<LeaveQueries />);
// // // //           break;
// // // //         default:
// // // //           setActiveContent(<LeaveRequest />);
// // // //       }
// // // //       return;
// // // //     }

// // // //     switch (item.path) {
// // // //       case "/dashboard":
// // // //         setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
// // // //         break;
// // // //       case "/Task":
// // // //         setActiveContent(<TaskManagementEmployee />);
// // // //         break;
// // // //       case "/TaskManagementEmployee":
// // // //         setActiveContent(<TaskManagementEmployee />);
// // // //         break;
// // // //       case "/TaskManagement":
// // // //         if (userRole === "Supervisor") {
// // // //           setActiveContent(<TaskManagement />);
// // // //         } else if (userRole === "HR") {
// // // //           setActiveContent(<TaskManagementHR />);
// // // //         } else if (userRole === "Admin") {
// // // //           setActiveContent(<TaskManagementAdmin />);
// // // //         } else {
// // // //           setActiveContent(<TaskManagementEmployee />);
// // // //         }
// // // //         break;
// // // //       case "/report":
// // // //         setActiveContent(<Report />);
// // // //         break;
// // // //       case "/TaskManagementAdmin":
// // // //         setActiveContent(<TaskManagementAdmin />);
// // // //         break;
// // // //       case "/employeeDetails":
// // // //         setActiveContent(<EmployeeDetails />);
// // // //         break;
// // // //       case "/addDepartment":
// // // //         setActiveContent(<AddDepartment />);
// // // //         break;
// // // //       case "/updateProjects":
// // // //         setActiveContent(<UpdateProject />);
// // // //         break;
// // // //       case "/leaveQueries":
// // // //         if (userRole === "Admin") {
// // // //           setActiveContent(<LeaveQueries />);
// // // //         } else if (userRole === "HR") {
// // // //           setActiveContent(<LeaveRequest />); // Default for HR
// // // //         } else {
// // // //           setActiveContent(<LeaveRequest />);
// // // //         }
// // // //         break;
// // // //       case "/Salary_Statement":
// // // //         setActiveContent(<SalaryStatementWrapper />);
// // // //         break;
// // // //       case "/letterHead":
// // // //         setActiveContent(<LetterHead />);
// // // //         break;
// // // //       case "/payrollSummary":
// // // //         setActiveContent(<PayrollSummary />);
// // // //         break;
// // // //       case "/messenger":
// // // //         setActiveContent(<Chat />);
// // // //         break;
// // // //       case "/reimbursement":
// // // //         if (userRole === "Admin") {
// // // //           setActiveContent(<RbAdmin />);
// // // //         } else if (userRole === "Manager") {
// // // //           setActiveContent(<RbTeamLead />);
// // // //         } else if (userRole === "HR") {
// // // //           setActiveContent(<ReimbursementHR />);
// // // //         } else {
// // // //           setActiveContent(<Reimbursement />);
// // // //         }
// // // //         break;
// // // //       case "/employeeQueries":
// // // //         setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
// // // //         break;
// // // //       case "/assets":
// // // //         setActiveContent(<Assets />);
// // // //         break;
// // // //       case "/vendors":
// // // //         setActiveContent(<Vendors />);
// // // //         break;
// // // //       case "/notes":
// // // //         setActiveContent(<NoteDashboard />);
// // // //         break;
// // // //       case "/EmployeeLogin":
// // // //         setActiveContent(<EmployeeLogin />);
// // // //         break;
// // // //       case "/Overtime":
// // // //         setActiveContent(<OvertimeDetails />);
// // // //         break;
// // // //       case "/OvertimeSummary":
// // // //         setActiveContent(<OvertimeSummary />);
// // // //         break;
// // // //       case "/compensation":
// // // //         switch (subOption) {
// // // //           case "create":
// // // //             setActiveContent(<CreateCompensation />);
// // // //             break;
// // // //           case "assign":
// // // //             setActiveContent(<AssignCompensation />);
// // // //             break;
// // // //           case "SalaryBreakupMain":
// // // //             setActiveContent(<SalaryBreakupMain />);
// // // //             break;
// // // //           case "EmployeeTable":
// // // //             setActiveContent(<SalaryDetails />);
// // // //             break;
// // // //           default:
// // // //             setActiveContent(<p>Please select a compensation option.</p>);
// // // //         }
// // // //         break;

// // // //       default:
// // // //         setActiveContent(<p>Content not found for this path.</p>);
// // // //     }
// // // //   };

// // // //   const toggleProfile = () => {
// // // //     setShowProfile(!showProfile);
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <div className="sidebar bg-gray-800 text-white min-h-screen w-64 fixed">
// // // //         {userRole !== "Admin" && (
// // // //           <div className="view-profile p-4">
// // // //             <span
// // // //               onClick={() => setShowProfile(!showProfile)}
// // // //               className="view-profile-text cursor-pointer hover:text-blue-400"
// // // //             >
// // // //               View Profile
// // // //             </span>
// // // //           </div>
// // // //         )}
// // // //         <ul className="mt-4">
// // // //           {menuItems.length > 0 ? (
// // // //             menuItems.map((item, index) => {
// // // //               const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// // // //               return (
// // // //                 <li key={index} className="relative">
// // // //                   <div
// // // //                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
// // // //                       activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// // // //                     }`}
// // // //                     onClick={() => handleMenuClick(item)}
// // // //                   >
// // // //                     <span className="icon mr-2">
// // // //                       <IconComponent size={24} />
// // // //                     </span>
// // // //                     <span className="menu-text flex-1">{item.label}</span>
// // // //                   </div>

// // // //                   {/* Compensation Dropdown */}
// // // //                   {item.path === "/compensation" && showCompensationDropdown && (
// // // //                     <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                       <li
// // // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                           activeSubItem === "create" ? "bg-gray-700" : ""
// // // //                         }`}
// // // //                         onClick={() => handleMenuClick(item, "create")}
// // // //                       >
// // // //                         Create Compensation
// // // //                       </li>
// // // //                       <li
// // // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                           activeSubItem === "assign" ? "bg-gray-700" : ""
// // // //                         }`}
// // // //                         onClick={() => handleMenuClick(item, "assign")}
// // // //                       >
// // // //                         Assign Compensation
// // // //                       </li>
// // // //                       <li
// // // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                           activeSubItem === "SalaryBreakupMain" ? "bg-gray-700" : ""
// // // //                         }`}
// // // //                         onClick={() => handleMenuClick(item, "SalaryBreakupMain")}
// // // //                       >
// // // //                         Salary Breakup
// // // //                       </li>
// // // //                       <li
// // // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                           activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
// // // //                         }`}
// // // //                         onClick={() => handleMenuClick(item, "EmployeeTable")}
// // // //                       >
// // // //                         Salary Details
// // // //                       </li>
// // // //                     </ul>
// // // //                   )}

// // // //                   {/* Supervisor Task Dropdown */}
// // // //                   {item.path === "/TaskManagement" &&
// // // //                     userRole === "Supervisor" &&
// // // //                     showTaskDropdown && (
// // // //                       <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                         <li
// // // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                             activeSubItem === "supervisor" ? "bg-gray-700" : ""
// // // //                           }`}
// // // //                           onClick={() => handleMenuClick(item, "supervisor")}
// // // //                         >
// // // //                           My Task Management
// // // //                         </li>
// // // //                         <li
// // // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// // // //                           }`}
// // // //                           onClick={() => handleMenuClick(item, "employee")}
// // // //                         >
// // // //                           Employee Tasks
// // // //                         </li>
// // // //                       </ul>
// // // //                     )}

// // // //                   {/* HR Task Dropdown */}
// // // //                   {item.path === "/TaskManagement" &&
// // // //                     userRole === "HR" &&
// // // //                     showHRTaskDropdown && (
// // // //                       <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                         <li
// // // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                             activeSubItem === "hr" ? "bg-gray-700" : ""
// // // //                           }`}
// // // //                           onClick={() => handleMenuClick(item, "hr")}
// // // //                         >
// // // //                           HR Task Management
// // // //                         </li>
// // // //                         <li
// // // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// // // //                           }`}
// // // //                           onClick={() => handleMenuClick(item, "employee")}
// // // //                         >
// // // //                           Employee Tasks
// // // //                         </li>
// // // //                       </ul>
// // // //                     )}

// // // //                   {/* HR Leave Dropdown */}
// // // //                   {item.path === "/leaveQueries" &&
// // // //                     userRole === "HR" &&
// // // //                     showLeaveDropdown && (
// // // //                       <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                         <li
// // // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// // // //                           }`}
// // // //                           onClick={() => handleMenuClick(item, "employee")}
// // // //                         >
// // // //                           My Leave Requests
// // // //                         </li>
// // // //                         <li
// // // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                             activeSubItem === "admin" ? "bg-gray-700" : ""
// // // //                           }`}
// // // //                           onClick={() => handleMenuClick(item, "admin")}
// // // //                         >
// // // //                           Admin Leave Queries
// // // //                         </li>
// // // //                       </ul>
// // // //                     )}
// // // //                 </li>
// // // //               );
// // // //             })
// // // //           ) : (
// // // //             <p className="no-menu p-4">No menu items available</p>
// // // //           )}
// // // //         </ul>
// // // //         {showProfile && (
// // // //           <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />
// // // //         )}
// // // //       </div>

// // // //       {/* Bottom Navigation */}
// // // //       <div className="bottom-nav fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2 md:hidden">
// // // //         <button
// // // //           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
// // // //           onClick={() => handleMenuClick({ path: "/dashboard" })}
// // // //         >
// // // //           <MdIcons.MdHome size={24} />
// // // //         </button>
// // // //         <button
// // // //           className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-400" : ""}`}
// // // //           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
// // // //         >
// // // //           <MdIcons.MdOutlineContactPhone size={24} />
// // // //         </button>
// // // //         <button
// // // //           className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-400" : ""}`}
// // // //           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
// // // //         >
// // // //           <MdIcons.MdOutlineCommentBank size={24} />
// // // //         </button>
// // // //         <button
// // // //           className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-400" : ""}`}
// // // //           onClick={() => handleMenuClick({ path: "/reimbursement" })}
// // // //         >
// // // //           <MdIcons.MdCurrencyRupee size={24} />
// // // //         </button>
// // // //         <button
// // // //   className={`p-2 ${activeNav === "/TaskManagement" ? "text-blue-400" : ""}`}
// // // //   onClick={() =>
// // // //     handleMenuClick({
// // // //       path: "/TaskManagement",
// // // //       label: "TaskManagement",
// // // //       icon: "MdTaskAlt", // any placeholder icon name
// // // //     })
// // // //   }
// // // // >
// // // //   <MdIcons.MdTaskAlt size={24} />
// // // // </button>

// // // //         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
// // // //           <MdIcons.MdMenu size={24} />
// // // //         </button>
// // // //       </div>

// // // //       {/* Mobile Menu */}
// // // //       {showMobileMenu && (
// // // //         <div
// // // //           className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-end"
// // // //           onClick={() => setShowMobileMenu(false)}
// // // //         >
// // // //           <div
// // // //             className="mobile-menu bg-gray-800 text-white w-64 h-full p-4"
// // // //             onClick={(e) => e.stopPropagation()}
// // // //           >
// // // //             <button
// // // //               className="close-menu text-xl mb-4"
// // // //               onClick={() => setShowMobileMenu(false)}
// // // //             >
// // // //               X
// // // //             </button>
// // // //             <ul>
// // // //               {menuItems.length > 0 ? (
// // // //                 menuItems.map((item, index) => {
// // // //                   const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// // // //                   return (
// // // //                     <li key={index} className="relative">
// // // //                       <div
// // // //                         className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                           activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// // // //                         }`}
// // // //                         onClick={() => handleMenuClick(item)}
// // // //                       >
// // // //                         <span className="icon mr-2">
// // // //                           <IconComponent size={24} />
// // // //                         </span>
// // // //                         <span className="menu-text flex-1">{item.label}</span>
// // // //                       </div>

// // // //                       {/* Compensation Dropdown in Mobile */}
// // // //                       {item.path === "/compensation" && showCompensationDropdown && (
// // // //                         <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                           <li
// // // //                             className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                               activeSubItem === "create" ? "bg-gray-700" : ""
// // // //                             }`}
// // // //                             onClick={() => handleMenuClick(item, "create")}
// // // //                           >
// // // //                             Create Compensation
// // // //                           </li>
// // // //                           <li
// // // //                             className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                               activeSubItem === "assign" ? "bg-gray-700" : ""
// // // //                             }`}
// // // //                             onClick={() => handleMenuClick(item, "assign")}
// // // //                           >
// // // //                             Assign Compensation
// // // //                           </li>
// // // //                           <li
// // // //                             className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                               activeSubItem === "SalaryBreakupMain" ? "bg-gray-700" : ""
// // // //                             }`}
// // // //                             onClick={() => handleMenuClick(item, "SalaryBreakupMain")}
// // // //                           >
// // // //                             Salary Breakup
// // // //                           </li>
// // // //                         </ul>
// // // //                       )}

// // // //                       {/* Supervisor Task Dropdown in Mobile */}
// // // //                       {item.path === "/TaskManagement" &&
// // // //                         userRole === "Supervisor" &&
// // // //                         showTaskDropdown && (
// // // //                           <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                             <li
// // // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                                 activeSubItem === "supervisor" ? "bg-gray-700" : ""
// // // //                               }`}
// // // //                               onClick={() => handleMenuClick(item, "supervisor")}
// // // //                             >
// // // //                               My Task Management
// // // //                             </li>
// // // //                             <li
// // // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                                 activeSubItem === "employee" ? "bg-gray-700" : ""
// // // //                               }`}
// // // //                               onClick={() => handleMenuClick(item, "employee")}
// // // //                             >
// // // //                               Employee Tasks
// // // //                             </li>
// // // //                           </ul>
// // // //                         )}

// // // //                       {/* HR Task Dropdown in Mobile */}
// // // //                       {item.path === "/TaskManagement" &&
// // // //                         userRole === "HR" &&
// // // //                         showHRTaskDropdown && (
// // // //                           <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                             <li
// // // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                                 activeSubItem === "hr" ? "bg-gray-700" : ""
// // // //                               }`}
// // // //                               onClick={() => handleMenuClick(item, "hr")}
// // // //                             >
// // // //                               HR Task Management
// // // //                             </li>
// // // //                             <li
// // // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                                 activeSubItem === "employee" ? "bg-gray-700" : ""
// // // //                               }`}
// // // //                               onClick={() => handleMenuClick(item, "employee")}
// // // //                             >
// // // //                               Employee Tasks
// // // //                             </li>
// // // //                           </ul>
// // // //                         )}

// // // //                       {/* HR Leave Dropdown in Mobile */}
// // // //                       {item.path === "/leaveQueries" &&
// // // //                         userRole === "HR" &&
// // // //                         showLeaveDropdown && (
// // // //                           <ul className="ml-8 bg-gray-900 rounded-md">
// // // //                             <li
// // // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                                 activeSubItem === "employee" ? "bg-gray-700" : ""
// // // //                               }`}
// // // //                               onClick={() => handleMenuClick(item, "employee")}
// // // //                             >
// // // //                               My Leave Requests
// // // //                             </li>
// // // //                             <li
// // // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // // //                                 activeSubItem === "admin" ? "bg-gray-700" : ""
// // // //                               }`}
// // // //                               onClick={() => handleMenuClick(item, "admin")}
// // // //                             >
// // // //                               Admin Leave Queries
// // // //                             </li>
// // // //                           </ul>
// // // //                         )}
// // // //                     </li>
// // // //                   );
// // // //                 })
// // // //               ) : (
// // // //                 <p className="no-menu p-2">No menu items available</p>
// // // //               )}
// // // //             </ul>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </>
// // // //   );
// // // // };

// // // // export default Sidebar;

// // // import React, { useState, useEffect, useContext } from "react";
// // // import "./Sidebar.css";
// // // import * as MdIcons from "react-icons/md";
// // // import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// // // import AddDepartment from "../AddDepartment/AddDepartment";
// // // import AdminQuery from "../EmployeeQueries/AdminQuery";
// // // import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// // // import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// // // import LeaveQueries from "../LeaveQueries/Admin";
// // // import LeaveRequest from "../LeaveQueries/LeaveRequest";
// // // import Profile from "../Profile/Profile";
// // // import MyDashboard from "../MyDashboard/MyDashboard";
// // // import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// // // import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// // // import PayrollSummary from "../PayrollSummary/PayrollSummary";
// // // import Reimbursement from "../Reimbursement/Reimbursement";
// // // import RbAdmin from "../Reimbursement/RbAdmin";
// // // import RbTeamLead from "../Reimbursement/RbTeamLead";
// // // import Assets from "../Assets/assets";
// // // import Vendors from "../vendors/vendors";
// // // import Chat from "../Chat/ChatPage";
// // // import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// // // import LetterHead from "../letterHead/letterhead";
// // // import NoteDashboard from "../Notes/NoteDashboard";
// // // import CreateCompensation from "../Compensation/createCompensation";
// // // import AssignCompensation from "../Compensation/assignCompensation";
// // // import OvertimeDetails from "../Compensation/OvertimeDetails";
// // // import { ContentContext } from "./Context";
// // // import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// // // import OvertimeSummary from "../Compensation/overtimeSupervisor";
// // // import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// // // import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// // // import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// // // import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// // // import TaskManagement from "../TaskManagement/TaskManagement";
// // // import Report from "../Report/ReportPanel";
// // // import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// // // import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";
// // // import ReimbursementHR from "../Reimbursement/ReimbursementHR";

// // // const Sidebar = () => {
// // //   const { setActiveContent } = useContext(ContentContext);
// // //   const [menuItems, setMenuItems] = useState([]);
// // //   const [activeItem, setActiveItem] = useState("");
// // //   const [activeSubItem, setActiveSubItem] = useState("");
// // //   const [showProfile, setShowProfile] = useState(false);
// // //   const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
// // //   const [showTaskDropdown, setShowTaskDropdown] = useState(false);
// // //   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
// // //   const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);

// // //   const employeeId = localStorage.getItem("employeeId");
// // //   const userRole = localStorage.getItem("userRole") || "Employee";
// // //   const dashboardData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
// // //   const userPosition = dashboardData.position;
// // //   const [activeNav, setActiveNav] = useState("/dashboard");
// // //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// // //   useEffect(() => {
// // //     const storedData = localStorage.getItem("sidebarMenu");
// // //     if (storedData) {
// // //       try {
// // //         const parsedData = JSON.parse(storedData);
// // //         setMenuItems(parsedData || []);
// // //       } catch (error) {
// // //         console.error("Error parsing sidebar menu:", error);
// // //         setMenuItems([]);
// // //       }
// // //     }
// // //     if (setActiveContent) {
// // //       if (userRole === "Admin") {
// // //         setActiveContent(<MyDashboard />);
// // //         setActiveItem("/dashboard");
// // //       } else {
// // //         setActiveContent(<MyEmpDashboard />);
// // //       }
// // //       setActiveSubItem("");
// // //       setShowCompensationDropdown(false);
// // //       setShowTaskDropdown(false);
// // //       setShowHRTaskDropdown(false);
// // //       setShowLeaveDropdown(false);
// // //     }
// // //   }, [setActiveContent, userRole]);

// // //   // Helper: Get unique path for active state in bottom nav
// // //   const getTaskManagementPath = () => {
// // //     if (userRole === "Supervisor") return "/TaskManagement/supervisor";
// // //     if (userRole === "HR") return "/TaskManagement/hr";
// // //     if (userRole === "Admin") return "/TaskManagement/admin";
// // //     return "/TaskManagement/employee";
// // //   };

// // //   // Direct click handler for Task Management in bottom nav
// // //   const handleDirectTaskClick = () => {
// // //     const item = { path: "/TaskManagement" };
// // //     let content = null;
// // //     let subOption = null;
// // //     let navPath = "/TaskManagement";

// // //     if (userRole === "Supervisor") {
// // //       content = <TaskManagement />;
// // //       subOption = "supervisor";
// // //       navPath = "/TaskManagement/supervisor";
// // //     } else if (userRole === "HR") {
// // //       content = <TaskManagementHR />;
// // //       subOption = "hr";
// // //       navPath = "/TaskManagement/hr";
// // //     } else if (userRole === "Admin") {
// // //       content = <TaskManagementAdmin />;
// // //       subOption = "admin";
// // //       navPath = "/TaskManagement/admin";
// // //     } else {
// // //       content = <TaskManagementEmployee />;
// // //       subOption = "employee";
// // //       navPath = "/TaskManagement/employee";
// // //     }

// // //     setActiveContent(content);
// // //     setActiveItem(item.path);
// // //     setActiveSubItem(subOption);
// // //     setActiveNav(navPath);
// // //     setShowMobileMenu(false);

// // //     // Close all dropdowns
// // //     setShowCompensationDropdown(false);
// // //     setShowTaskDropdown(false);
// // //     setShowHRTaskDropdown(false);
// // //     setShowLeaveDropdown(false);
// // //   };

// // //   const handleMenuClick = (item, subOption = null) => {
// // //     console.log("Menu clicked:", item.path, "Sub-option:", subOption);
// // //     setActiveItem(item.path);
// // //     setActiveNav(item.path);
// // //     setShowMobileMenu(false);

// // //     // Compensation Dropdown
// // //     if (item.path === "/compensation" && !subOption) {
// // //       setShowCompensationDropdown((prev) => !prev);
// // //       setShowTaskDropdown(false);
// // //       setShowHRTaskDropdown(false);
// // //       setShowLeaveDropdown(false);
// // //       setActiveSubItem("");
// // //       return;
// // //     }

// // //     // Supervisor Task Dropdown
// // //     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
// // //       setShowTaskDropdown((prev) => !prev);
// // //       setShowCompensationDropdown(false);
// // //       setShowHRTaskDropdown(false);
// // //       setShowLeaveDropdown(false);
// // //       setActiveSubItem("");
// // //       return;
// // //     }

// // //     // HR Task Dropdown
// // //     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
// // //       setShowHRTaskDropdown((prev) => !prev);
// // //       setShowCompensationDropdown(false);
// // //       setShowTaskDropdown(false);
// // //       setShowLeaveDropdown(false);
// // //       setActiveSubItem("");
// // //       return;
// // //     }

// // //     // HR Leave Dropdown
// // //     if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
// // //       setShowLeaveDropdown((prev) => !prev);
// // //       setShowCompensationDropdown(false);
// // //       setShowTaskDropdown(false);
// // //       setShowHRTaskDropdown(false);
// // //       setActiveSubItem("");
// // //       return;
// // //     }

// // //     // Close all dropdowns on sub-option click
// // //     setShowCompensationDropdown(false);
// // //     setShowTaskDropdown(false);
// // //     setShowHRTaskDropdown(false);
// // //     setShowLeaveDropdown(false);
// // //     setActiveSubItem(subOption || "");

// // //     // Handle Task Management Sub-options
// // //     if (item.path === "/TaskManagement" && subOption) {
// // //       let content = null;
// // //       let navPath = "/TaskManagement";

// // //       if (userRole === "Supervisor") {
// // //         if (subOption === "supervisor") {
// // //           content = <TaskManagement />;
// // //           navPath = "/TaskManagement/supervisor";
// // //         } else {
// // //           content = <TaskManagementEmployee />;
// // //           navPath = "/TaskManagement/employee";
// // //         }
// // //       } else if (userRole === "HR") {
// // //         if (subOption === "hr") {
// // //           content = <TaskManagementHR />;
// // //           navPath = "/TaskManagement/hr";
// // //         } else {
// // //           content = <TaskManagementEmployee />;
// // //           navPath = "/TaskManagement/employee";
// // //         }
// // //       } else if (userRole === "Admin") {
// // //         content = <TaskManagementAdmin />;
// // //         navPath = "/TaskManagement/admin";
// // //       } else {
// // //         content = <TaskManagementEmployee />;
// // //         navPath = "/TaskManagement/employee";
// // //       }

// // //       setActiveContent(content);
// // //       setActiveNav(navPath); // Critical for active state
// // //       return;
// // //     }

// // //     // Handle Leave Sub-options (HR only)
// // //     if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
// // //       switch (subOption) {
// // //         case "employee":
// // //           setActiveContent(<LeaveRequest />);
// // //           break;
// // //         case "admin":
// // //           setActiveContent(<LeaveQueries />);
// // //           break;
// // //         default:
// // //           setActiveContent(<LeaveRequest />);
// // //       }
// // //       return;
// // //     }

// // //     switch (item.path) {
// // //       case "/dashboard":
// // //         setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
// // //         break;
// // //       case "/Task":
// // //         setActiveContent(<TaskManagementEmployee />);
// // //         break;
// // //       case "/TaskManagementEmployee":
// // //         setActiveContent(<TaskManagementEmployee />);
// // //         break;
// // //       case "/TaskManagement":
// // //         if (userRole === "Supervisor") {
// // //           setActiveContent(<TaskManagement />);
// // //         } else if (userRole === "HR") {
// // //           setActiveContent(<TaskManagementHR />);
// // //         } else if (userRole === "Admin") {
// // //           setActiveContent(<TaskManagementAdmin />);
// // //         } else {
// // //           setActiveContent(<TaskManagementEmployee />);
// // //         }
// // //         break;
// // //       case "/report":
// // //         setActiveContent(<Report />);
// // //         break;
// // //       case "/TaskManagementAdmin":
// // //         setActiveContent(<TaskManagementAdmin />);
// // //         break;
// // //       case "/employeeDetails":
// // //         setActiveContent(<EmployeeDetails />);
// // //         break;
// // //       case "/addDepartment":
// // //         setActiveContent(<AddDepartment />);
// // //         break;
// // //       case "/updateProjects":
// // //         setActiveContent(<UpdateProject />);
// // //         break;
// // //       case "/leaveQueries":
// // //         if (userRole === "Admin") {
// // //           setActiveContent(<LeaveQueries />);
// // //         } else if (userRole === "HR") {
// // //           setActiveContent(<LeaveRequest />);
// // //         } else {
// // //           setActiveContent(<LeaveRequest />);
// // //         }
// // //         break;
// // //       case "/Salary_Statement":
// // //         setActiveContent(<SalaryStatementWrapper />);
// // //         break;
// // //       case "/letterHead":
// // //         setActiveContent(<LetterHead />);
// // //         break;
// // //       case "/payrollSummary":
// // //         setActiveContent(<PayrollSummary />);
// // //         break;
// // //       case "/messenger":
// // //         setActiveContent(<Chat />);
// // //         break;
// // //       case "/reimbursement":
// // //         if (userRole === "Admin") {
// // //           setActiveContent(<RbAdmin />);
// // //         } else if (userRole === "Manager") {
// // //           setActiveContent(<RbTeamLead />);
// // //         } else if (userRole === "HR") {
// // //           setActiveContent(<ReimbursementHR />);
// // //         } else {
// // //           setActiveContent(<Reimbursement />);
// // //         }
// // //         break;
// // //       case "/employeeQueries":
// // //         setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
// // //         break;
// // //       case "/assets":
// // //         setActiveContent(<Assets />);
// // //         break;
// // //       case "/vendors":
// // //         setActiveContent(<Vendors />);
// // //         break;
// // //       case "/notes":
// // //         setActiveContent(<NoteDashboard />);
// // //         break;
// // //       case "/EmployeeLogin":
// // //         setActiveContent(<EmployeeLogin />);
// // //         break;
// // //       case "/Overtime":
// // //         setActiveContent(<OvertimeDetails />);
// // //         break;
// // //       case "/OvertimeSummary":
// // //         setActiveContent(<OvertimeSummary />);
// // //         break;
// // //       case "/compensation":
// // //         switch (subOption) {
// // //           case "create":
// // //             setActiveContent(<CreateCompensation />);
// // //             break;
// // //           case "assign":
// // //             setActiveContent(<AssignCompensation />);
// // //             break;
// // //           case "SalaryBreakupMain":
// // //             setActiveContent(<SalaryBreakupMain />);
// // //             break;
// // //           case "EmployeeTable":
// // //             setActiveContent(<SalaryDetails />);
// // //             break;
// // //           default:
// // //             setActiveContent(<p>Please select a compensation option.</p>);
// // //         }
// // //         break;

// // //       default:
// // //         setActiveContent(<p>Content not found for this path.</p>);
// // //     }
// // //   };

// // //   const toggleProfile = () => {
// // //     setShowProfile(!showProfile);
// // //   };

// // //   return (
// // //     <>
// // //       <div className="sidebar bg-gray-800 text-white min-h-screen w-64 fixed">
// // //         {userRole !== "Admin" && (
// // //           <div className="view-profile p-4">
// // //             <span
// // //               onClick={() => setShowProfile(!showProfile)}
// // //               className="view-profile-text cursor-pointer hover:text-blue-400"
// // //             >
// // //               View Profile
// // //             </span>
// // //           </div>
// // //         )}
// // //         <ul className="mt-4">
// // //           {menuItems.length > 0 ? (
// // //             menuItems.map((item, index) => {
// // //               const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// // //               return (
// // //                 <li key={index} className="relative">
// // //                   <div
// // //                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
// // //                       activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// // //                     }`}
// // //                     onClick={() => handleMenuClick(item)}
// // //                   >
// // //                     <span className="icon mr-2">
// // //                       <IconComponent size={24} />
// // //                     </span>
// // //                     <span className="menu-text flex-1">{item.label}</span>
// // //                   </div>

// // //                   {/* Compensation Dropdown */}
// // //                   {item.path === "/compensation" && showCompensationDropdown && (
// // //                     <ul className="ml-8 bg-gray-900 rounded-md">
// // //                       <li
// // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                           activeSubItem === "create" ? "bg-gray-700" : ""
// // //                         }`}
// // //                         onClick={() => handleMenuClick(item, "create")}
// // //                       >
// // //                         Create Compensation
// // //                       </li>
// // //                       <li
// // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                           activeSubItem === "assign" ? "bg-gray-700" : ""
// // //                         }`}
// // //                         onClick={() => handleMenuClick(item, "assign")}
// // //                       >
// // //                         Assign Compensation
// // //                       </li>
// // //                       <li
// // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                           activeSubItem === "SalaryBreakupMain" ? "bg-gray-700" : ""
// // //                         }`}
// // //                         onClick={() => handleMenuClick(item, "SalaryBreakupMain")}
// // //                       >
// // //                         Salary Breakup
// // //                       </li>
// // //                       <li
// // //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                           activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
// // //                         }`}
// // //                         onClick={() => handleMenuClick(item, "EmployeeTable")}
// // //                       >
// // //                         Salary Details
// // //                       </li>
// // //                     </ul>
// // //                   )}

// // //                   {/* Supervisor Task Dropdown */}
// // //                   {item.path === "/TaskManagement" &&
// // //                     userRole === "Supervisor" &&
// // //                     showTaskDropdown && (
// // //                       <ul className="ml-8 bg-gray-900 rounded-md">
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "supervisor" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "supervisor")}
// // //                         >
// // //                           My Task Management
// // //                         </li>
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "employee")}
// // //                         >
// // //                           Employee Tasks
// // //                         </li>
// // //                       </ul>
// // //                     )}

// // //                   {/* HR Task Dropdown */}
// // //                   {item.path === "/TaskManagement" &&
// // //                     userRole === "HR" &&
// // //                     showHRTaskDropdown && (
// // //                       <ul className="ml-8 bg-gray-900 rounded-md">
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "hr" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "hr")}
// // //                         >
// // //                           HR Task Management
// // //                         </li>
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "employee")}
// // //                         >
// // //                           Employee Tasks
// // //                         </li>
// // //                       </ul>
// // //                     )}

// // //                   {/* HR Leave Dropdown */}
// // //                   {item.path === "/leaveQueries" &&
// // //                     userRole === "HR" &&
// // //                     showLeaveDropdown && (
// // //                       <ul className="ml-8 bg-gray-900 rounded-md">
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "employee")}
// // //                         >
// // //                           My Leave Requests
// // //                         </li>
// // //                         <li
// // //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                             activeSubItem === "admin" ? "bg-gray-700" : ""
// // //                           }`}
// // //                           onClick={() => handleMenuClick(item, "admin")}
// // //                         >
// // //                           Admin Leave Queries
// // //                         </li>
// // //                       </ul>
// // //                     )}
// // //                 </li>
// // //               );
// // //             })
// // //           ) : (
// // //             <p className="no-menu p-4">No menu items available</p>
// // //           )}
// // //         </ul>
// // //         {showProfile && (
// // //           <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />
// // //         )}
// // //       </div>

// // //       {/* Bottom Navigation */}
// // //       <div className="bottom-nav fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2 md:hidden">
// // //         <button
// // //           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
// // //           onClick={() => handleMenuClick({ path: "/dashboard" })}
// // //         >
// // //           <MdIcons.MdHome size={24} />
// // //         </button>
// // //         <button
// // //           className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-400" : ""}`}
// // //           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
// // //         >
// // //           <MdIcons.MdOutlineContactPhone size={24} />
// // //         </button>
// // //         <button
// // //           className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-400" : ""}`}
// // //           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
// // //         >
// // //           <MdIcons.MdOutlineCommentBank size={24} />
// // //         </button>
// // //         <button
// // //           className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-400" : ""}`}
// // //           onClick={() => handleMenuClick({ path: "/reimbursement" })}
// // //         >
// // //           <MdIcons.MdCurrencyRupee size={24} />
// // //         </button>

// // //         {/* Task Management – Direct Access */}
// // //         <button
// // //           className={`p-2 ${activeNav === getTaskManagementPath() ? "text-blue-400" : ""}`}
// // //           onClick={handleDirectTaskClick}
// // //         >
// // //           <MdIcons.MdTaskAlt size={24} />
// // //         </button>

// // //         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
// // //           <MdIcons.MdMenu size={24} />
// // //         </button>
// // //       </div>

// // //       {/* Mobile Menu */}
// // //       {showMobileMenu && (
// // //         <div
// // //           className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-end"
// // //           onClick={() => setShowMobileMenu(false)}
// // //         >
// // //           <div
// // //             className="mobile-menu bg-gray-800 text-white w-64 h-full p-4"
// // //             onClick={(e) => e.stopPropagation()}
// // //           >
// // //             <button
// // //               className="close-menu text-xl mb-4"
// // //               onClick={() => setShowMobileMenu(false)}
// // //             >
// // //               X
// // //             </button>
// // //             <ul>
// // //               {menuItems.length > 0 ? (
// // //                 menuItems.map((item, index) => {
// // //                   const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// // //                   return (
// // //                     <li key={index} className="relative">
// // //                       <div
// // //                         className={`flex items-center p-2 cursor-pointer hover:bg-gray-700 ${
// // //                           activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// // //                         }`}
// // //                         onClick={() => handleMenuClick(item)}
// // //                       >
// // //                         <span className="icon mr-2">
// // //                           <IconComponent size={24} />
// // //                         </span>
// // //                         <span className="menu-text flex-1">{item.label}</span>
// // //                       </div>

// // //                       {/* Compensation Dropdown in Mobile */}
// // //                       {item.path === "/compensation" && showCompensationDropdown && (
// // //                         <ul className="ml-8 bg-gray-900 rounded-md">
// // //                           <li
// // //                             className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                               activeSubItem === "create" ? "bg-gray-700" : ""
// // //                             }`}
// // //                             onClick={() => handleMenuClick(item, "create")}
// // //                           >
// // //                             Create Compensation
// // //                           </li>
// // //                           <li
// // //                             className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                               activeSubItem === "assign" ? "bg-gray-700" : ""
// // //                             }`}
// // //                             onClick={() => handleMenuClick(item, "assign")}
// // //                           >
// // //                             Assign Compensation
// // //                           </li>
// // //                           <li
// // //                             className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                               activeSubItem === "SalaryBreakupMain" ? "bg-gray-700" : ""
// // //                             }`}
// // //                             onClick={() => handleMenuClick(item, "SalaryBreakupMain")}
// // //                           >
// // //                             Salary Breakup
// // //                           </li>
// // //                         </ul>
// // //                       )}

// // //                       {/* Supervisor Task Dropdown in Mobile */}
// // //                       {item.path === "/TaskManagement" &&
// // //                         userRole === "Supervisor" &&
// // //                         showTaskDropdown && (
// // //                           <ul className="ml-8 bg-gray-900 rounded-md">
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "supervisor" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "supervisor")}
// // //                             >
// // //                               My Task Management
// // //                             </li>
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "employee" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "employee")}
// // //                             >
// // //                               Employee Tasks
// // //                             </li>
// // //                           </ul>
// // //                         )}

// // //                       {/* HR Task Dropdown in Mobile */}
// // //                       {item.path === "/TaskManagement" &&
// // //                         userRole === "HR" &&
// // //                         showHRTaskDropdown && (
// // //                           <ul className="ml-8 bg-gray-900 rounded-md">
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "hr" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "hr")}
// // //                             >
// // //                               HR Task Management
// // //                             </li>
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "employee" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "employee")}
// // //                             >
// // //                               Employee Tasks
// // //                             </li>
// // //                           </ul>
// // //                         )}

// // //                       {/* HR Leave Dropdown in Mobile */}
// // //                       {item.path === "/leaveQueries" &&
// // //                         userRole === "HR" &&
// // //                         showLeaveDropdown && (
// // //                           <ul className="ml-8 bg-gray-900 rounded-md">
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "employee" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "employee")}
// // //                             >
// // //                               My Leave Requests
// // //                             </li>
// // //                             <li
// // //                               className={`p-2 cursor-pointer hover:bg-gray-700 ${
// // //                                 activeSubItem === "admin" ? "bg-gray-700" : ""
// // //                               }`}
// // //                               onClick={() => handleMenuClick(item, "admin")}
// // //                             >
// // //                               Admin Leave Queries
// // //                             </li>
// // //                           </ul>
// // //                         )}
// // //                     </li>
// // //                   );
// // //                 })
// // //               ) : (
// // //                 <p className="no-menu p-2">No menu items available</p>
// // //               )}
// // //             </ul>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // export default Sidebar;

// // import React, { useState, useEffect, useContext } from "react";
// // import "./Sidebar.css";
// // import * as MdIcons from "react-icons/md";
// // import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// // import AddDepartment from "../AddDepartment/AddDepartment";
// // import AdminQuery from "../EmployeeQueries/AdminQuery";
// // import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// // import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// // import LeaveQueries from "../LeaveQueries/Admin";
// // import LeaveRequest from "../LeaveQueries/LeaveRequest";
// // import Profile from "../Profile/Profile";
// // import MyDashboard from "../MyDashboard/MyDashboard";
// // import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// // import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// // import PayrollSummary from "../PayrollSummary/PayrollSummary";
// // import Reimbursement from "../Reimbursement/Reimbursement";
// // import RbAdmin from "../Reimbursement/RbAdmin";
// // import RbTeamLead from "../Reimbursement/RbTeamLead";
// // import ReimbursementHR from "../Reimbursement/ReimbursementHR";
// // import Assets from "../Assets/assets";
// // import Vendors from "../vendors/vendors";
// // import Chat from "../Chat/ChatPage";
// // import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// // import LetterHead from "../letterHead/letterhead";
// // import NoteDashboard from "../Notes/NoteDashboard";
// // import CreateCompensation from "../Compensation/createCompensation";
// // import AssignCompensation from "../Compensation/assignCompensation";
// // import OvertimeDetails from "../Compensation/OvertimeDetails";
// // import { ContentContext } from "./Context";
// // import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// // import OvertimeSummary from "../Compensation/overtimeSupervisor";
// // import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// // import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// // import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// // import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// // import TaskManagement from "../TaskManagement/TaskManagement";
// // import Report from "../Report/ReportPanel";
// // import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// // import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";

// // const Sidebar = () => {
// //   const { setActiveContent } = useContext(ContentContext);
// //   const [menuItems, setMenuItems] = useState([]);
// //   const [activeItem, setActiveItem] = useState("");
// //   const [activeSubItem, setActiveSubItem] = useState("");
// //   const [showProfile, setShowProfile] = useState(false);
// //   const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
// //   const [showTaskDropdown, setShowTaskDropdown] = useState(false);
// //   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
// //   const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
// //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// //   // Mobile dropdown state
// //   const [mobileDropdown, setMobileDropdown] = useState({
// //     compensation: false,
// //     task: false,
// //     hrTask: false,
// //     leave: false,
// //   });

// //   const employeeId = localStorage.getItem("employeeId");
// //   const userRole = localStorage.getItem("userRole") || "Employee";
// //   const dashboardData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
// //   const [activeNav, setActiveNav] = useState("/dashboard");

// //   useEffect(() => {
// //     const storedData = localStorage.getItem("sidebarMenu");
// //     if (storedData) {
// //       try {
// //         const parsedData = JSON.parse(storedData);
// //         setMenuItems(parsedData || []);
// //       } catch (error) {
// //         console.error("Error parsing sidebar menu:", error);
// //         setMenuItems([]);
// //       }
// //     }
// //     if (setActiveContent) {
// //       if (userRole === "Admin") {
// //         setActiveContent(<MyDashboard />);
// //         setActiveItem("/dashboard");
// //       } else {
// //         setActiveContent(<MyEmpDashboard />);
// //       }
// //       setActiveSubItem("");
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //     }
// //   }, [setActiveContent, userRole]);

// //   const getTaskManagementPath = () => {
// //     if (userRole === "Supervisor") return "/TaskManagement/supervisor";
// //     if (userRole === "HR") return "/TaskManagement/hr";
// //     if (userRole === "Admin") return "/TaskManagement/admin";
// //     return "/TaskManagement/employee";
// //   };

// //   const handleDirectTaskClick = () => {
// //     const item = { path: "/TaskManagement" };
// //     let content = null;
// //     let subOption = null;
// //     let navPath = "/TaskManagement";

// //     if (userRole === "Supervisor") {
// //       content = <TaskManagement />;
// //       subOption = "supervisor";
// //       navPath = "/TaskManagement/supervisor";
// //     } else if (userRole === "HR") {
// //       content = <TaskManagementHR />;
// //       subOption = "hr";
// //       navPath = "/TaskManagement/hr";
// //     } else if (userRole === "Admin") {
// //       content = <TaskManagementAdmin />;
// //       subOption = "admin";
// //       navPath = "/TaskManagement/admin";
// //     } else {
// //       content = <TaskManagementEmployee />;
// //       subOption = "employee";
// //       navPath = "/TaskManagement/employee";
// //     }

// //     setActiveContent(content);
// //     setActiveItem(item.path);
// //     setActiveSubItem(subOption);
// //     setActiveNav(navPath);
// //     setShowMobileMenu(false);
// //     setShowCompensationDropdown(false);
// //     setShowTaskDropdown(false);
// //     setShowHRTaskDropdown(false);
// //     setShowLeaveDropdown(false);
// //   };

// //   const handleMenuClick = (item, subOption = null) => {
// //     setActiveItem(item.path);
// //     setActiveNav(item.path);
// //     setShowMobileMenu(false);

// //     if (item.path === "/compensation" && !subOption) {
// //       setShowCompensationDropdown((prev) => !prev);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
// //       setShowTaskDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
// //       setShowHRTaskDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
// //       setShowLeaveDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     setShowCompensationDropdown(false);
// //     setShowTaskDropdown(false);
// //     setShowHRTaskDropdown(false);
// //     setShowLeaveDropdown(false);
// //     setActiveSubItem(subOption || "");

// //     if (item.path === "/TaskManagement" && subOption) {
// //       let content = null;
// //       let navPath = "/TaskManagement";

// //       if (userRole === "Supervisor") {
// //         if (subOption === "supervisor") {
// //           content = <TaskManagement />;
// //           navPath = "/TaskManagement/supervisor";
// //         } else {
// //           content = <TaskManagementEmployee />;
// //           navPath = "/TaskManagement/employee";
// //         }
// //       } else if (userRole === "HR") {
// //         if (subOption === "hr") {
// //           content = <TaskManagementHR />;
// //           navPath = "/TaskManagement/hr";
// //         } else {
// //           content = <TaskManagementEmployee />;
// //           navPath = "/TaskManagement/employee";
// //         }
// //       } else if (userRole === "Admin") {
// //         content = <TaskManagementAdmin />;
// //         navPath = "/TaskManagement/admin";
// //       } else {
// //         content = <TaskManagementEmployee />;
// //         navPath = "/TaskManagement/employee";
// //       }

// //       setActiveContent(content);
// //       setActiveNav(navPath);
// //       return;
// //     }

// //     if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
// //       switch (subOption) {
// //         case "employee":
// //           setActiveContent(<LeaveRequest />);
// //           break;
// //         case "admin":
// //           setActiveContent(<LeaveQueries />);
// //           break;
// //         default:
// //           setActiveContent(<LeaveRequest />);
// //       }
// //       return;
// //     }

// //     switch (item.path) {
// //       case "/dashboard":
// //         setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
// //         break;
// //       case "/Task":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagementEmployee":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagement":
// //         if (userRole === "Supervisor") {
// //           setActiveContent(<TaskManagement />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<TaskManagementHR />);
// //         } else if (userRole === "Admin") {
// //           setActiveContent(<TaskManagementAdmin />);
// //         } else {
// //           setActiveContent(<TaskManagementEmployee />);
// //         }
// //         break;
// //       case "/report":
// //         setActiveContent(<Report />);
// //         break;
// //       case "/TaskManagementAdmin":
// //         setActiveContent(<TaskManagementAdmin />);
// //         break;
// //       case "/employeeDetails":
// //         setActiveContent(<EmployeeDetails />);
// //         break;
// //       case "/addDepartment":
// //         setActiveContent(<AddDepartment />);
// //         break;
// //       case "/updateProjects":
// //         setActiveContent(<UpdateProject />);
// //         break;
// //       case "/leaveQueries":
// //         if (userRole === "Admin") {
// //           setActiveContent(<LeaveQueries />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<LeaveRequest />);
// //         } else {
// //           setActiveContent(<LeaveRequest />);
// //         }
// //         break;
// //       case "/Salary_Statement":
// //         setActiveContent(<SalaryStatementWrapper />);
// //         break;
// //       case "/letterHead":
// //         setActiveContent(<LetterHead />);
// //         break;
// //       case "/payrollSummary":
// //         setActiveContent(<PayrollSummary />);
// //         break;
// //       case "/messenger":
// //         setActiveContent(<Chat />);
// //         break;
// //       case "/reimbursement":
// //         if (userRole === "Admin") {
// //           setActiveContent(<RbAdmin />);
// //         } else if (userRole === "Manager") {
// //           setActiveContent(<RbTeamLead />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<ReimbursementHR />);
// //         } else {
// //           setActiveContent(<Reimbursement />);
// //         }
// //         break;
// //       case "/employeeQueries":
// //         setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
// //         break;
// //       case "/assets":
// //         setActiveContent(<Assets />);
// //         break;
// //       case "/vendors":
// //         setActiveContent(<Vendors />);
// //         break;
// //       case "/notes":
// //         setActiveContent(<NoteDashboard />);
// //         break;
// //       case "/EmployeeLogin":
// //         setActiveContent(<EmployeeLogin />);
// //         break;
// //       case "/Overtime":
// //         setActiveContent(<OvertimeDetails />);
// //         break;
// //       case "/OvertimeSummary":
// //         setActiveContent(<OvertimeSummary />);
// //         break;
// //       case "/compensation":
// //         switch (subOption) {
// //           case "create":
// //             setActiveContent(<CreateCompensation />);
// //             break;
// //           case "assign":
// //             setActiveContent(<AssignCompensation />);
// //             break;
// //           case "SalaryBreakupMain":
// //             setActiveContent(<SalaryBreakupMain />);
// //             break;
// //           case "EmployeeTable":
// //             setActiveContent(<SalaryDetails />);
// //             break;
// //           default:
// //             setActiveContent(<p>Please select a compensation option.</p>);
// //         }
// //         break;

// //       default:
// //         setActiveContent(<p>Content not found for this path.</p>);
// //     }
// //   };

// //   const toggleProfile = () => {
// //     setShowProfile(!showProfile);
// //   };

// //   const toggleMobileDropdown = (key) => {
// //     setMobileDropdown((prev) => ({
// //       ...prev,
// //       [key]: !prev[key],
// //     }));
// //   };

// //   const closeAllMobileDropdowns = () => {
// //     setMobileDropdown({
// //       compensation: false,
// //       task: false,
// //       hrTask: false,
// //       leave: false,
// //     });
// //   };

// //   return (
// //     <>
// //       {/* Desktop Sidebar */}
// //       <div className="sidebar bg-gray-800 text-white min-h-screen w-64 fixed">
// //         {userRole !== "Admin" && (
// //           <div className="view-profile p-4">
// //             <span
// //               onClick={() => setShowProfile(!showProfile)}
// //               className="view-profile-text cursor-pointer hover:text-blue-400"
// //             >
// //               View Profile
// //             </span>
// //           </div>
// //         )}
// //         <ul className="mt-4">
// //           {menuItems.length > 0 ? (
// //             menuItems.map((item, index) => {
// //               const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //               return (
// //                 <li key={index} className="relative">
// //                   <div
// //                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
// //                       activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// //                     }`}
// //                     onClick={() => handleMenuClick(item)}
// //                   >
// //                     <span className="icon mr-2">
// //                       <IconComponent size={24} />
// //                     </span>
// //                     <span className="menu-text flex-1">{item.label}</span>
// //                   </div>

// //                   {/* Compensation Dropdown */}
// //                   {item.path === "/compensation" && showCompensationDropdown && (
// //                     <ul className="ml-8 bg-gray-900 rounded-md">
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "create" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "create")}
// //                       >
// //                         Create Compensation
// //                       </li>
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "assign" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "assign")}
// //                       >
// //                         Assign Compensation
// //                       </li>
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "SalaryBreakupMain" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "SalaryBreakupMain")}
// //                       >
// //                         Salary Breakup
// //                       </li>
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "EmployeeTable")}
// //                       >
// //                         Salary Details
// //                       </li>
// //                     </ul>
// //                   )}

// //                   {/* Supervisor Task Dropdown */}
// //                   {item.path === "/TaskManagement" &&
// //                     userRole === "Supervisor" &&
// //                     showTaskDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "supervisor" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "supervisor")}
// //                         >
// //                           My Task Management
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "employee")}
// //                         >
// //                           Employee Tasks
// //                         </li>
// //                       </ul>
// //                     )}

// //                   {/* HR Task Dropdown */}
// //                   {item.path === "/TaskManagement" &&
// //                     userRole === "HR" &&
// //                     showHRTaskDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "hr" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "hr")}
// //                         >
// //                           HR Task Management
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "employee")}
// //                         >
// //                           Employee Tasks
// //                         </li>
// //                       </ul>
// //                     )}

// //                   {/* HR Leave Dropdown */}
// //                   {item.path === "/leaveQueries" &&
// //                     userRole === "HR" &&
// //                     showLeaveDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "employee")}
// //                         >
// //                           My Leave Requests
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "admin" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "admin")}
// //                         >
// //                           Admin Leave Queries
// //                         </li>
// //                       </ul>
// //                     )}
// //                 </li>
// //               );
// //             })
// //           ) : (
// //             <p className="no-menu p-4">No menu items available</p>
// //           )}
// //         </ul>
// //         {showProfile && (
// //           <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />
// //         )}
// //       </div>

// //       {/* Bottom Navigation */}
// //       <div className="bottom-nav fixed bottom-0 w-full bg-gray-800 text-white flex justify-around py-2 md:hidden">
// //         <button
// //           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/dashboard" })}
// //         >
// //           <MdIcons.MdHome size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
// //         >
// //           <MdIcons.MdOutlineContactPhone size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
// //         >
// //           <MdIcons.MdOutlineCommentBank size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/reimbursement" })}
// //         >
// //           <MdIcons.MdCurrencyRupee size={24} />
// //         </button>

// //         <button
// //           className={`p-2 ${activeNav === getTaskManagementPath() ? "text-blue-400" : ""}`}
// //           onClick={handleDirectTaskClick}
// //         >
// //           <MdIcons.MdTaskAlt size={24} />
// //         </button>

// //         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
// //           <MdIcons.MdMenu size={24} />
// //         </button>
// //       </div>

// //       {/* Mobile Menu - Professional Vertical List */}
// //       {showMobileMenu && (
// //         <div
// //           className="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 z-50"
// //           onClick={() => {
// //             setShowMobileMenu(false);
// //             closeAllMobileDropdowns();
// //           }}
// //         >
// //           <div
// //             className="mobile-menu bg-gray-800 text-white w-80 h-full overflow-y-auto p-5"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <div className="flex justify-between items-center mb-6">
// //               <h2 className="text-lg font-semibold">Menu</h2>
// //               <button
// //                 className="text-2xl"
// //                 onClick={() => {
// //                   setShowMobileMenu(false);
// //                   closeAllMobileDropdowns();
// //                 }}
// //               >
// //                 X
// //               </button>
// //             </div>

// //             <ul className="space-y-1">
// //               {menuItems.length > 0 ? (
// //                 menuItems.map((item, index) => {
// //                   const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //                   return (
// //                     <li key={index} className="border-b border-gray-700">
// //                       <div
// //                         className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 rounded-lg transition-colors ${
// //                           activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => {
// //                           if (item.path === "/compensation") {
// //                             toggleMobileDropdown("compensation");
// //                             return;
// //                           }
// //                           if (item.path === "/TaskManagement" && userRole === "Supervisor") {
// //                             toggleMobileDropdown("task");
// //                             return;
// //                           }
// //                           if (item.path === "/TaskManagement" && userRole === "HR") {
// //                             toggleMobileDropdown("hrTask");
// //                             return;
// //                           }
// //                           if (item.path === "/leaveQueries" && userRole === "HR") {
// //                             toggleMobileDropdown("leave");
// //                             return;
// //                           }
// //                           handleMenuClick(item);
// //                         }}
// //                       >
// //                         <span className="icon mr-3">
// //                           <IconComponent size={22} />
// //                         </span>
// //                         <span className="menu-text flex-1 text-base">{item.label}</span>
// //                         {(item.path === "/compensation" && mobileDropdown.compensation) ||
// //                         (item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task) ||
// //                         (item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask) ||
// //                         (item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave) ? (
// //                           <MdIcons.MdKeyboardArrowDown size={20} />
// //                         ) : (
// //                           <MdIcons.MdKeyboardArrowRight size={20} />
// //                         )}
// //                       </div>

// //                       {/* Compensation Dropdown */}
// //                       {item.path === "/compensation" && mobileDropdown.compensation && (
// //                         <ul className="ml-12 bg-gray-900 rounded-lg mt-1">
// //                           {["create", "assign", "SalaryBreakupMain", "EmployeeTable"].map((opt) => (
// //                             <li
// //                               key={opt}
// //                               className={`p-3 cursor-pointer hover:bg-gray-700 rounded-md text-sm ${
// //                                 activeSubItem === opt ? "bg-gray-700" : ""
// //                               }`}
// //                               onClick={() => {
// //                                 handleMenuClick(item, opt);
// //                                 closeAllMobileDropdowns();
// //                               }}
// //                             >
// //                               {opt === "create" && "Create Compensation"}
// //                               {opt === "assign" && "Assign Compensation"}
// //                               {opt === "SalaryBreakupMain" && "Salary Breakup"}
// //                               {opt === "EmployeeTable" && "Salary Details"}
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       )}

// //                       {/* Supervisor Task */}
// //                       {item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task && (
// //                         <ul className="ml-12 bg-gray-900 rounded-lg mt-1">
// //                           <li
// //                             className={`p-3 cursor-pointer hover:bg-gray-700 rounded-md text-sm ${
// //                               activeSubItem === "supervisor" ? "bg-gray-700" : ""
// //                             }`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "supervisor");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >
// //                             My Task Management
// //                           </li>
// //                           <li
// //                             className={`p-3 cursor-pointer hover:bg-gray-700 rounded-md text-sm ${
// //                               activeSubItem === "employee" ? "bg-gray-700" : ""
// //                             }`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >
// //                             Employee Tasks
// //                           </li>
// //                         </ul>
// //                       )}

// //                       {/* HR Task */}
// //                       {item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask && (
// //                         <ul className="ml-12 bg-gray-900 rounded-lg mt-1">
// //                           <li
// //                             className={`p-3 cursor-pointer hover:bg-gray-700 rounded-md text-sm ${
// //                               activeSubItem === "hr" ? "bg-gray-700" : ""
// //                             }`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "hr");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >
// //                             HR Task Management
// //                           </li>
// //                           <li
// //                             className={`p-3 cursor-pointer hover:bg-gray-700 rounded-md text-sm ${
// //                               activeSubItem === "employee" ? "bg-gray-700" : ""
// //                             }`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >
// //                             Employee Tasks
// //                           </li>
// //                         </ul>
// //                       )}

// //                       {/* HR Leave */}
// //                       {item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave && (
// //                         <ul className="ml-12 bg-gray-900 rounded-lg mt-1">
// //                           <li
// //                             className={`p-3 cursor-pointer hover:bg-gray-700 rounded-md text-sm ${
// //                               activeSubItem === "employee" ? "bg-gray-700" : ""
// //                             }`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >
// //                             My Leave Requests
// //                           </li>
// //                           <li
// //                             className={`p-3 cursor-pointer hover:bg-gray-700 rounded-md text-sm ${
// //                               activeSubItem === "admin" ? "bg-gray-700" : ""
// //                             }`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "admin");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >
// //                             Admin Leave Queries
// //                           </li>
// //                         </ul>
// //                       )}
// //                     </li>
// //                   );
// //                 })
// //               ) : (
// //                 <p className="text-center py-4 text-gray-400">No menu items available</p>
// //               )}
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Sidebar;

// /*  src/components/Dashboard/Sidebar.jsx  */


// // import React, { useState, useEffect, useContext } from "react";
// // import "./Sidebar.css";
// // import * as MdIcons from "react-icons/md";

// // import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// // import AddDepartment from "../AddDepartment/AddDepartment";
// // import AdminQuery from "../EmployeeQueries/AdminQuery";
// // import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// // import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// // import LeaveQueries from "../LeaveQueries/Admin";
// // import LeaveRequest from "../LeaveQueries/LeaveRequest";
// // import Profile from "../Profile/Profile";
// // import MyDashboard from "../MyDashboard/MyDashboard";
// // import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// // import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// // import PayrollSummary from "../PayrollSummary/PayrollSummary";
// // import Reimbursement from "../Reimbursement/Reimbursement";
// // import RbAdmin from "../Reimbursement/RbAdmin";
// // import RbTeamLead from "../Reimbursement/RbTeamLead";
// // import ReimbursementHR from "../Reimbursement/ReimbursementHR";
// // import Assets from "../Assets/assets";
// // import Vendors from "../vendors/vendors";
// // import Chat from "../Chat/ChatPage";
// // import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// // import LetterHead from "../letterHead/letterhead";
// // import NoteDashboard from "../Notes/NoteDashboard";
// // import CreateCompensation from "../Compensation/createCompensation";
// // import AssignCompensation from "../Compensation/assignCompensation";
// // import OvertimeDetails from "../Compensation/OvertimeDetails";

// // /*  THE MISSING IMPORT  */
// // import { ContentContext } from "./Context";

// // import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// // import OvertimeSummary from "../Compensation/overtimeSupervisor";
// // import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// // import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// // import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// // import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// // import TaskManagement from "../TaskManagement/TaskManagement";
// // import Report from "../Report/ReportPanel";
// // import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// // import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";

// // const Sidebar = () => {
// //   const { setActiveContent } = useContext(ContentContext);
// //   const [menuItems, setMenuItems] = useState([]);
// //   const [activeItem, setActiveItem] = useState("");
// //   const [activeSubItem, setActiveSubItem] = useState("");
// //   const [showProfile, setShowProfile] = useState(false);
// //   const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
// //   const [showTaskDropdown, setShowTaskDropdown] = useState(false);
// //   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
// //   const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
// //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// //   // Mobile dropdown state
// //   const [mobileDropdown, setMobileDropdown] = useState({
// //     compensation: false,
// //     task: false,
// //     hrTask: false,
// //     leave: false,
// //   });

// //   const employeeId = localStorage.getItem("employeeId");
// //   const userRole = localStorage.getItem("userRole") || "Employee";
// //   const [activeNav, setActiveNav] = useState("/dashboard");

// //   /* --------------------------------------------------------------
// //      ALL YOUR ORIGINAL useEffect, helpers, handleMenuClick …
// //      (unchanged – copy-paste from your file)
// //   -------------------------------------------------------------- */
// //   useEffect(() => {
// //     const storedData = localStorage.getItem("sidebarMenu");
// //     if (storedData) {
// //       try {
// //         const parsedData = JSON.parse(storedData);
// //         setMenuItems(parsedData || []);
// //       } catch (error) {
// //         console.error("Error parsing sidebar menu:", error);
// //         setMenuItems([]);
// //       }
// //     }
// //     if (setActiveContent) {
// //       if (userRole === "Admin") {
// //         setActiveContent(<MyDashboard />);
// //         setActiveItem("/dashboard");
// //       } else {
// //         setActiveContent(<MyEmpDashboard />);
// //       }
// //       setActiveSubItem("");
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //     }
// //   }, [setActiveContent, userRole]);

// //   const getTaskManagementPath = () => {
// //     if (userRole === "Supervisor") return "/TaskManagement/supervisor";
// //     if (userRole === "HR") return "/TaskManagement/hr";
// //     if (userRole === "Admin") return "/TaskManagement/admin";
// //     return "/TaskManagement/employee";
// //   };

// //   const handleDirectTaskClick = () => {
// //     const item = { path: "/TaskManagement" };
// //     let content = null;
// //     let subOption = null;
// //     let navPath = "/TaskManagement";

// //     if (userRole === "Supervisor") {
// //       content = <TaskManagement />;
// //       subOption = "supervisor";
// //       navPath = "/TaskManagement/supervisor";
// //     } else if (userRole === "HR") {
// //       content = <TaskManagementHR />;
// //       subOption = "hr";
// //       navPath = "/TaskManagement/hr";
// //     } else if (userRole === "Admin") {
// //       content = <TaskManagementAdmin />;
// //       subOption = "admin";
// //       navPath = "/TaskManagement/admin";
// //     } else {
// //       content = <TaskManagementEmployee />;
// //       subOption = "employee";
// //       navPath = "/TaskManagement/employee";
// //     }

// //     setActiveContent(content);
// //     setActiveItem(item.path);
// //     setActiveSubItem(subOption);
// //     setActiveNav(navPath);
// //     setShowMobileMenu(false);
// //     setShowCompensationDropdown(false);
// //     setShowTaskDropdown(false);
// //     setShowHRTaskDropdown(false);
// //     setShowLeaveDropdown(false);
// //   };

// //   const handleMenuClick = (item, subOption = null) => {
// //     setActiveItem(item.path);
// //     setActiveNav(item.path);
// //     setShowMobileMenu(false);

// //     if (item.path === "/compensation" && !subOption) {
// //       setShowCompensationDropdown((prev) => !prev);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
// //       setShowTaskDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
// //       setShowHRTaskDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
// //       setShowLeaveDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     setShowCompensationDropdown(false);
// //     setShowTaskDropdown(false);
// //     setShowHRTaskDropdown(false);
// //     setShowLeaveDropdown(false);
// //     setActiveSubItem(subOption || "");

// //     if (item.path === "/TaskManagement" && subOption) {
// //       let content = null;
// //       let navPath = "/TaskManagement";

// //       if (userRole === "Supervisor") {
// //         if (subOption === "supervisor") {
// //           content = <TaskManagement />;
// //           navPath = "/TaskManagement/supervisor";
// //         } else {
// //           content = <TaskManagementEmployee />;
// //           navPath = "/TaskManagement/employee";
// //         }
// //       } else if (userRole === "HR") {
// //         if (subOption === "hr") {
// //           content = <TaskManagementHR />;
// //           navPath = "/TaskManagement/hr";
// //         } else {
// //           content = <TaskManagementEmployee />;
// //           navPath = "/TaskManagement/employee";
// //         }
// //       } else if (userRole === "Admin") {
// //         content = <TaskManagementAdmin />;
// //         navPath = "/TaskManagement/admin";
// //       } else {
// //         content = <TaskManagementEmployee />;
// //         navPath = "/TaskManagement/employee";
// //       }

// //       setActiveContent(content);
// //       setActiveNav(navPath);
// //       return;
// //     }

// //     if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
// //       switch (subOption) {
// //         case "employee":
// //           setActiveContent(<LeaveRequest />);
// //           break;
// //         case "admin":
// //           setActiveContent(<LeaveQueries />);
// //           break;
// //         default:
// //           setActiveContent(<LeaveRequest />);
// //       }
// //       return;
// //     }

// //     switch (item.path) {
// //       case "/dashboard":
// //         setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
// //         break;
// //       case "/Task":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagementEmployee":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagement":
// //         if (userRole === "Supervisor") {
// //           setActiveContent(<TaskManagement />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<TaskManagementHR />);
// //         } else if (userRole === "Admin") {
// //           setActiveContent(<TaskManagementAdmin />);
// //         } else {
// //           setActiveContent(<TaskManagementEmployee />);
// //         }
// //         break;
// //       case "/report":
// //         setActiveContent(<Report />);
// //         break;
// //       case "/TaskManagementAdmin":
// //         setActiveContent(<TaskManagementAdmin />);
// //         break;
// //       case "/employeeDetails":
// //         setActiveContent(<EmployeeDetails />);
// //         break;
// //       case "/addDepartment":
// //         setActiveContent(<AddDepartment />);
// //         break;
// //       case "/updateProjects":
// //         setActiveContent(<UpdateProject />);
// //         break;
// //       case "/leaveQueries":
// //         if (userRole === "Admin") {
// //           setActiveContent(<LeaveQueries />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<LeaveRequest />);
// //         } else {
// //           setActiveContent(<LeaveRequest />);
// //         }
// //         break;
// //       case "/Salary_Statement":
// //         setActiveContent(<SalaryStatementWrapper />);
// //         break;
// //       case "/letterHead":
// //         setActiveContent(<LetterHead />);
// //         break;
// //       case "/payrollSummary":
// //         setActiveContent(<PayrollSummary />);
// //         break;
// //       case "/messenger":
// //         setActiveContent(<Chat />);
// //         break;
// //       case "/reimbursement":
// //         if (userRole === "Admin") {
// //           setActiveContent(<RbAdmin />);
// //         } else if (userRole === "Manager") {
// //           setActiveContent(<RbTeamLead />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<ReimbursementHR />);
// //         } else {
// //           setActiveContent(<Reimbursement />);
// //         }
// //         break;
// //       case "/employeeQueries":
// //         setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
// //         break;
// //       case "/assets":
// //         setActiveContent(<Assets />);
// //         break;
// //       case "/vendors":
// //         setActiveContent(<Vendors />);
// //         break;
// //       case "/notes":
// //         setActiveContent(<NoteDashboard />);
// //         break;
// //       case "/EmployeeLogin":
// //         setActiveContent(<EmployeeLogin />);
// //         break;
// //       case "/Overtime":
// //         setActiveContent(<OvertimeDetails />);
// //         break;
// //       case "/OvertimeSummary":
// //         setActiveContent(<OvertimeSummary />);
// //         break;
// //       case "/compensation":
// //         switch (subOption) {
// //           case "create":
// //             setActiveContent(<CreateCompensation />);
// //             break;
// //           case "assign":
// //             setActiveContent(<AssignCompensation />);
// //             break;
// //           case "SalaryBreakupMain":
// //             setActiveContent(<SalaryBreakupMain />);
// //             break;
// //           case "EmployeeTable":
// //             setActiveContent(<SalaryDetails />);
// //             break;
// //           default:
// //             setActiveContent(<p>Please select a compensation option.</p>);
// //         }
// //         break;

// //       default:
// //         setActiveContent(<p>Content not found for this path.</p>);
// //     }
// //   };

// //   const toggleProfile = () => {
// //     setShowProfile(!showProfile);
// //   };

// //   const toggleMobileDropdown = (key) => {
// //     setMobileDropdown((prev) => ({
// //       ...prev,
// //       [key]: !prev[key],
// //     }));
// //   };

// //   const closeAllMobileDropdowns = () => {
// //     setMobileDropdown({
// //       compensation: false,
// //       task: false,
// //       hrTask: false,
// //       leave: false,
// //     });
// //   };

// //   /* --------------------------------------------------------------
// //      JSX – DESKTOP + MOBILE MENU (black & white)
// //   -------------------------------------------------------------- */
// //   return (
// //     <>
// //       {/* Desktop Sidebar */}
// //       <div className="sidebar bg-black text-white min-h-screen w-64 fixed">
// //         {userRole !== "Admin" && (
// //           <div className="view-profile p-4">
// //             <span
// //               onClick={() => setShowProfile(!showProfile)}
// //               className="view-profile-text cursor-pointer hover:text-blue-400"
// //             >
// //               View Profile
// //             </span>
// //           </div>
// //         )}
// //         <ul className="mt-4">
// //           {menuItems.length > 0 ? (
// //             menuItems.map((item, index) => {
// //               const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //               return (
// //                 <li key={index} className="relative">
// //                   <div
// //                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
// //                       activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// //                     }`}
// //                     onClick={() => handleMenuClick(item)}
// //                   >
// //                     <span className="icon mr-2">
// //                       <IconComponent size={24} />
// //                     </span>
// //                     <span className="menu-text flex-1">{item.label}</span>
// //                   </div>

// //                   {/* Compensation Dropdown */}
// //                   {item.path === "/compensation" && showCompensationDropdown && (
// //                     <ul className="ml-8 bg-gray-900 rounded-md">
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "create" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "create")}
// //                       >
// //                         Create Compensation
// //                       </li>
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "assign" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "assign")}
// //                       >
// //                         Assign Compensation
// //                       </li>
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "SalaryBreakupMain" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "SalaryBreakupMain")}
// //                       >
// //                         Salary Breakup
// //                       </li>
// //                       <li
// //                         className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                           activeSubItem === "EmployeeTable" ? "bg-gray-700" : ""
// //                         }`}
// //                         onClick={() => handleMenuClick(item, "EmployeeTable")}
// //                       >
// //                         Salary Details
// //                       </li>
// //                     </ul>
// //                   )}

// //                   {/* Supervisor Task Dropdown */}
// //                   {item.path === "/TaskManagement" &&
// //                     userRole === "Supervisor" &&
// //                     showTaskDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "supervisor" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "supervisor")}
// //                         >
// //                           My Task Management
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "employee")}
// //                         >
// //                           Employee Tasks
// //                         </li>
// //                       </ul>
// //                     )}

// //                   {/* HR Task Dropdown */}
// //                   {item.path === "/TaskManagement" &&
// //                     userRole === "HR" &&
// //                     showHRTaskDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "hr" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "hr")}
// //                         >
// //                           HR Task Management
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "employee")}
// //                         >
// //                           Employee Tasks
// //                         </li>
// //                       </ul>
// //                     )}

// //                   {/* HR Leave Dropdown */}
// //                   {item.path === "/leaveQueries" &&
// //                     userRole === "HR" &&
// //                     showLeaveDropdown && (
// //                       <ul className="ml-8 bg-gray-900 rounded-md">
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "employee" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "employee")}
// //                         >
// //                           My Leave Requests
// //                         </li>
// //                         <li
// //                           className={`p-2 cursor-pointer hover:bg-gray-700 ${
// //                             activeSubItem === "admin" ? "bg-gray-700" : ""
// //                           }`}
// //                           onClick={() => handleMenuClick(item, "admin")}
// //                         >
// //                           Admin Leave Queries
// //                         </li>
// //                       </ul>
// //                     )}
// //                 </li>
// //               );
// //             })
// //           ) : (
// //             <p className="no-menu p-4">No menu items available</p>
// //           )}
// //         </ul>
// //         {showProfile && (
// //           <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />
// //         )}
// //       </div>

// //       {/* Bottom Navigation */}
// //       <div className="bottom-nav fixed bottom-0 w-full bg-white text-black flex justify-around py-2 md:hidden">
// //         <button
// //           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/dashboard" })}
// //         >
// //           <MdIcons.MdHome size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
// //         >
// //           <MdIcons.MdOutlineContactPhone size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
// //         >
// //           <MdIcons.MdOutlineCommentBank size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/reimbursement" })}
// //         >
// //           <MdIcons.MdCurrencyRupee size={24} />
// //         </button>

// //         <button
// //           className={`p-2 ${activeNav === getTaskManagementPath() ? "text-blue-400" : ""}`}
// //           onClick={handleDirectTaskClick}
// //         >
// //           <MdIcons.MdTaskAlt size={24} />
// //         </button>

// //         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
// //           <MdIcons.MdMenu size={24} />
// //         </button>
// //       </div>

// //       {/* Mobile Menu – BLACK & WHITE VERTICAL LIST */}
// //       {showMobileMenu && (
// //         <div
// //           className="mobile-menu-overlay"
// //           onClick={() => {
// //             setShowMobileMenu(false);
// //             closeAllMobileDropdowns();
// //           }}
// //         >
// //           <div
// //             className="mobile-menu"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             {/* Header */}
// //             <div className="mobile-header">
// //               <h2 className="mobile-title">Menu</h2>
// //               <button
// //                 className="mobile-close"
// //                 onClick={() => {
// //                   setShowMobileMenu(false);
// //                   closeAllMobileDropdowns();
// //                 }}
// //               >
// //                 <MdIcons.MdClose size={28} />
// //               </button>
// //             </div>

// //             <ul className="mobile-list">
// //               {menuItems.length > 0 ? (
// //                 menuItems.map((item, index) => {
// //                   const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //                   const hasDropdown =
// //                     item.path === "/compensation" ||
// //                     (item.path === "/TaskManagement" && (userRole === "Supervisor" || userRole === "HR")) ||
// //                     (item.path === "/leaveQueries" && userRole === "HR");

// //                   const isOpen =
// //                     (item.path === "/compensation" && mobileDropdown.compensation) ||
// //                     (item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task) ||
// //                     (item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask) ||
// //                     (item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave);

// //                   return (
// //                     <li key={index} className="mobile-list-item">
// //                       <div
// //                         className={`mobile-item ${activeItem === item.path && !activeSubItem ? "active" : ""}`}
// //                         onClick={() => {
// //                           if (hasDropdown) {
// //                             const key =
// //                               item.path === "/compensation"
// //                                 ? "compensation"
// //                                 : item.path === "/TaskManagement" && userRole === "Supervisor"
// //                                 ? "task"
// //                                 : item.path === "/TaskManagement" && userRole === "HR"
// //                                 ? "hrTask"
// //                                 : "leave";
// //                             toggleMobileDropdown(key);
// //                             return;
// //                           }
// //                           handleMenuClick(item);
// //                         }}
// //                       >
// //                         <span className="mobile-icon"><IconComponent size={22} /></span>
// //                         <span className="mobile-label">{item.label}</span>
// //                         {hasDropdown && (
// //                           <span className="mobile-arrow">
// //                             {isOpen ? <MdIcons.MdKeyboardArrowDown /> : <MdIcons.MdKeyboardArrowRight />}
// //                           </span>
// //                         )}
// //                       </div>

// //                       {/* Compensation Dropdown */}
// //                       {item.path === "/compensation" && mobileDropdown.compensation && (
// //                         <ul className="mobile-submenu">
// //                           {[
// //                             { key: "create", label: "Create Compensation" },
// //                             { key: "assign", label: "Assign Compensation" },
// //                             { key: "SalaryBreakupMain", label: "Salary Breakup" },
// //                             { key: "EmployeeTable", label: "Salary Details" },
// //                           ].map((opt) => (
// //                             <li
// //                               key={opt.key}
// //                               className={`mobile-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
// //                               onClick={() => {
// //                                 handleMenuClick(item, opt.key);
// //                                 closeAllMobileDropdowns();
// //                               }}
// //                             >
// //                               {opt.label}
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       )}

// //                       {/* Supervisor Task */}
// //                       {item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task && (
// //                         <ul className="mobile-submenu">
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "supervisor" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "supervisor");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >My Task Management</li>
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >Employee Tasks</li>
// //                         </ul>
// //                       )}

// //                       {/* HR Task */}
// //                       {item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask && (
// //                         <ul className="mobile-submenu">
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "hr" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "hr");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >HR Task Management</li>
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >Employee Tasks</li>
// //                         </ul>
// //                       )}

// //                       {/* HR Leave */}
// //                       {item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave && (
// //                         <ul className="mobile-submenu">
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >My Leave Requests</li>
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "admin" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "admin");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >Admin Leave Queries</li>
// //                         </ul>
// //                       )}
// //                     </li>
// //                   );
// //                 })
// //               ) : (
// //                 <p className="mobile-no-items">No menu items available</p>
// //               )}
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Sidebar;

// // import React, { useState, useEffect, useContext } from "react";
// // import "./Sidebar.css";
// // import * as MdIcons from "react-icons/md";

// // import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// // import AddDepartment from "../AddDepartment/AddDepartment";
// // import AdminQuery from "../EmployeeQueries/AdminQuery";
// // import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// // import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// // import LeaveQueries from "../LeaveQueries/Admin";
// // import LeaveRequest from "../LeaveQueries/LeaveRequest";
// // import Profile from "../Profile/Profile";
// // import MyDashboard from "../MyDashboard/MyDashboard";
// // import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// // import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// // import PayrollSummary from "../PayrollSummary/PayrollSummary";
// // import Reimbursement from "../Reimbursement/Reimbursement";
// // import RbAdmin from "../Reimbursement/RbAdmin";
// // import RbTeamLead from "../Reimbursement/RbTeamLead";
// // import ReimbursementHR from "../Reimbursement/ReimbursementHR";
// // import Assets from "../Assets/assets";
// // import Vendors from "../vendors/vendors";
// // import Chat from "../Chat/ChatPage";
// // import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// // import LetterHead from "../letterHead/letterhead";
// // import NoteDashboard from "../Notes/NoteDashboard";
// // import CreateCompensation from "../Compensation/createCompensation";
// // import AssignCompensation from "../Compensation/assignCompensation";
// // import OvertimeDetails from "../Compensation/OvertimeDetails";

// // /*  THE MISSING IMPORT  */
// // import { ContentContext } from "./Context";

// // import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// // import OvertimeSummary from "../Compensation/overtimeSupervisor";
// // import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// // import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// // import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// // import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// // import TaskManagement from "../TaskManagement/TaskManagement";
// // import Report from "../Report/ReportPanel";
// // import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// // import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";

// // const Sidebar = () => {
// //   const { setActiveContent } = useContext(ContentContext);
// //   const [menuItems, setMenuItems] = useState([]);
// //   const [activeItem, setActiveItem] = useState("");
// //   const [activeSubItem, setActiveSubItem] = useState("");
// //   const [showProfile, setShowProfile] = useState(false);
// //   const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
// //   const [showTaskDropdown, setShowTaskDropdown] = useState(false);
// //   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
// //   const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
// //   const [showMobileMenu, setShowMobileMenu] = useState(false);

// //   // Mobile dropdown state
// //   const [mobileDropdown, setMobileDropdown] = useState({
// //     compensation: false,
// //     task: false,
// //     hrTask: false,
// //     leave: false,
// //   });

// //   const employeeId = localStorage.getItem("employeeId");
// //   const userRole = localStorage.getItem("userRole") || "Employee";
// //   const [activeNav, setActiveNav] = useState("/dashboard");

// //   /* --------------------------------------------------------------
// //      ALL YOUR ORIGINAL useEffect, helpers, handleMenuClick …
// //      (unchanged – copy-paste from your file)
// //   -------------------------------------------------------------- */
// //   useEffect(() => {
// //     const storedData = localStorage.getItem("sidebarMenu");
// //     if (storedData) {
// //       try {
// //         const parsedData = JSON.parse(storedData);
// //         setMenuItems(parsedData || []);
// //       } catch (error) {
// //         console.error("Error parsing sidebar menu:", error);
// //         setMenuItems([]);
// //       }
// //     }
// //     if (setActiveContent) {
// //       if (userRole === "Admin") {
// //         setActiveContent(<MyDashboard />);
// //         setActiveItem("/dashboard");
// //       } else {
// //         setActiveContent(<MyEmpDashboard />);
// //       }
// //       setActiveSubItem("");
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //     }
// //   }, [setActiveContent, userRole]);

// //   const getTaskManagementPath = () => {
// //     if (userRole === "Supervisor") return "/TaskManagement/supervisor";
// //     if (userRole === "HR") return "/TaskManagement/hr";
// //     if (userRole === "Admin") return "/TaskManagement/admin";
// //     return "/TaskManagement/employee";
// //   };

// //   const handleDirectTaskClick = () => {
// //     const item = { path: "/TaskManagement" };
// //     let content = null;
// //     let subOption = null;
// //     let navPath = "/TaskManagement";

// //     if (userRole === "Supervisor") {
// //       content = <TaskManagement />;
// //       subOption = "supervisor";
// //       navPath = "/TaskManagement/supervisor";
// //     } else if (userRole === "HR") {
// //       content = <TaskManagementHR />;
// //       subOption = "hr";
// //       navPath = "/TaskManagement/hr";
// //     } else if (userRole === "Admin") {
// //       content = <TaskManagementAdmin />;
// //       subOption = "admin";
// //       navPath = "/TaskManagement/admin";
// //     } else {
// //       content = <TaskManagementEmployee />;
// //       subOption = "employee";
// //       navPath = "/TaskManagement/employee";
// //     }

// //     setActiveContent(content);
// //     setActiveItem(item.path);
// //     setActiveSubItem(subOption);
// //     setActiveNav(navPath);
// //     setShowMobileMenu(false);
// //     setShowCompensationDropdown(false);
// //     setShowTaskDropdown(false);
// //     setShowHRTaskDropdown(false);
// //     setShowLeaveDropdown(false);
// //   };

// //   const handleMenuClick = (item, subOption = null) => {
// //     setActiveItem(item.path);
// //     setActiveNav(item.path);
// //     setShowMobileMenu(false);

// //     if (item.path === "/compensation" && !subOption) {
// //       setShowCompensationDropdown((prev) => !prev);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
// //       setShowTaskDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
// //       setShowHRTaskDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowLeaveDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
// //       setShowLeaveDropdown((prev) => !prev);
// //       setShowCompensationDropdown(false);
// //       setShowTaskDropdown(false);
// //       setShowHRTaskDropdown(false);
// //       setActiveSubItem("");
// //       return;
// //     }

// //     setShowCompensationDropdown(false);
// //     setShowTaskDropdown(false);
// //     setShowHRTaskDropdown(false);
// //     setShowLeaveDropdown(false);
// //     setActiveSubItem(subOption || "");

// //     if (item.path === "/TaskManagement" && subOption) {
// //       let content = null;
// //       let navPath = "/TaskManagement";

// //       if (userRole === "Supervisor") {
// //         if (subOption === "supervisor") {
// //           content = <TaskManagement />;
// //           navPath = "/TaskManagement/supervisor";
// //         } else {
// //           content = <TaskManagementEmployee />;
// //           navPath = "/TaskManagement/employee";
// //         }
// //       } else if (userRole === "HR") {
// //         if (subOption === "hr") {
// //           content = <TaskManagementHR />;
// //           navPath = "/TaskManagement/hr";
// //         } else {
// //           content = <TaskManagementEmployee />;
// //           navPath = "/TaskManagement/employee";
// //         }
// //       } else if (userRole === "Admin") {
// //         content = <TaskManagementAdmin />;
// //         navPath = "/TaskManagement/admin";
// //       } else {
// //         content = <TaskManagementEmployee />;
// //         navPath = "/TaskManagement/employee";
// //       }

// //       setActiveContent(content);
// //       setActiveNav(navPath);
// //       return;
// //     }

// //     if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
// //       switch (subOption) {
// //         case "employee":
// //           setActiveContent(<LeaveRequest />);
// //           break;
// //         case "admin":
// //           setActiveContent(<LeaveQueries />);
// //           break;
// //         default:
// //           setActiveContent(<LeaveRequest />);
// //       }
// //       return;
// //     }

// //     switch (item.path) {
// //       case "/dashboard":
// //         setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
// //         break;
// //       case "/Task":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagementEmployee":
// //         setActiveContent(<TaskManagementEmployee />);
// //         break;
// //       case "/TaskManagement":
// //         if (userRole === "Supervisor") {
// //           setActiveContent(<TaskManagement />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<TaskManagementHR />);
// //         } else if (userRole === "Admin") {
// //           setActiveContent(<TaskManagementAdmin />);
// //         } else {
// //           setActiveContent(<TaskManagementEmployee />);
// //         }
// //         break;
// //       case "/report":
// //         setActiveContent(<Report />);
// //         break;
// //       case "/TaskManagementAdmin":
// //         setActiveContent(<TaskManagementAdmin />);
// //         break;
// //       case "/employeeDetails":
// //         setActiveContent(<EmployeeDetails />);
// //         break;
// //       case "/addDepartment":
// //         setActiveContent(<AddDepartment />);
// //         break;
// //       case "/updateProjects":
// //         setActiveContent(<UpdateProject />);
// //         break;
// //       case "/leaveQueries":
// //         if (userRole === "Admin") {
// //           setActiveContent(<LeaveQueries />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<LeaveRequest />);
// //         } else {
// //           setActiveContent(<LeaveRequest />);
// //         }
// //         break;
// //       case "/Salary_Statement":
// //         setActiveContent(<SalaryStatementWrapper />);
// //         break;
// //       case "/letterHead":
// //         setActiveContent(<LetterHead />);
// //         break;
// //       case "/payrollSummary":
// //         setActiveContent(<PayrollSummary />);
// //         break;
// //       case "/messenger":
// //         setActiveContent(<Chat />);
// //         break;
// //       case "/reimbursement":
// //         if (userRole === "Admin") {
// //           setActiveContent(<RbAdmin />);
// //         } else if (userRole === "Manager") {
// //           setActiveContent(<RbTeamLead />);
// //         } else if (userRole === "HR") {
// //           setActiveContent(<ReimbursementHR />);
// //         } else {
// //           setActiveContent(<Reimbursement />);
// //         }
// //         break;
// //       case "/employeeQueries":
// //         setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
// //         break;
// //       case "/assets":
// //         setActiveContent(<Assets />);
// //         break;
// //       case "/vendors":
// //         setActiveContent(<Vendors />);
// //         break;
// //       case "/notes":
// //         setActiveContent(<NoteDashboard />);
// //         break;
// //       case "/EmployeeLogin":
// //         setActiveContent(<EmployeeLogin />);
// //         break;
// //       case "/Overtime":
// //         setActiveContent(<OvertimeDetails />);
// //         break;
// //       case "/OvertimeSummary":
// //         setActiveContent(<OvertimeSummary />);
// //         break;
// //       case "/compensation":
// //         switch (subOption) {
// //           case "create":
// //             setActiveContent(<CreateCompensation />);
// //             break;
// //           case "assign":
// //             setActiveContent(<AssignCompensation />);
// //             break;
// //           case "SalaryBreakupMain":
// //             setActiveContent(<SalaryBreakupMain />);
// //             break;
// //           case "EmployeeTable":
// //             setActiveContent(<SalaryDetails />);
// //             break;
// //           default:
// //             setActiveContent(<p>Please select a compensation option.</p>);
// //         }
// //         break;

// //       default:
// //         setActiveContent(<p>Content not found for this path.</p>);
// //     }
// //   };

// //   const toggleProfile = () => {
// //     setShowProfile(!showProfile);
// //   };

// //   const toggleMobileDropdown = (key) => {
// //     setMobileDropdown((prev) => ({
// //       ...prev,
// //       [key]: !prev[key],
// //     }));
// //   };

// //   const closeAllMobileDropdowns = () => {
// //     setMobileDropdown({
// //       compensation: false,
// //       task: false,
// //       hrTask: false,
// //       leave: false,
// //     });
// //   };

// //   /* --------------------------------------------------------------
// //      JSX – DESKTOP + MOBILE MENU (black & white)
// //   -------------------------------------------------------------- */
// //   return (
// //     <>
// //       {/* Desktop Sidebar */}
// //       <div className="sidebar bg-black text-white min-h-screen w-64 fixed">
// //         {userRole !== "Admin" && (
// //           <div className="view-profile p-4">
// //             <span
// //               onClick={() => setShowProfile(!showProfile)}
// //               className="view-profile-text cursor-pointer hover:text-blue-400"
// //             >
// //               View Profile
// //             </span>
// //           </div>
// //         )}
// //         <ul className="mt-4">
// //           {menuItems.length > 0 ? (
// //             menuItems.map((item, index) => {
// //               const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //               return (
// //                 <li key={index} className="relative">
// //                   <div
// //                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
// //                       activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
// //                     }`}
// //                     onClick={() => handleMenuClick(item)}
// //                   >
// //                     <span className="icon mr-2">
// //                       <IconComponent size={24} />
// //                     </span>
// //                     <span className="menu-text flex-1">{item.label}</span>
// //                   </div>

// //                   {/* === COMPENSATION DROPDOWN – DESKTOP (FIXED) === */}
// //                   {item.path === "/compensation" && showCompensationDropdown && (
// //                     <ul className="desktop-submenu">
// //                       {[
// //                         { key: "create", label: "Create Compensation", icon: "MdOutlineAddCircleOutline" },
// //                         { key: "assign", label: "Assign Compensation", icon: "MdOutlineAssignmentInd" },
// //                         { key: "SalaryBreakupMain", label: "Salary Breakup", icon: "MdOutlineAccountBalance" },
// //                         { key: "EmployeeTable", label: "Salary Details", icon: "MdOutlineTableChart" },
// //                       ].map((opt) => {
// //                         const SubIcon = MdIcons[opt.icon] || MdIcons.MdOutlineDashboard;
// //                         return (
// //                           <li
// //                             key={opt.key}
// //                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
// //                             onClick={() => handleMenuClick(item, opt.key)}
// //                           >
// //                             <span className="icon">
// //                               <SubIcon size={20} />
// //                             </span>
// //                             <span>{opt.label}</span>
// //                           </li>
// //                         );
// //                       })}
// //                     </ul>
// //                   )}

// //                   {/* === SUPERVISOR TASK DROPDOWN – DESKTOP (FIXED) === */}
// //                   {item.path === "/TaskManagement" && userRole === "Supervisor" && showTaskDropdown && (
// //                     <ul className="desktop-submenu">
// //                       {[
// //                         { key: "supervisor", label: "My Task Management", icon: "MdOutlineDashboard" },
// //                         { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
// //                       ].map((opt) => {
// //                         const SubIcon = MdIcons[opt.icon];
// //                         return (
// //                           <li
// //                             key={opt.key}
// //                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
// //                             onClick={() => handleMenuClick(item, opt.key)}
// //                           >
// //                             <span className="icon"><SubIcon size={20} /></span>
// //                             <span>{opt.label}</span>
// //                           </li>
// //                         );
// //                       })}
// //                     </ul>
// //                   )}

// //                   {/* === HR TASK DROPDOWN – DESKTOP (FIXED) === */}
// //                   {item.path === "/TaskManagement" && userRole === "HR" && showHRTaskDropdown && (
// //                     <ul className="desktop-submenu">
// //                       {[
// //                         { key: "hr", label: "HR Task Management", icon: "MdOutlineAdminPanelSettings" },
// //                         { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
// //                       ].map((opt) => {
// //                         const SubIcon = MdIcons[opt.icon];
// //                         return (
// //                           <li
// //                             key={opt.key}
// //                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
// //                             onClick={() => handleMenuClick(item, opt.key)}
// //                           >
// //                             <span className="icon"><SubIcon size={20} /></span>
// //                             <span>{opt.label}</span>
// //                           </li>
// //                         );
// //                       })}
// //                     </ul>
// //                   )}

// //                   {/* === HR LEAVE DROPDOWN – DESKTOP (FIXED) === */}
// //                   {item.path === "/leaveQueries" && userRole === "HR" && showLeaveDropdown && (
// //                     <ul className="desktop-submenu">
// //                       {[
// //                         { key: "employee", label: "My Leave Requests", icon: "MdOutlineCalendarToday" },
// //                         { key: "admin", label: "Admin Leave Queries", icon: "MdOutlineVerifiedUser" },
// //                       ].map((opt) => {
// //                         const SubIcon = MdIcons[opt.icon];
// //                         return (
// //                           <li
// //                             key={opt.key}
// //                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
// //                             onClick={() => handleMenuClick(item, opt.key)}
// //                           >
// //                             <span className="icon"><SubIcon size={20} /></span>
// //                             <span>{opt.label}</span>
// //                           </li>
// //                         );
// //                       })}
// //                     </ul>
// //                   )}
// //                 </li>
// //               );
// //             })
// //           ) : (
// //             <p className="no-menu p-4">No menu items available</p>
// //           )}
// //         </ul>
// //         {showProfile && (
// //           <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />
// //         )}
// //       </div>

// //       {/* Bottom Navigation */}
// //       <div className="bottom-nav fixed bottom-0 w-full bg-white text-black flex justify-around py-2 md:hidden">
// //         <button
// //           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/dashboard" })}
// //         >
// //           <MdIcons.MdHome size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
// //         >
// //           <MdIcons.MdOutlineContactPhone size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
// //         >
// //           <MdIcons.MdOutlineCommentBank size={24} />
// //         </button>
// //         <button
// //           className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-400" : ""}`}
// //           onClick={() => handleMenuClick({ path: "/reimbursement" })}
// //         >
// //           <MdIcons.MdCurrencyRupee size={24} />
// //         </button>

// //         <button
// //           className={`p-2 ${activeNav === getTaskManagementPath() ? "text-blue-400" : ""}`}
// //           onClick={handleDirectTaskClick}
// //         >
// //           <MdIcons.MdOutlineTask size={24} />
// //         </button>

// //         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
// //           <MdIcons.MdMenu size={24} />
// //         </button>
// //       </div>

// //       {/* Mobile Menu – BLACK & WHITE VERTICAL LIST */}
// //       {showMobileMenu && (
// //         <div
// //           className="mobile-menu-overlay"
// //           onClick={() => {
// //             setShowMobileMenu(false);
// //             closeAllMobileDropdowns();
// //           }}
// //         >
// //           <div
// //             className="mobile-menu"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             {/* Header */}
// //             <div className="mobile-header">
// //               <h2 className="mobile-title">Menu</h2>
// //               <button
// //                 className="mobile-close"
// //                 onClick={() => {
// //                   setShowMobileMenu(false);
// //                   closeAllMobileDropdowns();
// //                 }}
// //               >
// //                 <MdIcons.MdClose size={28} />
// //               </button>
// //             </div>

// //             <ul className="mobile-list">
// //               {menuItems.length > 0 ? (
// //                 menuItems.map((item, index) => {
// //                   const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
// //                   const hasDropdown =
// //                     item.path === "/compensation" ||
// //                     (item.path === "/TaskManagement" && (userRole === "Supervisor" || userRole === "HR")) ||
// //                     (item.path === "/leaveQueries" && userRole === "HR");

// //                   const isOpen =
// //                     (item.path === "/compensation" && mobileDropdown.compensation) ||
// //                     (item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task) ||
// //                     (item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask) ||
// //                     (item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave);

// //                   return (
// //                     <li key={index} className="mobile-list-item">
// //                       <div
// //                         className={`mobile-item ${activeItem === item.path && !activeSubItem ? "active" : ""}`}
// //                         onClick={() => {
// //                           if (hasDropdown) {
// //                             const key =
// //                               item.path === "/compensation"
// //                                 ? "compensation"
// //                                 : item.path === "/TaskManagement" && userRole === "Supervisor"
// //                                 ? "task"
// //                                 : item.path === "/TaskManagement" && userRole === "HR"
// //                                 ? "hrTask"
// //                                 : "leave";
// //                             toggleMobileDropdown(key);
// //                             return;
// //                           }
// //                           handleMenuClick(item);
// //                         }}
// //                       >
// //                         <span className="mobile-icon"><IconComponent size={22} /></span>
// //                         <span className="mobile-label">{item.label}</span>
// //                         {hasDropdown && (
// //                           <span className="mobile-arrow">
// //                             {isOpen ? <MdIcons.MdKeyboardArrowDown /> : <MdIcons.MdKeyboardArrowRight />}
// //                           </span>
// //                         )}
// //                       </div>

// //                       {/* Compensation Dropdown */}
// //                       {item.path === "/compensation" && mobileDropdown.compensation && (
// //                         <ul className="mobile-submenu">
// //                           {[
// //                             { key: "create", label: "Create Compensation" },
// //                             { key: "assign", label: "Assign Compensation" },
// //                             { key: "SalaryBreakupMain", label: "Salary Breakup" },
// //                             { key: "EmployeeTable", label: "Salary Details" },
// //                           ].map((opt) => (
// //                             <li
// //                               key={opt.key}
// //                               className={`mobile-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
// //                               onClick={() => {
// //                                 handleMenuClick(item, opt.key);
// //                                 closeAllMobileDropdowns();
// //                               }}
// //                             >
// //                               {opt.label}
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       )}

// //                       {/* Supervisor Task */}
// //                       {item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task && (
// //                         <ul className="mobile-submenu">
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "supervisor" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "supervisor");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >My Task Management</li>
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >Employee Tasks</li>
// //                         </ul>
// //                       )}

// //                       {/* HR Task */}
// //                       {item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask && (
// //                         <ul className="mobile-submenu">
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "hr" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "hr");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >HR Task Management</li>
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >Employee Tasks</li>
// //                         </ul>
// //                       )}

// //                       {/* HR Leave */}
// //                       {item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave && (
// //                         <ul className="mobile-submenu">
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "employee");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >My Leave Requests</li>
// //                           <li
// //                             className={`mobile-submenu-item ${activeSubItem === "admin" ? "active" : ""}`}
// //                             onClick={() => {
// //                               handleMenuClick(item, "admin");
// //                               closeAllMobileDropdowns();
// //                             }}
// //                           >Admin Leave Queries</li>
// //                         </ul>
// //                       )}
// //                     </li>
// //                   );
// //                 })
// //               ) : (
// //                 <p className="mobile-no-items">No menu items available</p>
// //               )}
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Sidebar;

// import React, { useState, useEffect, useContext } from "react";
// import "./Sidebar.css";
// import * as MdIcons from "react-icons/md";

// import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// import AddDepartment from "../AddDepartment/AddDepartment";
// import AdminQuery from "../EmployeeQueries/AdminQuery";
// import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// import LeaveQueries from "../LeaveQueries/Admin";
// import LeaveRequest from "../LeaveQueries/LeaveRequest";
// import Profile from "../Profile/Profile";
// import MyDashboard from "../MyDashboard/MyDashboard";
// import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// import PayrollSummary from "../PayrollSummary/PayrollSummary";
// import Reimbursement from "../Reimbursement/Reimbursement";
// import RbAdmin from "../Reimbursement/RbAdmin";
// import RbTeamLead from "../Reimbursement/RbTeamLead";
// import ReimbursementHR from "../Reimbursement/ReimbursementHR";
// import Assets from "../Assets/assets";
// import Vendors from "../vendors/vendors";
// import Chat from "../Chat/ChatPage";
// import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// import LetterHead from "../letterHead/letterhead";
// import NoteDashboard from "../Notes/NoteDashboard";
// import CreateCompensation from "../Compensation/createCompensation";
// import AssignCompensation from "../Compensation/assignCompensation";
// import OvertimeDetails from "../Compensation/OvertimeDetails";

// import { ContentContext } from "./Context";

// import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// import OvertimeSummary from "../Compensation/overtimeSupervisor";
// import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// import TaskManagement from "../TaskManagement/TaskManagement";
// import Report from "../Report/ReportPanel";
// import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";

// const Sidebar = () => {
//   const { setActiveContent } = useContext(ContentContext);
//   const [menuItems, setMenuItems] = useState([]);
//   const [activeItem, setActiveItem] = useState("");
//   const [activeSubItem, setActiveSubItem] = useState("");
//   const [showProfile, setShowProfile] = useState(false);
//   const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
//   const [showTaskDropdown, setShowTaskDropdown] = useState(false);
//   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
//   const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   // Mobile dropdown state
//   const [mobileDropdown, setMobileDropdown] = useState({
//     compensation: false,
//     task: false,
//     hrTask: false,
//     leave: false,
//   });

//   const employeeId = localStorage.getItem("employeeId");
//   const userRole = localStorage.getItem("userRole") || "Employee";
//   const [activeNav, setActiveNav] = useState("/dashboard");

//   useEffect(() => {
//     const storedData = localStorage.getItem("sidebarMenu");
//     if (storedData) {
//       try {
//         const parsedData = JSON.parse(storedData);
//         setMenuItems(parsedData || []);
//       } catch (error) {
//         console.error("Error parsing sidebar menu:", error);
//         setMenuItems([]);
//       }
//     }
//     if (setActiveContent) {
//       if (userRole === "Admin") {
//         setActiveContent(<MyDashboard />);
//         setActiveItem("/dashboard");
//       } else {
//         setActiveContent(<MyEmpDashboard />);
//       }
//       setActiveSubItem("");
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false);
//       setShowLeaveDropdown(false);
//     }
//   }, [setActiveContent, userRole]);

//   const getTaskManagementPath = () => {
//     if (userRole === "Supervisor") return "/TaskManagement/supervisor";
//     if (userRole === "HR") return "/TaskManagement/hr";
//     if (userRole === "Admin") return "/TaskManagement/admin";
//     return "/TaskManagement/employee";
//   };

//   const handleDirectTaskClick = () => {
//     const item = { path: "/TaskManagement" };
//     let content = null;
//     let subOption = null;
//     let navPath = "/TaskManagement";

//     if (userRole === "Supervisor") {
//       content = <TaskManagement />;
//       subOption = "supervisor";
//       navPath = "/TaskManagement/supervisor";
//     } else if (userRole === "HR") {
//       content = <TaskManagementHR />;
//       subOption = "hr";
//       navPath = "/TaskManagement/hr";
//     } else if (userRole === "Admin") {
//       content = <TaskManagementAdmin />;
//       subOption = "admin";
//       navPath = "/TaskManagement/admin";
//     } else {
//       content = <TaskManagementEmployee />;
//       subOption = "employee";
//       navPath = "/TaskManagement/employee";
//     }

//     setActiveContent(content);
//     setActiveItem(item.path);
//     setActiveSubItem(subOption);
//     setActiveNav(navPath);
//     setShowMobileMenu(false);
//     setShowCompensationDropdown(false);
//     setShowTaskDropdown(false);
//     setShowHRTaskDropdown(false);
//     setShowLeaveDropdown(false);
//   };

//   const handleMenuClick = (item, subOption = null) => {
//     setActiveItem(item.path);
//     setActiveNav(item.path);
//     setShowMobileMenu(false);

//     if (item.path === "/compensation" && !subOption) {
//       setShowCompensationDropdown((prev) => !prev);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false);
//       setShowLeaveDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
//       setShowTaskDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowHRTaskDropdown(false);
//       setShowLeaveDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
//       setShowHRTaskDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setShowLeaveDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
//       setShowLeaveDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     setShowCompensationDropdown(false);
//     setShowTaskDropdown(false);
//     setShowHRTaskDropdown(false);
//     setShowLeaveDropdown(false);
//     setActiveSubItem(subOption || "");

//     if (item.path === "/TaskManagement" && subOption) {
//       let content = null;
//       let navPath = "/TaskManagement";

//       if (userRole === "Supervisor") {
//         if (subOption === "supervisor") {
//           content = <TaskManagement />;
//           navPath = "/TaskManagement/supervisor";
//         } else {
//           content = <TaskManagementEmployee />;
//           navPath = "/TaskManagement/employee";
//         }
//       } else if (userRole === "HR") {
//         if (subOption === "hr") {
//           content = <TaskManagementHR />;
//           navPath = "/TaskManagement/hr";
//         } else {
//           content = <TaskManagementEmployee />;
//           navPath = "/TaskManagement/employee";
//         }
//       } else if (userRole === "Admin") {
//         content = <TaskManagementAdmin />;
//         navPath = "/TaskManagement/admin";
//       } else {
//         content = <TaskManagementEmployee />;
//         navPath = "/TaskManagement/employee";
//       }

//       setActiveContent(content);
//       setActiveNav(navPath);
//       return;
//     }

//     if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
//       switch (subOption) {
//         case "employee":
//           setActiveContent(<LeaveRequest />);
//           break;
//         case "admin":
//           setActiveContent(<LeaveQueries />);
//           break;
//         default:
//           setActiveContent(<LeaveRequest />);
//       }
//       return;
//     }

//     switch (item.path) {
//       case "/dashboard":
//         setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
//         break;
//       case "/Task":
//         setActiveContent(<TaskManagementEmployee />);
//         break;
//       case "/TaskManagementEmployee":
//         setActiveContent(<TaskManagementEmployee />);
//         break;
//       case "/TaskManagement":
//         if (userRole === "Supervisor") {
//           setActiveContent(<TaskManagement />);
//         } else if (userRole === "HR") {
//           setActiveContent(<TaskManagementHR />);
//         } else if (userRole === "Admin") {
//           setActiveContent(<TaskManagementAdmin />);
//         } else {
//           setActiveContent(<TaskManagementEmployee />);
//         }
//         break;
//       case "/report":
//         setActiveContent(<Report />);
//         break;
//       case "/TaskManagementAdmin":
//         setActiveContent(<TaskManagementAdmin />);
//         break;
//       case "/employeeDetails":
//         setActiveContent(<EmployeeDetails />);
//         break;
//       case "/addDepartment":
//         setActiveContent(<AddDepartment />);
//         break;
//       case "/updateProjects":
//         setActiveContent(<UpdateProject />);
//         break;
//       case "/leaveQueries":
//         if (userRole === "Admin") {
//           setActiveContent(<LeaveQueries />);
//         } else if (userRole === "HR") {
//           setActiveContent(<LeaveRequest />);
//         } else {
//           setActiveContent(<LeaveRequest />);
//         }
//         break;
//       case "/Salary_Statement":
//         setActiveContent(<SalaryStatementWrapper />);
//         break;
//       case "/letterHead":
//         setActiveContent(<LetterHead />);
//         break;
//       case "/payrollSummary":
//         setActiveContent(<PayrollSummary />);
//         break;
//       case "/messenger":
//         setActiveContent(<Chat />);
//         break;
//       case "/reimbursement":
//         if (userRole === "Admin") {
//           setActiveContent(<RbAdmin />);
//         } else if (userRole === "Manager") {
//           setActiveContent(<RbTeamLead />);
//         } else if (userRole === "HR") {
//           setActiveContent(<ReimbursementHR />);
//         } else {
//           setActiveContent(<Reimbursement />);
//         }
//         break;
//       case "/employeeQueries":
//         setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
//         break;
//       case "/assets":
//         setActiveContent(<Assets />);
//         break;
//       case "/vendors":
//         setActiveContent(<Vendors />);
//         break;
//       case "/notes":
//         setActiveContent(<NoteDashboard />);
//         break;
//       case "/EmployeeLogin":
//         setActiveContent(<EmployeeLogin />);
//         break;
//       case "/Overtime":
//         setActiveContent(<OvertimeDetails />);
//         break;
//       case "/OvertimeSummary":
//         setActiveContent(<OvertimeSummary />);
//         break;
//       case "/compensation":
//         switch (subOption) {
//           case "create":
//             setActiveContent(<CreateCompensation />);
//             break;
//           case "assign":
//             setActiveContent(<AssignCompensation />);
//             break;
//           case "SalaryBreakupMain":
//             setActiveContent(<SalaryBreakupMain />);
//             break;
//           case "EmployeeTable":
//             setActiveContent(<SalaryDetails />);
//             break;
//           default:
//             setActiveContent(<p>Please select a compensation option.</p>);
//         }
//         break;

//       default:
//         setActiveContent(<p>Content not found for this path.</p>);
//     }
//   };

//   const toggleProfile = () => {
//     setShowProfile(!showProfile);
//   };

//   const toggleMobileDropdown = (key) => {
//     setMobileDropdown((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const closeAllMobileDropdowns = () => {
//     setMobileDropdown({
//       compensation: false,
//       task: false,
//       hrTask: false,
//       leave: false,
//     });
//   };

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div className="sidebar bg-black text-white min-h-screen w-64 fixed">
//         {userRole !== "Admin" && (
//           <div className="view-profile p-4">
//             <span
//               onClick={() => setShowProfile(!showProfile)}
//               className="view-profile-text cursor-pointer hover:text-blue-400"
//             >
//               View Profile
//             </span>
//           </div>
//         )}
//         <ul className="mt-4">
//           {menuItems.length > 0 ? (
//             menuItems.map((item, index) => {
//               const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
//               return (
//                 <li key={index} className="relative">
//                   <div
//                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
//                       activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
//                     }`}
//                     onClick={() => handleMenuClick(item)}
//                   >
//                     <span className="icon mr-2">
//                       <IconComponent size={24} />
//                     </span>
//                     <span className="menu-text flex-1">{item.label}</span>
//                   </div>

//                   {/* === COMPENSATION DROPDOWN – DESKTOP (FIXED) === */}
//                   {item.path === "/compensation" && showCompensationDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "create", label: "Create Compensation", icon: "MdOutlineAddCircleOutline" },
//                         { key: "assign", label: "Assign Compensation", icon: "MdOutlineAssignmentInd" },
//                         { key: "SalaryBreakupMain", label: "Salary Breakup", icon: "MdOutlineAccountBalance" },
//                         { key: "EmployeeTable", label: "Salary Details", icon: "MdOutlineTableChart" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon] || MdIcons.MdOutlineDashboard;
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon">
//                               <SubIcon size={20} />
//                             </span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}

//                   {/* === SUPERVISOR TASK DROPDOWN – DESKTOP (FIXED) === */}
//                   {item.path === "/TaskManagement" && userRole === "Supervisor" && showTaskDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "supervisor", label: "My Task Management", icon: "MdOutlineDashboard" },
//                         { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon];
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon"><SubIcon size={20} /></span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}

//                   {/* === HR TASK DROPDOWN – DESKTOP (FIXED) === */}
//                   {item.path === "/TaskManagement" && userRole === "HR" && showHRTaskDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "hr", label: "HR Task Management", icon: "MdOutlineAdminPanelSettings" },
//                         { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon];
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon"><SubIcon size={20} /></span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}

//                   {/* === HR LEAVE DROPDOWN – DESKTOP (FIXED) === */}
//                   {item.path === "/leaveQueries" && userRole === "HR" && showLeaveDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "employee", label: "My Leave Requests", icon: "MdOutlineCalendarToday" },
//                         { key: "admin", label: "Admin Leave Queries", icon: "MdOutlineVerifiedUser" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon];
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon"><SubIcon size={20} /></span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}
//                 </li>
//               );
//             })
//           ) : (
//             <p className="no-menu p-4">No menu items available</p>
//           )}
//         </ul>
//         {showProfile && (
//           <Profile employeeId={employeeId} onClose={() => setShowProfile(false)} />
//         )}
//       </div>

//       {/* Bottom Navigation */}
//       <div className="bottom-nav fixed bottom-0 w-full bg-white text-black flex justify-around py-2 md:hidden">
//         <button
//           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/dashboard" })}
//         >
//           <MdIcons.MdHome size={24} />
//         </button>
//         <button
//           className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
//         >
//           <MdIcons.MdOutlineContactPhone size={24} />
//         </button>
//         <button
//           className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
//         >
//           <MdIcons.MdOutlineCommentBank size={24} />
//         </button>
//         <button
//           className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/reimbursement" })}
//         >
//           <MdIcons.MdCurrencyRupee size={24} />
//         </button>

//         <button
//           className={`p-2 ${activeNav === getTaskManagementPath() ? "text-blue-400" : ""}`}
//           onClick={handleDirectTaskClick}
//         >
//           <MdIcons.MdOutlineTask size={24} />
//         </button>

//         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
//           <MdIcons.MdMenu size={24} />
//         </button>
//       </div>

//       {/* Mobile Menu – BLACK & WHITE VERTICAL LIST */}
//       {showMobileMenu && (
//         <div
//           className="mobile-menu-overlay"
//           onClick={() => {
//             setShowMobileMenu(false);
//             closeAllMobileDropdowns();
//           }}
//         >
//           <div
//             className="mobile-menu"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="mobile-header">
//               <h2 className="mobile-title">Menu</h2>
//               <button
//                 className="mobile-close"
//                 onClick={() => {
//                   setShowMobileMenu(false);
//                   closeAllMobileDropdowns();
//                 }}
//               >
//                 <MdIcons.MdClose size={28} />
//               </button>
//             </div>

//             {/* View Profile at Top (Mobile) */}
//             {userRole !== "Admin" && (
//               <div className="mobile-profile-link p-4 border-b border-gray-200">
//                 <span
//                   onClick={() => {
//                     setShowProfile(true);
//                     setShowMobileMenu(false);
//                   }}
//                   className="text-blue-600 font-medium cursor-pointer hover:underline"
//                 >
//                   View Profile
//                 </span>
//               </div>
//             )}

//             <ul className="mobile-list">
//               {menuItems.length > 0 ? (
//                 menuItems.map((item, index) => {
//                   const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
//                   const hasDropdown =
//                     item.path === "/compensation" ||
//                     (item.path === "/TaskManagement" && (userRole === "Supervisor" || userRole === "HR")) ||
//                     (item.path === "/leaveQueries" && userRole === "HR");

//                   const isOpen =
//                     (item.path === "/compensation" && mobileDropdown.compensation) ||
//                     (item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task) ||
//                     (item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask) ||
//                     (item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave);

//                   return (
//                     <li key={index} className="mobile-list-item">
//                       <div
//                         className={`mobile-item ${activeItem === item.path && !activeSubItem ? "active" : ""}`}
//                         onClick={() => {
//                           if (hasDropdown) {
//                             const key =
//                               item.path === "/compensation"
//                                 ? "compensation"
//                                 : item.path === "/TaskManagement" && userRole === "Supervisor"
//                                 ? "task"
//                                 : item.path === "/TaskManagement" && userRole === "HR"
//                                 ? "hrTask"
//                                 : "leave";
//                             toggleMobileDropdown(key);
//                             return;
//                           }
//                           handleMenuClick(item);
//                         }}
//                       >
//                         <span className="mobile-icon"><IconComponent size={22} /></span>
//                         <span className="mobile-label">{item.label}</span>
//                         {hasDropdown && (
//                           <span className="mobile-arrow">
//                             {isOpen ? <MdIcons.MdKeyboardArrowDown /> : <MdIcons.MdKeyboardArrowRight />}
//                           </span>
//                         )}
//                       </div>

//                       {/* Compensation Dropdown */}
//                       {item.path === "/compensation" && mobileDropdown.compensation && (
//                         <ul className="mobile-submenu">
//                           {[
//                             { key: "create", label: "Create Compensation" },
//                             { key: "assign", label: "Assign Compensation" },
//                             { key: "SalaryBreakupMain", label: "Salary Breakup" },
//                             { key: "EmployeeTable", label: "Salary Details" },
//                           ].map((opt) => (
//                             <li
//                               key={opt.key}
//                               className={`mobile-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                               onClick={() => {
//                                 handleMenuClick(item, opt.key);
//                                 closeAllMobileDropdowns();
//                               }}
//                             >
//                               {opt.label}
//                             </li>
//                           ))}
//                         </ul>
//                       )}

//                       {/* Supervisor Task */}
//                       {item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task && (
//                         <ul className="mobile-submenu">
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "supervisor" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "supervisor");
//                               closeAllMobileDropdowns();
//                             }}
//                           >My Task Management</li>
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "employee");
//                               closeAllMobileDropdowns();
//                             }}
//                           >Employee Tasks</li>
//                         </ul>
//                       )}

//                       {/* HR Task */}
//                       {item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask && (
//                         <ul className="mobile-submenu">
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "hr" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "hr");
//                               closeAllMobileDropdowns();
//                             }}
//                           >HR Task Management</li>
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "employee");
//                               closeAllMobileDropdowns();
//                             }}
//                           >Employee Tasks</li>
//                         </ul>
//                       )}

//                       {/* HR Leave */}
//                       {item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave && (
//                         <ul className="mobile-submenu">
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "employee");
//                               closeAllMobileDropdowns();
//                             }}
//                           >My Leave Requests</li>
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "admin" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "admin");
//                               closeAllMobileDropdowns();
//                             }}
//                           >Admin Leave Queries</li>
//                         </ul>
//                       )}
//                     </li>
//                   );
//                 })
//               ) : (
//                 <p className="mobile-no-items">No menu items available</p>
//               )}
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;


// import React, { useState, useEffect, useContext } from "react";
// import "./Sidebar.css";
// import * as MdIcons from "react-icons/md";

// import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
// import AddDepartment from "../AddDepartment/AddDepartment";
// import AdminQuery from "../EmployeeQueries/AdminQuery";
// import EmployeeQuery from "../EmployeeQueries/EmployeeQuery";
// import UpdateProject from "../UpdateProjects/ProjectsDashboard";
// import LeaveQueries from "../LeaveQueries/Admin";
// import LeaveRequest from "../LeaveQueries/LeaveRequest";
// import Profile from "../Profile/Profile";
// import MyDashboard from "../MyDashboard/MyDashboard";
// import MyEmpDashboard from "../MyEmpDashboard/MyEmpDashboard";
// import SalaryStatementWrapper from "../Salary_statement/SalaryStatementWrapper";
// import PayrollSummary from "../PayrollSummary/PayrollSummary";
// import Reimbursement from "../Reimbursement/Reimbursement";
// import RbAdmin from "../Reimbursement/RbAdmin";
// import RbTeamLead from "../Reimbursement/RbTeamLead";
// import ReimbursementHR from "../Reimbursement/ReimbursementHR";
// import Assets from "../Assets/assets";
// import Vendors from "../vendors/vendors";
// import Chat from "../Chat/ChatPage";
// import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";
// import LetterHead from "../letterHead/letterhead";
// import NoteDashboard from "../Notes/NoteDashboard";
// import CreateCompensation from "../Compensation/createCompensation";
// import AssignCompensation from "../Compensation/assignCompensation";
// import OvertimeDetails from "../Compensation/OvertimeDetails";

// import { ContentContext } from "./Context";

// import SalaryBreakupMain from "../Compensation/SalaryBreakupMain";
// import OvertimeSummary from "../Compensation/overtimeSupervisor";
// import SalaryDetails from "../Compensation/SalaryDetails/SalaryDetails";
// import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";
// import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
// import TaskManagementEmployee from "../TaskManagementEmployee/EmpTaskManagement";
// import TaskManagement from "../TaskManagement/TaskManagement";
// import Report from "../Report/ReportPanel";
// import TaskManagementAdmin from "../TaskManagementAdmin/TaskManagementAdmin";
// import TaskManagementHR from "../TaskManagementHR/TaskManagementHR";

// const Sidebar = () => {
//   const { setActiveContent } = useContext(ContentContext);
//   const [menuItems, setMenuItems] = useState([]);
//   const [activeItem, setActiveItem] = useState("");
//   const [activeSubItem, setActiveSubItem] = useState("");
//   const [showProfile, setShowProfile] = useState(false); // MODAL STATE
//   const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
//   const [showTaskDropdown, setShowTaskDropdown] = useState(false);
//   const [showHRTaskDropdown, setShowHRTaskDropdown] = useState(false);
//   const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   const [mobileDropdown, setMobileDropdown] = useState({
//     compensation: false,
//     task: false,
//     hrTask: false,
//     leave: false,
//   });

//   const employeeId = localStorage.getItem("employeeId");
//   const userRole = localStorage.getItem("userRole") || "Employee";
//   const [activeNav, setActiveNav] = useState("/dashboard");

//   useEffect(() => {
//     const storedData = localStorage.getItem("sidebarMenu");
//     if (storedData) {
//       try {
//         const parsedData = JSON.parse(storedData);
//         setMenuItems(parsedData || []);
//       } catch (error) {
//         console.error("Error parsing sidebar menu:", error);
//         setMenuItems([]);
//       }
//     }
//     if (setActiveContent) {
//       if (userRole === "Admin") {
//         setActiveContent(<MyDashboard />);
//         setActiveItem("/dashboard");
//       } else {
//         setActiveContent(<MyEmpDashboard />);
//       }
//       setActiveSubItem("");
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false);
//       setShowLeaveDropdown(false);
//     }
//   }, [setActiveContent, userRole]);

//   const getTaskManagementPath = () => {
//     if (userRole === "Supervisor") return "/TaskManagement/supervisor";
//     if (userRole === "HR") return "/TaskManagement/hr";
//     if (userRole === "Admin") return "/TaskManagement/admin";
//     return "/TaskManagement/employee";
//   };

//   const handleDirectTaskClick = () => {
//     const item = { path: "/TaskManagement" };
//     let content = null;
//     let subOption = null;
//     let navPath = "/TaskManagement";

//     if (userRole === "Supervisor") {
//       content = <TaskManagement />;
//       subOption = "supervisor";
//       navPath = "/TaskManagement/supervisor";
//     } else if (userRole === "HR") {
//       content = <TaskManagementHR />;
//       subOption = "hr";
//       navPath = "/TaskManagement/hr";
//     } else if (userRole === "Admin") {
//       content = <TaskManagementAdmin />;
//       subOption = "admin";
//       navPath = "/TaskManagement/admin";
//     } else {
//       content = <TaskManagementEmployee />;
//       subOption = "employee";
//       navPath = "/TaskManagement/employee";
//     }

//     setActiveContent(content);
//     setActiveItem(item.path);
//     setActiveSubItem(subOption);
//     setActiveNav(navPath);
//     setShowMobileMenu(false);
//     setShowCompensationDropdown(false);
//     setShowTaskDropdown(false);
//     setShowHRTaskDropdown(false);
//     setShowLeaveDropdown(false);
//   };

//   const handleMenuClick = (item, subOption = null) => {
//     setActiveItem(item.path);
//     setActiveNav(item.path);
//     setShowMobileMenu(false);

//     if (item.path === "/compensation" && !subOption) {
//       setShowCompensationDropdown((prev) => !prev);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false);
//       setShowLeaveDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
//       setShowTaskDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowHRTaskDropdown(false);
//       setShowLeaveDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     if (item.path === "/TaskManagement" && !subOption && userRole === "HR") {
//       setShowHRTaskDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setShowLeaveDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     if (item.path === "/leaveQueries" && !subOption && userRole === "HR") {
//       setShowLeaveDropdown((prev) => !prev);
//       setShowCompensationDropdown(false);
//       setShowTaskDropdown(false);
//       setShowHRTaskDropdown(false);
//       setActiveSubItem("");
//       return;
//     }

//     setShowCompensationDropdown(false);
//     setShowTaskDropdown(false);
//     setShowHRTaskDropdown(false);
//     setShowLeaveDropdown(false);
//     setActiveSubItem(subOption || "");

//     if (item.path === "/TaskManagement" && subOption) {
//       let content = null;
//       let navPath = "/TaskManagement";

//       if (userRole === "Supervisor") {
//         if (subOption === "supervisor") {
//           content = <TaskManagement />;
//           navPath = "/TaskManagement/supervisor";
//         } else {
//           content = <TaskManagementEmployee />;
//           navPath = "/TaskManagement/employee";
//         }
//       } else if (userRole === "HR") {
//         if (subOption === "hr") {
//           content = <TaskManagementHR />;
//           navPath = "/TaskManagement/hr";
//         } else {
//           content = <TaskManagementEmployee />;
//           navPath = "/TaskManagement/employee";
//         }
//       } else if (userRole === "Admin") {
//         content = <TaskManagementAdmin />;
//         navPath = "/TaskManagement/admin";
//       } else {
//         content = <TaskManagementEmployee />;
//         navPath = "/TaskManagement/employee";
//       }

//       setActiveContent(content);
//       setActiveNav(navPath);
//       return;
//     }

//     if (item.path === "/leaveQueries" && subOption && userRole === "HR") {
//       switch (subOption) {
//         case "employee":
//           setActiveContent(<LeaveRequest />);
//           break;
//         case "admin":
//           setActiveContent(<LeaveQueries />);
//           break;
//         default:
//           setActiveContent(<LeaveRequest />);
//       }
//       return;
//     }

//     switch (item.path) {
//       case "/dashboard":
//         setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
//         break;
//       case "/Task":
//         setActiveContent(<TaskManagementEmployee />);
//         break;
//       case "/TaskManagementEmployee":
//         setActiveContent(<TaskManagementEmployee />);
//         break;
//       case "/TaskManagement":
//         if (userRole === "Supervisor") {
//           setActiveContent(<TaskManagement />);
//         } else if (userRole === "HR") {
//           setActiveContent(<TaskManagementHR />);
//         } else if (userRole === "Admin") {
//           setActiveContent(<TaskManagementAdmin />);
//         } else {
//           setActiveContent(<TaskManagementEmployee />);
//         }
//         break;
//       case "/report":
//         setActiveContent(<Report />);
//         break;
//       case "/TaskManagementAdmin":
//         setActiveContent(<TaskManagementAdmin />);
//         break;
//       case "/employeeDetails":
//         setActiveContent(<EmployeeDetails />);
//         break;
//       case "/addDepartment":
//         setActiveContent(<AddDepartment />);
//         break;
//       case "/updateProjects":
//         setActiveContent(<UpdateProject />);
//         break;
//       case "/leaveQueries":
//         if (userRole === "Admin") {
//           setActiveContent(<LeaveQueries />);
//         } else if (userRole === "HR") {
//           setActiveContent(<LeaveRequest />);
//         } else {
//           setActiveContent(<LeaveRequest />);
//         }
//         break;
//       case "/Salary_Statement":
//         setActiveContent(<SalaryStatementWrapper />);
//         break;
//       case "/letterHead":
//         setActiveContent(<LetterHead />);
//         break;
//       case "/payrollSummary":
//         setActiveContent(<PayrollSummary />);
//         break;
//       case "/messenger":
//         setActiveContent(<Chat />);
//         break;
//       case "/reimbursement":
//         if (userRole === "Admin") {
//           setActiveContent(<RbAdmin />);
//         } else if (userRole === "Manager") {
//           setActiveContent(<RbTeamLead />);
//         } else if (userRole === "HR") {
//           setActiveContent(<ReimbursementHR />);
//         } else {
//           setActiveContent(<Reimbursement />);
//         }
//         break;
//       case "/employeeQueries":
//         setActiveContent(userRole === "Admin" ? <AdminQuery /> : <EmployeeQuery />);
//         break;
//       case "/assets":
//         setActiveContent(<Assets />);
//         break;
//       case "/vendors":
//         setActiveContent(<Vendors />);
//         break;
//       case "/notes":
//         setActiveContent(<NoteDashboard />);
//         break;
//       case "/EmployeeLogin":
//         setActiveContent(<EmployeeLogin />);
//         break;
//       case "/Overtime":
//         setActiveContent(<OvertimeDetails />);
//         break;
//       case "/OvertimeSummary":
//         setActiveContent(<OvertimeSummary />);
//         break;
//       case "/compensation":
//         switch (subOption) {
//           case "create":
//             setActiveContent(<CreateCompensation />);
//             break;
//           case "assign":
//             setActiveContent(<AssignCompensation />);
//             break;
//           case "SalaryBreakupMain":
//             setActiveContent(<SalaryBreakupMain />);
//             break;
//           case "EmployeeTable":
//             setActiveContent(<SalaryDetails />);
//             break;
//           default:
//             setActiveContent(<p>Please select a compensation option.</p>);
//         }
//         break;

//       default:
//         setActiveContent(<p>Content not found for this path.</p>);
//     }
//   };

//   const toggleMobileDropdown = (key) => {
//     setMobileDropdown((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const closeAllMobileDropdowns = () => {
//     setMobileDropdown({
//       compensation: false,
//       task: false,
//       hrTask: false,
//       leave: false,
//     });
//   };

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div className="sidebar bg-black text-white min-h-screen w-64 fixed">
//         {userRole !== "Admin" && (
//           <div className="view-profile p-4">
//             <span
//               onClick={() => setShowProfile(true)}
//               className="view-profile-text cursor-pointer hover:text-blue-400"
//             >
//               View Profile
//             </span>
//           </div>
//         )}
//         <ul className="mt-4">
//           {menuItems.length > 0 ? (
//             menuItems.map((item, index) => {
//               const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
//               return (
//                 <li key={index} className="relative">
//                   <div
//                     className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
//                       activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
//                     }`}
//                     onClick={() => handleMenuClick(item)}
//                   >
//                     <span className="icon mr-2">
//                       <IconComponent size={24} />
//                     </span>
//                     <span className="menu-text flex-1">{item.label}</span>
//                   </div>

//                   {/* === COMPENSATION DROPDOWN – DESKTOP === */}
//                   {item.path === "/compensation" && showCompensationDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "create", label: "Create Compensation", icon: "MdOutlineAddCircleOutline" },
//                         { key: "assign", label: "Assign Compensation", icon: "MdOutlineAssignmentInd" },
//                         { key: "SalaryBreakupMain", label: "Salary Breakup", icon: "MdOutlineAccountBalance" },
//                         { key: "EmployeeTable", label: "Salary Details", icon: "MdOutlineTableChart" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon] || MdIcons.MdOutlineDashboard;
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon">
//                               <SubIcon size={20} />
//                             </span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}

//                   {/* === SUPERVISOR TASK DROPDOWN – DESKTOP === */}
//                   {item.path === "/TaskManagement" && userRole === "Supervisor" && showTaskDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "supervisor", label: "My Task Management", icon: "MdOutlineDashboard" },
//                         { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon];
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon"><SubIcon size={20} /></span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}

//                   {/* === HR TASK DROPDOWN – DESKTOP === */}
//                   {item.path === "/TaskManagement" && userRole === "HR" && showHRTaskDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "hr", label: "HR Task Management", icon: "MdOutlineAdminPanelSettings" },
//                         { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon];
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon"><SubIcon size={20} /></span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}

//                   {/* === HR LEAVE DROPDOWN – DESKTOP === */}
//                   {item.path === "/leaveQueries" && userRole === "HR" && showLeaveDropdown && (
//                     <ul className="desktop-submenu">
//                       {[
//                         { key: "employee", label: "My Leave Requests", icon: "MdOutlineCalendarToday" },
//                         { key: "admin", label: "Admin Leave Queries", icon: "MdOutlineVerifiedUser" },
//                       ].map((opt) => {
//                         const SubIcon = MdIcons[opt.icon];
//                         return (
//                           <li
//                             key={opt.key}
//                             className={`desktop-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                             onClick={() => handleMenuClick(item, opt.key)}
//                           >
//                             <span className="icon"><SubIcon size={20} /></span>
//                             <span>{opt.label}</span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}
//                 </li>
//               );
//             })
//           ) : (
//             <p className="no-menu p-4">No menu items available</p>
//           )}
//         </ul>
//       </div>

//       {/* Bottom Navigation */}
//       <div className="bottom-nav fixed bottom-0 w-full bg-white text-black flex justify-around py-2 md:hidden">
//         <button
//           className={`p-2 ${activeNav === "/dashboard" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/dashboard" })}
//         >
//           <MdIcons.MdHome size={24} />
//         </button>
//         <button
//           className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/employeeQueries" })}
//         >
//           <MdIcons.MdOutlineContactPhone size={24} />
//         </button>
//         <button
//           className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/leaveQueries" })}
//         >
//           <MdIcons.MdOutlineCommentBank size={24} />
//         </button>
//         <button
//           className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-400" : ""}`}
//           onClick={() => handleMenuClick({ path: "/reimbursement" })}
//         >
//           <MdIcons.MdCurrencyRupee size={24} />
//         </button>

//         <button
//           className={`p-2 ${activeNav === getTaskManagementPath() ? "text-blue-400" : ""}`}
//           onClick={handleDirectTaskClick}
//         >
//           <MdIcons.MdOutlineTask size={24} />
//         </button>

//         <button className="p-2" onClick={() => setShowMobileMenu(true)}>
//           <MdIcons.MdMenu size={24} />
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {showMobileMenu && (
//         <div
//           className="mobile-menu-overlay"
//           onClick={() => {
//             setShowMobileMenu(false);
//             closeAllMobileDropdowns();
//           }}
//         >
//           <div
//             className="mobile-menu"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="mobile-header">
//               <h2 className="mobile-title">Menu</h2>
//               <button
//                 className="mobile-close"
//                 onClick={() => {
//                   setShowMobileMenu(false);
//                   closeAllMobileDropdowns();
//                 }}
//               >
//                 <MdIcons.MdClose size={28} />
//               </button>
//             </div>

//             {/* View Profile at Top - Mobile */}
//             {userRole !== "Admin" && (
//               <div className="mobile-profile-link p-4 border-b border-gray-200">
//                 <span
//                   onClick={() => {
//                     setShowProfile(true);
//                     setShowMobileMenu(false);
//                   }}
//                   className="text-blue-600 font-medium cursor-pointer hover:underline"
//                 >
//                   View Profile
//                 </span>
//               </div>
//             )}

//             <ul className="mobile-list">
//               {menuItems.length > 0 ? (
//                 menuItems.map((item, index) => {
//                   const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
//                   const hasDropdown =
//                     item.path === "/compensation" ||
//                     (item.path === "/TaskManagement" && (userRole === "Supervisor" || userRole === "HR")) ||
//                     (item.path === "/leaveQueries" && userRole === "HR");

//                   const isOpen =
//                     (item.path === "/compensation" && mobileDropdown.compensation) ||
//                     (item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task) ||
//                     (item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask) ||
//                     (item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave);

//                   return (
//                     <li key={index} className="mobile-list-item">
//                       <div
//                         className={`mobile-item ${activeItem === item.path && !activeSubItem ? "active" : ""}`}
//                         onClick={() => {
//                           if (hasDropdown) {
//                             const key =
//                               item.path === "/compensation"
//                                 ? "compensation"
//                                 : item.path === "/TaskManagement" && userRole === "Supervisor"
//                                 ? "task"
//                                 : item.path === "/TaskManagement" && userRole === "HR"
//                                 ? "hrTask"
//                                 : "leave";
//                             toggleMobileDropdown(key);
//                             return;
//                           }
//                           handleMenuClick(item);
//                         }}
//                       >
//                         <span className="mobile-icon"><IconComponent size={22} /></span>
//                         <span className="mobile-label">{item.label}</span>
//                         {hasDropdown && (
//                           <span className="mobile-arrow">
//                             {isOpen ? <MdIcons.MdKeyboardArrowDown /> : <MdIcons.MdKeyboardArrowRight />}
//                           </span>
//                         )}
//                       </div>

//                       {/* Compensation Dropdown */}
//                       {item.path === "/compensation" && mobileDropdown.compensation && (
//                         <ul className="mobile-submenu">
//                           {[
//                             { key: "create", label: "Create Compensation" },
//                             { key: "assign", label: "Assign Compensation" },
//                             { key: "SalaryBreakupMain", label: "Salary Breakup" },
//                             { key: "EmployeeTable", label: "Salary Details" },
//                           ].map((opt) => (
//                             <li
//                               key={opt.key}
//                               className={`mobile-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
//                               onClick={() => {
//                                 handleMenuClick(item, opt.key);
//                                 closeAllMobileDropdowns();
//                               }}
//                             >
//                               {opt.label}
//                             </li>
//                           ))}
//                         </ul>
//                       )}

//                       {/* Supervisor Task */}
//                       {item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task && (
//                         <ul className="mobile-submenu">
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "supervisor" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "supervisor");
//                               closeAllMobileDropdowns();
//                             }}
//                           >My Task Management</li>
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "employee");
//                               closeAllMobileDropdowns();
//                             }}
//                           >Employee Tasks</li>
//                         </ul>
//                       )}

//                       {/* HR Task */}
//                       {item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask && (
//                         <ul className="mobile-submenu">
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "hr" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "hr");
//                               closeAllMobileDropdowns();
//                             }}
//                           >HR Task Management</li>
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "employee");
//                               closeAllMobileDropdowns();
//                             }}
//                           >Employee Tasks</li>
//                         </ul>
//                       )}

//                       {/* HR Leave */}
//                       {item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave && (
//                         <ul className="mobile-submenu">
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "employee");
//                               closeAllMobileDropdowns();
//                             }}
//                           >My Leave Requests</li>
//                           <li
//                             className={`mobile-submenu-item ${activeSubItem === "admin" ? "active" : ""}`}
//                             onClick={() => {
//                               handleMenuClick(item, "admin");
//                               closeAllMobileDropdowns();
//                             }}
//                           >Admin Leave Queries</li>
//                         </ul>
//                       )}
//                     </li>
//                   );
//                 })
//               ) : (
//                 <p className="mobile-no-items">No menu items available</p>
//               )}
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* MODAL: Profile - MOVED OUTSIDE SIDEBAR */}
//       {showProfile && (
//         <Profile
//           employeeId={employeeId}
//           onClose={() => setShowProfile(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;

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

    // Compensation Dropdown
    if (item.path === "/compensation" && !subOption) {
      setShowCompensationDropdown((prev) => !prev);
      setShowTaskDropdown(false);
      setShowHRTaskDropdown(false);
      setShowLeaveDropdown(false);

      setActiveSubItem("");
      return;
    }

    if (item.path === "/TaskManagement" && !subOption && userRole === "Supervisor") {
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
        setActiveContent(userRole === "Admin" ? <MyDashboard /> : <MyEmpDashboard />);
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
      {/* =================== DESKTOP SIDEBAR =================== */}
      <div className="sidebar bg-black text-white min-h-screen w-64 fixed top-0 left-0 flex flex-col">
        {/* Desktop: View Profile - EXACTLY LIKE YOUR ORIGINAL */}
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
              const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
              return (
                <li key={index} className="relative">
                  <div
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                      activeItem === item.path && !activeSubItem ? "bg-gray-700" : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span className="icon mr-3">
                      <IconComponent size={22} />
                    </span>
                    <span className="menu-text flex-1 text-sm">{item.label}</span>
                  </div>

                  {/* Compensation Dropdown */}
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
                            <span className="icon">
                              <SubIcon size={20} />
                            </span>
                            <span>{opt.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Supervisor Task */}
                  {item.path === "/TaskManagement" && userRole === "Supervisor" && showTaskDropdown && (
                    <ul className="desktop-submenu">
                      {[
                        { key: "supervisor", label: "My Task Management", icon: "MdOutlineDashboard" },
                        { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
                      ].map((opt) => {
                        const SubIcon = MdIcons[opt.icon];
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

                  {/* HR Task */}
                  {item.path === "/TaskManagement" && userRole === "HR" && showHRTaskDropdown && (
                    <ul className="desktop-submenu">
                      {[
                        { key: "hr", label: "HR Task Management", icon: "MdOutlineAdminPanelSettings" },
                        { key: "employee", label: "Employee Tasks", icon: "MdOutlinePeople" },
                      ].map((opt) => {
                        const SubIcon = MdIcons[opt.icon];
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

                  {/* HR Leave */}
                  {item.path === "/leaveQueries" && userRole === "HR" && showLeaveDropdown && (
                    <ul className="desktop-submenu">
                      {[
                        { key: "employee", label: "My Leave Requests", icon: "MdOutlineCalendarToday" },
                        { key: "admin", label: "Admin Leave Queries", icon: "MdOutlineVerifiedUser" },
                      ].map((opt) => {
                        const SubIcon = MdIcons[opt.icon];
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

                  {/* Supervisor Task Dropdown */}
                  {item.path === "/TaskManagement" &&
                    userRole === "Supervisor" &&
                    showTaskDropdown && (
                      <ul className="ml-8 bg-gray-900 rounded-md">
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "supervisor" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "supervisor")}
                        >
                          My Task Management
                        </li>
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "employee" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "employee")}
                        >
                          Employee Tasks
                        </li>
                      </ul>
                    )}

                  {/* HR Task Dropdown */}
                  {item.path === "/TaskManagement" &&
                    userRole === "HR" &&
                    showHRTaskDropdown && (
                      <ul className="ml-8 bg-gray-900 rounded-md">
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "hr" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "hr")}
                        >
                          HR Task Management
                        </li>
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "employee" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "employee")}
                        >
                          Employee Tasks
                        </li>
                      </ul>
                    )}

                  {/* HR Leave Dropdown */}
                  {item.path === "/leaveQueries" &&
                    userRole === "HR" &&
                    showLeaveDropdown && (
                      <ul className="ml-8 bg-gray-900 rounded-md">
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "employee" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "employee")}
                        >
                          My Leave Requests
                        </li>
                        <li
                          className={`p-2 cursor-pointer hover:bg-gray-700 ${
                            activeSubItem === "admin" ? "bg-gray-700" : ""
                          }`}
                          onClick={() => handleMenuClick(item, "admin")}
                        >
                          Admin Leave Queries
                        </li>
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

      {/* =================== BOTTOM NAV (MOBILE) =================== */}
      <div className="bottom-nav fixed bottom-0 w-full bg-white text-black flex justify-around py-2 md:hidden z-50">
        <button
          className={`p-2 ${activeNav === "/dashboard" ? "text-blue-500" : "text-gray-600"}`}
          onClick={() => handleMenuClick({ path: "/dashboard" })}
        >
          <MdIcons.MdHome size={26} />
        </button>
        <button
          className={`p-2 ${activeNav === "/employeeQueries" ? "text-blue-500" : "text-gray-600"}`}
          onClick={() => handleMenuClick({ path: "/employeeQueries" })}
        >
          <MdIcons.MdOutlineContactPhone size={26} />
        </button>
        <button
          className={`p-2 ${activeNav === "/leaveQueries" ? "text-blue-500" : "text-gray-600"}`}
          onClick={() => handleMenuClick({ path: "/leaveQueries" })}
        >
          <MdIcons.MdOutlineCommentBank size={26} />
        </button>
        <button
          className={`p-2 ${activeNav === "/reimbursement" ? "text-blue-500" : "text-gray-600"}`}
          onClick={() => handleMenuClick({ path: "/reimbursement" })}
        >
          <MdIcons.MdCurrencyRupee size={26} />
        </button>
        <button
          className={`p-2 ${activeNav === getTaskManagementPath() ? "text-blue-500" : "text-gray-600"}`}
          onClick={handleDirectTaskClick}
        >
          <MdIcons.MdOutlineTask size={26} />
        </button>
        <button className="p-2 text-gray-600" onClick={() => setShowMobileMenu(true)}>
          <MdIcons.MdMenu size={26} />
        </button>
      </div>

      {/* =================== MOBILE MENU =================== */}
      {showMobileMenu && (
        <div
          className="mobile-menu-overlay"
          onClick={() => {
            setShowMobileMenu(false);
            closeAllMobileDropdowns();
          }}
        >
          <div
            className="mobile-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-header">
              <h2 className="mobile-title">Menu</h2>

              {/* Mobile: View Profile Button */}
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
                  const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard;
                  const hasDropdown =
                    item.path === "/compensation" ||
                    (item.path === "/TaskManagement" && (userRole === "Supervisor" || userRole === "HR")) ||
                    (item.path === "/leaveQueries" && userRole === "HR");

                  const isOpen =
                    (item.path === "/compensation" && mobileDropdown.compensation) ||
                    (item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task) ||
                    (item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask) ||
                    (item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave);

                  return (
                    <li key={index} className="mobile-list-item">
                      <div
                        className={`mobile-item ${activeItem === item.path && !activeSubItem ? "active" : ""}`}
                        onClick={() => {
                          if (hasDropdown) {
                            const key =
                              item.path === "/compensation"
                                ? "compensation"
                                : item.path === "/TaskManagement" && userRole === "Supervisor"
                                ? "task"
                                : item.path === "/TaskManagement" && userRole === "HR"
                                ? "hrTask"
                                : "leave";
                            toggleMobileDropdown(key);
                            return;
                          }
                          handleMenuClick(item);
                        }}
                      >
                        <span className="mobile-icon"><IconComponent size={22} /></span>
                        <span className="mobile-label">{item.label}</span>
                        {hasDropdown && (
                          <span className="mobile-arrow">
                            {isOpen ? <MdIcons.MdKeyboardArrowDown /> : <MdIcons.MdKeyboardArrowRight />}
                          </span>
                        )}
                      </div>

                      {/* Submenus */}
                      {item.path === "/compensation" && mobileDropdown.compensation && (
                        <ul className="mobile-submenu">
                          {[
                            { key: "create", label: "Create Compensation" },
                            { key: "assign", label: "Assign Compensation" },
                            { key: "SalaryBreakupMain", label: "Salary Breakup" },
                            { key: "EmployeeTable", label: "Salary Details" },
                          ].map((opt) => (
                            <li
                              key={opt.key}
                              className={`mobile-submenu-item ${activeSubItem === opt.key ? "active" : ""}`}
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

                      {item.path === "/TaskManagement" && userRole === "Supervisor" && mobileDropdown.task && (
                        <ul className="mobile-submenu">
                          <li
                            className={`mobile-submenu-item ${activeSubItem === "supervisor" ? "active" : ""}`}
                            onClick={() => {
                              handleMenuClick(item, "supervisor");
                              closeAllMobileDropdowns();
                            }}
                          >My Task Management</li>
                          <li
                            className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
                            onClick={() => {
                              handleMenuClick(item, "employee");
                              closeAllMobileDropdowns();
                            }}
                          >Employee Tasks</li>
                        </ul>
                      )}

                      {item.path === "/TaskManagement" && userRole === "HR" && mobileDropdown.hrTask && (
                        <ul className="mobile-submenu">
                          <li
                            className={`mobile-submenu-item ${activeSubItem === "hr" ? "active" : ""}`}
                            onClick={() => {
                              handleMenuClick(item, "hr");
                              closeAllMobileDropdowns();
                            }}
                          >HR Task Management</li>
                          <li
                            className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
                            onClick={() => {
                              handleMenuClick(item, "employee");
                              closeAllMobileDropdowns();
                            }}
                          >Employee Tasks</li>
                        </ul>
                      )}

                      {item.path === "/leaveQueries" && userRole === "HR" && mobileDropdown.leave && (
                        <ul className="mobile-submenu">
                          <li
                            className={`mobile-submenu-item ${activeSubItem === "employee" ? "active" : ""}`}
                            onClick={() => {
                              handleMenuClick(item, "employee");
                              closeAllMobileDropdowns();
                            }}
                          >My Leave Requests</li>
                          <li
                            className={`mobile-submenu-item ${activeSubItem === "admin" ? "active" : ""}`}
                            onClick={() => {
                              handleMenuClick(item, "admin");
                              closeAllMobileDropdowns();
                            }}
                          >Admin Leave Queries</li>
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

      {/* =================== PROFILE MODAL =================== */}
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