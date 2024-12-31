import React from "react";
import "./Tooling.css";

const Tooling = () => {
  return (
    <div className="tooling-container">
      {/* Left Section - Image */}
      <div className="tooling-image">
        <img
          src="./images/Tooling.png"
          alt="Tooling Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="tooling-text">
        <h1>Tooling, Jigs & Fixture Design & Development</h1>
        <p>
          At Sukalpa Tech Solutions, we don’t just create tools; we shape the future of manufacturing. Our Tooling, Jigs & Fixture Design & Development services are meticulously engineered to optimize your manufacturing processes, enhancing efficiency and significantly reducing production costs. Each tool, jig, and fixture we design is precision-crafted to ensure flawless performance and reliability. We understand that the right tooling is crucial for operational success, which is why we prioritize quality and innovation in every project. Our solutions streamline production workflows, improve accuracy, and enable your team to achieve operational excellence.
        </p>

        <h2>Why Choose Our Tooling Services?</h2>
        <ul className="services-list">
          <li>
            <strong>Revolutionize Manufacturing:</strong> Enhance your manufacturing process with precision-designed tooling, jigs, and fixtures.
          </li>
          <li>
            <strong>Increase Efficiency:</strong> Our solutions help reduce production costs and improve overall operational performance.
          </li>
          <li>
            <strong>Precision-Crafted Tools:</strong> Each tool, jig, and fixture is designed to ensure maximum efficiency and reliability.
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
          <li>
            <strong>Maximized Efficiency:</strong> Ensure your production line operates smoothly, meeting consumer demands with confidence.
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
          <li>
            <strong>Ongoing Support:</strong> Continuous expertise to ensure sustainable success.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tooling;
