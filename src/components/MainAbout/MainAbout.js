import React from "react";
import "./MainAbout.css";
import CardLayout from "../CardLayout/CardLayout";
import MajorServices from "../MajorServices/MajorServices";
import MajorProjects from "../MajorProjects/MajorProjects";
import MainAboutSecond from "../MainAboutSecond/MainAboutSecond";

//Details of Cards
const MainAbout = () => {
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
      {/*container for About*/}
      <div className="aboutfirstpage-mainabout-container">
        <div className="aboutfirstpage-image-section">
          <img src="./images/Aboutus2.png" alt="About Us" className="aboutfirstpage-mainabout-image" />
        </div>
        <div className="aboutfirstpage-text-section">
          <h1>About Us</h1>
          <p>Where Sukalpa Tech Innovation Meets Perfection in Every Sector</p>
        </div>
      </div>
      <MainAboutSecond />
      <MajorProjects />
    </>
  );
};

export default MainAbout;
