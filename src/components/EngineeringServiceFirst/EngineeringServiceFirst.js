import React from "react";
import "./EngineeringServiceFirst.css"; // Updated to reference the correct CSS
import ITfirstpage from "../../assets/images/servicefirst.png";
import CircularDesignEngg from "../CircularDesignEngg/CircularDesignEngg";

const EngineeringServiceFirst = () => {
  return (
    <>
      {/* Container for About */}
      <div className="engservicefirstpage-about-container">
        <div className="engservicefirstpage-image-section">
          <img src={ITfirstpage} alt="About Us" className="engservicefirstpage-about-image" />
        </div>
        <div className="engservicefirstpage-text-section">
          <h1>Engineering Services</h1>
          <p>Driving Progress Through Innovative Engineering</p>
        </div>
      </div>
      <CircularDesignEngg />
    </>
  );
};

export default EngineeringServiceFirst;
