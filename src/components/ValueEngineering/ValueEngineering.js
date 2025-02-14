import React from "react";
import "./ValueEngineering.css";

const ValueEngineering = () => {
  return (
    <div className="value-engineering-container">
      {/* Left Section - Image */}
      <div className="value-engineering-image">
        <img
          src="./images/Valueengineering.png"
          alt="Value Engineering Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="value-engineering-text">
        <h1>Value Engineering Services</h1>
        <p>Our Value Engineering Services Include:</p>
        <ul className="services-list">
          <li>Software Development</li>
          <li>Application Development</li>
          <li>Website Design & Development</li>
          <li>Maintenance & Enhancement</li>
          <li>Campus & Wireless</li>
          <li>Cloud Solutions</li>
          <li>IT Consulting</li>
          <li>Testing & QA</li>
        </ul>
        <button className="value-engineering-button">Know More</button>
      </div>
    </div>
  );
};

export default ValueEngineering;


