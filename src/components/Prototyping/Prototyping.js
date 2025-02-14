import React from "react";
import "./Prototyping.css";

const Prototyping = () => {
  return (
    <div className="prototyping-container">
      {/* Left Section */}
      <div className="prototyping-text">
        <h1>Prototyping</h1>
        <p>Our Prototyping Services Include:</p>
        <ul className="services-list">
          <li>3D Printing</li>
          <li>Rapid Prototyping</li>
          <li>Functional Prototypes</li>
          <li>Mockups</li>
          <li>Material Testing</li>
          <li>Design Validation</li>
          <li>Iterative Development</li>
          <li>Prototyping Consultation</li>
          <li>Proof of Concept</li>
          <li>Manufacturing Feasibility</li>
        </ul>
        <button className="prototyping-button">Learn More</button>
      </div>

      {/* Right Section */}
      <div className="prototyping-image">
        <img
          src="./images/prototyping.png"
          alt="Prototyping Services"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default Prototyping;
