import React from "react";
import "./SoftwareDevelopment.css";

const SoftwareDevelopment = () => {
  return (
    <div className="software-development-container">
      {/* Left Section - Image */}
      <div className="software-development-image">
        <img
          src="./images/softwaredevelopment.png"
          alt="Software Development Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="software-development-text">
        <h1>Software Development Services</h1>
        <p>We specialize in building, customizing, and maintaining software solutions that meet business needs:</p>
        <ul className="services-list">
          <li>
            <strong>1. Software Products:</strong> Developing web, mobile, and enterprise applications.
          </li>
          <li>
            <strong>2. Customization & Integration:</strong> Tailoring software and integrating systems to improve processes.
          </li>
          <li>
            <strong>3. Testing & Quality Assurance:</strong> Ensuring functionality, security, and bug-free software.
          </li>
          <li>
            <strong>4. Maintenance & Updates:</strong> Ongoing support with patches, updates, and fixes.
          </li>
          <li>
            <strong>5. Business Process Support:</strong> Automating and enhancing business operations.
          </li>
        </ul>
        <h2>Key Features:</h2>
        <ul className="services-list">
          <li>
            <strong>Technological Stack:</strong> Using modern languages, frameworks, databases, and cloud infrastructure.
          </li>
          <li>
            <strong>Agile Methodology:</strong> Iterative development with sprints and continuous feedback.
          </li>
          <li>
            <strong>Version Control & CI/CD:</strong> Git for collaboration and automated build/deployment.
          </li>
          <li>
            <strong>UI/UX Design:</strong> Focus on user-friendly and intuitive interfaces.
          </li>
          <li>
            <strong>Security:</strong> Secure coding practices with strong authentication mechanisms.
          </li>
          <li>
            <strong>Scalability & Performance:</strong> Scalable systems designed for high traffic and optimized for speed.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SoftwareDevelopment;
