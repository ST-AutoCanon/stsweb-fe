import React from "react";
import "./WebsiteDesign.css";

const WebsiteDesign = () => {
  return (
    <div className="website-design-container">
      {/* Left Section - Content */}
      <div className="website-design-text">
        <h1>Website Design Services</h1>
        <p>
          At Sukalpa Tech, we craft digital experiences that redefine the future of manufacturing.
          Our website design services focus on enhancing efficiency, reducing costs, and driving
          operational excellence. Our offerings include:
        </p>
        <ul className="services-list">
          <li>
            <strong>Seamless Integration:</strong> Our websites integrate smoothly with existing manufacturing technologies.
          </li>
          <li>
            <strong>Streamlined Workflows:</strong> Optimize daily operations for improved efficiency and productivity.
          </li>
          <li>
            <strong>Real-Time Data Access:</strong> Empower decision-making with instant access to operational data.
          </li>
          <li>
            <strong>Operational Excellence:</strong> Each design serves as a tool to elevate performance at every stage.
          </li>
        </ul>

        <h2>Tailored Solutions for Maximum Efficiency</h2>
        <p>Our approach ensures solutions customized to your business needs:</p>
        <ul className="services-list">
          <li>
            <strong>Customized Designs:</strong> Aligns with your unique goals and manufacturing challenges.
          </li>
          <li>
            <strong>Improved Productivity:</strong> Streamlines processes, automates tasks, and reduces downtime.
          </li>
          <li>
            <strong>Faster Time-to-Market:</strong> Accelerates product development cycles for a competitive edge.
          </li>
          <li>
            <strong>Focus on Quality:</strong> Combines aesthetics and functionality to deliver high-performing websites.
          </li>
        </ul>

        <h2>Achieving Excellence in Every Step</h2>
        <p>We focus on the smallest details to make the biggest impact:</p>
        <ul className="services-list">
          <li>
            <strong>Attention to Detail:</strong> Every design is engineered with precision to meet high standards.
          </li>
          <li>
            <strong>Useful Tools:</strong> Includes product catalogs, customer portals, and internal management systems.
          </li>
          <li>
            <strong>Continuous Improvement:</strong> We refine and optimize tools to ensure operational excellence.
          </li>
        </ul>
      </div>

      {/* Right Section - Image */}
      <div className="website-design-image">
        <img
          src="./images/web5.png"
          alt="Website Design Services"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default WebsiteDesign;