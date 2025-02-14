// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Sidebar.css";
// import * as MdIcons from "react-icons/md"; // Import all Material icons dynamically

// const Sidebar = ({ setActiveContent }) => {
//   const navigate = useNavigate();
//   const [menuItems, setMenuItems] = useState([]); // Default empty array

//   useEffect(() => {
//     const storedData = localStorage.getItem("sidebarMenu");
//     if (storedData) {
//       try {
//         const parsedData = JSON.parse(storedData);
//         setMenuItems(parsedData || []); // FIXED: No need for .sidebarMenu
//       } catch (error) {
//         console.error("Error parsing sidebar menu:", error);
//         setMenuItems([]); // Fallback to empty array
//       }
//     }
//   }, []);

//   const handleMenuClick = (item) => {
//     setActiveContent(item.label);
//     navigate(item.path);
//   };

//   return (
//     <div className="sidebar">
//       <ul>
//         {menuItems.length > 0 ? (
//           menuItems.map((item, index) => {
//             const IconComponent = MdIcons[item.icon] || MdIcons.MdOutlineDashboard; // Default icon
//             return (
//               <li key={index} onClick={() => handleMenuClick(item)}>
//                 <span className="icon"><IconComponent /></span>
//                 <span className="menu-text">{item.label}</span>
//               </li>
//             );
//           })
//         ) : (
//           <p className="no-menu">No menu items available</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;



import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import * as MdIcons from "react-icons/md"; // Import all Material icons dynamically
import EmployeeDetails from "../EmployeeDetails/EmployeeDetails";
import AddDepartment from "../AddDepartment/AddDepartment";
// import MyDashboard from "../MyDashboard/MyDashboard";
// import UpdateProjects from "../UpdateProjects/UpdateProjects";
// import AttendanceMgmt from "../AttendanceMgmt/AttendanceMgmt";
import LeaveQueries from "../LeaveQueries/Admin";
import LeaveRequest from "../LeaveQueries/LeaveRequest";
import MyDashboard from "../MyDashboard/MyDashboard";
// import Performance from "../Performance/Performance";
// import PayrollSummary from "../PayrollSummary/PayrollSummary";
// import RequestLetter from "../RequestLetter/RequestLetter";
// import HolidayDetails from "../HolidayDetails/HolidayDetails";
// import TeamEvents from "../TeamEvents/TeamEvents";
// import EmployeeQueries from "../EmployeeQueries/EmployeeQueries";


const Sidebar = ({ setActiveContent }) => {
  const [menuItems, setMenuItems] = useState([]);

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
      setActiveContent(<MyDashboard />);
    } else if (userRole === "Admin") {
      setActiveContent(<MyDashboard />);
    } else {
      setActiveContent(<p>Access Denied</p>);
    }
  }, [setActiveContent]); // Only run once on component mount

  const handleMenuClick = (item) => {
    const userRole = localStorage.getItem("userRole");
    switch (item.path) {
      case "/dashboard":
        setActiveContent(<MyDashboard />);
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
