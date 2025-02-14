import React from "react";
import "./EngineeringServices.css";
import ConsultingServices from "../ConsultingServices/ConsultingServices";
import CAEAnalysis from "../CAEAnalysis/CAEAnalysis";
import Tooling from "../Tooling/Tooling";

const EngineeringServices = () => {
  return (
    <>
    <div className="engineering-services-container">
      {/* Left Section */}
      <div className="engineering-services-text">
        <h1>Engineering Services</h1>
        <p>Our Engineering Services Include</p>
        <ul className="services-list">
          <li>Homologation</li>
          <li>WMI Registration</li>
          <li>Plant Accreditation</li>
          <li>Supply Chain Management</li>
          <li>Product Performance Testing</li>
          <li>Component Life Testing</li>
          <li>Staffing Solutions</li>
          <li>Training & Development</li>
          <li>Homologation/Type</li>
          <li>Recruitment Services</li>
        </ul>
        <button className="engineering-services-button">Know More</button>
      </div>

      {/* Right Section */}
      <div className="engineering-services-image">
        <img
          src="./images/Engineeringservice.png"
          alt="Engineering Services"
          className="services-image"
        />
        {/* <div className="overlay-text">Engineering Services</div> */}
      </div>
    </div>
    <CAEAnalysis />
    <ConsultingServices />
    <Tooling />
 </>
  );
};

export default EngineeringServices;
