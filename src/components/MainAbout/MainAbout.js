import React from "react";
import "./MainAbout.css";
import CardLayout from "../CardLayout/CardLayout";
import MajorServices from "../MajorServices/MajorServices";
import MajorProjects from "../MajorProjects/MajorProjects";

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
      <div className="about-container">
        <div className="image-section">
          <img src="./images/m8.png" alt="About Us" className="about-image" />
        </div>
        <div className="text-section">
          <h1>About Us</h1>
          <p>See how Sukalpa Tech focuses on making the best in all sectors</p>
        </div>
      </div>
      <div className="about-right">

{/* Details Of About Page*/}
   
  
    <h1>About Us</h1>

        <h2>Our Vision</h2>
        <p>
        Our goal is clear: to become India’s leading engineering services company by 2025-26.
        We’re committed to delivering the most trusted, reliable, and innovative solutions to help
        your business excel. </p>
        <h2>Our Mission</h2>
        <p>
        We aim to delight our customers with the latest technological advancements and
        modernization, ensuring you stay ahead of the competition—without compromising on
        cost-effectiveness.</p>
        <h2>Why Choose Sukalpa Tech?</h2>
        <ul>
          <li>
            <strong>Innovation-Driven:</strong> We’re passionate about pushing boundaries to deliver unique, future-proof solutions
            that meet the evolving needs of your business.
          </li>
          <li>
            <strong>Holistic Approach:</strong> From the initial concept to the final product launch, our end-to-end services ensure
            every stage of your project is seamlessly managed.

          </li>
          <li>
            <strong>Collaborative Process:</strong> Your vision matters to us. Together with our expertise, we ensure a collaborative
            process that results in solutions that exceed your expectations.

          </li>
          <li>
          <strong>Expert Guidance:</strong> Our team of specialists provides tailored advice, guiding you through every phase—
          from documentation to testing and approvals.
          </li>
          <li>
          <strong>Accelerated Market Entry:</strong> We streamline processes to get your products to market faster, helping you gain a
          competitive edge in today’s fast-paced environment.
          </li>
        </ul>
      </div>

      {/* Pass cardData to CardLayout */}
    
    <MajorProjects />
      
    </>
  );
};

export default MainAbout;
