import React from "react";
import "./KnowMoreFirstPage.css"; // Updated CSS file name
import CircularDesign from "../CircularDesignNew/CircularDesignNew";
import KnowMore from "../../assets/images/KnowMore.png"
import Gallery from "../Gallery/Gallery";
import Broucher from "../Broucher/Broucher";

const KnowMoreFirstPage = () => {
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
      <section className="know-more-first-page">
        <div className="know-more-about-container">
          <div className="know-more-image-section">
            <img src={KnowMore} alt="About Us" className="know-more-image" />
          </div>
          <div className="know-more-text-section">
            <h1>Know More </h1>
            <p>Our journey, Our purpose - Know more about us.</p>
          </div>
        </div>
        <div className="circular-container">
          <div classname="Broucher123">
          <Broucher />
          </div>
          <Gallery />
        </div>
      </section>
    </>
  );
};

export default KnowMoreFirstPage;
