import React from "react";
import LoginChart from "./LoginChart";
import TotalEmployee from "./TotalEmployee";
import EmployeeByDepartment from "./EmployeeByDepartment";
import SalaryBreakupChart from "./SalaryBreakupChart";
import Dashboardcard from "./Dashboardcard";
import  ProjectTable from "./ProjectsTable";
import './MyDashboard.css';
const MyDashboard = () => {
  return (
    <div>
      <div className="dashboard-logingraph">
        <LoginChart/>
        </div>
        <div className="admindashboardpiecharts">
        <TotalEmployee />
        <EmployeeByDepartment />
        <SalaryBreakupChart />
        </div>
        <div className="dashboard-card-containers">
    <Dashboardcard />
  </div>
  {/* <div className="dashboard-Projecttable">
        <ProjectTable/>
        </div> */}
    </div>
  );
};

export default MyDashboard;