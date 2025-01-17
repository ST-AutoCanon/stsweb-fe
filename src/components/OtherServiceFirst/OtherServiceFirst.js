import React from "react";
import "./OtherServiceFirst.css"; // You can rename this file later if necessary

import StaffingAndTraining from "../StaffingAndTrainingServices/StaffingAndTrainingServices";
import PlantLayoutPlanningServices from "../PlantLayoutAndPlanningServices/PlantLayoutAndPlanningServices";
// import EMobilitySolutions from "../EMobilitySolutions/EMobilitySolutions";
// Details of Cards
const OtherServiceFirst = () => {
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
      <div className="otherservicefirstpage-container">
        <div className="otherservicefirstpage-image-section">
          <img src="./images/4.png" alt="About Us" className="otherservicefirstpage-image" />
        </div>
        <div className="otherservicefirstpage-text-section">
          <h1>Other Services</h1>
          <p>Transforming Ideas into Impactful Solutions</p>
        </div>
      </div>
      {/* <EMobilitySolutions /> */}
      <StaffingAndTraining />
      <PlantLayoutPlanningServices />
    </>
  );
};

export default OtherServiceFirst;
