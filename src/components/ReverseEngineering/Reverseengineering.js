import React from "react";
import "./ReverseEngineering.css";

const ReverseEngineering = () => {
  return (
    <div className="reverse-engineering-container">
      {/* Left Section */}
      <div className="reverse-engineering-text">
        <h1>Reverse Engineering</h1>
        <p>Our Reverse Engineering Services Include:</p>
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
        <button className="reverse-engineering-button">Learn More</button>
      </div>

      {/* Right Section */}
      <div className="reverse-engineering-image">
        <img
          src="./images/Homologationsupport.png"
          alt="Reverse Engineering Services"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default ReverseEngineering;
