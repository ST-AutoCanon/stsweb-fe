import React from "react";
import "./Tooling.css";

const Tooling = () => {
  return (
    <div className="tooling-container">
      {/* Left Section - Image */}
      <div className="tooling-image">
        <img
          src="./images/Tooling.png"
          alt="Tooling Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="tooling-text">
        <h1>Tooling, jigs & Fixtures</h1>
        <p>Our Tooling Services Include:</p>
        <ul className="services-list">
          <li>Injection Molds</li>
          <li>Die Casting Tools</li>
          <li>Sheet Metal Dies</li>
          <li>Jigs & Fixtures</li>
          <li>Prototype Tooling</li>
          <li>Tool Maintenance & Repair</li>
          <li>Production Optimization</li>
          <li>Tool Cost Estimation</li>
        </ul>
        <button className="tooling-button">Know More</button>
      </div>
    </div>
  );
};

export default Tooling;
