import React from "react";
import "./DomesticTypeApproval.css";

const DomesticTypeApproval = () => {
  return (
    <div className="domestic-type-approval-container">
      {/* Left Section - Image */}
      <div className="domestic-type-approval-image">
        <img
          src="./images/ConsultingService.png"
          alt="Domestic Type Approval Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="domestic-type-approval-text">
        <h1>Domestic Type Approval</h1>
        <p>
          At Sukalpa Tech, we bridge the gap between innovation and compliance 
          with our expert Domestic Type Approval services, covering CMVR (Central Motor Vehicle Rules) 
          and FAME II (Faster Adoption and Manufacturing of Electric Vehicles) certifications.
        </p>

        <h2>Why Choose Sukalpa Tech?</h2>
        <p>
          Navigating India’s regulatory landscape can be daunting, but with our deep expertise, 
          we ensure your vehicles, components, and infrastructure meet every standard and qualify for 
          valuable incentives.
        </p>

        <h2>Innovation Meets Regulation</h2>
        <p>
          By combining cutting-edge technology with regulatory know-how, we ensure your products not only 
          comply but excel. Our comprehensive services are tailored to help you succeed in the competitive 
          automotive market while maintaining full compliance with government standards.
        </p>

        <h2>Benefits of Our Services</h2>
        <ul className="services-list">
          <li>End-to-end support for CMVR and FAME II certification processes.</li>
          <li>Expert guidance to simplify complex regulatory requirements.</li>
          <li>Assurance that your products qualify for government incentives.</li>
          <li>Seamless integration of compliance and innovation to elevate your business.</li>
        </ul>
      </div>
    </div>
  );
};

export default DomesticTypeApproval;
