import React from "react";
import "./CAEAnalysis.css";

const CAEAnalysis = () => {
  return (
    <div className="cae-analysis-container">
      {/* Left Section - Image */}
      <div className="cae-analysis-image">
        <img
          src="./images/CAEAnalysis.png"
          alt="CAE Analysis Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="cae-analysis-text">
        <h1>CAE Analysis Services</h1>
        <p>Our CAE Analysis Services Include:</p>
        <ul className="services-list">
          <li>Structural Analysis</li>
          <li>Thermal Analysis</li>
          <li>Fluid Dynamics</li>
          <li>Dynamic Simulations</li>
          <li>Fatigue & Durability</li>
          <li>Optimization Studies</li>
          <li>Crash Simulations</li>
          <li>Vibration Analysis</li>
        </ul>
        <button className="cae-analysis-button">Know More</button>
      </div>
    </div>
  );
};

export default CAEAnalysis;
