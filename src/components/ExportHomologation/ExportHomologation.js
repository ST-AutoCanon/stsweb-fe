import React from "react";
import "./ExportHomologation.css";

const ExportHomologation = () => {
  return (
    <div className="export-homologation-container">
      {/* Left Section - Content */}
      <div className="export-homologation-text">
        <h1>Export Homologation: ECE Certification</h1>
        <p>
          At Sukalpa Tech Solutions, we empower businesses to unlock global opportunities with our Export Homologation services. 
          Focused on ECE (Economic Commission for Europe) Certification, we ensure your vehicles meet international standards, 
          enabling seamless entry into global markets.
        </p>

        <h2>Importance of ECE Certification for Global Expansion</h2>
        <ul className="services-list">
          <li>
            <strong>Key to International Trade:</strong> ECE Certification is essential for vehicle manufacturers to export products 
            to global markets, particularly Europe.
          </li>
          <li>
            <strong>Compliance with Safety and Environmental Standards:</strong> Ensures adherence to safety, environmental, and 
            performance regulations, making vehicles eligible for sale internationally.
          </li>
          <li>
            <strong>Global Competitiveness:</strong> Vehicles with ECE Certification are recognized for meeting internationally 
            acknowledged standards, giving them a competitive edge.
          </li>
        </ul>

        
      </div>

      {/* Right Section - Image */}
      <div className="export-homologation-image">
        <img
          src="./images/exporthomologation.png"
          alt="Export Homologation Services"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default ExportHomologation;