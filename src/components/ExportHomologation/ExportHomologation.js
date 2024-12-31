import React from "react";
import "./ExportHomologation.css";

const ExportHomologation = () => {
  return (
    <div className="export-homologation-container">
      {/* Left Section - Image */}
      <div className="export-homologation-image">
        <img
          src="./images/ConsultingService.png"
          alt="Export Homologation Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="export-homologation-text">
        <h1 className="main-headline">Export Homologation: ECE Certification</h1>
        <p>
          Paving Your Path to Global Markets - We don’t just help you cross borders; we help you conquer them. 
          At Sukalpa Tech Solutions, our Export Homologation services, focused on ECE (Economic Commission for Europe) Certification, 
          unlock international markets with seamless precision.
        </p>

        <h2 className="sub-headline">Expand with Confidence</h2>
        <p>
          Gaining ECE Certification is critical for your vehicles to meet global standards and thrive in the international market. 
          With Sukalpa Tech as your partner, you’re not just certifying your products you’re expanding your horizons. 
          Our expert guidance ensures that your products meet the stringent requirements of global markets with ease and efficiency.
        </p>

        <h2 className="sub-headline">Auto-Canon for Homologation</h2>
        <p>
          Revolutionizing compliance with precision, Sukalpa Tech introduces Auto-Canon for Homologation, 
          a groundbreaking solution designed to streamline and simplify the homologation process.
        </p>
        <p>
          Homologation is a crucial step in bringing automotive products to market. With Auto-Canon, we transform 
          this complex and time-consuming process into an efficient, seamless experience, enabling your products 
          to achieve compliance faster and more effectively.
        </p>

        <h2 className="sub-headline">Why Choose Sukalpa Tech?</h2>
        <ul className="services-list">
          <li>Comprehensive Export Homologation services tailored to your needs.</li>
          <li>Expert support to meet global ECE Certification requirements.</li>
          <li>Cutting-edge Auto-Canon solution for streamlined homologation.</li>
          <li>Seamless entry into international markets with full regulatory compliance.</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportHomologation;
