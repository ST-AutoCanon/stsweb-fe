import React from "react";
import "./ITConsulting.css";

const ITConsulting = () => {
  return (
    <div className="it-consulting-container">
      {/* Left Section - Content */}
      <div className="it-consulting-text">
        <h1>IT Consulting Services</h1>
        <p>
          Sukalpa Tech Solutions delivers expert guidance to optimize IT systems, 
          align technology with business goals, and drive digital transformation. 
          Our services include:
        </p>
        <ul className="services-list">
          <li>
            <strong>Strategic IT Planning:</strong> Define long-term strategies, adopt cloud solutions, 
            and modernize legacy systems.
          </li>
          <li>
            <strong>Technology Selection:</strong> Recommend tools and platforms like ERP or CRM 
            based on business needs and budget.
          </li>
          <li>
            <strong>Process Optimization:</strong> Streamline operations by automating workflows 
            and upgrading software.
          </li>
          <li>
            <strong>Security & Risk Management:</strong> Ensure secure systems, data protection, 
            and compliance with industry standards.
          </li>
          <li>
            <strong>Change Management:</strong> Facilitate smooth adoption of new technologies 
            with training and support.
          </li>
        </ul>

        <h2>How We Work</h2>
        <p>Our IT consulting process ensures tailored solutions for every client:</p>
        <ul className="services-list">
          <li>
            <strong>Assessment:</strong> Analyze business goals, challenges, and current IT systems 
            through workshops and reviews.
          </li>
          <li>
            <strong>Strategy:</strong> Develop customized IT strategies, including system upgrades, 
            cloud migration, and security enhancements.
          </li>
          <li>
            <strong>Implementation:</strong> Manage projects, integrate systems, test thoroughly, 
            and deploy new technologies seamlessly.
          </li>
          <li>
            <strong>Post-Implementation:</strong> Provide training, monitor performance, and offer 
            ongoing support and optimization.
          </li>
        </ul>
      </div>

      {/* Right Section - Image */}
      <div className="it-consulting-image">
        <img
          src="./images/itcons.png"
          alt="IT Consulting Services"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default ITConsulting;
