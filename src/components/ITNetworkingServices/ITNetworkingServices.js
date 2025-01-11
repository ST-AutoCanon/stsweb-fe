import React from "react";
import "./ITNetworkingServices.css";

const ITNetworkingServices = () => {
  return (
    <>
    <div className="it-networking-services-container">
      {/* Left Section - Image */}
      <div className="it-networking-services-image">
        <img
          src="./images/ITfirstpage.png"
          alt="IT & Networking Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="it-networking-services-text">
        <h1>IT & Networking Services</h1>
        <p>Our IT & Networking Services Include:</p>
        <ul className="services-list">
          <li>Software Development</li>
          <li>Application Development</li>
          <li>Website Design & Development</li>
          <li>Maintenance & Enhancement</li>
          <li>Campus & Wireless</li>
          <li>Cloud Solutions</li>
          <li>IT Consulting</li>
          <li>Testing & QA</li>
        </ul>
        <button className="it-networking-services-button">Know More</button>
      </div>
      
    </div>
    
   
    
    </>
  );

};

export default ITNetworkingServices;

