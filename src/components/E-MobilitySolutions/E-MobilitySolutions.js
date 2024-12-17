import React from "react";
import "./EMobilitySolutions.css";

const EMobilitySolutions = () => {
  return (
    <div className="e-mobility-solutions-container">
      {/* Left Section */}
      <div className="e-mobility-solutions-text">
        <h1>E-Mobility Solutions</h1>
        <p>Our E-Mobility Solutions Services Include:</p>
        <ul className="services-list">
          <li>3D Scanning</li>
          <li>Digital Twin Creation</li>
          <li>Component Analysis</li>
          <li>System Replication</li>
          <li>Material Decomposition</li>
          <li>Design Recovery</li>
          <li>Iterative Modeling</li>
          <li>Consultation Services</li>
          <li>Validation and Testing</li>
          <li>Manufacturing Adaptation</li>
        </ul>
        <button className="e-mobility-solutions-button">Learn More</button>
      </div>

      {/* Right Section */}
      <div className="e-mobility-solutions-image">
        <img
          src="./images/E-MobilitySolutions.png"
          alt="E-Mobility Solutions"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default EMobilitySolutions;
