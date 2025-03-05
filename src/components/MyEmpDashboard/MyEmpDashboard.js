import React from "react";
import EmpDashCards from "./EmpDashCards";
import EmpReImbursement from "./EmpReImbursement";
import EmpSessions from "./EmpSessions";
import EmpWorkDays from "./EmpWorkDays";
import EmpProjectTable from "./EmpProjectTable";
import EmpLeaveTracker from "./EmpLeaveTracker";
import MyDailyWorkHour from "./MyDailyWorkHour";

import "./MyEmpDashboard.css";
const MyEmpDashboard = () => {
  return (
    <div>
      {/* <h1>Employee Dashboad</h1>
      <p>Manage employee details here.</p> */}
      <div className="EmpDashCards1234">

<EmpDashCards/>
</div>
<div className="empcardcharts123">
<EmpSessions/>
<EmpWorkDays/>
<EmpReImbursement/>

</div>
<div className="mydailyworkhour123">
<MyDailyWorkHour/>
</div>

{/* <div className="EmpProjectTable">
  
<EmpProjectTable/>
</div> */}
<div className="EmpLeaveTracker123">
  <h2>Leave Tracker</h2>
<EmpLeaveTracker/>
</div>
</div>

  );
};

export default MyEmpDashboard;