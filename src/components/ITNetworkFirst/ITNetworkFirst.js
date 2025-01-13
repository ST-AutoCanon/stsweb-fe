import React from "react";
import "./ITNetworkFirst.css"; // You can rename this file later if necessary
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
    <section className="ITNetworkFirst123">
      {/* Container for About */}
      <div className="itabout-container">
        <div className="image-section">
          {/* <img src="./images/ITfirstpage.png" alt="About Us" className="about-image" /> */}
          <img src={ITService} alt="About Us" className="about-image" />

        </div>
        <div className="ittext-section">
          <h1>ITNetworking Services</h1>
          <p>Empowering Your Digital Transformation with Sukalpa Tech Expert IT Solutions</p>
        </div>
      
      </div>
      <div className="circular1">
      <CircularDesign />
      </div>
      </section>
     
      </> 
      
  );
};

export default ITNetworkFirst;
