import React from "react";
import "./MainAboutSecond.css";

const MainAboutSecond = () => {
  return (
    <div className="about-second-container">
      {/* Left Column */}
      <div className="about-second-left">
        <h1>About Us</h1>
        <p>
          <strong>Sukalpa Tech</strong> started in 2018-19 with the philosophy
          of support, succeed & grow stronger together.
        </p>
        <h2>Our Vision</h2>
        <p>
          To be a top-most engineering services company in India by 2025-26 to
          offer services with most trusted, reliable & innovative solutions.
        </p>
        <h2>Our Mission</h2>
        <p>
          Delighting the customers by uncompromisingly dynamic technological
          developments & modernization that becomes vital to stay ahead of
          their competition at reasonable cost.
        </p>
      </div>

      {/* Right Column */}
      <div className="about-second-right">
        <h2>Why Choose Sukalpa Tech?</h2>
        <ul>
          <li>
            <strong>Innovation-Driven:</strong> We thrive on pushing boundaries
            to deliver truly unique solutions.
          </li>
          <li>
            <strong>Holistic Approach:</strong> Our end-to-end services cover
            everything from initial concept to final product launch.
          </li>
          <li>
            <strong>Collaborative Process:</strong> Your vision, combined with
            our expertise, ensures a result that exceeds expectations.
          </li>
          <li>
            <strong>Seamless Compliance:</strong> We streamline the
            certification process, ensuring your products adhere to the Central
            Motor Vehicles Rules (CMVR) and FAME II guidelines with ease.
          </li>
          <li>
            <strong>Expert Guidance:</strong> Our team of specialists offers
            tailored advice, guiding you through each step from documentation
            to testing and approval.
          </li>
          <li>
            <strong>Accelerated Market Entry:</strong> With our efficient
            processes, your products reach the market faster, giving you a
            competitive edge.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainAboutSecond;
