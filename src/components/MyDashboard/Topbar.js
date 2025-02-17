import React from "react";
import "./Topbar.css";

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="profile-section">
        <img
          src="./images/1.png"
          alt="Profile"
          className="profile-img"
        />
        <div className="profile-info">
          <span className="profile-namedash">john doe</span>
          <span className="profile-designation">Software Engineer</span>
        </div>
      </div>
      <div className="icon-section">
      <i className="fas fa-bell"></i>
      <i className="fas fa-calendar-alt"></i>
          
          <i className="fas fa-power-off"></i>
      </div>
    </div>
  );
};

export default Topbar;
