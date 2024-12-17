import React from "react";
import "./OtherServices.css";

const OtherServices = () => {
  return (
    <div className="other-services-container">
      {/* Left Section */}
      <div className="other-services-text">
        <h1>Other Services</h1>
        <p>Our Other Services Include</p>
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
        <button className="other-services-button">Know More</button>
      </div>

      {/* Right Section */}
      <div className="other-services-image">
        <img
          src="./images/OtherService.png"
          alt="Other Services"
          className="services-image"
        />
        {/* <div className="overlay-text">Other Services</div> */}
      </div>
    </div>
  );
};

export default OtherServices;
