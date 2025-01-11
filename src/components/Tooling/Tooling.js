import React from "react";
import "./Tooling.css";

const Tooling = () => {
  return (
    <div className="tooling-container">
      {/* Left Section - Image */}
      <div className="tooling-image">
        <img
          src="./images/tool6.png"
          alt="Tooling Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="tooling-text">
        <h1>Tooling, Jigs & Fixture Design & Development</h1>
        <p>
        At Sukalpa Tech Solutions, we design and develop precision-engineered tooling, jigs, and fixtures to optimize manufacturing, enhance efficiency, and reduce costs. With a focus on quality and innovation, our solutions streamline workflows and ensure reliable, accurate performance for operational excellence.        </p>

        <h2>Why Choose Our Tooling Services?</h2>
        <ul className="services-list">
          <li>
            <strong>Revolutionize Manufacturing:</strong> Enhance your manufacturing process with precision-designed tooling, jigs, and fixtures.
          </li>
          <li>
            <strong>Increase Efficiency:</strong> Our solutions help reduce production costs and improve overall operational performance.
          </li>
          
        </ul>

        <h2>The Significance of Jigs, Fixtures, and Tooling</h2>
        <ul className="services-list">
          <li>
            <strong>Enhanced Precision and Repeatability:</strong> Well-designed jigs and fixtures ensure accuracy in manufacturing.
          </li>
          <li>
            <strong>Improved Safety:</strong> Our products are designed to provide safer and more ergonomic working conditions.
          </li>
         
        </ul>

        <strong>Consulting, Expertise, and Support</strong>
        <ul className="services-list">
          <li>
            <strong>Strategic Planning:</strong> Tailored strategies to align with your business goals.
          </li>
          <li>
            <strong>Process Improvement:</strong> Optimize operational processes for efficiency and growth.
          </li>
          <li>
            <strong>Technology Integration:</strong> Implement the latest technologies to enhance your business.
          </li>
          <li>
            <strong>Expert Guidance:</strong> Make informed decisions with deep industry expertise.
          </li>
         
        </ul>
      </div>
    </div>
  );
};

export default Tooling;
