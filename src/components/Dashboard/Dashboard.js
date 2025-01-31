import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Dashboard.css";

const Dashboard = () => {
  // State to manage active content
  const [activeContent, setActiveContent] = useState("Welcome to the Dashboard!");

  const renderContent = () => {
    return (
      <div className="conentcontainerdeisgn">
      <div style={{ height: "1500px" }}>
        <p>{activeContent} content goes here.</p>
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
          {renderContent()}
        </div>
      </div>
    </div>
    </div>
    </div>
  
  );
};

export default Dashboard;
