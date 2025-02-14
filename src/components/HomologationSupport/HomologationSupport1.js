import React from "react";
import "./HomologationSupport1.css";

const HomologationSupport1 = () => {
  return (
    <div className="homologation-support-container">
      {/* Left Section */}
      <div className="homologation-support-text">
        <h1>Homologation support</h1>
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
        <button className="homologation-support-button">Know More</button>
      </div>

      {/* Right Section */}
      <div className="homologation-support-image">
        <img
          src="./images/Homologationsupport1.png"
          alt="Other Services"
          className="services-image"
        />
        {/* <div className="overlay-text">Other Services</div> */}
      </div>
    </div>
  );
};

export default HomologationSupport1;
