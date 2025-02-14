// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import "./Dashboard.css";
// import LoginChart from "./LoginChart";
// import TotalEmployee from "./TotalEmployee";
// import EmployeeByDepartment from "./EmployeeByDepartment";
// import SalaryBreakupChart from "./SalaryBreakupChart";
// import Dashboardcard from "./Dashboardcard";
// import ProjectTable from "./ProjectsTable";

// const Dashboard = () => {
//   // State to manage active content
//   const [activeContent, setActiveContent] = useState("");

//   const renderContent = () => {
//     return (
//       <div className="conentcontainerdeisgn">
//       <div style={{ height: "1500px" }}>
//         <p>{activeContent} content goes here.</p>
//         <div className="dashboard-logingraph">
//         <LoginChart/>
//         </div>
        
//         <div className="dashboard-graphs">
//         <TotalEmployee />
//         <EmployeeByDepartment />
//         <SalaryBreakupChart />
       
//         </div>
//         <div className="dashboard-card-containers">
//     <Dashboardcard />
//   </div>
//   <div className="dashboard-Projecttable">
//         <ProjectTable/>
//         </div>
//       </div>
//       </div>
//     );
//   };

//   return (
//     <div className="Dashboard123">
//     <div className="Dashboarddesign">
    
//     <div className="dashboard">
//       {/* Topbar at the top */}
//       <Topbar />
      
//       {/* Content container: Sidebar on the left, Main Content on the right */}
//       <div className="content-container">
//         <Sidebar setActiveContent={setActiveContent} />
//         <div className="main-content">
//           {renderContent()}
         
//         </div>
//       </div>
//     </div>
//     </div>
//     </div>
  
//   );
// };

// export default Dashboard;
