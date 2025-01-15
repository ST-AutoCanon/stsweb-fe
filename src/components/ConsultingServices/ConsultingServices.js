import React from "react";
import "./ConsultingServices.css";

const ConsultingServices = () => {
  return (
    <div className="consulting-services-container">
      {/* Left Section - Image */}
      <div className="consulting-services-image">
        <img
          src="./images/consulting.png"
          alt="Consulting Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="consulting-services-text">
        <h1>Consulting Services</h1>
        <p>Our Consulting Services Include:</p>
        <ul className="services-list">
          <li>Business Strategy</li>
          <li>Process Optimization</li>
          <li>Project Management</li>
          <li>IT Consulting</li>
          <li>Digital Transformation</li>
          <li>Risk Management</li>
          <li>Leadership Development</li>
          <li>Market Analysis</li>
        </ul>
        <button className="consulting-services-button">Know More</button>
      </div>
    </div>
  );
};

export default ConsultingServices;
