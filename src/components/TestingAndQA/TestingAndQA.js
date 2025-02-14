import React from "react";
import "./TestingAndQA.css";

const TestingAndQA = () => {
  return (
    <div className="testing-qa-container">
      {/* Left Section - Content */}
      <div className="testing-qa-text">
        <h1>Testing and QA Services</h1>
        <p>
          Sukalpa Tech Solutions ensures software excellence with reliable Testing and QA services. We focus on delivering high-quality applications that meet user expectations and business needs.
        </p>
        <h2>Our Expertise</h2>
        <ul className="services-list">
          <li>
            <strong>Manual Testing:</strong> Detects usability issues and ensures intuitive user experience.
          </li>
          <li>
            <strong>Automated Testing:</strong> Fast and accurate testing with tools like Selenium and TestNG.
          </li>
          <li>
            <strong>Performance Testing:</strong> Ensures stability under various user loads and conditions.
          </li>
          <li>
            <strong>Security Testing:</strong> Identifies vulnerabilities to safeguard data and systems.
          </li>
          <li>
            <strong>Usability Testing:</strong> Enhances UI/UX for a seamless user experience.
          </li>
          <li>
            <strong>Compatibility Testing:</strong> Validates functionality across multiple platforms and devices.
          </li>
        </ul>
        <h2>Why Choose Us?</h2>
        <p>
          With a structured QA process, including test planning, execution, and defect resolution, we ensure:
        </p>
        <ul className="benefits-list">
          <li>High-quality software free from critical bugs.</li>
          <li>Enhanced reliability and performance.</li>
          <li>Faster time-to-market with efficient testing.</li>
        </ul>
        
      </div>

      {/* Right Section - Image */}
      <div className="testing-qa-image">
        <img
          src="./images/test.png"
          alt="Testing and QA Services"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default TestingAndQA;
