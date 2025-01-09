import React from "react";
import "./Reachusfirst.css"; // Updated CSS file name
import ReachUs from "../ReachUs/ReachUs";

// Details of Cards
const Reachusfirst = () => {
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
      {/* Container for ReachUsFirstPage */}
      <div className="reachusfirstpage-container">
        <div className="reachusfirstpage-image-section">
          <img src="./images/Reachus.png" alt="About Us" className="reachusfirstpage-about-image" />
        </div>
        <div className="reachusfirstpage-text-section">
          <h1>Reach Us</h1>
          <p>See how Sukalpa Tech focuses on making the best in all sectors</p>
        </div>
      </div>

      {/* <EMobilitySolutions /> */}
      <ReachUs />
    </>
  );
};

export default Reachusfirst;