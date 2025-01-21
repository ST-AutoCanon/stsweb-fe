import React from "react";
import "./PlantLayoutAndPlanningServices.css";

const PlantLayoutAndPlanningServices = () => {
  return (
    <div className="plant-layout-planning-container">
      {/* Right Section - Image */}
      <div className="plant-layout-planning-image">
        <img
          src="./images/plant.png"
          alt="Plant Layout Planning Services"
          className="services-image"
        />
      </div>

      {/* Left Section - Content */}
      <div className="plant-layout-planning-text">
        <h1>Plant Layout Planning Services</h1>
        <p>
          Transform Your Production Space with Sukalpa Tech. We turn your manufacturing visions into a well-orchestrated reality with our Plant Layout Planning Services.
        </p>
        <ul className="services-list">
          <li>
            <strong> Space Optimization:</strong> Designing layouts that maximize space utilization.
          </li>
          <li>
            <strong> Workflow Enhancement:</strong> Streamlining processes for smooth production.
          </li>
          <li>
            <strong> Safety Improvements:</strong> Ensuring compliance with safety standards.
          </li>
          <li>
            <strong> Waste Reduction:</strong> Identifying and eliminating inefficiencies.
          </li>
          <li>
            <strong> Equipment Placement:</strong> Strategic positioning to boost productivity.
          </li>
        </ul>
        <h2>Maximize Your Production Efficiency</h2>
        <p>
          With optimized layouts that enhance workflow, reduce waste, and improve safety, Sukalpa Tech ensures your plant is ready to meet production demands with efficiency and precision.
        </p>
      </div>
    </div>
  );
};

export default PlantLayoutAndPlanningServices;
