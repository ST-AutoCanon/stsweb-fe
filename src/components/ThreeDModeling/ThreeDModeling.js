import React from "react";
import "./ThreeDModeling.css";

const ThreeDModeling = () => {
  return (
    <div className="three-d-modeling-container">
      {/* Left Section - Image */}
      <div className="three-d-modeling-image">
        <img
          src="./images/3dmodel.png"
          alt="3D Modeling Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="three-d-modeling-text">
        <h1>3D Modeling Services</h1>
        <p>
          At Sukalpa Tech Solutions, we specialize in creating digital representations of objects and environments using cutting-edge tools and techniques.
        </p>
        <h2>Key Activities</h2>
        <ul className="activities-list">
          <li>
            <strong>Client Collaboration:</strong> Understanding project requirements and defining the model's purpose.
          </li>
          <li>
            <strong>Concept Design & Planning:</strong> Conceptualizing models through sketches, references, and mood boards.
          </li>
          <li>
            <strong>3D Model Creation:</strong> Building detailed models with precise geometry, textures, and physical properties.
          </li>
          <li>
            <strong>Refinement & Iteration:</strong> Incorporating client feedback for continuous improvement.
          </li>
        </ul>
        <h2>Our Services</h2>
        <ul className="services-list">
          <li>
            <strong>Product Design:</strong> 3D models for consumer goods, electronics, and machinery.
          </li>
          <li>
            <strong>Architectural Visualization:</strong> Models of buildings, interiors, and landscapes for architects and real estate.
          </li>
          <li>
            <strong>3D Printing:</strong> Digital models optimized for rapid prototyping and small-scale manufacturing.
          </li>
          <li>
            <strong>Game Asset Creation:</strong> High-quality models for immersive gaming experiences.
          </li>
          <li>
            <strong>AR/VR Integration:</strong> Models tailored for augmented and virtual reality applications.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ThreeDModeling;
