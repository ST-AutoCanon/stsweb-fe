import React from "react";
import "./MajorServices.css";

const MajorServices = () => {
  return (
    <div className="major-services-container">
      <h2>Major Services provided as follows</h2>
      <div className="major-services">
        <div className="major-services-section">
          <h3>IT SERVICES</h3>
          <ul>
            <li>Software Development</li>
            <li>Application Development</li>
            <li>Website Design & Development</li>
            <li>Maintenance & Enhancement</li>
            <li>Campus & Wireless Networking</li>
            <li>Cloud Solutions</li>
            <li>IT Consulting</li>
            <li>Testing & QA</li>
          </ul>
        </div>
        <div className="major-services-section">
          <h3>NON-IT SERVICES</h3>
          <ul>
            <li>Styling</li>
            <li>Product Design & Development</li>
            <li>CAE Analysis</li>
            <li>Prototyping</li>
            <li>Tooling, Jigs & Fixture Design & Development</li>
            <li>Sourcing Support</li>
            <li>Export Homologation</li>
            <li>Plant Layout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MajorServices;
