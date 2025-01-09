import React from "react";
import "./EngineeringServiceFirst.css"; // You can rename this file later if necessary
import ITfirstpage from "../../assets/images/servicefirst.png";
import CircularDesignEngg from "../CircularDesignEngg/CircularDesignEngg";
// Details of Cards
const EngineeringServiceFirst = () => {
  const cardData = [
    { title: "Software Development", description: "We build reliable software solutions.", imgPath: "./images/logo.png" },
    { title: "Application Development", description: "Custom applications tailored to your needs.", imgPath: "./images/logo.png" },
    { title: "Website Design & Development", description: "Creative and responsive web solutions.", imgPath: "./images/logo.png" },
    { title: "Maintenance & Enhancement", description: "Ensure systems run smoothly and efficiently.", imgPath: "./images/logo.png" },
    { title: "Campus & Wireless", description: "Seamless connectivity solutions.", imgPath: "./images/logo.png" },
    { title: "Cloud Solutions", description: "Scalable and secure cloud integrations.", imgPath: "./images/logo.png" },
    { title: "IT Consulting", description: "Strategic IT guidance to grow your business.", imgPath: "./images/logo.png" },
    { title: "Testing & QA", description: "Thorough testing for flawless products.", imgPath: "./images/logo.png" },
    { title: "Cloud Solutions", description: "Reliable and future-ready cloud services.", imgPath: "./images/logo.png" },
  ];

  return (
    <>
      {/* Container for About */}
      <div className="engineeringabout-container">
        <div className="image-section">
        <img src={ITfirstpage} alt="About Us" className="about-image" />
        </div>
        <div className="engineeringtext-section">
          <h1>EngineeringServices</h1>
          <p>Driving Progress Through Innovative Engineering</p>
        </div>
      </div>
      <CircularDesignEngg/>
    </>
    
  );
};

export default EngineeringServiceFirst;
