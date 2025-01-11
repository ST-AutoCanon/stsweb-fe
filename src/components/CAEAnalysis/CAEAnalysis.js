import React from "react";
import "./CAEAnalysis.css";

const CAEAnalysis = () => {
  return (
    <div className="cae-analysis-container">
      {/* Left Section - Image */}
      <div className="cae-analysis-image">
        <img
          src="./images/caeanalysisone.png"
          alt="CAE Analysis Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="cae-analysis-text">
        <h1>CAE Analysis & Prototyping</h1>
        <p>
          At Sukalpa Tech Solutions, we specialize in turning your ideas into reality with our advanced Computer-Aided Engineering (CAE) Analysis & Prototyping services. Our state-of-the-art solutions empower you to validate your designs and ensure optimal performance under real-world conditions—well before they reach the market.
        </p>
        <p>
          We don't just predict the future; we engineer it. Leveraging sophisticated CAE tools, we simulate every aspect of your product's performance. From stress analysis to thermal behavior, our comprehensive evaluations ensure that each design is not only innovative but also robust and reliable. 
        </p>
        <p>
          <h2>What is CAE?</h2>
          <br />
          Computer-Aided Engineering (CAE) encompasses a variety of software tools that facilitate engineering tasks, including simulation, validation, and optimization of products. By integrating CAE into your development process, you can significantly reduce time and costs while enhancing product quality.
        </p>
        <ul className="services-list">
          <li>
            <strong>Thorough Simulations:</strong> Identify potential issues early in the development process to minimize costly revisions.
          </li>
          <li>
            <strong>Prototyping Services:</strong> Transform virtual models into tangible representations to assess form, fit, and function.
          </li>
          <li>
            <strong>Streamlined Development:</strong> Reduce risks and achieve faster time-to-market with our efficient workflows.
          </li>
          <li>
            <strong>Real-World Validation:</strong> Ensure designs perform optimally under real-world conditions before launch.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CAEAnalysis;
