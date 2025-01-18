import React from "react";
import "./ITNetworkFirst.css"; // Updated CSS file path
import CircularDesign from "../CircularDesignNew/CircularDesignNew";
import ITService from "../../assets/images/ITService.png";

// Details of Cards
const ITNetworkFirst = () => {
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
      <section className="itnetworkfirstpage-container">
        {/* Container for About */}
        <div className="itnetworkfirstpage-about-container">
          <div className="itnetworkfirstpage-image-section">
            <img src={ITService} alt="About Us" className="itnetworkfirstpage-about-image" />
          </div>
          <div className="itnetworkfirstpage-text-section">
            <h1>IT Services</h1>
            <p>Empowering Your Digital Transformation with Sukalpa Tech Expert IT Solutions</p>
          </div>
        </div>
        <div className="itnetworkfirstpage-circular">
          <CircularDesign />
        </div>
      </section>
    </>
  );
};

export default ITNetworkFirst;
