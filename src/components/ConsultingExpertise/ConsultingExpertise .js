import React from "react";
import "./ConsultingExpertise.css";

const ConsultingExpertise = () => {
  return (
    <div className="consulting-expertise-container">
      {/* Left Section - Image */}
      <div className="consulting-expertise-image">
        <img
          src="./images/consult.png"
          alt="Consulting Expertise Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="consulting-expertise-text">
        <h1>Consulting, Expertise, and Support</h1>
        <p>
          At Sukalpa Tech Solutions, we don’t just offer advice; we actively shape the future of your business. Our Consulting, Expertise, and Support services are meticulously designed to transform your challenges into opportunities, enabling you to thrive in today’s competitive landscape. With a profound understanding of technology and industry dynamics, we craft tailored strategies that align seamlessly with your business objectives. Our team of specialized experts collaborates closely with you to provide innovative solutions and comprehensive support, ensuring your success at every stage of your project.
        </p>

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
            <strong>Expert Guidance:</strong> Informed decision-making through deep industry expertise.
          </li>
          <li>
            <strong>Ongoing Support:</strong> Continuous expertise to ensure sustainable success.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConsultingExpertise;
