import React from "react";
import "./WebsiteDesign.css";

const WebsiteDesign = () => {
  return (
    <div className="website-design-container">
      {/* Left Section - Image */}
      <div className="website-design-image">
        <img
          src="./images/CAEAnalysis.png"
          alt="Website Design Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="website-design-text">
        <h1>Website Design</h1>
        <p>
          At Sukalpa Tech, we don't just design websites — we craft digital experiences that
          redefine the future of manufacturing. Our website design services are precision-crafted to enhance the efficiency of your manufacturing processes, reduce production costs, and elevate the performance of your operations.
        </p>

        <h2>Optimize Your Manufacturing Process</h2>
        <p>
          Our website designs are built to integrate seamlessly with your manufacturing operations. From streamlining workflows to providing real-time data access, we ensure that every website we develop serves as a powerful tool to drive operational excellence.
        </p>

        <h2>Tailored Solutions for Maximum Efficiency</h2>
        <p>
          Each design is customized to meet your unique needs. With a keen focus on quality and performance, we create websites that not only look great but also perform at their best. We take the time to understand your business goals and manufacturing challenges, then deliver a digital solution that improves productivity, reduces downtime, and accelerates your time-to-market.
        </p>

        <h2>Achieving Excellence in Every Step</h2>
        <p>
          At Sukalpa Tech, we understand that the smallest details can make a big difference in the manufacturing world. That's why our designs are engineered for precision. Every tool we develop — whether it's a product catalog, customer portal, or internal management system — is a step toward achieving excellence in your operations.
        </p>
      </div>
    </div>
  );
};

export default WebsiteDesign;
