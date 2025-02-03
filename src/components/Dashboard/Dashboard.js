import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Dashboard.css";

const Dashboard = () => {
  // State to manage active content inside the main-content container
  const [activeContent, setActiveContent] = useState(<p>Welcome to the Dashboard!</p>);

  const renderContent = () => {
    return (
      <div className="content-container-design">
        <div style={{ height: "1500px" }}>
          {activeContent}
        </div>
      </div>
    );
  };

  return (
    <div className="Dashboard123">
      <div className="Dashboarddesign">
        <div className="dashboard">
          {/* Topbar at the top */}
          <Topbar />

          {/* Content container: Sidebar on the left, Main Content on the right */}
          <div className="content-container">
            <Sidebar setActiveContent={setActiveContent} />
            <div className="main-content">
              {renderContent()} {/* Dynamic content rendered here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
